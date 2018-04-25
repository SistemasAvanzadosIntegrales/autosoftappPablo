var sync = {
    save_local_data: function(data){
        alert('save local data');
        this.save_clients(data.clients);
        this.save_vehicles(data.vehicles);
        this.save_techs(data.techs);
        this.save_cataloge(data.cataloge);
    },
    save_clients : function(clients){
        var db = window.sqlitePlugin.openDatabase({name: "my.db"});

        db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS test_table');
        tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

        tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
          alert("insertId: " + res.insertId + " -- probably 1");
          alert("rowsAffected: " + res.rowsAffected + " -- should be 1");

          db.transaction(function(tx) {
            tx.executeSql("select count(id) as cnt from test_table;", [], function(tx, res) {
              alert("res.rows.length: " + res.rows.length + " -- should be 1");
              alert("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
            });
          });

        }, function(e) {
          alert("ERROR: " + e.message);
        });
        });
    },
    save_vehicles : function(vehicles){

    },
    save_techs : function(techs){

    },
    save_cataloge : function(cataloge){

    },
}

function sync_get_data(){
    if(localStorage.getItem('need_sync_get_data')){
        let session = JSON.parse(localStorage.getItem('session'));
        $.ajax({
            url: ruta_generica+"/api/v1/sync_get_data",
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: session.token,
            },
            success:function(resp) {
                sync.save_local_data(resp);
            }
        });
        localStorage.setItem('need_sync_get_data', true);
    }
}



document.addEventListener("deviceready", function(){
    sync_get_data();
}, false);
