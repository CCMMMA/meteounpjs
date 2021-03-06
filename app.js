let _appTitle="meteo@uniparthenope"
let _appLogo="/images/meteo_uniparthenope_logo.png"
let _appDescription="Center for Monitoring and Modelling Marine and Atmosphere Applications @ University of Naples Parthenope. https://app.meteo.uniparthenope.it"
let unpApiBaseUrl="https://api.uniparthenope.it/uniparthenope"
let apiBaseUrl="https://api.meteo.uniparthenope.it"
//apiBaseUrl="http://193.205.230.6:5000"
//apiBaseUrl="http://193.205.230.6"
let dataBaseUrl="https://data.meteo.uniparthenope.it/opendap/opendap/"
let wmsBaseUrl="https://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/"

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getAppUrl() {
    let getUrl = window.location
    return getUrl .protocol + "//" + getUrl.host + "/"
}
function getURLParameter(sParam, defaultValue) {

    let sPageURL = window.location.search.substring(1);

    let sURLVariables = sPageURL.split('&');

    for (let i = 0; i < sURLVariables.length; i++) {
        let sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
    return defaultValue;
}

let languages = [ "en-US", "it-IT"]
let lang=getURLParameter("lang",(navigator.language || navigator.userLanguage));
let _lang=lang.split("-")[0].toLowerCase()+"-"+lang.split("-")[1].toUpperCase()
if (languages.includes(_lang)==false) {
    _lang=languages[0]
}


let _page=getURLParameter("page","home");

let oMap=null;


let _place=getURLParameter("place","it000");
let _prod=getURLParameter("prod","wrf5");
let _output=getURLParameter("output","gen");

const dateTime=new Date()
defaultNcepDate=dateTime.getUTCFullYear()+pad(dateTime.getUTCMonth()+1,2)+pad(dateTime.getUTCDate(),2)+"Z"+pad(dateTime.getUTCHours(),2)+"00";

let _ncepDate=getURLParameter("date",defaultNcepDate);




let _hours=getURLParameter("hours",0);
let _step=getURLParameter("step",1);
let _mapName=getURLParameter("mapName","muggles");

let box=null;
let chart=null;
let control=null;
let plot=null;

function expandUrl( baseUrl ) {
    if (baseUrl == null) {
        baseUrl=""
    }
    return baseUrl
        .replace("{lang}",_lang)
        .replace("{place}",_place)
        .replace("{prod}",_prod)
        .replace("{output}",_output)
        .replace("{date}",_ncepDate)
        .replace("{hours}",_hours)
        .replace("{step}",_step)
        .replace("{mapName}",_mapName)
        .replace("{random}",Math.random())
}

function pythonEncode(s) {
    return s
        .replace(/:/g,"__cl__")
        .replace(/\//g,"__sl__")
        .replace(/ /g,"__sp__")
        .replace( /&/g,"__am__")
        .replace(/\?/g,"__qm__")
        .replace(/=/g,"__eq__")
        .replace(/\+/g,"__pl__")
        .replace(/@/g,"__at__")
        .replace(/#/g,"__sh__")
        .replace(/,/g,"__cm__")
        .replace(/[.]/g,"__pt__")
}



function rewriteUrl(title, description, prepend, previewImage) {

    if (title==="") {
        title=_appTitle
    } else {
        title=_appTitle+": "+title
    }

    if (description==="") {
        description=_appDescription
    }

    if (previewImage==="") {
        previewImage=getAppUrl()+_appLogo
    } else {
        if (!(previewImage.startsWith("https://") || previewImage.startsWith("http://"))) {
            if (previewImage.startsWith("/")==false) {
                previewImage="/"+previewImage
            }
            previewImage=getAppUrl()+previewImage
        }
    }

    console.log("Update urls")
    let params=expandUrl("place={place}&prod={prod}&output={output}&date={date}&step={step}&hours={hours}")
    let url="index.html?"+prepend+"&"+params
    let fullUrl=getAppUrl()+"/"+url
    let encodedShareUrl=
        apiBaseUrl+"/share/"+pythonEncode(title)+
        "/"+pythonEncode(description)+
        "/"+pythonEncode(previewImage)+
        "/"+pythonEncode(fullUrl)

    window.history.pushState("",title,url)
    $("a.navbar-brand").attr("href","index.html?"+params)

    $("#urlShareFacebook")
        .attr("href","https://facebook.com/sharer.php?u="+encodedShareUrl)
        .attr("data-url",encodedShareUrl)
    $("#urlShareTwitter")
        .attr("href","https://twitter.com/intent/tweet?url="+encodedShareUrl)
        .attr("data-url",encodedShareUrl)

}

function getUserObjectIfAny() {
    let userObject=null

    // Get the user name from the local storage
    let user = localStorage.getItem('user');

    // Check if the user is not null and not empty
    if (user != null && user !== "" ) {

        // Get the user object
        userObject =  JSON.parse(user)

    }

    return userObject
}

function footer() {
    let legalDisclaimerUrl=apiBaseUrl+"/legal/disclaimer?lang="+_lang

    $.getJSON( legalDisclaimerUrl, function( data ) {
        console.log("legalDisclaimer")
        let localizedData=data["i18n"][_lang]
        $("#container_footer").append(localizedData["disclaimer"]);
        $("#container_footer").css("display","block")
    });

}

function navBar() {
    // The token value
    let token=null

    // Set the navBar resource url
    let navBarUrl=apiBaseUrl+"/v2/navbar?lang="+_lang

    // Get the userObject
    let userObject = getUserObjectIfAny()

    // Check if the user is logged
    if (userObject != null) {
        // Fill the user name in the GUI
        $("#user").text(userObject["name"])

        // Set the auth token
        token=userObject["token"]

        // Show the user info in the GUI
        $("#container_user").css("display","block")
    } else {
        // Show the user login GUI
        $("#container_login").css("display","block")
    }

    function setHeader(xhr) {
        if (token != null) {
            xhr.setRequestHeader('authorization', "Basic "+token);
        }
    }

    $.ajax({
        url: navBarUrl,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            let navBarBrandUrl="index.html"
            let items = [];

            $.each( data, function( key, values ) {
                values.forEach(function(item, index) {
                    let html="";
                    let localizedItem=item["i18n"][_lang]

                    if ("items" in localizedItem) {
                        if ("isHome" in item && item["isHome"]) {
                            navBarBrandUrl=localizedItem["href"]
                        }

                        html += "<li class='nav-item dropdown'>"
                        html += "    <a class='nav-link dropdown-toggle' href='"+expandUrl(localizedItem["href"])+"' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false\'>"+localizedItem["text"]+"</a>"
                        html += "    <div class='dropdown-menu' aria-labelledby='navbarDropdown'>"
                        localizedItem["items"].forEach(function(item1, index1) {

                            if (item1["text"]==="-") {
                                html += "        <div class='dropdown-divider'></div>"
                            } else {
                                html += "        <a class='dropdown-item' href='" + expandUrl(item1["href"]) + "'>" + item1["text"]+ "</a>"
                            }

                            if ("isHome" in item1 && item1["isHome"]) {
                                navBarBrandUrl=item1["href"]
                            }
                        })
                        html += "    </div>"
                        html += "</li>"
                    } else {
                        html += "<li class='nav-item active'>"
                        html += "    <a class='nav-link' href='"+expandUrl(localizedItem["href"])+"'>"+localizedItem["text"]+"</a>"
                        html += "</li>"

                        if ("isHome" in item && item["isHome"]) {
                            navBarBrandUrl=localizedItem["href"]
                        }
                    }
                    items.push(  html );
                });
            });
            $("a.navbar-brand").attr("href",expandUrl(navBarBrandUrl))
            $("#navbar_items").append(items.join("\n"));
        },
        //error: function() { alert('boo!'); },
        beforeSend: setHeader
    });
}

let _calendar=null

function dataAvailability() {
    let availUrl=apiBaseUrl+"/products"

    console.log("dataAvailability:CALENDAR")

    let calendarEl = document.getElementById('calendar');

    _calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid', 'timeGrid', 'list', 'bootstrap'],
        timeZone: 'UTC',
        themeSystem: 'bootstrap',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        weekNumbers: true,
        eventLimit: true, // allow "more" link when too many events
        eventSources: [
            {
                "id":_prod,
                "url":availUrl + "/" + _prod + "/" + _place + "/avail/calendar?baseUrl=index.html?page=products"
            }
        ]
    });

    _calendar.render();

    control=$("#control").MeteoUniparthenopeControl(_place,_prod,null,null);

    control.on( "update", function( event, place, prod, output, ncepDate ) {

        if (place !== _place || prod!== _prod) {

            //_calendar["events"]=availUrl + "/" + prod + "/" + place + "/avail/calendar?baseUrl=index.html?page=products"
            _calendar.getEventSourceById(_prod).remove()

            _calendar.addEventSource({
                "id":prod,
                "url":availUrl + "/" + prod + "/" + place + "/avail/calendar?baseUrl=index.html?page=products"
            })
            _prod = prod;
            _place = place;
        }

    })

    $("#container_dataavailability").css("display","block")
    $("#container_control").css("display","block")
}

