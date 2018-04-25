function sync(data){
    console.log(data);
    var db = window.sqlitePlugin.openDatabase({
        name: 'my.db',
        location: 'default',
        androidDatabaseImplementation: 2
    });

    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)');
        alert(JSON.stringify(data));
        tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]);
        tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
    }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function() {
        console.log('Populated database OK');
    }).bind(data);
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
