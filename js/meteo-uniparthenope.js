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
                    '<td width="9%" class="tMin">T&nbsp;min</td>' +
                    '<td width="9%" class="tMax">T&nbsp;max</td>' +
                    '<td width="21%" colspan="2">Wind</td>' +
                    '<td width="28%">Rain</td>' +
                    '</tr>');
            }
            divBox.append(table);

            // Create the ink container
            var divInk=$('<div>');
            divInk.attr('class','meteo.ink');
            divInk.append('<a href="http://meteo.uniparthenope.it" target="_blank" title="Meteo">CCMMMA: http://meteo.uniparthenope.it</a>');
            divInk.append('<br/>');
            divInk.append('&copy;2019 '+
                '<a href="http://meteo.uniparthenope.it/" title="Meteo siti web" target="_blank">'+
                '<b>meteo.uniparthenope.it</b> - <b>CCMMMA</b> Universit&agrave; Parthenope</a>');

            divBox.append(divInk);

            //$("#"+container).append(divBox);
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
                        row+='  <td class="data">'+val['winds']+'</td>';
                        row+='  <td class="data">'+val['ws10']+'</td>';
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

    $.fn.MeteoUniparthenopeControl = function(place = "com63049", prod = "wrf5", output="gen", dateTime=null ) {

        return control(this, place, prod, output, dateTime);

    };


}( jQuery ));







