function __sync_data(data, call_back_function = null){
    debug('aki', 1);
    var  db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS techs;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS techs (id INTEGER PRIMARY KEY, name)');
        for(let i = 0; i < data.techs.length; i++)
        {
            tx.executeSql("INSERT INTO techs (id, name) VALUES ("+data.techs[i].id+", '"+data.techs[i].name+"')");
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS vehicles;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vehicles (id INTEGER PRIMARY KEY, brand, model, license_plate, user_id, vin)');
        for(let i = 0; i < data.vehicles.length; i++)
        {
            let vehicle = data.vehicles[i];
            let sql = "INSERT INTO vehicles (id, brand, model, license_plate, user_id, vin) VALUES ("+vehicle.id+", '"+vehicle.brand+"', '"+vehicle.model+"', '"+vehicle.license_plate+"', "+vehicle.user_id+", '"+vehicle.vin+"')";
            tx.executeSql(sql);
        }
    });


    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS clients;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY, name, cellphone, email )');
        for(let i = 0; i < data.clients.length; i++)
        {
            let client =  data.clients[i];
            tx.executeSql("INSERT INTO clients (id, name, cellphone, email) VALUES ("+client.id+", '"+client.name+"', '"+client.cellphone+"', '"+client.email+"')");
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS catalogue;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS catalogue (id INTEGER PRIMARY KEY, inspection_id, name, category_name)');
        for(let i = 0; i < data.catalogue.length; i++)
        {
            let catalogue =  data.catalogue[i];
            tx.executeSql("INSERT INTO catalogue (id, inspection_id, name, category_name) VALUES ("+catalogue.id+", "+catalogue.inspection_id+", '"+catalogue.name+"', '"+catalogue.category_name+"')");
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS inspections;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS inspections (id INTEGER PRIMARY KEY, vehicle_id, user_id, origen, status)');
        tx.executeSql('DROP TABLE IF EXISTS vehicle_inspections;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vehicle_inspections (id INTEGER PRIMARY KEY, inspection_id, point_id, price, severity, status, cataloge, category, origen)');
        for(let i = 0; i < data.inspections.length; i++)
        {
            let inspection =  data.inspections[i];
            let sql = "INSERT INTO inspections (id, vehicle_id, user_id, origen, status) VALUES ("+inspection.id+", "+inspection.vehicle_id+", "+inspection.user_id+", 'server', "+inspection.status+")";
            tx.executeSql(sql);
            let vehicle_inspections = inspection.vehicle_inspections;
            for(let x = 0; x < vehicle_inspections.length; x++)
            {
                let poin = vehicle_inspections[x];
                let sql2 = "INSERT INTO vehicle_inspections (id, inspection_id, point_id, price, severity, status, cataloge, category, origen) VALUES ("+poin.id+", "+poin.inspections_id+", "+poin.inspection_id+", '"+poin.price+"', "+poin.severity+", '"+poin.status+"', '"+poin.catalogue.name+"', '"+poin.catalogue.inspection.name+"', 'server' )";
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
var first_sink = true;
function sync_data(call_back_function = null){
    if(localStorage.getItem("network") == 'online'){
        $('#dbRefresh').removeClass('hide');
        var session = JSON.parse(localStorage.getItem('session'));
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        var post_data = {
            inspections: [],
            points: []
        };
        db.transaction(function(tx) {
            tx.executeSql("SELECT i.* FROM inspections AS i LEFT JOIN vehicle_inspections AS vi ON i.id = vi.inspection_id WHERE i.origen IN ('modified', 'device') OR vi.origen IN ('modified', 'device') GROUP BY i.id ORDER BY i.id ", [], function (tx, inspections){
                post_data.inspections = inspections.rows;
                tx.executeSql("SELECT *  FROM vehicle_inspections WHERE origen IN ('modified', 'device') order by inspection_id", [], function(tx, points){
                    post_data.points = points.rows;
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
                debug('algo fallo', true);
            }
        }, function() {
            $('#dbRefresh').addClass('hide');
            debug('Data base has been saved');
            if(call_back_function)
            {
                call_back_function.call();
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