function weatherReports() {
    let weatherReportsUrl=apiBaseUrl+"/v2/weatherreports/latest/json?lang="+_lang

    $.getJSON( weatherReportsUrl, function( data ) {
        let localizedItem=data["i18n"][_lang]
        let html=""
        html+="<div class=\"row\">"
        html+="  <div class=\"col\">"

        html+="    <div class=\"card\">"
        html+="      <div class=\"card-body\">"
        html+="        <h5 class=\"card-title\">"+localizedItem["title"]+"</h5>"
        html+=localizedItem["summary"]
        html+="      </div>"
        html+="    </div>"
        html+="  </div>"
        html+="</div>"



        $("#container_weatherreports")
            .html(html)
            .css("display","block")

        rewriteUrl(localizedItem["title"],"","page=weatherreports",expandUrl(apiBaseUrl+"/products/wrf5/forecast/reg15/map/image"))
    });

}

function infrastructure() {
    let storageUrl=apiBaseUrl+"/v2/slurm/storage"
    let gangliaBaseUrl="http://blackjeans.uniparthenope.it/ganglia/"

    function update() {
        $("#card_aggregated_load_one_image").attr("src",gangliaBaseUrl+"stacked.php?c=Blackjeans-UniParthenope&r=hour&m=load_one")
        $("#card_webserv_load_one_image").attr("src",gangliaBaseUrl+"graph.php?c=Blackjeans-UniParthenope&r=hour&h=webserv&m=load_one")

        console.log(storageUrl)
        $.getJSON(storageUrl, function (data) {

            $("#tbody_storage").empty()

            for (let index in data) {
                let item = data[index]

                let html = ""

                if (item["status"]!=="down") {
                    html += "<tr class=\"table-" + item["alert"] + "\">"
                } else {
                    html += "<tr class=\"table bg-danger\">"
                }
                html += "    <td>" + item["name"] + "</td>"
                html += "    <td><strong>" + item["status"] + "</strong></td>"
                if (item["status"]!=="down") {
                    html += "    <td>" + item["total_mb"]/1000000 + "</td>"
                    html += "    <td>" + item["used_mb"]/1000000 + "</td>"
                    html += "    <td>" + item["available_mb"]/1000000 + "</td>"
                    html += "    <td>" + (item["used_perc"]*100) + "</td>"
                } else {
                    html += "<td></td><td></td><td></td><td></td>"
                }
                html += "</tr>"


                $("#tbody_storage").append(html)
            }
        });
    }
    update()
    setInterval(update, 180000);
    $("#container_infrastructure").css("display", "block")
}

