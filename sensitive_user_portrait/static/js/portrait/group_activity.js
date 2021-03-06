ajax_method = 'GET';
function call_sync_ajax_request(url, method, callback){
    $.ajax({
      url: url,
      type: method,
      dataType: 'json',
      async: true,
      success:callback
    });
}
function Draw_activity(data){
	var data_x_ = [];
	var data_y_ = [];

	for(var i=0;i<data.length;i++){
		var time_line  = new Date(parseInt(data[i][0])*1000).format("yyyy-MM-dd hh: mm");
		data_x_.push(time_line);
		data_y_.push(data[i][1]);

	}

    $('#line').highcharts({
        chart: {
            type: 'spline',// line,
            animation: Highcharts.svg, // don't animate in old IE
            style: {
                fontSize: '12px',
                fontFamily: 'Microsoft YaHei'
            }},
        title: {
            text: '微博时间走势图',
            x: -20, //-20：center
            style: {
                color: '#555555',
                fontSize: '14px'
            }
        },
        
    	lang: {
            printChart: "打印",
            downloadJPEG: "下载JPEG 图片",
            downloadPDF: "下载PDF文档",
            downloadPNG: "下载PNG 图片",
            downloadSVG: "下载SVG 矢量图",
            exportButtonTitle: "导出图片"
        },
        xAxis: {
            //categories: data_x,
            categories: data_x_,
            labels:{
              rotation: 0,
              step: 15,
              y:25
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '微博总量 (条)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        plotOptions:{
            series:{            
                cursor:'pointer',
                events:{
                    click:function(event){
                        point2weibo(event.point.x, data[event.point.x][0]);
                    }
                }
            }
        },
        tooltip: {
            valueSuffix: '条',
            xDateFormat: '%Y-%m-%d %H:%M:%S'
        },
        legend: {
        	enabled: false,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            borderWidth: 0
        },
        series: [{
            name:'微博量',
            data: data_y_
        }]
    });
}

//微博文本默认数据
function point2weibo(xnum, ts){
    //console.log(ts);
    var delta = '';
    if(xnum == -1){
        delta = "00:00-24:00";
        $('#date_zh').html(getYearDate(ts) + "至" +  getYearDate(ts + 7 * 24 * 3600));
        var activity_weibo_url = '/group/activity_weibo/?task_name='+ task_name +'&start_ts=' + ts + '&submit_user=' + submit_user + '&during=' + 7 * 24 * 3600;
        call_sync_ajax_request(activity_weibo_url, ajax_method, draw_content);
    }
    else{
        switch(xnum % 6){
            case 0: delta = "00:00-04:00";break;
            case 1: delta = "04:00-08:00";break;
            case 2: delta = "08:00-12:00";break;
            case 3: delta = "12:00-16:00";break;
            case 4: delta = "16:00-20:00";break;
            case 5: delta = "20:00-24:00";break;
        }
        $('#date_zh').html(getYearDate(ts));
        var activity_weibo_url = '/group/activity_weibo/?task_name='+ task_name +'&start_ts=' + ts + '&submit_user=' + submit_user;
        call_sync_ajax_request(activity_weibo_url, ajax_method, draw_content);
    }
    $('#time_zh').html(delta);
}
function getYearDate(tm){
    var tt = new Date(parseInt(tm)*1000).format("yyyy-MM-dd");
    return tt;
}
function draw_content(data){
    console.log('d',data);
    var html = '';
    $('#line_content').empty();
    if(data.length==0){
        html += "<div style='width:100%;'><span style='margin-left:20px;'>该时段用户未发布任何微博</span></div>";
    }else{
        for(i=0;i<data.length;i++){
            html += "<div style='width:100%;'><img src='/static/img/pencil-icon.png' style='height:10px;width:10px;margin:0px;margin-right:10px;'><span style='font-size:12px;'>"+data[i].text+"</span><br><br></div>";
        }

    }
    $('#line_content').append(html);
}

function Draw_activeness(data){
    x_data = [];
    y_data = [];
    for (var i = 0; i < data['1']['0'].length; i++) {
       var s = i.toString();
       x_value = data['1']['0'][s];
       x_data.push(x_value);
    };
    for (var i = 0; i < data['1']['1'].length; i++) {
       var s = i.toString();
       y_value = data['1']['1'][s].toFixed(0);
       y_data.push(y_value);
    };
    xdata = [];
    for (i = 0; i< y_data.length-1; i++){
        xdata.push(y_data[i] + '-' + y_data[i+1])
    };

    $('#active_distribution').highcharts({
        chart: {
        type: 'column',
        margin: [ 50, 50, 100, 80]
    },
    title: {
        //text: '活跃度排名分布'
    },
    lang: {
        printChart: "打印",
        downloadJPEG: "下载JPEG 图片",
        downloadPDF: "下载PDF文档",
        downloadPNG: "下载PNG 图片",
        downloadSVG: "下载SVG 矢量图",
        exportButtonTitle: "导出图片"
    },
    xAxis: {
        title: {
                text: '排名'
            },
        categories: xdata,
        labels: {
            rotation: -45,
            align: 'right'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '数量 (人)'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: '<b>{point.y:.1f} 人</b>',
    },
    plotOptions: {
           series: {
               pointPadding: 0, //数据点之间的距离值
               groupPadding: 0, //分组之间的距离值
               borderWidth: 0,
               shadow: false,
               pointWidth:38//柱子之间的距离值
           }
       },
    series: [{
        name: '',
        data: x_data ,
        dataLabels: {
            // enabled: true,
            rotation: 0,
            color: '#FFFFFF',
            align: 'right',
            x: 4,
            y: 10,
            style: {
                fontSize: '13px',
                fontFamily: '微软雅黑',
                textShadow: '0 0 3px black'
            }
        }
    }]
});
}


// function draw_content(data){
//     var html = '';
//     $('#weibo_text').empty();
//     if(data==''){
//         html += "<div style='width:100%;'><span style='margin-left:20px;'>该时段用户未发布任何微博</span></div>";
//     }else{
//         for(i=0;i<data.length;i++){
//             html += "<div style='width:100%;'><img src='/static/img/pencil-icon.png' style='height:10px;width:10px;margin:0px;margin-right:10px;'><span>"+data[i].text+"</span><br></div>";
//         }

//     }
//     $('#weibo_text').append(html);
// }


function show_online_time(data){
    $('#online_time_table').empty();
    var time_split =[];
    var online_time_data = [];
    for(var key in data[0]){
        key_new = parseInt(key)/(60*15*16)
        switch(key_new)
        {
            case 0: value = "00:00-04:00";break;
            case 1: value = "04:00-08:00";break;
            case 2: value = "08:00-12:00";break;
            case 3: value = "12:00-16:00";break;
            case 4: value = "16:00-20:00";break;
            case 5: value = "20:00-24:00";break;
        }
        time_split.push(value);
        online_time_data.push(data[0][key]);
    }
    var html = '';
    html += '<table class="table table-striped table-bordered bootstrap-datatable datatable responsive" style="width:100%;font-size:14px">';
    html += '<tr>';
    html += '<th style="text-align:center">主要活跃时间</th>';
    for(var i=0; i < time_split.length;i++){
        html += '<th style="text-align:center">'+time_split[i]+'</th>'
    }
    html += '</tr>';
    html += '<tr>';
    html += '<th style="text-align:center">人数</th>';
    for (var i = 0; i < online_time_data.length; i++) {
       html += '<th style="text-align:center">' + online_time_data[i] + '</th>';
    };
    html += '</tr></table>'; 
    $('#online_time_table').append(html);
    // $('#online_time_conclusion').append(data[1]+'。');
}

function get_max_data (data) {
  // var topic = data;
  //console.log(data);
  var data_name = [];
  var data_value = [];
  for(var key in data){
    data_name.push(key);
    data_value.push(data[key]);
  }
  var data_value_after = [];
  var data_name_after = [];
  for(var i=0; i<data_value.length;i++){ //排序
    a=data_value.indexOf(Math.max.apply(Math, data_value));
    data_value_after.push(data_value[a]);
    data_name_after.push(data_name[a]);
    data_value[a]= -1;
  }
  var data_name3 = [];

  var data_result = [];
  data_result.push(data_name_after);
  data_result.push(data_value_after);
  return data_result;
}

function draw_active_distribution(data){
    var xdata = [];

    for (i = 0; i< data[1].length-1; i++){
        xdata.push(data[1][i] + '-' + data[1][i+1])
    };
    var mychart1 = echarts.init(document.getElementById('active_distribution'));
    var option = {
    tooltip : {
        trigger: 'axis'
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'value',
            boundaryGap : [0, 0.01]
        }
    ],
    yAxis : [
        {
            type : 'category',
            name : '活跃度排名分布',
            data : xdata
        }
    ],
    series : [
        {
            name:'人数',
            type:'bar',
            data:data[0]
        }
    ]
};
  mychart1.setOption(option);
}

function show_active_users(data, div_name){
	// console.log(data[1])
	if(data.length<5){
		var show_count = data.length;
	} else{
		show_count = 5
	};
    $('#' + div_name).empty();
    var html = '';
    html += '<table class="table table-striped" style="font-size:10px;margin-bottom:0px;">';
    html += '<tr><th style="text-align:center">排名</th><th style="text-align:center">昵称</th><th style="text-align:center">微博数</th></tr>';
    for (var i = 0; i < show_count; i++) {
        var name_list = data[i][0].split('&');
        var user_id = name_list[0];
        var name = name_list[1];
        console.log(name);
        var s = i.toString();
        var m = i + 1;
        if(name=='unknown'){
            name = '未知('+user_id+')';
		}
        html += '<tr><th style="text-align:center">' + m + '</th><th style="text-align:center"><a target="_blank" href="/index/personal/?uid='+user_id+'">'+ name + '</a></th><th style="text-align:center">'+data[i][1] + '</th></tr>';
    };
    html += '</table>'; 
    $('#'+div_name).append(html);
}
// function show_more_active_users(data, div_name){
//     $('#' + div_name).empty();
//     var html = '';
//     html += '<table class="table table-striped table-bordered bootstrap-datatable datatable responsive" style="font-size:14px;margin-bottom:0px;">';
//     html += '<tr><th style="text-align:center">排名</th><th style="text-align:center">昵称</th><th style="text-align:center">微博数</th></tr>';
//     for (var i = 0; i < data.length; i++) {
//     	var name_list = data[i][0].split('&');
//         var name = name_list[1];
//         var s = i.toString();
//         var m = i + 1;
//         html += '<tr><th style="text-align:center">' + m + '</th><th style="text-align:center">' + name + '</th><th style="text-align:center">'+data[i][1] + '</th></tr>';
//     };
//     html += '</table>'; 
//     $('#'+div_name).append(html);
// }

function group_activity(data){


	//活跃非活跃用户
	var main_active = data.main_max;
	var main_unactive = data.main_min;
	show_active_users(main_active, 'active_users');
	show_active_users(main_unactive, 'unactive_users');
	//show_more_active_users(main_active, 'show_rank_active_users');
	//show_more_active_users(main_unactive, 'show_rank_unactive_users');

	//折线图
	//var legend_data = []
    var xAxis_data = data.time_list.slice(1,-1);
    var yAxis_ave = data.ave_list.slice(1,-1);
    
    // for(var j=0;j<data.time_list.length;j++){
    //     console.log(data.time_list[j],data.time_list[j].indexOf('2013'));
    //     if(data.time_list[j].indexOf('2013')==-1){
    //         xAxis_data.push(data.time_list[j]);
    //         yAxis_ave.push(data.ave_list[j]);
    //         console.log(j,data.ave_list[j],yAxis_ave)
    //     }
    // }


	var max_list = data.max_list.slice(1,-1);
	var yAxis_max = [];
	for(var i=0; i<max_list.length;i++){
		yAxis_max.push(max_list[i][1]);
	};

	var min_list = data.min_list.slice(1,-1);
	var yAxis_min = [];
	for(var i=0; i<min_list.length;i++){
		yAxis_min.push(min_list[i][1])
	};

   var mychart = echarts.init(document.getElementById('group_activity'));
   var option = {

    tooltip : {
        trigger: 'axis',
        formatter: function (params) {
            var max_user_name = [];
            var min_user_name = [];
            for(var i=0; i<max_list.length;i++){
                if(max_list[i][2]=='unknown'){
                    max_list[i][2] = '未知('+max_list[i][0]+')';
                }
                if(min_list[i][2]=='unknown'){
                    min_list[i][2] = '未知('+min_list[i][0]+')';
                }
                max_user_name.push(max_list[i][2]);
                min_user_name.push(min_list[i][2]);
            };
            var res = '' + params[0].name;
            var index = params[0].dataIndex;
            res +=  ': <br/>最高值用户: ' + max_user_name[index];
            res +=  ' <br/>最低值用户: ' + min_user_name[index];
            return res
        }
    },
    legend: {
        data:['最高值','最低值','平均值']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            scale : true,
            boundaryGap : false,
            
            data : xAxis_data
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale: true,
            name : '活跃度'

        }
    ],
    series : [
        {
            name:'最高值',
            type:'line',
            data:yAxis_max
        },
        {
            name:'最低值',
            type:'line',
            data:yAxis_min
        },
        {
            name:'平均值',
            type:'line',
            data:yAxis_ave
        }
        
    ]
};
  mychart.setOption(option);
}

