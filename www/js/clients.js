var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
function obtenerClients(take, skip, search = null){
    var session=JSON.parse(localStorage.getItem('session'));
    sync_data(function(){
        db.transaction(function(tx) {
            var where = 'WHERE origen != "deleted" ';
            if (search){
                where += " AND ( ";
                where += " clients.name like '%"+search+"%'";
                where += ")";
            }
            var sql = " SELECT  *, id as link,  id as trash  FROM clients " + where + " LIMIT " + skip+", "+take;
            tx.executeSql(sql, [], function (tx, results){
                clientsHTML({clients: results.rows});
            });
            sql = " SELECT COUNT(*) as count_rows FROM clients " + where
            tx.executeSql(sql, [], function (tx, results){
                var show_more = $('#show_more');
                show_more.unbind('click');
                show_more.parent().parent().removeClass('hide');
                skip = skip + take;
                if(skip < results.rows[0].count_rows){
                    show_more.click(function(){
                        obtenerClients(take, skip, search)
                    });
                }
                else {
                    show_more.parent().parent().addClass('hide');
                }
            });
        });
    });
}

function clientsHTML(data){
    for(var i = 0; i < data.clients.length; i++){
        var clone = $('#clients #clone').clone();
        clone.attr('id', 'clone'+i);
        var good_clone = true;
        clone.find(".fill-data").each(function(x, item){
            field = $(item).attr('data-field');
            if(field)
            {
                var value = data.clients[i][field];
                if(field == 'trash'){
                    value = '<a data-client-id="'+data.clients[i].id+'" class="btn-link btn-delete btn-md"><i class="fa fa-trash"> </i></a>';
                }
                if(field == 'link'){
                    value = '<a href="client_view.html?client_id='+data.clients[i].id+'" class="btn-link btn-md"><i class="fa fa-chevron-right"> </i></a>';
                }
                $(item).append(value);
            }
        });
        if(good_clone)
            $('#clients').append(clone.removeClass('hide'));
        else
            clone.remove()
    }
    setTimeout(function(){
        $("#buttonmenu").prepend("<a href='client_view.html' class='navbar-link'><i class='fa fa-user-plus'></i></a>")
    }, 200);

    $('.btn-delete').click(function(e){
        var self = this;
        navigator.notification.confirm(
            'Confirme la eliminación del cliente',  // message
            function(result){
                if(result === 1){
                    db.transaction(function(tx) {
                        tx.executeSql( "UPDATE clients set origen = 'deleted' where id = ? ", [$(self).attr('data-client-id')]);
                    },function(error){
                        console.log(error);
                    },function(){
                        sync_data(function(){
                            $(self).parent().parent().remove();
                        })
                    });
                }
            },              // callback to iurlParams.client_idnvoke with index of button pressed
            'Eliminar',            // title
            'Ok,Cancelar'          // buttonLabels
        );
    })
}

var view_client = function(){
    var urlParams = getParams(window.location.href)
    if (urlParams.client_id){
        db.transaction(function(tx) {
            tx.executeSql( "SELECT * from clients where id = ? ", [urlParams.client_id], function(tx, result) {
                var client = result.rows[0];
                $("#cellphone").val(client.cellphone);
                $("#email").val(client.email);
                $("#name").val(client.name);
                $("#id").val(client.id);
                $("#client_origen").val('modified');
                var sql = "select (brand || ' ' || model || ' </br>' || license_plate || ' ' || vin) as name, id as trash, id as link, *  from vehicles where user_id = "+urlParams.client_id;
                tx.executeSql(sql, [], function(tx, results){
                    vehiclesHTML({vehicles: results.rows})
                });
                $('#vehicles_secction').removeClass('hide');
            },
            function(error){
                 alert('Error occurred');
            });
        },function(error){
            console.log(error);
        },function(){
            $(self).parent().parent().remove();
        });
    }
    setTimeout(function(){
        var buttons = "<a class='navbar-link' id='SaveAll'><i class='fa fa-save'></i></a>";
        if (urlParams.client_id)
        {
            buttons = buttons + "<a id='AddCar' class='navbar-link '><i class='fa fa-car'></i></a>";
        }
        $("#buttonmenu").prepend(buttons);
        $("#AddCar").click(function(){
            $('#vehicle_id').val($("#vehicles tr").length);
            $('#brand').val("");
            $('#model').val("");
            $('#license_plate').val("");
            $('#vin').val("");
            $('#origen').val('device');
            togle_form_table();
        })
        $('#SaveAll').click(function(){
            var ok = true;
            $('.has-error').removeClass('has-error');
            var cellphone = $("#cellphone").val();
            var email = $("#email").val();
            var name = $("#name").val();
            var password = $('#password').val();
            if(cellphone == ""){
                $("#cellphone").parent().addClass('has-error');
            }
            if(email == ""){
                $("#email").parent().addClass('has-error');
            }
            if(name == ""){
                $("#name").parent().addClass('has-error');
            }
            if($('#client_origen').val() == 'device'){
                if(password == ""){
                    $('#password').parent().addClass('has-error');
                    $('#password2').parent().addClass('has-error');
                }
            }
            if(password != $('#password2').val()){
                $('#password').parent().addClass('has-error');
                $('#password2').parent().addClass('has-error');
            }
            if(!ok)
            {
                return false;
            }
            db.transaction(function(tx) {
                var sql = ""
                if ($('#client_origen').val() == 'device')
                {
                    sql = "INSERT INTO clients (name, cellphone, email, password, origen) VALUES ('"+name+"', '"+cellphone+"', '"+email+"' , '"+password+"' , 'device')";
                }
                else
                {
                    var set_password = password != "" ? ", password = '"+password+"'" : "";
                    sql = "UPDATE clients SET name = '"+name+"', cellphone = '"+cellphone+"', email = '"+email+"' "+set_password+" , origen = 'modified' WHERE id = "+$('#id').val();
                }
                tx.executeSql(sql);
            },function(error){
                console.log(error);
            },function(){
                sync_data(function(){
                    location.href="clients.html"
                })
            });
        });
    }, 200)
}