function sinfo() {
    let sinfoUrl=apiBaseUrl+"/v2/slurm/info"

    let gangliaBaseUrl="http://blackjeans.uniparthenope.it/ganglia/graph.php?z=small&c=Blackjeans-UniParthenope&"

    function update() {
        $.getJSON(sinfoUrl, function (data) {

            $("#container_sinfo_row").empty()


            for (let index in data) {
                let item = data[index]

                let hostName = item["hostnames"]
                switch (hostName) {
                    case "node1":
                        hostName = "node01"
                        break
                    case "node2":
                        hostName = "node02"
                        break
                    case "node3":
                        hostName = "node03"
                        break
                    case "node4":
                        hostName = "node04"
                        break
                    case "node5":
                        hostName = "node05"
                        break
                    case "node6":
                        hostName = "node06"
                        break
                    case "node7":
                        hostName = "node07"
                        break
                    case "node8":
                        hostName = "node08"
                        break
                    case "node9":
                        hostName = "node09"
                        break
                }

                let hostId = "host_" + hostName

                let cardClass="card"

                if (item["state"].includes("down")) {
                    cardClass+=" bg-danger"
                } else if (item["state"].includes("allocated")) {
                    cardClass+=" bg-success"
                } if (item["state"].includes("mixed")) {
                    cardClass+=" bg-warning"
                }

                let html = ""
                html += "<div id=\"" + hostId + "_container\" class=\"col\">"
                html += "  <div class=\""+cardClass+"\" id=\"" + hostId + "\">"
                //html+="    <a href=\""+expandUrl(localizedItem["button"]["href"])+"\">"
                html += "      <img id=\"" + hostId + "_image\" class=\"card-img-top\" src=\"" + expandUrl(gangliaBaseUrl + "m=load_one&h=" + hostName) + "\" alt=\"" + hostName + "\">"
                //html+="    </a>"
                html += "    <div class=\"card-header\">"+ hostName +"</div>"
                html += "    <div class=\"card-body\">"
                html += "      <h5 id=\"" + hostId + "_title\" class=\"card-title\">" + item["state"] + "</h5>"
                if (!item["state"].includes("down")) {
                    html += "      <ul class=\"list-group list-group-flush\">"
                    html += "        <li class=\"list-group-item\">CPU Load:" + item["cpu_load"] + "</li>"
                    html += "        <li class=\"list-group-item\">CPUs:" + item["cpus_a_i_o_t"] + "</li>"
                    html += "        <li class=\"list-group-item\">Memory:" + item["free_mem"] + "/" + item["memory"] + "</li>"
                    html += "      </ul>"
                }
                html += "      <p id=\"" + hostId + "_text\" class=\"card-text\">"
                html += "      Partition:<strong>" + item["partition"]+"</strong>"
                html += "      </p>"
                html += "    </div>"
                html += "  </div>"
                html += "</div>"


                $("#container_sinfo_row").append(html)
            }
        });
    }
    update()
    setInterval(update, 60000);
    $("#container_sinfo").css("display", "block")
}

