function new_inspection(take, skip, search = null){
    sync_data(function(){
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

            var sql = " SELECT  v.id as link, * FROM vehicles AS v LEFT JOIN clients AS c ON c.id = v.user_id " + where + " GROUP BY v.id LIMIT " + skip+", "+take;
            tx.executeSql(sql, [], function (tx, results){
                console.log(results.rows);
                new_inspection_html({vehicles: results.rows});
            });
            var _sql = " SELECT COUNT(*) as count_rows FROM vehicles AS v " + where  ;
            tx.executeSql(_sql, [], function (tx, results){
                var show_more = $('#show_more');
                console.log(results);
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
    });
}
function new_inspection_html(data){
    for(var i = 0; i < data.vehicles.length; i++){
        var clone = $('#table-clients #clone').clone();
        clone.attr('id', 'clone'+i);
        var vehicle_id = data.vehicles[i].link;
        var good_clone = true;
        clone.find(".fill-data").each(function(x, item){
            field = $(item).attr('data-field');
            if(field)
            {
                var value = data.vehicles[i][field];
                if(field == 'link'){
                    value = '<a href="techs.html?vehicle_id='+vehicle_id+'" class="btn-link btn-md"><i class="fa fa-chevron-right"> </i></a>';
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
