let apiBaseUrl="https://api.meteo.uniparthenope.it"
let _language = (navigator.language || navigator.userLanguage).split("-")[0]


function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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

let _lang=getURLParameter("lang",(navigator.language || navigator.userLanguage));

let _page=getURLParameter("page","home");

let oMap=null;


let _place=getURLParameter("place","it000");
let _prod=getURLParameter("prod","wrf5");
let _output=getURLParameter("output","gen");

const dateTime=new Date()
defaultNcepDate=dateTime.getUTCFullYear()+pad(dateTime.getUTCMonth()+1,2)+pad(dateTime.getUTCDate(),2)+"Z"+pad(dateTime.getUTCHours(),2)+"00";

let _ncepDate=getURLParameter("date",defaultNcepDate);

console.log("--------> _ncepDate:"+_ncepDate);


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


function footer() {
    let legalDisclaimerUrl=apiBaseUrl+"/legal/disclaimer"
    console.log("legalDisclaimerUrl:"+legalDisclaimerUrl)
    $.getJSON( legalDisclaimerUrl, function( data ) {
        console.log("legalDisclaimer")
        $("#container_footer").append(data["disclaimer"][_language]);
        $("#container_footer").css("display","block")
    });

}

function navBar() {
    let navBarUrl=apiBaseUrl+"/v2/navbar?lang="+_lang
    console.log("navBarUrl:"+navBarUrl)



    $.getJSON( navBarUrl, function( data ) {
        console.log("menu")

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
                        if (item1["text"]=="-") {
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
    });
}

function weatherReports() {
    let weatherReportsUrl=apiBaseUrl+"/v2/weatherreports/latest/json"
    console.log("weatherReportsUrl:"+weatherReportsUrl)
    $.getJSON( weatherReportsUrl, function( data ) {
        let html=""
        html+="<div class=\"row\">"
        html+="  <div class=\"col\">"

        html+="    <div class=\"card\">"
        html+="      <div class=\"card-body\">"
        html+="        <h5 class=\"card-title\">"+data["title"][_language]+"</h5>"
        html+=data["summary"][_language]
        html+="      </div>"
        html+="    </div>"
        html+="  </div>"
        html+="</div>"

        //console.log("weatherReports:"+html)

        $("#container_weatherreports").html(html);
        $("#container_weatherreports").css("display","block")
    });

}

function cards() {
    let cardsUrl=apiBaseUrl+"/v2/cards"
    console.log("cardsUrl:"+cardsUrl)

    $.getJSON( cardsUrl, function( data ) {

        $("#container_cards_row").empty()
        let count=0

        $.each( data, function( key, values ) {
            values.forEach(function(item, index) {

                let cardId="card"+pad(count,2)



                let html=""
                html+="<div class=\"col\">"
                html+="  <div class=\"card\" id=\""+cardId+"\">"
                html+="    <a href=\""+expandUrl(item["button"]["href"])+"\">"
                html+="      <img id=\""+cardId+"_image\" class=\"card-img-top\" src=\""+expandUrl(item["image"]["src"])+"\" alt=\""+item["image"]["alt"][_language]+"\">"
                html+="    </a>"
                html+="    <div class=\"card-body\">"
                html+= "      <h5 id=\""+cardId+"_title\" class=\"card-title\"></h5>"
                html+= "      <p id=\""+cardId+"_text\" class=\"card-text\"></p>"
                html+="      <a href=\""+expandUrl(item["button"]["href"])+"\" class=\"btn btn-primary\">"+item["button"]["text"][_language]+"</a>"
                html+="    </div>"
                html+="  </div>"
                html+="</div>"


                $("#container_cards_row").append(html)

                if ("timeout" in item) {
                    (function(){
                        let imageUrl=expandUrl(item["image"]["src"])
                        console.log("Update:"+imageUrl)
                        $("#"+cardId+"_image").attr("src",imageUrl)
                        setTimeout(arguments.callee, parseInt(item["timeout"])*1000);
                    })();

                }

                let title=item["title"]
                let text=item["text"]

                if ( "url" in title) {
                    $.getJSON( apiBaseUrl+"/v2/weatherreports/latest/title/json", function( data ) {
                        title=data["title"]
                        $("#"+cardId+"_title").html(title[_language])
                    })

                } else {
                    $("#"+cardId+"_title").html(title[_language])
                }

                if ( "url" in text) {
                    $.getJSON( apiBaseUrl+"/v2/weatherreports/latest/text/json", function( data ) {
                        text=data["summary"]
                        $("#"+cardId+"_text").html(text[_language])
                    })

                } else {
                    $("#"+cardId+"_text").html(text[_language])
                }


                count=count+1


            });
        });

        $("#container_cards").css("display","block")
    });
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
        console.log( place );
        console.log( ncepDate );

        oMap = $("#map").MeteoUniparthenopeMap(place, ncepDate, {
            "noPopup": false,
            "mapName": _mapName,
            "baseLink": "index.html?page=products"
        });

        _place=place;
        _ncepDate=ncepDate;

        cards()
        let navBarBrandUrl="index.html?place={place}&prod={prod}&output={output}&date={date}&step={step}&hours={hours}"
        $("a.navbar-brand").attr("href",expandUrl(navBarBrandUrl))
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
    control=$("#control").MeteoUniparthenopeControl(_place,_prod,_output,_ncepDate);
    control.on( "update", function( event, place, prod, output, ncepDate ) {
        console.log( place );
        console.log( prod );
        console.log( output );
        console.log( ncepDate );

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

        let navBarBrandUrl="index.html?place={place}&prod={prod}&output={output}&date={date}&step={step}&hours={hours}"
        $("a.navbar-brand").attr("href",expandUrl(navBarBrandUrl))
    });
    $("#container_control").css("display","block")
    $("#container_plot").css("display","block")
    $("#container_chart").css("display","block")
    $("#container_box").css("display","block")
}

function pages() {
    let pageUrl=apiBaseUrl+"/v2/pages/"+_page+"?lang="+_lang
    console.log("pageUrl:"+pageUrl)

    $.getJSON( pageUrl, function( data ) {
        let localizedData=data["i18n"][_lang]
        if ("image" in localizedData) {
            $("#page_image").attr("src",localizedData["image"]["src"])
            $("#page_image").attr("alt",localizedData["image"]["alt"])
        }
        $("#page_title").text(localizedData["title"])
        if ("subtitle" in localizedData) {
            $("#page_subtitle").text(localizedData["subtitle"])
        }
        $("#page_body").html(localizedData["body"])

        if ("links" in localizedData) {
            localizedData["links"].forEach(function(link, index) {
                $("#page_links").append("<a href=\""+link["href"]+"\" class=\"card-link\">"+link["text"]+"</a>")
            })
        }

        $("#container_pages").css("display","block")
    });
}


$( document ).ready(function() {

    console.log("READY _ncepDate:"+_ncepDate)

    navBar()

    console.log("PAGE:"+_page)
    if (_page==="home") {
        console.log("HOME")
        map()
        cards()
    } else if (_page==="products") {
        console.log("PRODUCTS")
        products()
    } else if (_page==="weatherreports") {
        console.log("weatherreports")
        weatherReports()
    } else {
        console.log("PAGES")
        pages()
    }
    footer()
    console.log("FINISH")
});
