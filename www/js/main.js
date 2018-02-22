/**
 * Autosoft
 * @Author:      Roberto Ramirez
 * @Contact:     roberto_ramirez@avansys.com.mx
 * @Copyright:   Avansys
 * @date:        09/01/2018
 * @Description: Libreria para app de Autosoft.
 **/

var rutaV1 = "http://admin.lealtadprimero.com.mx/servicio/index.php";
//var ruta_generica = "http://localhost:8000";
var ruta_generica = "http://172.16.1.30:8000"; 

/**
 *  @author   : Roberto Ramirez
 *  @Contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 09/01/2018
 *  @function : ingresar
 **/
function ingresar() {
    
    if( $("#email" ).val().trim() == '' ) {
        $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes escribir tu email').show();
    }
    else if( $("#password").val().trim() == '' ) {
        $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes escribir tu contraseña').show();
    }
    else if( $("#token").val().trim() == '' ) {
        $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes escribir el token').show();
    }
    else {
        
        $("#alertaLogin").html("").hide();
        
        $.ajax({
            url: ruta_generica+"/api/v1/login",
            type: 'POST',
            dataType: 'JSON',
            data: {
                email       : $("#email" ).val(),               
                password    : $("#password").val().trim(),
                token       : $("#token").val().trim(),
            },
            success:function(resp) {
                
                if( resp.status == 'ok' ) {                    
                    session.login($("#token").val().trim(),resp.rol,resp.conf.id);             
                    location.href="tecnico.html";      
                   //  location.href="cliente_detalle.html";
                }
                else {
                    $("#alertaLogin").html(resp.message).show();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("Status: " + textStatus); 
                console.log("Error: " + errorThrown); 
                jsonValue = jQuery.parseJSON( XMLHttpRequest.responseText);
                
                console.log("message: " +jsonValue.message);
                $("#alertaLogin").html(jsonValue.message).show();
            }
        });
        
    }
}


/**
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 16/01/2018
 *  @function : resetPassword
 **/
function resetPassword(){
   
    window.open(ruta_generica+"/password/reset",  '_blank');
}

/**
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 16/01/2018
 *  @function : gridClientes
 **/
function gridClientes(){    
		
    $("#table-clients").html("");
    var token = session.get_token;
	
    $.ajax({
        url: ruta_generica+"/api/v1/clients",
        type: 'POST',
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
                $("#alertaLogin").html(resp.message).show();
            }
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });        
}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 02/02/2018
 *  @function : obtenerclients
 **/
function obtenerclients(){ 

    $("#table-clients-users").html("");
    var token = session.get_token;
	
    $.ajax({
        url: ruta_generica+"/api/v1/clients",
        type: 'GET',
        dataType: 'JSON',
        data: {
            token:      token,
            cliente:    $("#cliente").val().trim()			    
        },
        success:function(resp) {
            
            if( resp.status == 'ok' ) {
			   $("#table-clients-users").append(resp.user);
				localStorage.removeItem("id_cliente");
            }
            else {		
                $("#alertaCliente").html(resp.message).show();
            }
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });   
	
}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 02/02/2018
 *  @function : delete_cliente
 **/
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
                $("#alertaCliente").html(resp.message).show();
            }
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });  
}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 02/02/2018
 *  @function : detalle_cliente
 *  @description: guarda el id del cliente del cual se esta viendo el perfil.
 **/
function detalle_cliente(id){	
	localStorage.setItem("id_cliente", id);
	location.href = "alta_cliente.html";
}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 03/02/2018
 *  @function : obtener_datos_cliente
 *  @description: obtiene los datos del cliente que se selecciono, para edición o ver cliente.
 **/
