function sync(data){

    var db;

    if (device.platform == "browser")
    {
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    }
    else
    {
        db = window.sqlitePlugin.openDatabase({
            name: 'my.db',
            location: 'default',
            androidDatabaseImplementation: 2
        });
    }

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS techs;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS techs (id, name)');
        for(let i = 0; i < data.techs.length; i++)
        {
            tx.executeSql("INSERT INTO techs (id, name) VALUES ("+data.techs[i].id+", '"+data.techs[i].name+"')");
        }
    }, function(error) {
        debug('Techs error '+ JSON.stringify(error));
    }, function() {
        debug('Techs was been saved');
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS vehicles;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vehicles (id, brand, model, license_plate, user_id, vin)');
        for(let i = 0; i < data.vehicles.length; i++)
        {
            let vehicle = data.vehicles[i];
            let sql = "INSERT INTO vehicles (id, brand, model, license_plate, user_id, vin) VALUES ("+vehicle.id+", '"+vehicle.brand+"', '"+vehicle.model+"', '"+vehicle.license_plate+"', '"+vehicle.user_id+"', '"+vehicle.vin+"')";
            tx.executeSql(sql);
        }
    }, function(error) {
        debug('Vehicles error '+ JSON.stringify(error));
    }, function() {
        debug('Vehicles was been saved');
    });


    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS clients;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS clients (id, name)');
        for(let i = 0; i < data.clients.length; i++)
        {
            let client =  data.clients[i];
            tx.executeSql("INSERT INTO clients (id, name) VALUES ("+client.id+", '"+client.name+"')");
        }
    }, function(error) {
        debug('Clients error '+ JSON.stringify(error));
    }, function() {
        debug('Clients was been saved');
    })

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS catalogue;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS catalogue (id, inspection_id, name, category_name)');
        for(let i = 0; i < data.inspections_catalogue.length; i++)
        {
            let catalogue =  data.inspections_catalogue[i];
            tx.executeSql("INSERT INTO catalogue (id, inspection_id, name, category_name) VALUES ("+catalogue.id+", '"+catalogue.inspection_id+"', '"+catalogue.name+"', '"+catalogue.category_name+"')");
        }
    }, function(error) {
        debug('Catalogue error '+ JSON.stringify(error));
    }, function() {
        debug('Catalogue was been saved');
    })

    return true;
}

function get_data(){
    if(localStorage.getItem('need_sync_get_data')){
        let session = JSON.parse(localStorage.getItem('session'));
        $.ajax({
            url: ruta_generica+"/api/v1/sync_get_data",
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: session.token,
            },
            success:function(data) {
                localStorage.setItem('need_sync_get_data', !sync(data));
            }
        });

    }
}
function debug(message)
{
    if (device.platform == "browser")
    {
        console.log(message);
    }
    else
    {
        alert(message);
    }
}
document.addEventListener("deviceready", function(){
    get_data();
}, false);