var togle_form_table = function(){
    $('#vehicles_secction').find('form').toggleClass('hide');
    $('#vehicles_secction').find('.table-responsive').toggleClass('hide');
    $("#SaveAll").toggleClass('hide');
}

function vehiclesHTML(data){
    for(i in data.vehicles){
        var clone = $('#vehicles #clone').clone();
        clone.attr('id', 'clone'+i);
        var good_clone = true;
        clone.find(".fill-data").each(function(x, item){
            field = $(item).attr('data-field');
            if(field)
            {
                var value = data.vehicles[i][field];
                if(!value){
                    good_clone = false;
                    return;
                }
                if(field == 'trash'){
                    value = '<a data-vehicle-id="'+data.vehicles[i].id+'" class="btn-link btn-vehicle-delete btn-md"><i class="fa fa-trash"> </i></a>';
                }
                if(field == 'link'){
                    value = '<a ' +
                        'data-vehicle-id="'+data.vehicles[i].id+'"  '+
                        'data-vehicle-brand="'+data.vehicles[i].brand+'"  '+
                        'data-vehicle-model="'+data.vehicles[i].model+'"  '+
                        'data-vehicle-license_plate="'+data.vehicles[i].license_plate+'"  '+
                        'data-vehicle-vin="'+data.vehicles[i].vin+'" '+
                        'data-vehicle-origen="'+data.vehicles[i].origen+'" '+
                        'class=" btn-link btn-vehicle-edit btn-md"><i class="fa fa-chevron-right"> </i></a>';
                }
                $(item).append(value);
            }
        });
        clone.find('.btn-vehicle-edit').click(function(e){
            var self = this;
            $('#vehicle_id').val($(self).attr('data-vehicle-id'));
            $('#brand').val($(self).attr('data-vehicle-brand'));
            $('#model').val($(self).attr('data-vehicle-model'));
            $('#license_plate').val($(self).attr('data-vehicle-license_plate'));
            $('#vin').val($(self).attr('data-vehicle-vin'));
            $('#origen').val($(self).attr('data-vehicle-origen'));
            togle_form_table();
        })

        clone.find('.btn-vehicle-delete').click(function(e){
            var self = this;
            navigator.notification.confirm(
                'Confirme la eliminación del vehiculo',  // message
                function(result){
                    if(result === 1){
                        db.transaction(function(tx) {
                            tx.executeSql( "UPDATE vehicles set origen = 'deleted' where id = ? ", [$(self).attr('data-vehicle-id')]);
                        },function(error){
                            console.log(error);
                        },function(){
                            sync_data(function(){
                                $(self).parent().parent().remove();
                            })
                        });
                    }
                },              // callback to invoke with index of button pressed
                'Eliminar',            // title
                'Ok,Cancelar'          // buttonLabels
            );
        })

        if(good_clone)
            $('#vehicles').append(clone.removeClass('hide'));
        else
            clone.remove()
    }
}

$(".save-vehicle").click(function(){
    var ok = true;
    $('.has-error').removeClass('has-error');
    if( $('#brand').val() == "")
    {
        $('#brand').parent().addClass('has-error');
        ok = false;
    }
    if( $('#model').val() == "")
    {
        $('#model').parent().addClass('has-error')
        ok = false;
    }
    if( $('#license_plate').val() == "")
    {
        $('#license_plate').parent().addClass('has-error')
        ok = false;
    }
    if( $('#vin').val() == "")
    {
        $('#vin').parent().addClass('has-error')
        ok = false;
    }
    if(!ok){
        return ok;
    }
    if ($('#origen').val() != 'device'){
        $('a[data-vehicle-id="'+$('#vehicle_id').val()+'"').parent().parent().remove();
    }
    var name =  $('#brand').val() + " " +  $('#model').val() + " <br> " + $('#license_plate').val() + " " + $('#vin').val();
    var trash = $('#vehicle_id').val();
    var link = $('#vehicle_id').val();
    var brand = $('#brand').val();
    var model = $('#model').val();
    var license_plate = $('#license_plate').val();
    var vin = $('#vin').val();
    var origen = $('#origen').val() == 'device' ? 'device' : 'modified';
    vehiclesHTML({vehicles: [{
        id: vehicle_id,
        name:  brand + " " +  model + " <br> " + license_plate + " " + vin,
        trash: vehicle_id,
        link: vehicle_id,
        brand: brand,
        model: model,
        license_plate: license_plate,
        vin: vin,
        origen: origen == 'device' ? 'device' : 'modified',
    }]});
    var user_id = $('#id').val();

    if (origen == 'device')
    {
        sql = "INSERT INTO vehicles (brand, model, license_plate, user_id, vin, origen) VALUES ('"+$('#brand').val()+"', '"+model+"', '"+license_plate+"', "+user_id+", '"+vin+"', 'device')";
    }
    else
    {
        sql = "UPDATE vehicles SET brand = '"+brand+"', model = '"+model+"', license_plate = '"+license_plate+"' ,  vin = '"+ vin+"', origen = 'modified'  WHERE id = "+vehicle_id;
    }
    console.log(sql);
    db.transaction(function(tx) {
        tx.executeSql(sql);
    })
    sync_data();
    togle_form_table();
});