function squeue() {
    let squeueUrl=apiBaseUrl+"/v2/slurm/queue"

    let table_background = {
        "BOOT_FAIL":"danger",
        "CANCELLED":"warning",
        "CONFIGURING":"secondary",
        "COMPLETING":"success",
        "DEADLINE":"info",
        "FAILED":"danger",
        "NODE_FAIL":"danger",
        "OUT_OF_MEMORY":"warning",
        "PENDING":"primary",
        "PREEMPTED":"warning",
        "RESV_DEL_HOLD":"info",
        "REQUEUED_FED":"info",
        "REQUEUED_HOLD":"info",
        "REQUEUED":"info",
        "RESIZING":"info",
        "REVOKED":"warning",
        "RUNNING":"active",
        "SPECIAL_EXIT":"warning",
        "STAGE_OUT":"active",
        "STOPPED":"warning",
        "SUSPENDED":"warning",
        "TIMEOUT":"warning"
    }

    function baseName(str)
    {
        let base = new String(str).substring(str.lastIndexOf('/') + 1);
        if(base.lastIndexOf(".") != -1)
            base = base.substring(0, base.lastIndexOf("."));
        return base;
    }


    function update() {
        $.getJSON(squeueUrl, function (data) {

            $("#tbody_squeue").empty()

            for (let index in data) {
                let item = data[index]

                let command = baseName(item["command"].split(" ")[0])
                let time=""
                if (item["state"]==="RUNNING") {
                    time="<br/>Started:"+item["start_time"]+
                        "<br/>("+item["time"]+")"
                }

                let html = ""

                html += "<tr class=\"table-" + table_background[item["state"]] + "\">"
                html += "    <td>" + item["jobid"] + "</td>"
                html += "    <td>" + item["name"] +
                    "<br/>CPUs: " + item["cpus"] + " Nodes:" + item["nodes"] + " Memory:" + item["min_memory"] +
                    "</td>"
                html += "    <td>" + item["partition"] + "</td>"
                html += "    <td>" + item["state"] +
                    "<br/>Submitted:" + item["submit_time"] + time
                    "</td>"
                html += "    <td>" + item["nodelist_reason"] + "</td>"
                html += "</tr>"


                $("#tbody_squeue").append(html)
            }


        });
    }
    update()
    setInterval(update, 15000);
    $("#container_squeue").css("display", "block")

}

