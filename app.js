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
    let navBarUrl=apiBaseUrl+"/v2/navbar"
    console.log("navBarUrl:"+navBarUrl)



    $.getJSON( navBarUrl, function( data ) {
        console.log("menu")
        let navBarBrandUrl="index.html"
        let items = [];
        $.each( data, function( key, values ) {
            values.forEach(function(item, index) {
                let html="";

                if ("items" in item) {
                    if ("isHome" in item && item["isHome"]) {
                        navBarBrandUrl=item["href"]
                    }

                    html += "<li class='nav-item dropdown'>"
                    html += "    <a class='nav-link dropdown-toggle' href='"+expandUrl(item["href"])+"' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false\'>"+item["text"][_language]+"</a>"
                    html += "    <div class='dropdown-menu' aria-labelledby='navbarDropdown'>"
                    item["items"].forEach(function(item1, index1) {
                        if (item1["text"][_language]=="-") {
                            html += "        <div class='dropdown-divider'></div>"
                        } else {
                            html += "        <a class='dropdown-item' href='" + expandUrl(item1["href"]) + "'>" + item1["text"][_language] + "</a>"
                        }

                        if ("isHome" in item1 && item1["isHome"]) {
                            navBarBrandUrl=item1["href"]
                        }
                    })
                    html += "    </div>"
                    html += "</li>"
                } else {
                    html += "<li class='nav-item active'>"
                    html += "    <a class='nav-link' href='"+expandUrl(item["href"])+"'>"+item["text"][_language]+"</a>"
                    html += "</li>"

                    if ("isHome" in item && item["isHome"]) {
                        navBarBrandUrl=item["href"]
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

        $.each( data, function( key, values ) {
            values.forEach(function(item, index) {


                let title=item["title"]
                let text=item["text"]
                let count=0
                if ( "url" in title) {
                    count=count+1
                    $.getJSON( apiBaseUrl+"/v2/weatherreports/latest/title/json", function( data ) {
                        title=data["title"]
                        count=count-1
                    })

                }
                if ( "url" in text) {
                    count=count+1
                    $.getJSON( apiBaseUrl+"/v2/weatherreports/latest/summary/json", function( data ) {
                        title=data["summary"]
                        count=count-1
                    })

                }

                let handle=null
                check=function() {
                    if (count===0) {
                        let html=""
                        html+="<div class=\"col\">"
                        html+="  <div class=\"card\">"
                        html+="    <a href=\""+expandUrl(item["button"]["href"])+"\">"
                        html+="      <img class=\"card-img-top\" src=\""+expandUrl(item["image"]["src"])+"\" alt=\""+item["image"]["alt"][_language]+"\">"
                        html+="    </a>"
                        html+="    <div class=\"card-body\">"
                        html+= "      <h5 class=\"card-title\">" + title[_language] + "</h5>"
                        html+= "      <p class=\"card-text\">" + text[_language] + "</p>"
                        html+="      <a href=\""+expandUrl(item["button"]["href"])+"\" class=\"btn btn-primary\">"+item["button"]["text"][_language]+"</a>"
                        html+="    </div>"
                        html+="  </div>"
                        html+="</div>"


                        $("#container_cards_row").append(html)
                        clearTimeout(handle)
                        handle=null
                    } else {
                        handle=setTimeout(check,5000)
                    }
                }

                check()


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
    $.getJSON( apiBaseUrl+"/v2/pages/"+_page, function( data ) {
        if ("image" in data) {
            $("#page_image").attr("src",data["image"]["src"])
            $("#page_image").attr("alt",data["image"]["alt"])
        }
        $("#page_title").text(data["title"])
        if ("subtitle" in data) {
            $("#page_subtitle").text(data["subtitle"])
        }
        $("#page_body").html(data["body"])

        if ("links" in data) {
            data["links"].forEach(function(link, index) {
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
    if (_page=="home") {
        console.log("HOME")
        map()
        cards()
    } else if (_page=="products") {
        console.log("PRODUCTS")
        products()
    } else if (_page="weatherreports") {
        console.log("weatherreports")
        weatherReports()
    } else {
        console.log("PAGES")
        pages()
    }
    footer()
    console.log("FINISH")
});
