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
                debug(resp, true);
                var resp = JSON.parse(resp);
                debug(resp.status, 1);
                if( resp.status == 'ok' || 1) {
                    localStorage.setItem("app_settings", JSON.stringify(resp));
                    localStorage.setItem("network", 'online');
                    sync_get_data();
    //                location.href="dashboard.html";
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
