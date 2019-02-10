(function( $ ) {

    var apiBaseUrl="https://api.meteo.uniparthenope.it"

    var weatherIconUrl="images/";
    var loadingUrl="images/animated_progress_bar.gif";




    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    function dayOfWeek(date) {
        let year = date.substring(0, 4);
        let month = date.substring(4, 6);
        let day = date.substring(6, 8);

        let dayOfWeek = new Date(year + "-" + month + "-" + day).getDay();
        return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    };

    function monthOfYear(date) {
        let month = parseInt(date.substring(4, 6)) - 1;
        console.log(month);
        return isNaN(month) ? null : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month];
    };

    function box(container,type="minibox",place="com63049",prod="wrf5")  {
        console.log( "box:"+container );

        //$("#"+container).empty();
        container.empty();


        var placeUrl=apiBaseUrl+"/places/"+place;

        let step=1;
        if (type=="minibox" || type=="compactbox" || type=="daybox") {
            step=24;
        }

        var timeseriesUrl=apiBaseUrl+"/products/"+prod+"/timeseries/"+place+"?step="+step;
        console.log("placeUrl: "+placeUrl);
        console.log("timeseriesUrl: "+timeseriesUrl);

        let divBox=null;

        // Get the place data
        $.getJSON( placeUrl, function( placeData ) {
            console.log(placeData);

            // Create the main container
            divBox=$('<div>');
            divBox.attr('id','box');
            divBox.attr('class','box');

            // Append the title
            divBox.append('<div class="title">'+placeData['long_name']['it']+'</div>');

            // Append the loading div
            divBox.append('<div id="loading"><img src="'+loadingUrl+'" width="100%"/></div>');

            let table = $('<table>');
            table.attr('id','table');
            table.attr( 'width',"100%");
            table.attr( 'cellspacing','0');
            table.attr( 'cellpadding','0');
            table.attr( 'border','0');
            table.attr( 'style','display:none');

            if (type=="minibox") {
                table.append('<tr class="legenda">' +
                    '<td width="60%" colspan="2" valign="top" align="left">Forecast</td>' +
                    '<td width="20%" valign="top" align="center">Wind</td>' +
                    '<td width="20%" valign="top" align="center">Sea</td>' +
                    '</tr>');
            } else if (type=="compactbox") {
                table.append('<tr class="legenda">'+
                    '<td width="40%" colspan="2">Forecast</td>'+
                    '<td width="20%" colspan="2">Temp</td>'+
                    '<td width="20%">Wind</td>'+
                    '<td width="20%">Sea</td>'+
                    '</tr>');
            } else if (type=="daybox") {
                table.append('<tr class="legenda">' +
                    '<td width="32%" colspan="2">Forecast</td>' +
                    '<td width="9%" class="tMin">T&nbsp;min &deg;C</td>' +
                    '<td width="9%" class="tMax">T&nbsp;max &deg;C</td>' +
                    '<td width="21%" colspan="2">Wind (kn)</td>' +
                    '<td width="28%">Rain (mm)</td>' +
                    '</tr>');
            }
            divBox.append(table);

            // Create the ink container
            /*
            var divInk=$('<div>');
            divInk.attr('class','meteo.ink');
            divInk.append('<a href="http://meteo.uniparthenope.it" target="_blank" title="Meteo">CCMMMA: http://meteo.uniparthenope.it</a>');
            divInk.append('<br/>');
            divInk.append('&copy;2019 '+
                '<a href="http://meteo.uniparthenope.it/" title="Meteo siti web" target="_blank">'+
                '<b>meteo.uniparthenope.it</b> - <b>CCMMMA</b> Universit&agrave; Parthenope</a>');

            divBox.append(divInk);
            */
            container.append(divBox);

            console.log("-----------------------------------");
            $.getJSON( timeseriesUrl, function( data ) {
                let timeseriesData=data['timeseries'];
                console.log("-------------> "+timeseriesData);

                $.each( timeseriesData, function( key, val ) {

                    let weekDayLabel=dayOfWeek(val['dateTime']);
                    let monthDay=monthOfYear(val['dateTime']) + "-" + val['dateTime'].substring(6,8);

                    let wIconUrl=weatherIconUrl+"/"+val['icon'];
                    let wTextLabel=val['text'];

                    let windLabel="";
                    let windBarbUrl="";

                    let seaWaveUrl="";
                    let waveLabel="";



                    let row='<tr>';

                    if (type=="minibox") {
                        row += '  <td class="data" valign="top" align="center">';
                        row += '    <a href="' + val['link'] + '" target="_blank" class="day" title="Meteo ' + placeData['long_name']['it'] + ' - ' + weekDayLabel + ' ' + monthDay + '" >';
                        row += weekDayLabel + "<br/>" + monthDay;
                        row += '    </a>';
                        row += '  </td>';
                        row += '  <td class="data" valign="top" align="center">';
                        row += '      <img src="' + wIconUrl + '" width="16" height="16" alt="' + wTextLabel + '" title="' + wTextLabel + '" />';
                        row += '    <br/>' + val['t2c-min'] + '/' + val['t2c-max'];
                        row += '  </td>';
                        row += '  <td class="data"  align="center">';
                        row += '    <img src="' + windBarbUrl + '" alt="' + windLabel + '" title="' + windLabel + '" width="16" heigh="16" />';
                        row += '  </td>';
                        row += '  <td class="data"  align="center">';
                        row += '    <img src="' + seaWaveUrl + '" alt="' + waveLabel + '" title="' + waveLabel + '" width="16" heigh="16" />';
                        row += '  </td>';
                    } else if (type=="compactbox") {
                        row+='  <td class="data">'
                        row+='    <a href="'+val['link']+'" target="_blank" class="day" title="Meteo '+placeData['long_name']['it']+' - '+weekDayLabel+' '+monthDay+'" >';
                        row+=       weekDayLabel+" "+monthDay;
                        row+='    </a>';
                        row+='  </td>';
                        row+='  <td class="data">';
                        row+='    <a href="'+val['link']+'" target="_blank" class="day" title="Meteo '+placeData['long_name']['it']+' - '+weekDayLabel+' '+monthDay+'" >';
                        row+='      <img src="'+wIconUrl+'" width="16" height="16" alt="'+wTextLabel+'" title="'+wTextLabel+'" />';
                        row+='    </a>';
                        row+='  </td>';
                        row+='  <td class="data tmin">'+val['t2c-min']+'</td>';
                        row+='  <td class="data tmax">'+val['t2c-max']+'</td>';
                        row+='  <td class="data">';
                        row+='    <img src="'+windBarbUrl+'" alt="'+windLabel+'" title="'+windLabel+'" width="16" heigh="16" />';
                        row+='  </td>';
                        row+='  <td class="data">';
                        row+='    <img src="'+seaWaveUrl+'" alt="'+waveLabel+'" title="'+waveLabel+'" width="16" heigh="16" />';
                        row+='  </td>';
                    } else if (type=="daybox") {
                        row+='  <td class="data">'
                        row+='    <a href="'+val['link']+'" target="_blank" class="day" title="Meteo '+placeData['long_name']['it']+' - '+weekDayLabel+' '+monthDay+'" >';
                        row+=       weekDayLabel+"<br/>"+monthDay;
                        row+='    </a>';
                        row+='  </td>';
                        row+='  <td class="data">';
                        row+='    <a href="'+val['link']+'" target="_blank" class="day" title="Meteo '+placeData['long_name']['it']+' - '+weekDayLabel+' '+monthDay+'" >';
                        row+='      <img src="'+wIconUrl+'" class="weathericon" alt="'+wTextLabel+'" title="'+wTextLabel+'" />';
                        row+='    </a>';
                        row+='  </td>';
                        row+='  <td class="data tmin">'+val['t2c-min']+'</td>';
                        row+='  <td class="data tmax">'+val['t2c-max']+'</td>';
                        row+='  <td class="data">'+val['winds']+'</td>';
                        row+='  <td class="data">'+val['ws10n']+'</td>';
                        row+='  <td class="data">'+val['crh']+'</td>';
                    }
                    row+='</tr>';
                    table.append(row);
                });
                $('#loading').hide();
                $('#table').show();
            });
        });
        return divBox;
    };

    function plot(container,place="com63049",prod="wrf5",output="gen",ncepDate=null,
                  topBarImageId,
                  leftBarImageId,
                  rightBarImageId,
                  bottomBarImageId)  {
        console.log( "plot");

        if (ncepDate==null) {
            if (prod != "rdr1" && prod != "rdr2") {
                let dateTime = new Date();
                ncepDate = dateTime.getFullYear() + pad(dateTime.getMonth() + 1, 2) + pad(dateTime.getDate(), 2) + "Z" + pad(dateTime.getHours(), 2) + "00";
            }
        }

        let _topBarImageId=topBarImageId;
        let _leftBarImageId=leftBarImageId;
        let _rightBarImageId=rightBarImageId;
        let _bottomBarImageId=bottomBarImageId;

        //$("#"+container).empty();
        container.empty();

        // Create the main container
        let divPlot=$('<div>');
        divPlot.attr('id','plot-container');


        // Append the title
        divPlot.append(
            '<div id="plot-container-loadingDiv" class="plot-container-loadingDiv"><img src="'+loadingUrl+'"/></div>'+
            '<div id="plot-container-mapDiv" class="plot-container-mapDiv">'+
            '  <img id="plot-container-mapImage" style="width: 100%; height: 100%; display:none"/>'+
            '</div>'
        );



        container.append(divPlot);

        divPlot.update=function(place, prod, output, ncepDate) {

            //$("#plot").empty();
            let mapImageUrl=apiBaseUrl+"/products/"+prod+"/forecast/"+place+"/plot/image?date="+ncepDate+"&output="+output;
            let baseBarImageUrl=apiBaseUrl+"/products/"+prod+"/forecast/legend";
            console.log("Plot:"+mapImageUrl);

            $('#plot-container-mapImage').hide();
            $('#plot-container-loadingDiv').show();


            $("#"+_topBarImageId).attr('src',baseBarImageUrl+"/top/"+output);
            $("#"+_leftBarImageId).attr('src',baseBarImageUrl+"/left/"+output);

            $("#plot-container-mapImage").attr('src',mapImageUrl);

            $("#"+_rightBarImageId).attr('src',baseBarImageUrl+"/right/"+output);
            $("#"+_bottomBarImageId).attr('src',baseBarImageUrl+"/bottom/"+output);

            $('#plot-container-loadingDiv').hide();
            $('#plot-container-mapImage').show();
        };
        divPlot.update(place,prod,output,ncepDate);
        return divPlot;
    };

    function map(container,place="com63049",prod="wrf5",output="gen",ncepDate=null,baseMapIdx=0,
                  topBarImageId,
                  leftBarImageId,
                  rightBarImageId,
                  bottomBarImageId)  {
        console.log( "map");

        if (ncepDate==null) {
            if (prod != "rdr1" && prod != "rdr2") {
                let dateTime = new Date();
                ncepDate = dateTime.getFullYear() + pad(dateTime.getMonth() + 1, 2) + pad(dateTime.getDate(), 2) + "Z" + pad(dateTime.getHours(), 2) + "00";
            }
        }

        let _topBarImageId=topBarImageId;
        let _leftBarImageId=leftBarImageId;
        let _rightBarImageId=rightBarImageId;
        let _bottomBarImageId=bottomBarImageId;

        var _map=null;
        var _controlLayers=null;
        var _center=new L.LatLng(40.85, 14.28);
        var _zoom = 5;
        var _domain="d00";
        var _prefix="";
        var _windLayer = null;
        var _t2cLayer= null;
        var _rainLayer= null;
        var _snowLayer= null;
        var _cloudLayer= null;
        var _infoLayer= null;


        //$("#"+container).empty();
        container.empty();

        // Create the main container
        let divMap=$('<div>');
        divMap.attr('id','map-container');


        // Append the title
        divMap.append('<div id="map-container-mapid" style="height: 512px;position: inherit !important;"></div>');

        container.append(divMap);



        var navionicsLayer = new JNC.Leaflet.NavionicsOverlay({
            navKey: 'Navionics_webapi_00480',
            chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
            isTransparent: false,
            // Enable Navionics logo with payoff
            logoPayoff: true,
            zIndex: 1
        });

        var navionicsSonarMapLayer=new JNC.Leaflet.NavionicsOverlay({
            navKey: 'Navionics_webapi_00480',
            chartType: JNC.NAVIONICS_CHARTS.SONARCHART,
            isTransparent: false,
            zIndex: 1
        });

        var navionicsSkiLayer=new JNC.Leaflet.NavionicsOverlay({
            navKey: 'Navionics_webapi_00480',
            chartType: JNC.NAVIONICS_CHARTS.SKI,
            isTransparent: false,
            zIndex: 1
        });


        var worldImageryLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, ' +
                    'AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }
        );

        var darkGreyLayer = L.tileLayer(
            "http://{s}.sm.mapstack.stamen.com/" +
            "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
            "{z}/{x}/{y}.png", {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, ' +
                    'NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            }
        );

        var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        );

        var baseMaps = {
            "Satellite": worldImageryLayer,
            "Navionics Marine Chart": navionicsLayer,
            "Navionics Sonar Map": navionicsSonarMapLayer,
            "Navionics Ski": navionicsSkiLayer,
            "Dark Gray": darkGreyLayer,
            "Open Street Map": osmLayer
        };

        var overlayMaps = {};

        //L.Icon.Default.imagePath = 'images';

        //Inizializzo la mappa
        _map = new L.Map('map-container-mapid');

        //Setto la visualizzazione di defautl a Napoli
        _map.setView(_center, _zoom);

        var layerInstance = null;
        switch (parseInt(baseMapIdx)) {
            case 1:
                layerInstance=navionicsLayer;
                break;
            case 2:
                layerInstance=navionicsSonarMapLayer;
                break;
            case 3:
                layerInstance=navionicsSkiLayer;
                break;
            case 4:
                layerInstance=darkGreyLayer;
                break;
            case 5:
                layerInstance=osmLayer;
                break;
            default:
                console.log("worldImageryLayer");
                layerInstance=worldImageryLayer;

        }

        //Aggiungo il layer alla mappa
        layerInstance.addTo(_map);

        console.log("Added background map:"+baseMapIdx);



        // Evento sulla modifica dello zoom della mappa
        _map.on('zoomend', function () {
            _zoom = _map.getZoom();
            change_domain(_map.getBounds());
        });

        _map.on('moveend', function(e) {
            _center = _map.getBounds().getCenter();
            change_domain(_map.getBounds());
        });



        var loadingControl = L.Control.loading({
            spinjs: true
        });
        _map.addControl(loadingControl);


        // Add the geojson layer to the layercontrol
        _controlLayers = L.control.layers(baseMaps,overlayMaps,{ collapsed: true }).addTo(_map);


        divMap.update=function(place, prod, output, ncepDate) {

            //$("#plot").empty();
            let baseBarImageUrl=apiBaseUrl+"/products/"+prod+"/forecast/legend";

            $("#"+_topBarImageId).attr('src',baseBarImageUrl+"/top/"+output);
            $("#"+_leftBarImageId).attr('src',baseBarImageUrl+"/left/"+output);


            change_domain(_map.getBounds());

            $("#"+_rightBarImageId).attr('src',baseBarImageUrl+"/right/"+output);
            $("#"+_bottomBarImageId).attr('src',baseBarImageUrl+"/bottom/"+output);

        };

        divMap.update(place,prod,output,ncepDate);


        /*****************************************/

        function  change_domain(bounds) {
            console.log("prefix:" + _prefix);
            var new_prefix = "reg";
            if (_zoom >= 0 && _zoom <= 6) {
                new_prefix = 'reg';
            } else if (_zoom >= 7 && _zoom <= 10) {
                new_prefix = 'prov';
            } else {
                new_prefix = 'com';
            }
            console.log("new_prefix:" + new_prefix);

            if (new_prefix != _prefix) {
                _prefix = new_prefix;
                addInfoLayer();
            }

            console.log("domain:" + _domain);
            var new_domain = "d01";
            var boundsD01 = L.latLngBounds(L.latLng(27.64, -19.68), L.latLng(63.48, 34.80));
            var boundsD02 = L.latLngBounds(L.latLng(34.40, 3.58), L.latLng(47.83, 22.26));
            var boundsD03 = L.latLngBounds(L.latLng(39.15, 13.56), L.latLng(41.62, 16.31));

            console.log("bounds:" + bounds.getWest() + "," + bounds.getSouth() + " - " + bounds.getEast() + "," + bounds.getNorth());
            console.log("boundsD03:" + boundsD03.getWest() + "," + boundsD03.getSouth() + " - " + boundsD03.getEast() + "," + boundsD03.getNorth());
            console.log("boundsD02:" + boundsD02.getWest() + "," + boundsD02.getSouth() + " - " + boundsD02.getEast() + "," + boundsD02.getNorth());
            console.log("boundsD01:" + boundsD01.getWest() + "," + boundsD01.getSouth() + " - " + boundsD01.getEast() + "," + boundsD01.getNorth());

            if ( boundsD03.contains(bounds) ) {
                new_domain="d03";
            } else if ( boundsD02.contains(bounds) ) {
                new_domain="d02";
            } else {
                new_domain="d01";
            }
            console.log("new_domain:"+new_domain);

            if ( new_domain != _domain ) {
                console.log("Remove");
                _domain=new_domain;
                console.log("Add")
                addWindLayer();
                ////addT2CLayer();
                addCloudLayer();
                addRainLayer();
                addSnowLayer();
            }
        }


        function addInfoLayer() {

            var geojsonURL = apiBaseUrl + '/apps/owm/wrf5/'+_prefix+'/{z}/{x}/{y}.geojson?date=' + ncepDate;
            console.log("geojsonURL:"+geojsonURL);

            // Creo lo syle per i marker
            var style = {
                "clickable": true,
                "color": "#00D",
                "fillColor": "#00D",
                "weight": 1.0,
                "opacity": 0.3,
                "fillOpacity": 0.2
            };

            // Creo il layer Json
            // Opzioni per il layer json
            option_geojsonTileLayer = {
                clipTiles: true,
            };

            // opzioni del json per il layer json
            geojsonOptions_geojsonTileLayer = {
                style: style,
                pointToLayer: function (features, latlng) {
                    var file = features.properties.icon;
                    //console.log(file);
                    return L.marker(latlng, {icon: img_array[file]});
                },
                filter: function (feature, layer) {
                    var index = feature.properties.id.search(/[0-9]/);
                    var get_type = feature.properties.id.substring(0, index);
                    return get_type == _prefix;
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        //console.log(feature.properties);
                        country = feature.properties.country;
                        city = feature.properties.name;
                        id = feature.properties.id;
                        clouds = parseInt(feature.properties.clf * 100); //clouds
                        dateTime = feature.properties.dateTime;
                        humidity = feature.properties.rh2; //umidity
                        pressure = feature.properties.slp; //pressure
                        temp = feature.properties.t2c; //temp
                        text = feature.properties.text;
                        wind_direction = feature.properties.wd10; // wind_deg
                        wind_speed = feature.properties.ws10n; //wind_speed
                        wind_chill = feature.properties.wchill; //wind_chill
                        winds = feature.properties.winds; //winds



                        popupString = "<div class='popup'>" +
                            "<table class='tg' style='undefined;table-layout: fixed; width: 230px'>" +
                            "<colgroup>" +
                            "<col style='width: 85px'>" +
                            "<col style='width: 60px'>" +
                            "</colgroup>" +
                            "<tr>" +
                            "<th class='tg-baqh' colspan='2'><a href='/place/" + id + "'>" + city + "</a></th>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='tg-7un6'>COUNTRY</td>" +
                            "<td class='tg-7un6'>" + country + "</td>" +
                            "</tr>";

                        //creazione popup place
                        popupString +=
                            "<tr>" +
                            "<td class='tg-j0tj'>TEMP</td>" +
                            "<td class='tg-j0tj'>" + temp + "°C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='tg-7un6'>METEO</td>" +
                            "<td class='tg-7un6'>" + text + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='tg-j0tj'>CLOUDS</td>" +
                            "<td class='tg-j0tj'>" + clouds  + "%</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='tg-7un6'>HUMIDITY</td>" +
                            "<td class='tg-7un6'>" + humidity + "%</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='tg-j0tj'>PRESSURE</td>" +
                            "<td class='tg-j0tj'>" + pressure + " HPa</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='tg-7un6'>WIND DIRECTION</td>" +
                            "<td class='tg-7un6'>" + wind_direction + " °N</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='tg-j0tj'>WIND SPEED</td>" +
                            "<td class='tg-j0tj'>" + wind_speed + " knt</td>" +
                            "</tr>" +
                            "<td class='tg-7un6'>WIND CHILL</td>" +
                            "<td class='tg-7un6'>" + wind_chill + " *C</td>" +
                            "</tr>" +
                            "<td class='tg-j0tj'>WIND</td>" +
                            "<td class='tg-j0tj'>" + winds + "</td>" +
                            "</tr>" +
                            "</table>" +
                            "</div>";

                        popupString += "</table>" + "</div>";

                        layer.bindPopup(popupString);
                    }
                }
            };

            if (_infoLayer != null) {
                _controlLayers.removeLayer(_infoLayer);
                _map.removeLayer(_infoLayer);
            }

            _infoLayer = new L.TileLayer.GeoJSON(geojsonURL, option_geojsonTileLayer, geojsonOptions_geojsonTileLayer);

            //Aggiungo il layer alla mappa
            _map.addLayer(_infoLayer);
            _controlLayers.addOverlay(_infoLayer,"Info");
            console.log("Added info layer");
        }


        function addCloudLayer() {
            let year=ncepDate.substring(0,4);
            let month=ncepDate.substring(4,6);
            let day=ncepDate.substring(6,8);

            if (_cloudLayer != null) {
                _controlLayers.removeLayer(_cloudLayer);
                _map.removeLayer(_cloudLayer);
            }

            _cloudLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/'+
                _domain+'/archive/'+year+'/'+month+'/'+day+'/wrf5_'+_domain+'_'+ncepDate+'.nc', {
                    layers: 'CLDFRA_TOTAL',
                    styles: 'raster/tcldBars',
                    format: 'image/png',
                    transparent: true,
                    opacity : 0.8,
                    COLORSCALERANGE:"0.125,1",
                    NUMCOLORBANDS:"250",
                    ABOVEMAXCOLOR:"extend",
                    BELOWMINCOLOR:"transparent",
                    BGCOLOR:"extend",
                    LOGSCALE:"false"
                }
            );
            _map.addLayer(_cloudLayer);
            _controlLayers.addOverlay(_cloudLayer,"Cloud");
        }

        function addT2CLayer() {
            let year=ncepdate.substring(0,4);
            let month=ncepdate.substring(4,6);
            let day=ncepdate.substring(6,8);

            if (_t2cLayer != null) {
                _controlLayers.removeLayer(_t2cLayer);
                _map.removeLayer(_t2cLayer);
            }

            _t2cLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/'+
                _domain+'/archive/'+year+'/'+month+'/'+day+'/wrf5_'+_domain+'_'+ncepDate+'.nc', {
                    layers: 'T2C',
                    styles: 'default-scalar/tspBars',
                    format: 'image/png',
                    transparent: true,
                    opacity : 0.8,
                    COLORSCALERANGE:"-40,50",
                    NUMCOLORBANDS:"19",
                    ABOVEMAXCOLOR:"extend",
                    BELOWMINCOLOR:"extend",
                    BGCOLOR:"extend",
                    LOGSCALE:"false"
                }
            );
            //map.addLayer(t2cLayer);
            _controlLayers.addOverlay(_t2cLayer,"Temperature");
        }

        function addRainLayer() {
            let year=ncepDate.substring(0,4);
            let month=ncepDate.substring(4,6);
            let day=ncepDate.substring(6,8);

            if (_rainLayer != null) {
                _controlLayers.removeLayer(_rainLayer);
                _map.removeLayer(_rainLayer);
            }

            _rainLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/'+
                _domain+'/archive/'+year+'/'+month+'/'+day+'/wrf5_'+_domain+'_'+ncepDate+'.nc', {
                    layers: 'DELTA_RAIN',
                    styles: 'raster/crhBars',
                    format: 'image/png',
                    transparent: true,
                    opacity : 0.8,
                    COLORSCALERANGE:".2,60",
                    NUMCOLORBANDS:"15",
                    ABOVEMAXCOLOR:"extend",
                    BELOWMINCOLOR:"transparent",
                    BGCOLOR:"extend",
                    LOGSCALE:"false"
                }
            );
            _map.addLayer(_rainLayer);
            _controlLayers.addOverlay(_rainLayer,"Rain");
        }

        function addSnowLayer() {
            let year=ncepDate.substring(0,4);
            let month=ncepDate.substring(4,6);
            let day=ncepDate.substring(6,8);

            if (_snowLayer != null) {
                _controlLayers.removeLayer(_snowLayer);
                _map.removeLayer(_snowLayer);
            }

            _snowLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/'+
                _domain+'/archive/'+year+'/'+month+'/'+day+'/wrf5_'+_domain+'_'+ncepDate+'.nc', {
                    layers: 'HOURLY_SWE',
                    styles: 'raster/sweBars',
                    format: 'image/png',
                    transparent: true,
                    opacity : 0.8,
                    COLORSCALERANGE:"0.5,15.5",
                    NUMCOLORBANDS:"6",
                    ABOVEMAXCOLOR:"extend",
                    BELOWMINCOLOR:"transparent",
                    BGCOLOR:"extend",
                    LOGSCALE:"false"
                }
            );
            _map.addLayer(_snowLayer);
            _controlLayers.addOverlay(_snowLayer,"Snow");
        }

        function addWindLayer() {

            // load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)
            $.getJSON(apiBaseUrl+'/products/wrf5/forecast/'+_domain+'/grib/json?date='+ncepDate, function (data) {

                if (_windLayer != null) {
                    _controlLayers.removeLayer(_windLayer);
                    _map.removeLayer(_windLayer);
                }

                _windLayer = L.velocityLayer({
                    displayValues: true,
                    displayOptions: {
                        velocityType: 'Wind 10m',
                        position: 'bottomleft',
                        displayPosition: 'bottomleft',
                        displayEmptyString: 'No wind data',
                        angleConvention: 'meteoCW',
                        speedUnit: 'kt'
                    },
                    data: data,

                    // OPTIONAL
                    minVelocity: 0,          // used to align color scale
                    maxVelocity: 25.72,         // used to align color scale
                    velocityScale: 0.005,    // modifier for particle animations, arbitrarily defaults to 0.005
                    colorScale: [ "#000033", "#0117BA", "#011FF3", "#0533FC", "#1957FF", "#3B8BF4",
                        "#4FC6F8", "#68F5E7", "#77FEC6", "#92FB9E", "#A8FE7D", "#CAFE5A",
                        "#EDFD4D", "#F5D03A", "#EFA939", "#FA732E", "#E75326", "#EE3021",
                        "#BB2018", "#7A1610", "#641610" ]          // define your own array of hex/rgb colors
                });

                _map.addLayer(_windLayer);
                _controlLayers.addOverlay(_windLayer,"Wind");
            });
        }

        return divMap;
    };


    function control(container,place="com63049",prod="wrf5",output="gen",dateTime=null)  {
        console.log( "control:"+container );

        let _prod="wrf5";
        let _output="gen";
        let _place="com63049";
        let _ncepDate=null;

        function update() {

            console.log("UPDATE: place:"+_place+" prod:"+_prod+" output:"+_output+" ncepDate:"+_ncepDate);
            divControl.trigger( "update", [ _place, _prod, _output, _ncepDate ] );
        }

        //$("#"+container).empty();
        container.empty();

        // Create the main container
        let divControl=$('<div>');
        divControl.attr('id','control-container');

        // Append the title
        divControl.append('<fieldset>'+
            '<div class="ui-widget">'+
            '  <label for="control-container-places">Places: </label>'+
            '  <input id="control-container-places">'+
            '</div>'+

            //'<div id="control-container-datetimepicker"></div>'+
            '<input type="text" id="control-container-datetimepicker">'+

            '<label for="control-container-product">Product:</label>'+
            '<select name="control-container-product" id="control-container-product"></select>'+

            '<label for="control-container-output">Output:</label>'+
            '<select name="control-container-output" id="control-container-output"></select>'+
            '</fieldset>'
        );

        container.append(divControl);

        $( "#control-container-product" ).selectmenu({
            change: function( event, ui ) {
                _prod=ui.item.value;
                $.getJSON( apiBaseUrl+"/products/"+_prod, function( data ) {
                    let outputs=data['outputs']['outputs'];

                    $("#control-container-output").empty();

                    $.each( outputs, function( key, val ) {
                        $("#control-container-output").append('<option value="'+key+'">'+val['en']+'</option>');
                    });

                    _output="gen";
                    $('#control-container-output').val(_output);
                    $("#control-container-output").selectmenu("refresh");

                    update();
                });
            }
        });

        $( "#control-container-output" ).selectmenu({
            change: function( event, ui ) {
                _output=ui.item.value;
                update();
            }
        });

        $( "#control-container-places" ).autocomplete({
            source: function( request, response ) {
                $.ajax( {
                    url: apiBaseUrl+"/places/search/byname/autocomplete",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function( data ) {
                        console.log("data:"+data);
                        response( data );
                    },
                    error: function (  jqXHR,  textStatus,  errorThrown) {
                        console.log("Error:"+textStatus);
                    }

                } );
            },
            minLength: 2,
            select: function( event, ui ) {
                _place=ui.item.id;
                update();
            }
        } );


        $( "#control-container-datetimepicker" ).datetimepicker({
            showOtherMonths: true,
            selectOtherMonths: true,
            format: "yyyy-mm-dd",
            timeFormat: 'HH:mm',
            stepHour: 1,
            stepMinute: 60,
            addSliderAccess: true,
            sliderAccessArgs: { touchonly: false },

            onSelect: function(dateText) {
                let dateTime=$('#control-container-datetimepicker').datetimepicker('getDate');
                _ncepDate=dateTime.getFullYear()+pad(dateTime.getMonth()+1,2)+pad(dateTime.getDate(),2)+"Z"+pad(dateTime.getHours(),2)+pad(dateTime.getMinutes(),2);

                update();
            }
        });



        $.getJSON( apiBaseUrl+"/products", function( data ) {
            let products=data['products'];

            console.log("products:"+products);

            $("#control-container-product").empty();

            $.each( products, function( key, val ) {
                $("#control-container-product").append('<option value="'+key+'">'+val['desc']['en']+'</option>');
            });

            _prod=prod;
            $('#control-container-product').val(_prod);
            $("#control-container-product").selectmenu("refresh");

            $.getJSON( apiBaseUrl+"/products/"+_prod, function( data ) {
                let outputs=data['outputs']['outputs'];

                $("#control-container-output").empty();

                $.each( outputs, function( key, val ) {
                    $("#control-container-output").append('<option value="'+key+'">'+val['en']+'</option>');
                });

                _output=output;
                $('#control-container-output').val(_output);
                $("#control-container-output").selectmenu("refresh");
            });

            $('#control-container-datetimepicker').datetimepicker('setDate', (new Date()) );
            let dateTime=$('#control-container-datetimepicker').datetimepicker('getDate');
            _ncepDate=dateTime.getFullYear()+pad(dateTime.getMonth()+1,2)+pad(dateTime.getDate(),2)+"Z"+pad(dateTime.getHours(),2)+pad(dateTime.getMinutes(),2);

            _place=place;
            $.getJSON(apiBaseUrl+"/places/"+_place, function( data ) {
                $( "#control-container-places" ).val(data['long_name']['it']);
            });

            update();

        });
        return divControl;
    };



    $.fn.MeteoUniparthenopeDayBox = function( place = "com63049", prod = "wrf5" ) {

        return box(this, "daybox", place, prod);

    };

    $.fn.MeteoUniparthenopeCompactBox = function( place = "com63049", prod = "wrf5" ) {

        return box(this, "compactbox", place, prod);

    };

    $.fn.MeteoUniparthenopeMiniBox = function(place = "com63049", prod = "wrf5" ) {

        return box(this, "minibox", place, prod);

    };



    $.fn.MeteoUniparthenopePlot = function(place = "com63049", prod = "wrf5", output="gen", dateTime=null,topBarImageId,leftBarImageId,rightBarImageId,bottomBarImageId ) {

        return plot(this, place, prod, output, dateTime,topBarImageId,leftBarImageId,rightBarImageId,bottomBarImageId);

    };

    $.fn.MeteoUniparthenopeMap = function(place = "com63049", prod = "wrf5", output="gen", dateTime=null,baseMapIdx=0,topBarImageId,leftBarImageId,rightBarImageId,bottomBarImageId) {

        return map(this, place, prod, output, dateTime,baseMapIdx,topBarImageId,leftBarImageId,rightBarImageId,bottomBarImageId);

    };

    $.fn.MeteoUniparthenopeControl = function(place = "com63049", prod = "wrf5", output="gen", dateTime=null ) {

        return control(this, place, prod, output, dateTime);

    };


})( jQueryProtect); // Use jQuery protected.







