
function gridClientes(){
    session=JSON.parse(localStorage.getItem('session'));
    $("#table-clients").html("");
    var token = session.token;

    $.ajax({
        url: ruta_generica+"/api/v1/clients",
        type: 'GET',
        dataType: 'JSON',
        data: {
            token:      token,
            cliente:    $("#cliente" ).val().trim()
        },
        success:function(resp) {

            if( resp.status == 'ok' ) {
               $("#table-clients").append(resp.table);
            }
            else {
                navigator.notification.alert(resp.message, null, 'Aviso', 'Aceptar');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
    });
}

function obtenerclients(){

    $("#table-clients-users").html("");
    var token = session.get_token;

    $.ajax({
        url: ruta_generica+"/api/v1/clients",
        type: 'GET',
        dataType: 'JSON',
        data: {
            token:      token,
            cliente:    $("#cliente").val().trim(),
			id_user:    session.get_id_cliente
        },
        success:function(resp) {

            if( resp.status == 'ok' ) {
			   $("#table-clients-users").append(resp.user);
				localStorage.removeItem("id_cliente");
            }
            else {
                navigator.notification.alert(resp.message, null, 'Aviso', 'Aceptar');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
    });

}

function delete_cliente(id){
    var token = session.get_token;

    $.ajax({
        url: ruta_generica+"/api/v1/delete",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token:  token,
            id:    	id
        },
        success:function(resp) {

            if( resp.status == 'ok' ) {
				location.href="cliente_detalle.html";
            }
            else {
                navigator.notification.alert(resp.message, null, 'Aviso', 'Aceptar');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
    });
}

function detalle_cliente(id){
	localStorage.setItem("id_cliente", id);
	location.href = "alta_cliente.html";
}

function obtener_datos_cliente(){

	var id = localStorage.getItem('id_cliente');

	if(id != null){
		var token = session.get_token;

		$.ajax({
			url: ruta_generica+"/api/v1/clients/"+id,
			type: 'GET',
			dataType: 'JSON',
			data: {
				token:    token,
				id_user:  session.get_id_cliente
			},
			success:function(resp) {

				if( resp.status == 'ok' ) {

					$("#name").val(resp.user[0]['name']);
					$("#email").val(resp.user[0]['email']);
					$("#cellphone").val(resp.user[0]['cellphone']);
					$("#table_vehicle").append(resp.vehicle);

					localStorage.removeItem("id_vehiculo");

				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("Status: " + textStatus);
				console.log("Error: " + errorThrown);
			}
		});
	}
}

function accion_cliente(){ // Obtener clientes marca error al obtener el token.

	emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

	var name = $("#name").val();
	var email = $("#email").val();
	var cellphone = $("#cellphone").val();
	var password = $("#password").val();
	var password2 = $("#password2").val();

	if(password != password2)
		navigator.notification.alert("Las contraseñas no coinciden", null, 'Aviso', 'Aceptar');

	else if(name == "" || email == "" || cellphone == "")
		navigator.notification.alert("Campos Vacíos", null, 'Aviso', 'Aceptar');

	else if(!emailRegex.test(email))
		navigator.notification.alert("Correo invalido", null, 'Aviso', 'Aceptar');

	else if(localStorage.getItem('id_cliente') == null)
		agregar_cliente();

	else
		editar_cliente();

}

function editar_cliente(){

	var name = $("#name").val();
	var email = $("#email").val();
	var cellphone = $("#cellphone").val();
	var password = $("#password").val();

	var id = localStorage.getItem('id_cliente');

	var token = session.get_token;

	if(password != "" && (password.length > 12 || password.length < 8)){
		navigator.notification.alert("La contraseña debe ser mayor 8 y menor a 12 caracteres", null, 'Aviso', 'Aceptar');
	}else{
		$.ajax({
			url: ruta_generica+"/api/v1/clients/"+id,
			type: 'PUT',
			dataType: 'JSON',
			data: {

				token:      token,
				name:       name,
				email:      email,
				cellphone:  cellphone,
				password:	password

			},
			success:function(resp) {

				if( resp.status == 'ok' ) {

					navigator.notification.alert("Datos Actualizados", null, 'Aviso', 'Aceptar');
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("Status: " + textStatus);
				console.log("Error: " + errorThrown);
			}
		});
	}
}

function agregar_cliente(){

	var name = $("#name").val();
	var email = $("#email").val();
	var cellphone = $("#cellphone").val();
	var password = $("#password").val();
	var password2 = $("#password2").val();

	if(password == ""){
		navigator.notification.alert("Ingrese una contraseña", null, 'Aviso', 'Aceptar');
	}
	else if(password.length > 12 || password.length < 8){
		navigator.notification.alert("La contraseña debe ser mayor 8 y menor a 12 caracteres", null, 'Aviso', 'Aceptar');
	}
	else{

		var token = session.get_token;

		$.ajax({
			url: ruta_generica+"/api/v1/clients/",
			type: 'POST',
			dataType: 'JSON',
			data: {

				token:      token,
				name:       name,
				email:      email,
				cellphone:  cellphone,
				password:	password

			},
			success:function(resp) {

				if( resp.status == 'ok' ) {

					location.href="alta_cliente.html";
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("Status: " + textStatus);
				console.log("Error: " + errorThrown);
			}
		});
	}
}
document.addEventListener("deviceready", gridClientes);