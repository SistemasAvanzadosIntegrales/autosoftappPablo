function obtenerTecnicos(take, skip, search = null){
    var session=JSON.parse(localStorage.getItem('session'));
    sync_data(function(){
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(function(tx) {
            var where = 'WHERE 1 ';
            if (search){
                where += " AND ( ";
                where += " techs.name like '%"+search+"%'";
                where += ")";
            }
            let sql = " SELECT  *, id as link FROM techs " + where + " LIMIT " + skip+", "+take;
            tx.executeSql(sql, [], function (tx, results){
                builTecnicosHTML({techs: results.rows});
            });
            sql = " SELECT COUNT(*) as count_rows FROM techs " + where
            tx.executeSql(sql, [], function (tx, results){
                var show_more = $('#show_more');
                show_more.unbind('click');
                show_more.parent().parent().removeClass('hide');
                skip = skip + take;
                if(skip < results.rows[0].count_rows){
                    show_more.click(function(){
                        obtenerTecnicos(take, skip, search)
                    });
                }
                else {
                    show_more.parent().parent().addClass('hide');
                }
            });
        });
    });
}

function builTecnicosHTML(data){
    console.log(data);
    var params = getParams(window.location.href);
    var vehicle_id = params.vehicle_id;
    for(i in data.techs){
        var clone = $('#tecnicos #clone').clone();
        clone.attr('id', 'clone'+i);
        var tech_id = data.techs[i].id;
        var good_clone = true;
        clone.find(".fill-data").each(function(x, item){
            field = $(item).attr('data-field');
            if(field)
            {
                let value = data.techs[i][field];
                if(!value){
                    good_clone = false;
                    return;
                }
                if(field == 'link'){
                    value = '<a onclick="asignar('+vehicle_id+', '+tech_id+')" class="btn-link btn-md"><i class="fa fa-chevron-right"> </i></a>';
                }

                $(item).append(value);
            }
        });
        if(good_clone)
            $('#tecnicos').append(clone.removeClass('hide'));
        else
            clone.remove()

    }
    permissions();
}

function asignar(vehicle_id, user_id){

    navigator.notification.confirm(
        'Confirme la asignación de técnico',  // message
        function(result){
            if(result === 1){
                var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                db.transaction(function(tx) {
                    tx.executeSql( "INSERT INTO inspections (vehicle_id, user_id, origen,  status) VALUES ( "+vehicle_id+", "+user_id+", 'device', 1)", [], function(tx, result) {
                        var inspection_id = result.insertId;
                        console.log(result);
                        tx.executeSql(" SELECT  * FROM catalogue ", [], function (tx, results){
                            for (var x = 0; x < results.rows.length; x++){
                                let name = results.rows.item(x).name;
                                let category_name = results.rows[x].category_name;
                                let point_id = results.rows[x].id;
                                let sql2 = "INSERT INTO vehicle_inspections (inspection_id, point_id, price, severity, status, cataloge, category, 'origen') VALUES ("+inspection_id+", "+point_id+",0, 0, 1, '"+name+"', '"+category_name+"', 'device')";
                                tx.executeSql(sql2);
                            }
                        });
                    },
                    function(error){
                         alert('Error occurred');
                    });

                },function(error){
                    console.log(error);
                },function(){
                    location.href="dashboard.html";
                });

            }
        },              // callback to invoke with index of button pressed
        'Crear inspección',            // title
        'Ok,Cancelar'          // buttonLabels
    );


}
