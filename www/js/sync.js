function sync(data){
    alert(device.platform);
    var db = window.sqlitePlugin.openDatabase({
        name: 'my.db',
        location: 'default',
        androidDatabaseImplementation: 2
    });

    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS techs (id, name)');
        for(let i = 0; i < data.techs.length; i++)
        {
            tx.executeSql('INSERT INTO  VALUES (?,?)', [data.techs[i].id, data.techs[i].name]);
        }

    }, function(error) {
        alert('Transaction ERROR: ' + error.message);
    }, function() {
        alert('Populated database OK');
    }).bind(data);

    db.transaction(function(tx) {
        tx.executeSql('SELECT count(*) AS tecnicos FROM techs', [], function(tx, rs) {
            alert('Record count (expected to be 2): ' + rs.rows.item(0).mycount);
        }, function(tx, error) {
            alert('SELECT error: ' + error.message);
        });
    });
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
                sync(data)
            }
        });
        localStorage.setItem('need_sync_get_data', true);
    }
}



document.addEventListener("deviceready", function(){
    get_data();
}, false);
