var ruta_generica = "http://autosoft2.avansys.com.mx";
document.addEventListener("online", function() {

	var app_settings = JSON.parse(localStorage.getItem('app_settings'));
	var url = window.location.href;
	var params = getParams(url);
	var screen =  (new URL(location)).pathname;
	if(params.url){
		location.href = params.url
	}
	screen = screen.split('/');
	screen = screen[screen.length - 1];
	if (app_settings)
	{
	  location.href="dashboard.html";
	}
});
function resetPassword(){
    window.open(ruta_generica+"/password/reset",  '_blank');
}

function ingresar() {
    var email = $('#email').val().trim();
    var password = $('#password').val().trim();
    var token = $('#token').val().trim();

    if( email == '' ) {
        navigator.notification.alert('Debes escribir tu email', null, 'Aviso', 'Aceptar');
    }
    else if( password == '' ) {
        navigator.notification.alert('Debes escribir tu contraseña', null, 'Aviso', 'Aceptar');
    }
    else if( token == '' ) {
        navigator.notification.alert('Debes escribir el token', null, 'Aviso', 'Aceptar');
    }
    else {
        $.ajax({
            url: ruta_generica+"/api/v1/login",
            type: 'POST',
            dataType: 'JSON',
            data: {
                email    : email,
                token    : token,
                password : password,
            },
            success:function(resp) {
                if( resp.status == 'ok') {
                    localStorage.setItem('session', JSON.stringify({'token' : token}));
                    localStorage.setItem("app_settings", JSON.stringify(resp));
                    localStorage.setItem("network", 'online');
                    location.href="dashboard.html";
                }
                else {
                  navigator.notification.alert(resp.message, null, 'Aviso', 'Aceptar');
                }
            }
        });

    }
    return false;
  }