function cards() {
    let cardsUrl=apiBaseUrl+"/v2/cards?lang="+_lang
    console.log("cardsUrl:"+cardsUrl)

    // Define the token
    let token=null

    // Get the userObject
    let userObject = getUserObjectIfAny()

    // Check if the user is logged
    if (userObject != null) {

        // Set the auth token
        token=userObject["token"]
    }

    function setHeader(xhr) {
        if (token != null) {
            xhr.setRequestHeader('authorization', "Basic "+token);
        }
    }

    $.ajax({
            url: cardsUrl,
            type: 'GET',
            dataType: 'json',
            beforeSend: setHeader,
            success: function (data) {
                $("#container_cards_row").empty()



                $.each( data, function( key, values ) {
                    values.forEach(function(item, index) {
                        let localizedItem=item["i18n"][_lang]
                        let cardId="card_"+item["_id"]



                        let html=""
                        html+="<div id=\""+cardId+"_container\" class=\"col\" style=\"display: none\">"
                        html+="  <div class=\"card\" id=\""+cardId+"\">"
                        html+="    <a href=\""+expandUrl(localizedItem["button"]["href"])+"\">"
                        html+="      <img id=\""+cardId+"_image\" class=\"card-img-top\" src=\""+expandUrl(localizedItem["image"]["src"])+"\" alt=\""+localizedItem["image"]["alt"]+"\">"
                        html+="    </a>"
                        html+="    <div class=\"card-body\">"
                        html+= "      <h5 id=\""+cardId+"_title\" class=\"card-title\"></h5>"
                        html+= "      <p id=\""+cardId+"_text\" class=\"card-text\"></p>"
                        html+="      <a href=\""+expandUrl(localizedItem["button"]["href"])+"\" class=\"btn btn-primary\">"+localizedItem["button"]["text"]+"</a>"
                        html+="    </div>"
                        html+="  </div>"
                        html+="</div>"


                        $("#container_cards_row").append(html)

                        if ("timeout" in item) {
                            (function(){
                                let imageUrl=expandUrl(localizedItem["image"]["src"])
                                console.log("Update:"+imageUrl)
                                $("#"+cardId+"_image").attr("src",imageUrl)
                                setTimeout(arguments.callee, parseInt(item["timeout"])*1000);
                            })();

                        }

                        let title=localizedItem["title"]



                        if (title instanceof Object) {

                            if ( "url" in title) {
                                let titleUrl=apiBaseUrl+"/v2/weatherreports/latest/title/json?lang="+_lang

                                $.getJSON( titleUrl, function( data ) {
                                    title=data["title"]
                                    $("#"+cardId+"_title").html(title)
                                })

                            }
                        } else {
                            $("#"+cardId+"_title").html(title)
                        }

                        let text=localizedItem["text"]
                        if (text instanceof Object) {
                            if ( "url" in text) {
                                let textUrl=apiBaseUrl+"/v2/weatherreports/latest/text/json?lang="+_lang

                                $.getJSON(textUrl, function (data) {
                                    text = data["summary"]
                                    $("#" + cardId + "_text").html(text)
                                })
                            }
                        } else {
                            $("#"+cardId+"_text").html(text)
                        }

                        if ("avail" in item && item["avail"]!=="") {
                            let availUrl=expandUrl(item["avail"])

                            $.getJSON(availUrl, function (data) {

                                if (data["avail"].length > 0) {
                                    $("#"+cardId+"_container").css("display","block")
                                }
                            })

                        } else {
                            $("#"+cardId+"_container").css("display","block")
                        }
                    });
                });

                $("#container_cards").css("display","block")

            },
        }
    );
}

function map() {
    console.log("Map _ncepDate:"+_ncepDate)
    oMap = $("#map").MeteoUniparthenopeMap(_place, _ncepDate, {
        "noPopup": false,
        "mapName": _mapName,
        "baseLink": "index.html?page=products"
    });

    $(window).on('resize', function() {
        //console.log("RESIZE")
        $("#map").css('height', "50vh");
    });

    control=$("#control").MeteoUniparthenopeControl(_place,null,null,_ncepDate);
    control.on( "update", function( event, place, prod, output, ncepDate ) {


        oMap = $("#map").MeteoUniparthenopeMap(place, ncepDate, {
            "noPopup": false,
            "mapName": _mapName,
            "baseLink": "index.html?page=products"
        });

        _place=place;
        _ncepDate=ncepDate;

        cards()

        rewriteUrl("",_appDescription,"",expandUrl(apiBaseUrl+"/products/{prod}/forecast/{place}/map/image"))
    });

    //$("#container_carousel").css("display","block")
    $("#container_control").css("display","block")
    $("#container_map").css("display","block")
}

