function draw_search_results(data){
    //console.log(data);
    $('#search_result').empty();
    var user_url ;
    var contact_url;
    //console.log(user_url);
    var html = '';
    html += '<table class="table table-striped table-bordered bootstrap-datatable datatable responsive">';
    html += '<thead><tr><th style="width:100px;">用户ID</th><th style="width:140px;">昵称</th><th style="width:140px;">注册地</th><th>活跃度</th><th>敏感度</th><th>重要度</th><th>影响力</th><th>相关度</th>';
    html += '<th>操作</th></tr></thead>';
    html += '<tbody>';
    for(var i = 0; i<data.length;i++){
     /*
      var item = data[i];
      item = replace_space(item);
      if (item[1] == '未知'){
          item[1] = item[0];
      } 
      for(var j=3;j<7;j++){
        if(item[j]!='未知')
          item[j] = item[j].toFixed(2);
      }
	  */
	  var item = data;
      user_url = '/index/personal/?uid=' + item[i][0];
      contact_url = '/index/contact/?uid=' + item[i][0];
      html += '<tr id=' + item[i][0] +'>';
      html += '<td class="center" name="uids"><a href='+ user_url+ '  target="_blank">'+ item[i][0] +'</td>';
      html += '<td class="center">'+ item[i][1] +'</td>';
      html += '<td class="center">'+ item[i][2] +'</td>';
      html += '<td class="center" style="width:100px;">'+ item[i][3].toFixed(2) +'</td>';
      html += '<td class="center" style="width:100px;">'+ item[i][4].toFixed(2) +'</td>';
      html += '<td class="center" style="width:100px;">'+ item[i][5].toFixed(2) +'</td>';
      html += '<td class="center" style="width:100px;">'+ item[i][6].toFixed(2) +'</td>';
	  html += '<td class="center" style="width:100px;">'+ item[i][7] +'</td>';
      html += '<td class="center" style="width:120px;"><a class="portrait_href" href=' + contact_url + ' target="_blank">关联分析</a></td>';
      html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    $('#search_result').append(html);
    
    $('.datatable').dataTable({
        "sDom": "<'row'<'col-md-6'l ><'col-md-6'f>r>t<'row'<'col-md-12'i><'col-md-12 center-block'p>>",
        "sPaginationType": "bootstrap",
        "aaSorting":[[5, 'desc']],
        //"aoColumnDefs":[ {"bSortable": false, "aTargets":[7]}],
        "oLanguage": {
            "sLengthMenu": "每页&nbsp; _MENU_ 条"
        }
    });
	
}
