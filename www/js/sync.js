function __sync_get_data(data, callback = null){
    var db;
    debug(data, 1);
    if (device.platform == "browser")
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    else
        db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default', androidDatabaseImplementation: 2});

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS techs;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS techs (id, name)');
        for(let i = 0; i < data.techs.length; i++)
        {
            tx.executeSql("INSERT INTO techs (id, name) VALUES ("+data.techs[i].id+", '"+data.techs[i].name+"')");
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS vehicles;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vehicles (id, brand, model, license_plate, user_id, vin)');
        for(let i = 0; i < data.vehicles.length; i++)
        {
            let vehicle = data.vehicles[i];
            let sql = "INSERT INTO vehicles (id, brand, model, license_plate, user_id, vin) VALUES ("+vehicle.id+", '"+vehicle.brand+"', '"+vehicle.model+"', '"+vehicle.license_plate+"', "+vehicle.user_id+", '"+vehicle.vin+"')";
            tx.executeSql(sql);
        }
    });


    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS clients;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS clients (id, name)');
        for(let i = 0; i < data.clients.length; i++)
        {
            let client =  data.clients[i];
            tx.executeSql("INSERT INTO clients (id, name) VALUES ("+client.id+", '"+client.name+"')");
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS catalogue;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS catalogue (id, inspection_id, name, category_name)');
        for(let i = 0; i < data.catalogue.length; i++)
        {
            let catalogue =  data.catalogue[i];
            tx.executeSql("INSERT INTO catalogue (id, inspection_id, name, category_name) VALUES ("+catalogue.id+", '"+catalogue.inspection_id+"', '"+catalogue.name+"', '"+catalogue.category_name+"')");
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS inspections;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS inspections (id, vehicle_id, user_id, status)');
        tx.executeSql('DROP TABLE IF EXISTS vehicle_inspections;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vehicle_inspections (id, inspections_id, price, severity, status, cataloge, category)');
        for(let i = 0; i < data.inspections.length; i++)
        {
            let inspection =  data.inspections[i];
            let sql = "INSERT INTO inspections (id, vehicle_id, user_id, status) VALUES ("+inspection.id+", "+inspection.vehicle_id+", "+inspection.user_id+", "+inspection.status+")";
            tx.executeSql(sql);
            let vehicle_inspections = inspection.vehicle_inspections;
            for(let x = 0; x < vehicle_inspections.length; x++)
            {
                let poin = vehicle_inspections[x];
                let sql2 = "INSERT INTO vehicle_inspections (id, inspections_id, price, severity, status, cataloge, category) VALUES ("+poin.id+", "+poin.inspections_id+", '"+poin.price+"', '"+poin.severity+"', '"+poin.status+"', '"+poin.catalogue.name+"', '"+poin.catalogue.inspection.name+"')";
                tx.executeSql(sql2);
            }
        }
    }, function(error) {
        debug('algo fallo', true);
    }, function() {
        $('#dbRefresh').attr('class', 'text-success');
        $('#dbRefresh').attr('class', 'text-danger hide')
        debug('Data base has been saved');
        if (callback)
        {
            return callback(true);
        }
        return true;
    });
}

function sync_get_data(callback = null){
    if(localStorage.getItem("network") == 'online'){
        $('#dbRefresh').attr('class', 'text-danger')
        let session = JSON.parse(localStorage.getItem('session'));
        $.ajax({
            url: ruta_generica+"/api/v1/sync_get_data",
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: session.token,
            },
            success:function(data) {
                __sync_get_data(data, callback);
            }
        });
    }else{
        if (callback)
        {
            return callback(false);
        }
    }
}
function debug(message, debug)
{
    if (device.platform == "browser")
        console.log(message);

    if(debug)
        alert(JSON.stringify(message));
}
