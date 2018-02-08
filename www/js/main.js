/**
 * Autosoft
 * @Author:      Roberto Ramirez
 * @Contact:     roberto_ramirez@avansys.com.mx
 * @Copyright:   Avansys
 * @date:        09/01/2018
 * @Description: Libreria para app de Autosoft.
 **/

var rutaV1 = "http://admin.lealtadprimero.com.mx/servicio/index.php";
var ruta_generica = "http://172.16.0.15:8000"; 

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