function products() {
    box=$("#box").MeteoUniparthenopeDayBox(_place,_prod,"#box_title");
    chart=$("#chart").MeteoUniparthenopeChart(_place,_prod,_output,_hours,_step,_ncepDate,$("#chart_title"));
    plot=$("#plot").MeteoUniparthenopePlot(_place,_prod,_output,_ncepDate,
        "topBarImage",
        "leftBarImage",
        "rightBarImage",
        "bottomBarImage");

    $(window).on('resize', function() {
        //console.log("RESIZE")
        $("#chart").css('height', "50vh");
    });

    control=$("#control").MeteoUniparthenopeControl(_place,_prod,_output,_ncepDate);
    control.on( "update", function( event, place, prod, output, ncepDate ) {


        plot.update(place,prod,output,ncepDate);

        if (place !== _place) {
            box=$("#box").MeteoUniparthenopeDayBox(place,prod,"#box_title");
            chart=$("#chart").MeteoUniparthenopeChart(place,prod,output,_hours,_step,_ncepDate,null);
        }
        else if (prod!==_prod || output !== _output) {
            chart=$("#chart").MeteoUniparthenopeChart(place,prod,output,_hours,_step,_ncepDate,null);
        }

        _prod=prod;
        _place=place;
        _output=output;
        _ncepDate=ncepDate;

        let placeUrl=apiBaseUrl + "/places/"+place
        $.getJSON( placeUrl, function( data ) {

            // Get the long name
            let longName=""
            if (_lang in data["long_name"]) {
                longName=data["long_name"][_lang]
            } else if (_lang.split("-")[0] in data["long_name"]) {
                longName=data["long_name"][_lang.split("-")[0]]
            } else {
                longName=data["long_name"]["it"]
            }

            // Get the domain and the resolution
            let domain=Object.keys(data["prods"][prod])[0];
            let res=data["prods"][prod][domain]["res"].toFixed(4)

            let cLat=data["cLat"]
            let cLon=data["cLon"]

            console.log("cLon:"+cLon+" cLat:"+cLat)

            let d2r=0.0174533
            resKm=(res*111.3199*Math.cos(cLat*d2r)).toFixed(2)

            let fileName=prod+"_"+domain+"_"+ncepDate+".nc"

            let year=ncepDate.substring(0,4)
            let month=ncepDate.substring(4,6)
            let day=ncepDate.substring(6,8)

            let prodsUrl=apiBaseUrl+"/products/"+prod
            $.getJSON( prodsUrl, function( data ) {


                // Get the description
                let description=""
                if (_lang in data["outputs"]["desc"]) {
                    description+=data["outputs"]["desc"][_lang]
                } else if (_lang.split("-")[0] in data["outputs"]["desc"]) {
                    description+=data["outputs"]["desc"][_lang.split("-")[0]]
                } else {
                    description+=data["outputs"]["desc"]["it"]
                }

                description+=". "

                if (_lang in data["outputs"]["outputs"][output]) {
                    description+=data["outputs"]["outputs"][output][_lang]
                } else if (_lang.split("-")[0] in data["outputs"]["outputs"][output]) {
                    description+=data["outputs"]["outputs"][output][_lang.split("-")[0]]
                } else {
                    description+=data["outputs"]["outputs"][output]["it"]
                }

                description += ". Resolution:" + res + "&deg; ("+resKm+"Km)."

                rewriteUrl(longName + ".", description, "page=products", expandUrl(apiBaseUrl + "/products/{prod}/forecast/{place}/plot/image?output={output}&opt=bars"))

                $("#card_title").html(longName)
                $("#card_text").html(description)

                $("#place_link").attr("href", expandUrl(apiBaseUrl + "/places/{place}"))
                $("#plot_link").attr("href", expandUrl(apiBaseUrl + "/products/{prod}/forecast/{place}/plot/image?output={output}&opt=bars&date={date}"))
                $("#json_link").attr("href", expandUrl(apiBaseUrl + "/products/{prod}/timeseries/{place}?date={date}"))
                $("#csv_link").attr("href", expandUrl(apiBaseUrl + "/products/{prod}/timeseries/{place}/csv?date={date}"))
                $("#opendap_history_link").attr("href", expandUrl(dataBaseUrl + "/{prod}/" + domain + "/history/" + year + "/" + month + "/" + day + "/" + fileName + ".html"))
                $("#wms_history_link").attr("href", expandUrl(wmsBaseUrl + "/{prod}/" + domain + "/history/" + year + "/" + month + "/" + day + "/" + fileName + "?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0"))
                $("#opendap_archive_link").attr("href", expandUrl(dataBaseUrl + "/{prod}/" + domain + "/archive/" + year + "/" + month + "/" + day + "/" + fileName + ".html"))
                $("#wms_archive_link").attr("href", expandUrl(wmsBaseUrl + "/{prod}/" + domain + "/archive/" + year + "/" + month + "/" + day + "/" + fileName + "?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0"))

            })
        })
    });
    $("#container_control").css("display","block")
    $("#container_plot").css("display","block")
    $("#container_chart").css("display","block")
    $("#container_box").css("display","block")
    $("#container_opendata").css("display","block")
}

