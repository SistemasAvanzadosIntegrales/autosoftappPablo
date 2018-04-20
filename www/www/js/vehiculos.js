






function detalle_vehiculo(id){
	localStorage.setItem("id_vehiculo", id);
	location.href = "alta_vehiculo.html";
}







function obtener_datos_vehiculo(){

	var id = localStorage.getItem('id_vehiculo');

	obtener_datos_cliente();

	if(id != null){
		var token = session.get_token;

		$.ajax({
			url: ruta_generica+"/api/v1/vehicles/"+id,
			type: 'GET',
			dataType: 'JSON',
			data: {
				token:  token,
				id_user:  session.get_id_cliente
			},
			success:function(resp) {

				if( resp.status == 'ok' ) {
					$("#brand").val(resp.vehicle[0]['brand']);
					$("#vin").val(resp.vehicle[0]['vin']);
					$("#model").val(resp.vehicle[0]['model']);
					$("#license_plate").val(resp.vehicle[0]['license_plate']);

					localStorage.setItem("id_vehiculo", id);
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
}







function accion_vehiculo(){

	var brand = $("#brand").val();
	var vin = $("#vin").val();
	var model = $("#model").val();
	var license_plate = $("#license_plate").val();

	if(brand == "" || vin == "" || model == "" || license_plate == "" )
		navigator.notification.alert("Campos vacíos", null, 'Aviso', 'Aceptar');

	else if(localStorage.getItem('id_vehiculo') == null)
		agregar_vehiculo();

	else editar_vehiculo();
}







function agregar_vehiculo(){

	var token = session.get_token;
	var user_id = localStorage.getItem('id_cliente');
	var brand = $("#brand").val();
	var vin = $("#vin").val();
	var model = $("#model").val();
	var license_plate = $("#license_plate").val();

	$.ajax({
		url: ruta_generica+"/api/v1/vehicles",
		type: 'POST',
		dataType: 'JSON',
		data: {
			token:  token,
			brand:  brand,
			vin:  vin,
			model:  model,
			license_plate:  license_plate,
			user_id : user_id
		},
		success:function(resp) {

			if( resp.status == 'ok' ) {
				location.href="alta_vehiculo.html";
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







function editar_vehiculo(){
	var token = session.get_token;
	var id = localStorage.getItem('id_vehiculo');
	var brand = $("#brand").val();
	var vin = $("#vin").val();
	var model = $("#model").val();
	var license_plate = $("#license_plate").val();

	$.ajax({
		url: ruta_generica+"/api/v1/vehicles/"+id,
		type: 'PUT',
		dataType: 'JSON',
		data: {
			token:  token,
			brand:  brand,
			vin:  vin,
			model:  model,
			license_plate:  license_plate
		},
		success:function(resp) {

			if( resp.status == 'ok' ) {
				location.href="alta_vehiculo.html";
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







function eliminar_vehiculo(id){
	var token = session.get_token;

    $.ajax({
        url: ruta_generica+"/api/v1/vehicles/delete",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token:  token,
            id:    	id
        },
        success:function(resp) {

            if( resp.status == 'ok' ) {
				location.href="alta_cliente.html";
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
