let apiBaseUrl="https://api.meteo.uniparthenope.it"

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
let _mapName=getURLParameter("mapName","muggles");



let control=null;
let plot=null;

$( document ).ready(function() {

    console.log("READY")
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

    console.log("PAGE:"+_page)
    if (_page=="home") {
        console.log("HOME")

        let cardsUrl=apiBaseUrl+"/v2/cards"
        console.log("cardsUrl:"+cardsUrl)
        $.getJSON( cardsUrl, function( data ) {
            html="<div class=\"row\">"

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
            $("#container_cards").append(html);
        });

        oMap = $("#map").MeteoUniparthenopeMap(_place, _ncepDate, {
            "noPopup": false,
            "mapName": _mapName,
            "baseLink": "index.html?page=products"
        });

        $(window).on('resize', function() {
            console.log("RESIZE")
            $("#map").css('height', "50vh");
        });

        $("#container_carousel").css("display","block")
        $("#container_map").css("display","block")
        $("#container_cards").css("display","block")


    } else if (_page=="products") {
        console.log("PRODUCTS")
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


            _prod=prod;
            _place=place;
            _output=output;
            _ncepDate=ncepDate;
        });
        $("#container_products").css("display","block")
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
        });

        $("#container_pages").css("display","block")
    }
    console.log("FINISH")
});
