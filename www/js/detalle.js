/**
 * Autosoft
 * @Author:      Pablo Diaz
 * @Contact:     pablo_diaz@avansys.com.mx
 * @Copyright:   Avansys
 * @date:        12/01/2018
 * @Description: Libreria para app de Autosoft.
 **/

var rutaV1 = "http://admin.lealtadprimero.com.mx/servicio/index.php";
//var ruta_generica = "http://localhost:8000";
var ruta_generica = "http://172.16.1.20:8000"; 


/**
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 12/02/2018
 *  @function : gridDetalleInspeccion
 **/
function gridDetalleInspeccion(){    
		
    $("#table-clients-users").html("");
    var token = session.get_token;
    var inspections_id=2;
	
   /* $.ajax({
        url: ruta_generica+"/api/v1/detail_inspection",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token:      token,
            inspections_id:    inspections_id
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
    });   */     
}



