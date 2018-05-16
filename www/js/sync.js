function __sync_data(data, call_back_function = null){

    var  db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS techs;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS techs (id INTEGER PRIMARY KEY, name)');
        for(var i = 0; i < data.techs.length; i++)
        {
            tx.executeSql("INSERT INTO techs (id, name) VALUES ("+data.techs[i].id+", '"+data.techs[i].name+"')");
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS vehicles;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vehicles (id INTEGER PRIMARY KEY, brand, model, license_plate, user_id, vin, origen)');
        for(var i = 0; i < data.vehicles.length; i++)
        {
            var vehicle = data.vehicles[i];
            var sql = "INSERT INTO vehicles (id, brand, model, license_plate, user_id, vin, origen) VALUES ("+vehicle.id+", '"+vehicle.brand+"', '"+vehicle.model+"', '"+vehicle.license_plate+"', "+vehicle.user_id+", '"+vehicle.vin+"', 'server')";
            tx.executeSql(sql);
        }
    });


    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS clients;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY, name, cellphone, email, origen, password )');
        for(var i = 0; i < data.clients.length; i++)
        {
            var client =  data.clients[i];
            tx.executeSql("INSERT INTO clients (id, name, cellphone, email,  origen, password) VALUES ("+client.id+", '"+client.name+"', '"+client.cellphone+"', '"+client.email+"' , 'server', '')");
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS catalogue;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS catalogue (id INTEGER PRIMARY KEY, inspection_id, name, category_name)');
        for(var i = 0; i < data.catalogue.length; i++)
        {
            var catalogue =  data.catalogue[i];
            tx.executeSql("INSERT INTO catalogue (id, inspection_id, name, category_name) VALUES ("+catalogue.id+", "+catalogue.inspection_id+", '"+catalogue.name+"', '"+catalogue.category_name+"')");
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS inspections;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS inspections (id INTEGER PRIMARY KEY, vehicle_id, user_id, origen, status, presupuesto)');
        tx.executeSql('DROP TABLE IF EXISTS vehicle_inspections;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vehicle_inspections (id INTEGER PRIMARY KEY, inspection_id, point_id, price, severity, status, cataloge, category, origen, files)');
        for(var i = 0; i < data.inspections.length; i++)
        {
            var inspection =  data.inspections[i];

            var presupuesto = data.presupuestos[inspection.id] ? data.presupuestos[inspection.id] : '';
            var sql = "INSERT INTO inspections (id, vehicle_id, user_id, origen, status, presupuesto) VALUES ("+inspection.id+", "+inspection.vehicle_id+", "+inspection.user_id+", 'server', "+inspection.status+", '"+ presupuesto +"')";
            tx.executeSql(sql);
            var vehicle_inspections = inspection.vehicle_inspections;
            for(var x = 0; x < vehicle_inspections.length; x++)
            {
                var point = vehicle_inspections[x];
                var files = JSON.stringify(point.files);
                var sql2 = "INSERT INTO vehicle_inspections (id, inspection_id, point_id, price, severity, status, cataloge, category, origen, files) VALUES ("+point.id+", "+point.inspections_id+", "+point.inspection_id+", '"+point.price+"', "+point.severity+", '"+point.status+"', '"+point.catalogue.name+"', '"+point.catalogue.inspection.name+"', 'server', '"+files+"' )";
                tx.executeSql(sql2);
            }
        }
    }, function(error) {
        debug('algo fallo', true);
    }, function() {
        $('#dbRefresh').addClass('hide');
        debug('Data base has been saved');
        if(call_back_function)
            call_back_function.call();
    });
}

var first_sync = true;

function sync_data(call_back_function = null){
    if(localStorage.getItem("network") == 'online'){
        $('#dbRefresh').removeClass('hide');
        var session = JSON.parse(localStorage.getItem('session'));
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        var post_data = {
            inspections: [],
            points: [],
            clients: [],
            vehicles: []
        };
        db.transaction(function(tx) {
            tx.executeSql("SELECT i.* FROM inspections AS i LEFT JOIN vehicle_inspections AS vi ON i.id = vi.inspection_id WHERE i.origen IN ('modified', 'device') OR vi.origen IN ('modified', 'device') GROUP BY i.id ORDER BY i.id ", [], function (tx, inspections){
                post_data.inspections = inspections.rows;
                tx.executeSql("SELECT *  FROM vehicle_inspections WHERE origen IN ('modified', 'device') order by inspection_id", [], function(tx, points){
                    post_data.points = points.rows;
                    tx.executeSql("SELECT *  FROM clients WHERE origen != 'server' order by id", [], function(tx, clients){
                        post_data.clients = clients.rows;
                        tx.executeSql("SELECT *  FROM vehicles WHERE  origen != 'server' order by id", [], function(tx, vehicles){
                            post_data.vehicles = vehicles.rows;
                            $.ajax({
                                async: false,
                                url: ruta_generica+"/api/v1/sync_data",
                                type: 'POST',
                                cache : false,
                                dataType: 'JSON',
                                data: {
                                    token:session.token,
                                    post_data: JSON.stringify(post_data),
                                },
                                success:function(data) {
                                    __sync_data(data, call_back_function);
                                }
                            });
                        });
                    });
                });
            });
        }, function(error) {
            if(first_sync){
                $.ajax({
                    async: false,
                    url: ruta_generica+"/api/v1/sync_data",
                    type: 'POST',
                    cache : false,
                    dataType: 'JSON',
                    data: {
                        token:session.token,
                    },
                    success:function(data) {
                        __sync_data(data, call_back_function);
                    }
                });
                first_sync = false;
            }else {
                debug('algo fallo.. [' + JSON.stringify(error) + ']', true);
            }
        });

    }
    else
    {
        call_back_function.call();

    }
}

function debug(message, debug)
{
    console.log(message);
    if(debug)
        alert(JSON.stringify(message));
}
