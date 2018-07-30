var ruta_generica = "http://autosoft2.avansys.com.mx";

function resetPassword(){
    window.open(ruta_generica+"/password/reset",  '_blank');
}
/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};
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
