function new_inspection(take, skip, search = null){
    sync_get_data(function(success){
        console.log(success ? 'sync' : 'no syncs');
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);


        db.transaction(function(tx) {
            var where = 'WHERE 1 ';
            if (search){
                where += " AND ( ";
                where += " c.name like '%"+search+"%'";
                where += " OR v.brand like '%"+ search+"%'";
                where += " OR v.model like '%"+ search+"%'";
                where += " OR v.license_plate like '%"+ search+"%'";
                where += ")";
            }

            let sql = " SELECT  v.id as link, * FROM vehicles AS v LEFT JOIN clients AS c ON c.id = v.user_id " + where + " LIMIT " + skip+", "+take;
            tx.executeSql(sql, [], function (tx, results){
                new_inspection_html({vehicles: results.rows});
            });
            sql = " SELECT COUNT(*) as count_rows FROM vehicles AS v LEFT JOIN clients AS c ON c.id = v.user_id " + where;
            tx.executeSql(sql, [], function (tx, results){
                var show_more = $('#show_more');
                show_more.unbind('click');
                show_more.parent().parent().removeClass('hide');
                skip = skip + take;
                if(skip < results.rows[0].count_rows){
                    show_more.click(function(){
                        new_inspection(take, skip, search)
                    });
                }
                else {
                    show_more.parent().parent().addClass('hide');
                }
            });
        });
    })
}
function new_inspection_html(data){
    for(i in data.vehicles){
        var clone = $('#table-clients #clone').clone();
        clone.attr('id', 'clone'+i);
        var vehicle_id = data.vehicles[i].id;
        var good_clone = true;
        clone.find(".fill-data").each(function(x, item){
            field = $(item).attr('data-field');
            if(field)
            {
                let value = data.vehicles[i][field];
                if(!value){
                    good_clone = false;
                    return;
                }
                if(field == 'link'){
                    value = '<a href="tecnicos.html?vehicle_id='+vehicle_id+'" class="btn-link btn-md"><i class="fa fa-chevron-right"> </i></a>';
                }

                $(item).append(value);
            }
        });
        if(good_clone)
            $('#table-clients').append(clone.removeClass('hide'));
        else
            clone.remove()
    }
    permissions();
}