function pages() {
    let pageUrl=apiBaseUrl+"/v2/pages/"+_page+"?lang="+_lang
    console.log("pageUrl:"+pageUrl)

    // Define the token
    let token=null

    // Get the userObject
    let userObject = getUserObjectIfAny()

    // Check if the user is logged
    if (userObject != null) {

        // Set the auth token
        token=userObject["token"]
    }

    function setHeader(xhr) {
        if (token != null) {
            xhr.setRequestHeader('authorization', "Basic "+token);
        }
    }

    $.ajax({
        url: pageUrl,
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader,
        success: function(data) {
            let localizedData=data["i18n"][_lang]
            let imageUrl=""
            if ("image" in localizedData) {
                $("#page_image").attr("src",localizedData["image"]["src"])
                $("#page_image").attr("alt",localizedData["image"]["alt"])
                imageUrl=localizedData["image"]["src"]
            }
            $("#page_title").text(localizedData["title"])

            let subtitle=""
            if ("subtitle" in localizedData) {
                $("#page_subtitle").text(localizedData["subtitle"])
                subtitle=localizedData["subtitle"]
            }
            $("#page_body").html(localizedData["body"])

            if ("links" in localizedData) {
                localizedData["links"].forEach(function(link, index) {
                    $("#page_links").append("<a href=\""+link["href"]+"\" class=\"card-link\">"+link["text"]+"</a>")
                })
            }

            console.log("DATA")
            console.log(data)

            // Check if the user can edit the page
            if ("permissions" in data ) {
                console.log("Has permissions")

                if (data["permissions"].includes("edit")) {
                    console.log("Can Edit")
                    // Query the edit button
                    $("#page_edit_button")

                        // Show the edit button
                        .css("display", "block")

                        // Register the click event responder
                        .click(function (e) {
                            console.log("SHOW EDIT")

                            // Show the edit button
                            $("#page_edit_button").css("display","none")

                            // Fill the form items
                            $("#page_edit_title").val(localizedData["title"])
                            $("#page_edit_subtitle").val(localizedData["subtitle"])

                            $("#page_edit_abstract").html(localizedData["abstract"])
                            $("#page_edit_abstract").summernote()

                            // Fill the summernote with the body of the page
                            $("#page_edit_body").html(localizedData["body"])
                            $("#page_edit_body").summernote()


                            // Register the cancel button
                            $("#page_save_button")
                                .css("display", "block")
                                .click(function (e) {


                                    let updatedPage = {
                                        "_id": data["_id"],
                                        "active": data["active"],
                                        "author": data["author"],
                                        "i18n": {}
                                    }

                                    updatedPage["i18n"][_lang] = {
                                        "title": $("#page_edit_title").val(),
                                        "subtitle":$("#page_edit_subtitle").val(),
                                        "abstract": $("#page_edit_abstract").val(),
                                        "body": $("#page_edit_body").val(),
                                        "links": localizedData["links"]
                                    }


                                    // Save the modifications.
                                    $.ajax({
                                        url: pageUrl,
                                        type: 'POST',
                                        dataType: 'json',
                                        data: JSON.stringify({
                                            "page":updatedPage
                                        }),
                                        contentType: "application/json; charset=utf-8",
                                        beforeSend: setHeader,
                                        success: function (data) {

                                            // Show the edit button
                                            $("#page_edit_button").css("display", "block")

                                            // Hide the save button
                                            $("#page_save_button").css("display", "none")

                                            // Hide the cancel button
                                            $("#page_cancel_button").css("display", "none")

                                            // Hide the edit div
                                            $("#page_edit").css("display", "none")

                                            // Show the edit div
                                            $("#page_view").css("display", "block")
                                        }
                                    })
                                })

                            // Register the cancel button
                            $("#page_cancel_button")
                                .css("display", "block")
                                .click(function (e) {
                                    // Show the edit button
                                    $("#page_edit_button").css("display","block")

                                    // Hide the save button
                                    $("#page_save_button").css("display","none")

                                    // Hide the cancel button
                                    $("#page_cancel_button").css("display","none")

                                    // Hide the edit div
                                    $("#page_edit").css("display", "none")

                                    // Show the edit div
                                    $("#page_view").css("display", "block")
                                })

                            // Show the editor
                            $("#page_edit").css("display", "block")
                            $("#page_view").css("display", "none")
                            console.log("SHOW EDIT END")
                        })
                } else {
                    $("#page_edit_button").css("display","none")
                }

                if (data["permissions"].includes("delete")) {
                    console.log("Can Delete")
                    // Query the edit button
                    $("#page_delete_button")

                        // Show the edit button
                        .css("display", "block")

                        // Register the click event responder
                        .click(function (e) {
                        })
                } else {
                    $("#page_delete_button").css("display","none")
                }
            }

            $("#container_pages").css("display","block")

            rewriteUrl(localizedData["title"], subtitle,"page="+_page,imageUrl)
        }
    });
}

