var ruta_generica = "http://autosoft2.avansys.com.mx";
(function () {
    var ConsoleBasedNativeApi = {
        exec: function(bridgeSecret, service, action, callbackId, argsJson) {
            return console.log(argsJson, 'gap:'+JSON.stringify([bridgeSecret, service, action, callbackId]));
        },
        setNativeToJsBridgeMode: function(bridgeSecret, value) {
            console.log(value, 'gap_bridge_mode:' + bridgeSecret);
        },
        retrieveJsMessages: function(bridgeSecret, fromOnlineEvent) {
            return console.log(+fromOnlineEvent, 'gap_poll:' + bridgeSecret);
        }
    };
    window._cordovaNative = ConsoleBasedNativeApi;
})();
function resetPassword(){
  window.open(ruta_generica+"/password/reset",  '_blank');
}

function ingresar() {
    $('#loading').css('display', 'block');

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
                if( resp.status == 'ok' || 1) {
                    localStorage.setItem('session', JSON.stringify({
                        'token' : $("#token").val().trim()
                    }));
                    localStorage.setItem("app_settings", JSON.stringify(resp));
                    localStorage.setItem("network", 'online');
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
