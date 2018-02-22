/*
 * Local storage
 *
 * Libreria equivalente almacenamiento en sesion
 *
 * @access    public
 * @author    Avansys
 * @copyright Avansys
 *
 */
var session = {};

/**
 * login
 *
 * Inicia la variable session en localStorage con las variables de sesion
 * @access    public
 * @author    Avansys
 */
session.login = function(token,rol,id_cliente) {
    try {
        localStorage.setItem('session', JSON.stringify({
            'token' : token,
            'rol' : rol,
            'id_cliente' : id_cliente
        }));
    }
    catch(error) {
        //alert(error.message);
        return false;
    }
}

/**
 * isLogged
 *
 * Verifica si se inicio sesion
 * @access    public
 * @author    Avansys
 */
session.isLogged = function() {
    if( localStorage.getItem('session') != null ) {
        return true;
    }
    else {
        return false;
    }
};


/* get_token
 *
 * Extrae el identificador de la base de datos
 * @access    public
 * @author    Avansys
 */
session.get_token = function() {
    var session=JSON.parse(localStorage.getItem('session'));
    return session.token;
};



/* get_rol
 *
 * Extrae el identificador de la base de datos
 * @access    public
 * @author    Avansys
 */
session.get_rol = function() {
    var session=JSON.parse(localStorage.getItem('session'));
    return session.rol;
};

/* get_id_cliente
 *
 * Extrae el identificador de la base de datos
 * @access    public
 * @author    Avansys
 */
session.get_id_cliente = function() {
    var session=JSON.parse(localStorage.getItem('session'));
    return session.id_cliente;
};
