var ruta_generica = "http://autosoft2.avansys.com.mx";

function resetPassword(){
  window.open(ruta_generica+"/password/reset",  '_blank');
}


function ingresar() {

    if( $("#email" ).val().trim() == '' ) {
        navigator.notification.alert('Debes escribir tu email', null, 'Aviso', 'Aceptar');
    }
    else if( $("#password").val().trim() == '' ) {
        navigator.notification.alert('Debes escribir tu contraseña', null, 'Aviso', 'Aceptar');
    }
    else if( $("#token").val().trim() == '' ) {
        navigator.notification.alert('Debes escribir el token', null, 'Aviso', 'Aceptar');
    }
    else {
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
                    session.login($("#token").val().trim(),resp.rol,resp.user.id);
                    localStorage.setItem("app_settings", JSON.stringify(resp));
                    location.href="dashboard.html";
                }
                else {
                  navigator.notification.alert(resp.message, null, 'Aviso', 'Aceptar');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                jsonValue = jQuery.parseJSON( XMLHttpRequest.responseText);
                navigator.notification.alert(jsonValue.message, null, 'Aviso', 'Aceptar');
            }
        });

    }
    return false;
  }
