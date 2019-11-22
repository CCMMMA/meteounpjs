let apiBaseUrl="https://api.meteo.uniparthenope.it"
let _language = (navigator.language || navigator.userLanguage).split("-")[0]


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
let _ncepDate=getURLParameter("date",null);
let _hours=getURLParameter("hours",0);
let _step=getURLParameter("step",1);
let _mapName=getURLParameter("mapName","muggles");

let box=null;
let chart=null;
let control=null;
let plot=null;

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
        let items = [];
        $.each( data, function( key, values ) {
            values.forEach(function(item, index) {
                let html="";

                if ("items" in item) {
                    html += "<li class='nav-item dropdown'>"
                    html += "    <a class='nav-link dropdown-toggle' href='"+item["href"]+"' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false\'>"+item["text"]+"</a>"
                    html += "    <div class='dropdown-menu' aria-labelledby='navbarDropdown'>"
                    item["items"].forEach(function(item1, index1) {
                        if (item1["text"]=="-") {
                            html += "        <div class='dropdown-divider'></div>"
                        } else {
                            html += "        <a class='dropdown-item' href='" + item1["href"] + "'>" + item1["text"] + "</a>"
                        }
                    })
                    html += "    </div>"
                    html += "</li>"
                } else {
                    html += "<li class='nav-item active'>"
                    html += "    <a class='nav-link' href='"+item["href"]+"'>"+item["text"]+"</a>"
                    html += "</li>"
                }
                items.push(  html );
            });
        });

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
        html+="        <h5 class=\"card-title\">"+data["title"]+"</h5>"
        html+=data["summary"]
        html+="      </div>"
        html+="    </div>"
        html+="  </div>"
        html+="</div>"

        console.log("weatherReports:"+html)

        $("#container_weatherreports").html(html);
        $("#container_weatherreports").css("display","block")
    });

}

function cards() {
    let cardsUrl=apiBaseUrl+"/v2/cards"
    console.log("cardsUrl:"+cardsUrl)
    $.getJSON( cardsUrl, function( data ) {
        let html="<div class=\"row\">"

        $.each( data, function( key, values ) {
            values.forEach(function(item, index) {
                html+="<div class=\"col\">"
                html+="  <div class=\"card\">"
                html+="    <a href=\""+item["button"]["href"]+"\">"
                html+="      <img class=\"card-img-top\" src=\""+item["image"]["src"]+"\" alt=\""+item["image"]["alt"]+"\">"
                html+="    </a>"
                html+="    <div class=\"card-body\">"
                html+="      <h5 class=\"card-title\">"+item["title"]+"</h5>"
                html+="      <p class=\"card-text\">"+item["text"]+"</p>"
                html+="      <a href=\""+item["button"]["href"]+"\" class=\"btn btn-primary\">"+item["button"]["text"]+"</a>"
                html+="    </div>"
                html+="  </div>"
                html+="</div>"

            });
        });
        html+="</div>"
        $("#container_cards").html(html);
        $("#container_cards").css("display","block")
    });
}

function map() {
    oMap = $("#map").MeteoUniparthenopeMap(_place, _ncepDate, {
        "noPopup": false,
        "mapName": _mapName,
        "baseLink": "index.html?page=products"
    });

    $(window).on('resize', function() {
        console.log("RESIZE")
        $("#map").css('height', "50vh");
    });

    control=$("#control").MeteoUniparthenopeControl(_place,null,null,_ncepDate);
    control.on( "update", function( event, place, prod, output, ncepDate ) {
        console.log( place );
        console.log( prod );
        console.log( output );
        console.log( ncepDate );

        _prod=prod;
        _place=place;
        _output=output;
        _ncepDate=ncepDate;
    });

    //$("#container_carousel").css("display","block")
    $("#container_control").css("display","block")
    $("#container_map").css("display","block")
}

$( document ).ready(function() {

    console.log("READY")

    navBar()

    console.log("PAGE:"+_page)
    if (_page=="home") {
        console.log("HOME")
        map()
        cards()
        weatherReports()

    } else if (_page=="products") {
        console.log("PRODUCTS")
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
        });
        $("#container_control").css("display","block")
        $("#container_plot").css("display","block")
        $("#container_chart").css("display","block")
        $("#container_box").css("display","block")
    } else {
        console.log("PAGES")
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
    footer()
    console.log("FINISH")
});