function show_activity(data) {
    console.log("activity data: ");
    console.log(data);
	var time_data = [23,3,4,55,22,6]
    // console.log(runtype);
    //默认显示第一天微博；
    point2weibo(0, data.activity_trend[0][0]);

	//微博走势，点击后显示微博
	Draw_activity(data.activity_trend);

	show_online_time(data.activity_time);

	draw_active_distribution(data.activeness_his);

	group_activity(data.activeness_trend);

	$('#activity_conclusion').append(data.activeness_description + '。');
    // body...
}

function month_process(data){
    //console.log(data);
    require.config({
        paths: {
            echarts: '/static/js/bmap/js'
        },
        packages: [
            {
                name: 'BMap',
                location: '/static/js/bmap',
                main: 'main'
            }
        ]
    });

    require(
    [
        'echarts',
        'BMap',
        'echarts/chart/map'
    ],
    function (echarts, BMapExtension) {
        // 初始化地图
        var BMapExt = new BMapExtension($('#user_geo_map')[0], BMap, echarts,{
            enableMapClick: false
        });
        var map = BMapExt.getMap();
        var container = BMapExt.getEchartsContainer();
        var startPoint = {
            x: 110.114129,
            y: 35.550339
        };

        var point = new BMap.Point(startPoint.x, startPoint.y);
        map.centerAndZoom(point, 5);
        //map.enableScrollWheelZoom(true);
        //console.log(data);
        // process
        var timelist = new Array();
        var geolist = new Array();
        var addedlist = new Array();
        for (var i = 0; i < data.length; i++){
            var time_geo = data[i];
            if (time_geo[1] != ''){
                var unit_geo_list = time_geo[1].split('\t');
                if (unit_geo_list[0] == '中国'){
                    timelist.push(time_geo[0]);
                    var city_city = unit_geo_list.pop();
                    geolist.push(city_city);
                    addedlist[city_city] = '';
                }
            }
        }
        // marker
        var newgeo = new Array();
        var myGeo = new BMap.Geocoder();
        //var geolist = ['北京', '上海','广州','南宁', '南昌', '大连','拉萨'];
        var index = 0;
        bdGEO();
        function bdGEO(){
            var geoname = geolist[index];
            var timename = timelist[index];
            geocodeSearch(geoname, timename);
            index++;
        }
        function geocodeSearch(geoname, timename){
            if(index < geolist.length-1){
                setTimeout(bdGEO,400);
            }
            else{
                setTimeout(drawline, 400);
            }
            myGeo.getPoint(geoname, function(point){
                if (point){
                    var fixpoint= new BMap.Point(point.lng,point.lat+0.5);
                    var marker = new BMap.Marker(fixpoint);
                    addedlist[geoname] = addedlist[geoname] + ',' + timename;
                    marker.setTitle(geoname+addedlist[geoname]);
                    marker.setOffset(new BMap.Size(2,10));
                    map.addOverlay(marker);
                    newgeo[geoname] = [fixpoint.lng.toFixed(2),fixpoint.lat.toFixed(2)];
                }
                else{
                    //alert("no such point!");
                }
            }, geoname);
        }
        function drawline(){
            var linklist = new Array();
            var last_geo = geolist[0];
            for (var i = 1; i < geolist.length; i++){
                linklist.push([{name:last_geo},{name:geolist[i], value:90}]);
                last_geo = geolist[i];
            }
            //console.log(linklist);
            //linklist = [[{name:'北京'}, {name:'南宁',value:90}],[{name:'北京'}, {name:'南昌',value:90}],[{name:'北京'}, {name:'拉萨',value:90}]];
            //console.log(linklist);
            var option = {
                color: ['gold','aqua','lime'],
                title : {
                    text: '',
                    subtext:'',
                    x:'center',
                    textStyle : {
                        color: '#fff'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: function (v) {
                        return v[1].replace(':', ' > ');
                    }
                },
                toolbox: {
                    show : false,
                    orient : 'vertical',
                    x: 'right',
                    y: 'center',
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                dataRange: {
                    show: false,
                    min : 0,
                    max : 100,
                    range: {
                        start: 10,
                        end: 90
                    },
                    x: 'right',
                    calculable : true,
                    color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
                    textStyle:{
                        color:'#fff'
                    }
                },
                series : [
                    {
                        name:'全国',
                        type:'map',
                        mapType: 'none',
                        data:[],
                        geoCoord: newgeo,
                        markLine : {
                            smooth:true,
                            effect : {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle : {
                                normal: {
                                    borderWidth:1,
                                    label:{show:false},
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data : linklist
                        },
                    }
                ]
            };
            var myChart = BMapExt.initECharts(container);
            window.onresize = myChart.onresize;
            BMapExt.setOption(option);
        }
    }
);
}

function  activity_load(){
    var group_activity_url = '/group/show_group_result/?module=activity&task_name=' + task_name + '&submit_user=' + submit_user;
    call_sync_ajax_request(group_activity_url,ajax_method, show_activity);
}

// var activity_data = []

