(function( $ ) {

    var apiBaseUrl="https://api.meteo.uniparthenope.it"

    var weatherIconUrl="images/";
    var loadingUrl="images/animated_progress_bar.gif";

    var conColors = [
        "#FFFFFF",
        "#CCFFFF",
        "#3366FF",
        "#00CC00",
        "#FFFF00",
        "#FF3301",
        "#660033"
    ];

    var scmColors = [
        "#F8F0FD",
        "#E1CAFF",
        "#60F3F0",
        "#30FC4B",
        "#FEF400",
        "#FFA302",
        "#F60000",
        "#C0C0C0",

    ];

    var sssColors = [
        "#1001F3",
        "#0076FF",
        "#04B6FF",
        "#AEFE00",
        "#FFFF00",
        "#FF9403",
        "#DB0200",
        "#DBADAC"
    ];

    var sstColors = [
        "#140756",
        "#4141C7",
        "#206EEB",
        "#459CFB",
        "#7FB7F4",
        "#B5F1F5",
        "#D0FAC4",
        "#00D580",
        "#0FA609",
        "#82D718",
        "#D5ED05",
        "#FDFD26",
        "#F6D403",
        "#F3A000",
        "#FC6608",
        "#F60305",
        "#C00A18",
        "#680A06",
        "#720008",
        "#97009C",
        "#FF05FF",
        "#FDB0F9"

    ];


    var tempColors = [
        "#2400d8",
        "#181cf7",
        "#2857ff",
        "#3d87ff",
        "#56b0ff",
        "#75d3ff",
        "#99eaff",
        "#bcf8ff",
        "#eaffff",
        "#ffffea",
        "#fff1bc",
        "#ffd699",
        "#ffff75",
        "#ff7856",
        "#ff3d3d",
        "#f72735",
        "#d8152f",
        "#a50021"
        ];

    var windColors = [
        "#000033",
        "#0117BA",
        "#011FF3",
        "#0533FC",
        "#1957FF",
        "#3B8BF4",
        "#4FC6F8",
        "#68F5E7",
        "#77FEC6",
        "#92FB9E",
        "#A8FE7D",
        "#CAFE5A",
        "#EDFD4D",
        "#F5D03A",
        "#EFA939",
        "#FA732E",
        "#E75326",
        "#EE3021",
        "#BB2018",
        "#7A1610",
        "#641610"
    ];



    function sss2color(sss) {
        var index=0;

        // 37.5 37.75 38 38.25 38.5 38.75 39
        if (sss<37.5) {
            index=0;
        } else if (sss>=37.5 && sss<37.5) {
            index=1;
        } else if (sss>=37.75 && sss<38) {
            index=2;
        } else if (sss>=38 && sss<38.25) {
            index=3;
        } else if (sss>=38.25 && sss<38.5) {
            index=4;
        } else if (sss>=38.5 && sss<38.75) {
            index=5;
        } else if (sss>=38.75 && sss<39) {
            index=6;
        } else if (sss>=39 ) {
            index=7 ;
        }

        return sssColors[index];
    }

    function sst2color(sst) {
        var index=0;

        // 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
        if (sst<10) {
            index=0;
        } else if (sst>=10 && sst<11) {
            index=1;
        } else if (sst>=11 && sst<12) {
            index=2;
        } else if (sst>=12 && sst<13) {
            index=3;
        } else if (sst>=13 && sst<14) {
            index=4;
        } else if (sst>=14 && sst<15) {
            index=5;
        } else if (sst>=15 && sst<16) {
            index=6;
        } else if (sst>=16 && sst<17) {
            index=6;
        } else if (sst>=17 && sst<18) {
            index=6;
        } else if (sst>=18 && sst<19) {
            index=6;
        } else if (sst>=19 && sst<20) {
            index=6;
        } else if (sst>=20 && sst<21) {
            index=6;
        } else if (sst>=21 && sst<22) {
            index=6;
        } else if (sst>=22 && sst<23) {
            index=6;
        } else if (sst>=23 && sst<24) {
            index=6;
        } else if (sst>=24 && sst<25) {
            index=6;
        } else if (sst>=25 && sst<26) {
            index=6;
        } else if (sst>=26 && sst<27) {
            index=6;
        } else if (sst>=27 && sst<28) {
            index=6;
        } else if (sst>=28 && sst<29) {
            index=6;
        } else if (sst>=29 && sst<30) {
            index=6;
        } else if (sst>=30 ) {
            index=7 ;
        }

        return sstColors[index];
    }

    function con2color(conc) {
        var index=0;

        // 1 18 230 700 4600 46000
        if (conc<18) {
            index=0;
        } else if (conc>=18 && conc<230) {
            index=1;
        } else if (conc>=230 && conc<700) {
            index=2;
        } else if (conc>=700 && conc<4600) {
            index=3;
        } else if (conc>=4600 && conc<46000) {
            index=4;
        } else if (conc>=46000 ) {
            index=5 ;
        }

        return conColors[index];
    }

    function scm2color(scm) {
        var index=0;

        // 0.1 0.2 0.3 0.4 0.5 0.6 0.7
        if (scm<0.1) {
            index=0;
        } else if (scm>=.1 && scm<.2) {
            index=1;
        } else if (scm>=.2 && scm<.3) {
            index=2;
        } else if (scm>=.3 && scm<.4) {
            index=3;
        } else if (scm>=.4 && scm<.5) {
            index=4;
        } else if (scm>=.5 && scm<.6) {
            index=5;
        } else if (scm>=.6 && scm<.7) {
            index=5;
        } else if (scm>=.7 ) {
            index=8;
        }

        return scmColors[index];
    }

    function temp2color(temp) {
        var index=0;

        // -40 -30 -20 -15 -10 -5 0 3 6 9 12 15 18 21 25 30 40 50
        if (temp>=-40 && temp<-30) {
            index=0;
        } else if (temp>=-30 && temp<-20) {
            index=1;
        } else if (temp>=-20 && temp<-15) {
            index=2;
        } else if (temp>=-15 && temp<-10) {
            index=3;
        } else if (temp>=-10 && temp<-5) {
            index=4;
        } else if (temp>=-5 && temp<0) {
            index=5;
        } else if (temp>=0 && temp<3) {
            index=6;
        } else if (temp>=3 && temp<6) {
            index=7;
        } else if (temp>=6 && temp<9) {
            index=8;
        } else if (temp>=9 && temp<12) {
            index=9;
        } else if (temp>=12 && temp<15) {
            index=10;
        } else if (temp>=15 && temp<18) {
            index=11;
        } else if (temp>=18 && temp<21) {
            index=12;
        } else if (temp>=21 && temp<25) {
            index=13;
        } else if (temp>=25 && temp<30) {
            index=14;
        } else if (temp>=30 && temp<40) {
            index=15;
        } else if (temp>=40 && temp<50) {
            index=16;
        } else if (temp>=50 ) {
            index=17;
        }

        return tempColors[index];
    }

    function windKnt2color(ws) {
        var index=0;

        if (ws>=0 && ws<1) {
            index=0;
        } else if (ws>=1 && ws<3) {
            index=1;
        } else if (ws>=3 && ws<5) {
            index=2;
        } else if (ws>=5 && ws<7) {
            index=3;
        } else if (ws>=7 && ws<9) {
            index=4;
        } else if (ws>=9 && ws<11) {
            index=5;
        } else if (ws>=11 && ws<15) {
            index=6;
        } else if (ws>=15 && ws<17) {
            index=7;
        } else if (ws>=17 && ws<19) {
            index=8;
        } else if (ws>=19 && ws<21) {
            index=9;
        } else if (ws>=21 && ws<23) {
            index=10;
        } else if (ws>=23 && ws<25) {
            index=11;
        } else if (ws>=25 && ws<27) {
            index=12;
        } else if (ws>=27 && ws<30) {
            index=13;
        } else if (ws>=30 && ws<35) {
            index=14;
        } else if (ws>=35 && ws<40) {
            index=15;
        } else if (ws>=40 && ws<45) {
            index=16;
        } else if (ws>=45 && ws<50) {
            index=17;
        } else  {
            index=18;
        }

        // 0 1 3 5 7 9 11 13 15 17 19 21 23 25 27 30 35 40 45 50

        return windColors[index+1];
    }


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

    function formatDate(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes;
        return  date.getDate()+ "/" + (date.getMonth()+1)+ "/" + date.getFullYear() + "  " + strTime;
    }

    function box(container,type="minibox",place="com63049",prod="wrf5", hours=0)  {
        console.log( "box:"+container );

        //$("#"+container).empty();
        container.empty();


        var placeUrl=apiBaseUrl+"/places/"+place;


        let step=1;
        if (type=="minibox" || type=="compactbox" || type=="daybox") {
            step=24;
        }

        var timeseriesUrl=apiBaseUrl+"/products/"+prod+"/timeseries/"+place+"?hours="+hours+"&step="+step;
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
            } else {
                table.append('<tr class="legenda">' +
                    '<td width="32%" colspan="2">Forecast</td>' +
                    '<td width="9%" class="press">Press (HPa)</td>' +
                    '<td width="9%" class="temp">Temp &deg;C</td>' +
                    '<td width="21%" colspan="2">Wind (kn)</td>' +
                    '<td width="28%">Rain (mm)</td>' +
                    '</tr>')
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

                    let year = val['dateTime'].substring(0, 4);
                    let month = val['dateTime'].substring(4, 6);
                    let day = val['dateTime'].substring(6, 8);
                    let hour = val['dateTime'].substring(9, 11);
                    let sDateTime = year + "-" + month + "-" + day + "T" + hour + ":00:00Z";

                    let dateTime = new Date(sDateTime);

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
                    } else {
                        row+='  <td class="data">'
                        row+='    <a href="'+val['link']+'" target="_blank" class="day" title="Meteo '+placeData['long_name']['it']+' - '+formatDate(dateTime)+'" >';
                        row+=       formatDate(dateTime);
                        row+='    </a>';
                        row+='  </td>';
                        row+='  <td class="data">';
                        row+='    <a href="'+val['link']+'" target="_blank" class="day" title="Meteo '+placeData['long_name']['it']+' - '+formatDate(dateTime)+'" >';
                        row+='      <img src="'+wIconUrl+'" class="weathericon" alt="'+wTextLabel+'" title="'+wTextLabel+'" />';
                        row+='    </a>';
                        row+='  </td>';
                        row+='  <td class="data press">'+val['slp']+'</td>';
                        row+='  <td class="data temp">'+val['t2c']+'</td>';
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

    function chart(container,place="com63049",prod="wrf5",output="gen", hours=0, step=1)  {
        console.log( "chart:"+container );

        //$("#"+container).empty();
        container.empty();


        var placeUrl=apiBaseUrl+"/places/"+place;


        var timeseriesUrl=apiBaseUrl+"/products/"+prod+"/timeseries/"+place+"?hours="+hours+"&step="+step;
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
            divBox.append('<div id="chart-loadingDiv"><img src="'+loadingUrl+'" width="100%"/></div>');
            divBox.append('<div id="chart-container-canvasDiv" style="height: inherit; width: inherit; display:none"></div>');

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

            var title = "Forecast";
            var dataPoints = [];
            var dataPoints2 = [];
            var data=[];

            var axisY=null, axisY2=null, colorSet=null;

            if (prod==='wrf5') {
                if (output === "gen" || output === "tsp") {
                    title="Pressure and Temperature";

                    axisY = {
                        title: "Sea Level Pressure (HPa)",
                        includeZero: false,
                        suffix: " HPa"
                    };
                    axisY2 = {
                        title: "Temperature (°C)",
                        includeZero: false,
                        suffix: " °C"
                    };
                    data.push({
                        name: "t2c",
                        type: "column",
                        axisYType: "secondary",
                        yValueFormatString: "#0.## °C",
                        dataPoints: dataPoints
                    });
                    data.push({
                        name: "slp",
                        type: "line",
                        yValueFormatString: "##.# HPa",
                        dataPoints: dataPoints2
                    });
                } else if (output==="wn1") {

                    title="Wind Speed and Direction at 10m";
                    axisY = {
                        title: "Wind Speed at 10m (knt)",
                        includeZero: false,
                        suffix: " knt"
                    };
                    axisY2 = {
                        title: "Wind Direction at 10m (°N)",
                        maximum: 360,
                        interval: 45,
                        includeZero: false,
                        suffix: " °"
                    };
                    data.push({
                        name: "ws",
                        type: "column",
                        yValueFormatString: "##.# knt",
                        dataPoints: dataPoints
                    });
                    data.push({
                        name: "wd",
                        type: "line",
                        axisYType: "secondary",
                        yValueFormatString: "#0.## °",
                        dataPoints: dataPoints2
                    });
                } else if (output==="crh") {
                    title="Clouds and Rain";
                    axisY= {
                        title: "Hourly cumulated rain (mm)",
                        includeZero: false,
                        suffix: " °"
                    };
                    axisY2 = {
                        title: "Cloud fraction (%)",
                        includeZero: false,
                        maximum: 100,
                        suffix: " %"
                    };
                    data.push({
                        name: "crh",
                        type: "column",
                        yValueFormatString: "##.# mm",
                        dataPoints: dataPoints
                    });
                    data.push({
                        name: "crf",
                        type: "line",
                        axisYType: "secondary",
                        yValueFormatString: "#0.## %",
                        dataPoints: dataPoints2
                    });
                }
            } else if (prod==='wcm3') {
                if (output === "gen" || output === "con") {
                    title = "Particle concentration";

                    axisY = {
                        title: "Number of Particles (#)",
                        includeZero: false,
                        suffix: ""
                    };

                    data.push({
                        name: "con",
                        type: "column",
                        yValueFormatString: "##.# ",
                        dataPoints: dataPoints
                    });
                }
            } else if (prod==='rms3') {
                if (output === "gen" || output === "scu") {
                    title="Surface current";
                    axisY = {
                        title: "Current Speed at the surface (m/s)",
                        includeZero: false,
                        suffix: " m/s"
                    };
                    axisY2 = {
                        title: "Current Direction at the surface (°N)",
                        maximum: 360,
                        interval: 45,
                        includeZero: false,
                        suffix: " °"
                    };
                    data.push({
                        name: "scm",
                        type: "column",
                        yValueFormatString: "##.# m/s",
                        dataPoints: dataPoints
                    });
                    data.push({
                        name: "scd",
                        type: "line",
                        axisYType: "secondary",
                        yValueFormatString: "#0.## °",
                        dataPoints: dataPoints2
                    });
                } else if (output === "sst") {
                    title="Surface temperature";
                    axisY = {
                        title: "Surface temperature (°C)",
                        includeZero: false,
                        suffix: " °C"
                    };
                    data.push({
                        name: "sst",
                        type: "column",
                        yValueFormatString: "##.# °C",
                        dataPoints: dataPoints
                    });

                } else if (output === "sss") {
                    title="Surface salinity";
                    axisY = {
                        title: "Surface salinity (1/1000)",
                        includeZero: false,
                        suffix: " "
                    };
                    data.push({
                        name: "sss",
                        type: "line",
                        yValueFormatString: "##.# ",
                        dataPoints: dataPoints
                    });

                } else if (output === "sts") {
                    title="Surface temperature and salinity";
                    axisY = {
                        title: "Surface temperature (°C)",
                        includeZero: false,
                        suffix: " °C"
                    };
                    axisY2 = {
                        title: "Surface salinity (1/1000)",
                        includeZero: false,
                        suffix: " "
                    };
                    data.push({
                        name: "sst",
                        type: "column",
                        yValueFormatString: "##.# °C",
                        dataPoints: dataPoints
                    });
                    data.push({
                        name: "sss",
                        type: "line",
                        axisYType: "secondary",
                        yValueFormatString: "#0.## ",
                        dataPoints: dataPoints2
                    });
                }
            }


            var options= {
                animationEnabled: true,
                theme: "light2",
                title: {
                    text: title
                },
                axisX: {
                    valueFormatString: "DD MMM, HHZ"
                },
                axisY: axisY,
                axisY2: axisY2,

                data: data
            };


            var chart = new CanvasJS.Chart("chart-container-canvasDiv", options);




            $.getJSON( timeseriesUrl, function( data ) {
                let timeseriesData=data['timeseries'];
                console.log("-------------> "+timeseriesData);

                $.each( timeseriesData, function( key, val ) {

                    let date = val.dateTime;
                    let year = date.substring(0, 4);
                    let month = date.substring(4, 6);
                    let day = date.substring(6, 8);
                    let hour = date.substring(9, 11);
                    let sDateTime = year + "-" + month + "-" + day + "T" + hour + ":00:00Z";

                    let dateTime = new Date(sDateTime);

                    if (prod==='wrf5') {
                        if (output === "gen" || output === "tsp") {

                            dataPoints2.push({
                                x: dateTime,
                                y: val.slp
                            });

                            dataPoints.push({
                                x: dateTime,
                                y: val.t2c,
                                color: temp2color(val.t2c)
                            });
                        } else if (output=="wn1") {

                            dataPoints.push({
                                x: dateTime,
                                y: val.ws10n,
                                color: windKnt2color(val.ws10n)
                            });

                            dataPoints2.push({
                                x: dateTime,
                                y: val.wd10
                            });
                        } else if (output=="crh") {

                            dataPoints.push({
                                x: dateTime,
                                y: val.crh
                            });

                            dataPoints2.push({
                                x: dateTime,
                                y: val.clf * 100
                            });
                        }
                    } else if (prod==='wcm3') {
                        if (output === "gen" || output === "con") {

                            dataPoints.push({
                                x: dateTime,
                                y: val.con,
                                color: con2color(val.con)
                            });
                        }
                    } else if (prod==='rms3') {
                        if (output === "gen" || output === "scu") {
                            dataPoints.push({
                                x: dateTime,
                                y: val.scm,
                                color: scm2color(val.scm)
                            });

                            dataPoints2.push({
                                x: dateTime,
                                y: val.scd
                            });
                        } else if (output === "sst") {
                            dataPoints.push({
                                x: dateTime,
                                y: val.sst,
                                color: sst2color(val.sst)
                            });

                        } else if (output === "sss") {
                            dataPoints.push({
                                x: dateTime,
                                y: val.sss,
                                color: sss2color(val.sss)
                            });

                        } else if (output === "sts") {
                            dataPoints.push({
                                x: dateTime,
                                y: val.sst,
                                color: sst2color(val.sst)
                            });

                            dataPoints2.push({
                                x: dateTime,
                                y: val.sss
                            });
                        }
                    }
                });

                $('#chart-loadingDiv').hide();
                $('#chart-container-canvasDiv').show();
                chart.render();
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

        var _prod=prod;
        var _place=place;
        var _output=output;
        var _ncepdate=ncepDate;


        //$("#"+container).empty();
        container.empty();

        // Create the main container
        let divMap=$('<div>');
        divMap.attr('id','map-container');


        // Append the title
        divMap.append('<div id="map-container-mapid" style="height: 512px;position: inherit !important;"></div>');

        container.append(divMap);

        var placeUrl=apiBaseUrl+"/places/"+place;
        console.log("placeUrl:"+placeUrl);

        // Get the place data
        $.getJSON( placeUrl, function( placeData ) {


            console.log(placeData['bbox']['coordinates']);
            console.log("----------------");

            var marker0=L.marker([placeData['bbox']['coordinates'][0][1],placeData['bbox']['coordinates'][0][0]]);
            var marker1=L.marker([placeData['bbox']['coordinates'][1][1],placeData['bbox']['coordinates'][1][0]]);
            var marker2=L.marker([placeData['bbox']['coordinates'][2][1],placeData['bbox']['coordinates'][2][0]]);

            var group = new L.featureGroup([marker0, marker1, marker2]);


            //Inizializzo la mappa
            _map = new L.Map('map-container-mapid');
            _center = new L.LatLng(placeData['cLat'], placeData['cLon']);

            console.log(_center);
            _map.setView(_center, _zoom);

            _map.fitBounds(group.getBounds());
            _zoom = _map.getZoom();
            _center = _map.getBounds().getCenter();

            var navionicsLayer = new JNC.Leaflet.NavionicsOverlay({
                navKey: 'Navionics_webapi_00480',
                chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
                isTransparent: false,
                // Enable Navionics logo with payoff
                logoPayoff: true,
                zIndex: 1
            });

            var navionicsSonarMapLayer = new JNC.Leaflet.NavionicsOverlay({
                navKey: 'Navionics_webapi_00480',
                chartType: JNC.NAVIONICS_CHARTS.SONARCHART,
                isTransparent: false,
                zIndex: 1
            });

            var navionicsSkiLayer = new JNC.Leaflet.NavionicsOverlay({
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


            var layerInstance = null;
            switch (parseInt(baseMapIdx)) {
                case 1:
                    layerInstance = navionicsLayer;
                    break;
                case 2:
                    layerInstance = navionicsSonarMapLayer;
                    break;
                case 3:
                    layerInstance = navionicsSkiLayer;
                    break;
                case 4:
                    layerInstance = darkGreyLayer;
                    break;
                case 5:
                    layerInstance = osmLayer;
                    break;
                default:
                    console.log("worldImageryLayer");
                    layerInstance = worldImageryLayer;

            }

            //Aggiungo il layer alla mappa
            layerInstance.addTo(_map);

            console.log("Added background map:" + baseMapIdx);


            // Evento sulla modifica dello zoom della mappa
            _map.on('zoomend', function () {
                _zoom = _map.getZoom();
                change_domain(_map.getBounds());
            });

            _map.on('moveend', function (e) {
                _center = _map.getBounds().getCenter();
                change_domain(_map.getBounds());
            });


            var loadingControl = L.Control.loading({
                spinjs: true
            });
            _map.addControl(loadingControl);


            // Add the geojson layer to the layercontrol
            _controlLayers = L.control.layers(baseMaps, overlayMaps, {collapsed: true}).addTo(_map);


            divMap.update = function (place, prod, output, ncepDate) {



                //$("#plot").empty();
                let baseBarImageUrl = apiBaseUrl + "/products/" + prod + "/forecast/legend";

                $("#" + _topBarImageId).attr('src', baseBarImageUrl + "/top/" + output);
                $("#" + _leftBarImageId).attr('src', baseBarImageUrl + "/left/" + output);


                change_domain(_map.getBounds());

                $("#" + _rightBarImageId).attr('src', baseBarImageUrl + "/right/" + output);
                $("#" + _bottomBarImageId).attr('src', baseBarImageUrl + "/bottom/" + output);


            };

            divMap.update(place, prod, output, ncepDate);



            /*****************************************/

            function change_domain(bounds) {
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

                if (boundsD03.contains(bounds)) {
                    new_domain = "d03";
                } else if (boundsD02.contains(bounds)) {
                    new_domain = "d02";
                } else {
                    new_domain = "d01";
                }
                console.log("new_domain:" + new_domain);

                if (new_domain != _domain) {
                    console.log("Remove");
                    _domain = new_domain;
                    console.log("Add")
                    addWindLayer();
                    ////addT2CLayer();
                    addCloudLayer();
                    addRainLayer();
                    addSnowLayer();
                }
            }


            function addInfoLayer() {

                var geojsonURL = apiBaseUrl + '/apps/owm/wrf5/' + _prefix + '/{z}/{x}/{y}.geojson?date=' + ncepDate;
                console.log("geojsonURL:" + geojsonURL);

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
                                "<td class='tg-j0tj'>" + clouds + "%</td>" +
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
                _controlLayers.addOverlay(_infoLayer, "Info");
                console.log("Added info layer");
            }


            function addCloudLayer() {
                let year = ncepDate.substring(0, 4);
                let month = ncepDate.substring(4, 6);
                let day = ncepDate.substring(6, 8);

                if (_cloudLayer != null) {
                    _controlLayers.removeLayer(_cloudLayer);
                    _map.removeLayer(_cloudLayer);
                }

                _cloudLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/' +
                    _domain + '/archive/' + year + '/' + month + '/' + day + '/wrf5_' + _domain + '_' + ncepDate + '.nc', {
                        layers: 'CLDFRA_TOTAL',
                        styles: 'raster/tcldBars',
                        format: 'image/png',
                        transparent: true,
                        opacity: 0.8,
                        COLORSCALERANGE: "0.125,1",
                        NUMCOLORBANDS: "250",
                        ABOVEMAXCOLOR: "extend",
                        BELOWMINCOLOR: "transparent",
                        BGCOLOR: "extend",
                        LOGSCALE: "false"
                    }
                );
                _map.addLayer(_cloudLayer);
                _controlLayers.addOverlay(_cloudLayer, "Cloud");
            }

            function addT2CLayer() {
                let year = ncepdate.substring(0, 4);
                let month = ncepdate.substring(4, 6);
                let day = ncepdate.substring(6, 8);

                if (_t2cLayer != null) {
                    _controlLayers.removeLayer(_t2cLayer);
                    _map.removeLayer(_t2cLayer);
                }

                _t2cLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/' +
                    _domain + '/archive/' + year + '/' + month + '/' + day + '/wrf5_' + _domain + '_' + ncepDate + '.nc', {
                        layers: 'T2C',
                        styles: 'default-scalar/tspBars',
                        format: 'image/png',
                        transparent: true,
                        opacity: 0.8,
                        COLORSCALERANGE: "-40,50",
                        NUMCOLORBANDS: "19",
                        ABOVEMAXCOLOR: "extend",
                        BELOWMINCOLOR: "extend",
                        BGCOLOR: "extend",
                        LOGSCALE: "false"
                    }
                );
                //map.addLayer(t2cLayer);
                _controlLayers.addOverlay(_t2cLayer, "Temperature");
            }

            function addRainLayer() {
                let year = ncepDate.substring(0, 4);
                let month = ncepDate.substring(4, 6);
                let day = ncepDate.substring(6, 8);

                if (_rainLayer != null) {
                    _controlLayers.removeLayer(_rainLayer);
                    _map.removeLayer(_rainLayer);
                }

                _rainLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/' +
                    _domain + '/archive/' + year + '/' + month + '/' + day + '/wrf5_' + _domain + '_' + ncepDate + '.nc', {
                        layers: 'DELTA_RAIN',
                        styles: 'raster/crhBars',
                        format: 'image/png',
                        transparent: true,
                        opacity: 0.8,
                        COLORSCALERANGE: ".2,60",
                        NUMCOLORBANDS: "15",
                        ABOVEMAXCOLOR: "extend",
                        BELOWMINCOLOR: "transparent",
                        BGCOLOR: "extend",
                        LOGSCALE: "false"
                    }
                );
                _map.addLayer(_rainLayer);
                _controlLayers.addOverlay(_rainLayer, "Rain");
            }

            function addSnowLayer() {
                let year = ncepDate.substring(0, 4);
                let month = ncepDate.substring(4, 6);
                let day = ncepDate.substring(6, 8);

                if (_snowLayer != null) {
                    _controlLayers.removeLayer(_snowLayer);
                    _map.removeLayer(_snowLayer);
                }

                _snowLayer = L.tileLayer.wms('http://data.meteo.uniparthenope.it/ncWMS2/wms/lds/opendap/wrf5/' +
                    _domain + '/archive/' + year + '/' + month + '/' + day + '/wrf5_' + _domain + '_' + ncepDate + '.nc', {
                        layers: 'HOURLY_SWE',
                        styles: 'raster/sweBars',
                        format: 'image/png',
                        transparent: true,
                        opacity: 0.8,
                        COLORSCALERANGE: "0.5,15.5",
                        NUMCOLORBANDS: "6",
                        ABOVEMAXCOLOR: "extend",
                        BELOWMINCOLOR: "transparent",
                        BGCOLOR: "extend",
                        LOGSCALE: "false"
                    }
                );
                _map.addLayer(_snowLayer);
                _controlLayers.addOverlay(_snowLayer, "Snow");
            }

            function addWindLayer() {

                // load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)
                $.getJSON(apiBaseUrl + '/products/wrf5/forecast/' + _domain + '/grib/json?date=' + ncepDate, function (data) {

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
                        colorScale: ["#000033", "#0117BA", "#011FF3", "#0533FC", "#1957FF", "#3B8BF4",
                            "#4FC6F8", "#68F5E7", "#77FEC6", "#92FB9E", "#A8FE7D", "#CAFE5A",
                            "#EDFD4D", "#F5D03A", "#EFA939", "#FA732E", "#E75326", "#EE3021",
                            "#BB2018", "#7A1610", "#641610"]          // define your own array of hex/rgb colors
                    });

                    _map.addLayer(_windLayer);
                    _controlLayers.addOverlay(_windLayer, "Wind");
                });
            }
        });

        return divMap;
    };


    function control(container,place="com63049",prod="wrf5",output="gen",dateTime=null)  {
        console.log( "control:"+container );

        /*
        let _prod="wrf5";
        let _output="gen";
        let _place="com63049";
        let _ncepDate=null;
        */
        let _prod=prod;
        let _output=output;
        let _place=place;
        let _ncepDate=dateTime;

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

    $.fn.MeteoUniparthenopeBox = function( place = "com63049", prod = "wrf5", hours=0 ) {

        return box(this, "", place, prod, hours);

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

    $.fn.MeteoUniparthenopeChart = function( place = "com63049", prod = "wrf5", output="gen", hours=0, step=1 ) {

        return chart(this, place, prod, output, hours, step);

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







