function dashboard(take, skip, search = null)
{
    sync_get_data();
    setTimeout(function(){
        var db;
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);

        var _status = [
            {"en revision": 1},
            {"revision": 1},
            {"revisado": 1},
            {"verificacion": 2},
            {"verificada": 2},
            {"verificado": 2},
            {"espera cliente": 3},
            {"espera": 3},
            {"cliente": 3},
            {"respondido" :4},
            {"respondida" :4},
            {"revisado" :5},
            {"revisada":5},
            {"cerrado":6},
            {"cerrada":6}
        ];

        db.transaction(function(tx) {
            var where = 'WHERE 1 ';
            if(app_settings.user_permissions.indexOf('technical-group') >= 0){
                where += ' AND i.user_id = ' + app_settings.user.id;
            }
            if (search){
                where += " AND ( ";
                where += " c.name like '%"+search+"%'";
                where += " OR i.id like  '%"+search+"%'";

                let l = _status.length;
                let status_id;
                for (let i = 0; i < l; i++){
                    if (_status[i][search])
                    {
                        status_id = _status[i][search];
                    }
                }
                if (status_id){
                    where += " OR i.status = "+ status_id;
                }
                where += " OR v.brand like '%"+ search+"%'";
                where += " OR v.model like '%"+ search+"%'";
                where += " OR v.license_plate like '%"+ search+"%'";

                where += ")";
            }
            if (search == "cerrado" || search == 'cerrada'){
                where += ' AND i.status = 6 ';
            }else {
                where += ' AND i.status != 6 ';
            }
            let sql = [
                " SELECT ",
                " substr('000000' || i.id, -4, 4) as folio,  i.id as link, * ",
                " FROM inspections AS i ",
                " LEFT JOIN vehicles AS v ON v.id = i.vehicle_id ",
                " LEFT JOIN clients AS c ON c.id = v.user_id ",
                where,
                " ORDER BY i.id DESC ",
                " LIMIT " + skip+", "+take
            ].join('');
            console.log(sql);
            tx.executeSql(sql, [], function (tx, results){
                HtmlDashboard({inspections: results.rows});
            });


            sql = [
                " SELECT ",
                " COUNT(*) as count_rows ",
                " FROM inspections AS i ",
                " LEFT JOIN vehicles AS v ON v.id = i.vehicle_id ",
                " LEFT JOIN clients AS c ON c.id = v.user_id ",
                where
            ].join('');
            tx.executeSql(sql, [], function (tx, results){
                var show_more = $('#show_more');
                show_more.unbind('click');
                show_more.parent().parent().removeClass('hide');
                skip = skip + take;
                if(skip < results.rows[0].count_rows){
                    show_more.click(function(){
                        dashboard(take, skip, search)
                    });
                }
                else {
                    show_more.parent().parent().addClass('hide');
                }
            });
        });
    }, 2000)
}


function HtmlDashboard(data)
{
    console.log(data);
    for(i in data.inspections){
        var clone = $('#table-body #clone').clone();
        clone.attr('id', 'clone'+i);
        var inspection_id = data.inspections[i].id;
        var vehicle_id = data.inspections[i].vehicle_id;
        var good_clone = true;
        clone.find(".fill-data").each(function(x, item){
            field = $(item).attr('data-field');
            if(field)
            {
                let value = data.inspections[i][field];
                if(!value){
                    good_clone = false;
                    return;
                }
                if(field == 'status'){
                    value ='<i class="'+inspectionStatus[value].icon +' text-color-marca"> </i> '+inspectionStatus[value].text;
                    if(app_settings.user_permissions.indexOf('advisory_group') >= 0){
                        value = '<a href="resultado_inspeccion.html?id='+inspection_id+'" class="btn-link btn-md">' +value +'</a>'
                    }
                }
                if(field == 'link'){
                    if(app_settings.user_permissions.indexOf('technical-group')){
                        value = '<a href="realizar_inspeccion.html?vehicle_id='+vehicle_id+'&inspection_id='+inspection_id+'" class="btn-link btn-md"><i class="fa fa-chevron-right"> </i></a>';
                    }
                }

                $(item).append(value);
            }
        });
        if(good_clone)
            $('#table-body').append(clone.removeClass('hide'));
        else
            clone.remove()
    }
    permissions();
}