function obtener_datos_cliente(){ 
	
	var id = localStorage.getItem('id_cliente');	
	
	if(id != null){
		var token = session.get_token;

		$.ajax({
			url: ruta_generica+"/api/v1/clients/"+id,
			type: 'GET',
			dataType: 'JSON',
			data: {
				token:  token 
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

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 08/02/2018
 *  @function : accion_cliente
 *  @description: edita o agrega un cliente.
 **/
function accion_cliente(){ // Obtener clientes marca error al obtener el token.
	
	emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
	
	var name = $("#name").val();
	var email = $("#email").val();
	var cellphone = $("#cellphone").val();
	var password = $("#password").val();
	var password2 = $("#password2").val();
	
	if(password != password2) 
		$("#alertaCliente").html("Las contraseñas no coinciden").show();
	
	else if(name == "" || email == "" || cellphone == "") 
		$("#alertaCliente").html("Campos Vacíos").show();
	
	else if(!emailRegex.test(email))
		$("#alertaCliente").html("Correo invalido").show();
		
	else if(localStorage.getItem('id_cliente') == null) 
		agregar_cliente();
	
	else 
		editar_cliente();
	
}


/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 08/02/2018
 *  @function : editar_cliente 
 **/
function editar_cliente(){
	
	var name = $("#name").val();
	var email = $("#email").val();
	var cellphone = $("#cellphone").val();
	var password = $("#password").val();	
	
	alert("editar cliente");
	var id = localStorage.getItem('id_cliente');

	var token = session.get_token;
	
	if(password != "" && (password.length > 12 || password.length < 8)){
		$("#alertaCliente").html("La contraseña debe ser mayor 8 y menor a 12 caracteres").show();
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

					$("#alertaCliente").html("Datos Actualizados").show();
				}
			}, 
			error: function(XMLHttpRequest, textStatus, errorThrown) { 				
				console.log("Status: " + textStatus); 
				console.log("Error: " + errorThrown); 
			}
		}); 
	}	 
}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 08/02/2018
 *  @function : agregar_cliente 
 **/
function agregar_cliente(){
	
	var name = $("#name").val();
	var email = $("#email").val();
	var cellphone = $("#cellphone").val();
	var password = $("#password").val();
	var password2 = $("#password2").val();
	
	if(password == ""){
		$("#alertaCliente").html("Ingrese una contraseña").show();
	}
	else if(password.length > 12 || password.length < 8){
		$("#alertaCliente").html("La contraseña debe ser mayor 8 y menor a 12 caracteres").show();
	}
	else{
		alert("agregar cliente");
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

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 08/02/2018
 *  @function : detalle_vehiculo 
 **/
function detalle_vehiculo(id){	
	localStorage.setItem("id_vehiculo", id);
	location.href = "alta_vehiculo.html";
}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 08/02/2018
 *  @function : alta_vehiculo 
 **/
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
				token:  token				
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
					$("#alertaCliente").html(resp.message).show();
				}
			}, 
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				console.log("Status: " + textStatus); 
				console.log("Error: " + errorThrown); 
			}
		});
	}
}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 08/02/2018
 *  @function : agregar_vehiculo 
 **/
function accion_vehiculo(){
	
	var brand = $("#brand").val();
	var vin = $("#vin").val();
	var model = $("#model").val();
	var license_plate = $("#license_plate").val();
	
	if(brand == "" || vin == "" || model == "" || license_plate == "" )		
		$("#alerta").html("Campos vacíos").show();
	
	else if(localStorage.getItem('id_vehiculo') == null)
		agregar_vehiculo();
	
	else editar_vehiculo();
}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 08/02/2018
 *  @function : agregar_vehiculo 
 **/
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
				$("#alertaCliente").html(resp.message).show();
			}
		}, 
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			console.log("Status: " + textStatus); 
			console.log("Error: " + errorThrown); 
		}
	}); 

}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 08/02/2018
 *  @function : editar_vehiculo 
 **/
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
				$("#alertaCliente").html(resp.message).show();
			}
		}, 
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			console.log("Status: " + textStatus); 
			console.log("Error: " + errorThrown); 
		}
	}); 
}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 08/02/2018
 *  @function : eliminar_vehiculo 
 **/
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
                $("#alertaCliente").html(resp.message).show();
            }
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    }); 
}