// When the document is ready
$( document ).ready(function() {

    // Register the login event handler
    $('#form_logout').submit(function(e) {

        console.log("logout")

        // Store the result in the local storage
        localStorage.removeItem('user')

        $("#user").text("")
        $("#container_login").css("display","block")
        $("#container_user").css("display","none")

        $('#cancel_logout').click()

        e.preventDefault();
        location.reload();
    })



    // Register the login event handler
    $('#form_login').submit(function(e) {
        let authLoginUrl=apiBaseUrl+"/v2/auth/login"

        // Get user name
        let userName=$('#name').val()

        // Get password
        let userPass =$('#pass').val()

        let token=btoa(userName+":"+userPass)

        console.log("TOKEN")
        console.log(token)

        function setHeader(xhr) {
            if (token != null) {
                xhr.setRequestHeader('authorization', "Basic "+token);
            }
        }

        // Prepare the ajax call
        $.ajax({
            // Type of the HTTP request
            type        : 'GET',
            // The URL
            url         : authLoginUrl,
            // Don't use the cache
            cache       : false,
            // Set the content type
            contentType: "application/json; charset=utf-8",
            // Set the data type
            dataType: "json",
            // Don't process data
            processData : false,

            // Set header before sending
            beforeSend: setHeader,

            // In case of request success (it is different than authentication success)
            success: function(response) {
                console.log(response)

                /** Correct HTTP answer with authorization error
                 *
                 * {
                 * "errMsg": "Invalid Username or Password!",
                 * "statusCode": 401
                 * }
                 *
                 */

                // Check if the authentication was a success
                if ("errMsg" in response) {

                    // The authentication was a failure
                    $('#messages_login').addClass('alert alert-danger').text(response.errMsg);

                } else {

                    // The authentication was a success

                    // Store the result in the local storage
                    localStorage.setItem( 'user', JSON.stringify({ "token": token, "name":userName }) );

                    $("#user").text(userName)
                    $("#container_login").css("display","none")
                    $("#container_user").css("display","block")

                    //$("#modal_login").modal("toggle")
                    //$("#modal_login").attr('class', 'modal');
                    $('#cancel_login').click()
                    location.reload();
                }


            }
        });
        e.preventDefault();
    });

    console.log("READY _ncepDate:"+_ncepDate)

    // Display the navigation bar
    navBar()

    console.log("PAGE:"+_page)

    // Beginning of page selection

    // Check if the page is the home page
    if (_page==="home") {
        console.log("HOME")
        map()
        // Cards is automatically issued by update
        //cards()
    } else if (_page==="products") {
        console.log("PRODUCTS")
        products()
    } else if (_page==="weatherreports") {
        console.log("weatherreports")
        weatherReports()
    } else if (_page==="dataavailability") {
        console.log("dataavailability")
        dataAvailability()
    } else if (_page==="infrastructure") {
        console.log("infrastructure")
        infrastructure()
        sinfo()
        squeue()
    } else {
        console.log("PAGES")
        pages()
    }
    footer()
    console.log("FINISH")
});
