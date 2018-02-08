/**
 * Autosoft
 * @Author:      Pablo Diaz
 * @Contact:     pablo_diaz@avansys.com.mx
 * @Copyright:   Avansys
 * @date:        24/01/2018
 * @Description: Libreria para app de Autosoft.
 **/

var rutaV1 = "http://admin.lealtadprimero.com.mx/servicio/index.php";
var ruta_generica = "http://172.16.0.15:8000";

/**
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 02/02/2018
 *  @function : severo
 **/
function severo(id){
    var severity=id.split("_");
    $("#severity_"+severity[1]).val(severity[0]);
}

/**
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 02/02/2018
 *  @function : guardar
 **/
function guardar(){
    var arr=new Array();
    var arrPhoto=new Array();
    var flag=true;
    $(".severity").each(function(){
        if( $(this).val() == "" ){
            var attr=$(this).attr("class").split(" ");
            alert("No ha inspeccionado: "+attr[1]);
            return false;
            flag=false;
        }                
        arr.push($(this).attr("id")+"_"+$(this).val());
        
    });
    if(!flag)
        return false;
    $(".photo").each(function(){                
        arrPhoto.push($(this).val());
    });
    
    alert(arrPhoto);
    
     var token = session.get_token;
     $.ajax({
        url: ruta_generica+"/api/v1/save_inspections",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token:      token,
            vehicle_id: $("#vehicle_id").val(),
            dataForm: arr, 
            dataPhoto: arrPhoto 
            
        },
        success:function(resp) {
            
            if( resp.status == 'ok' ) { 
                //$("#alertaLogin").html(resp.message).show();
                alert(resp.message);
                $("#guardar").attr("disabled","disabled");                              
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


function cameraFail(message) {
   console.log("Picture failure: " + message);
}

var picturecount=1;
var pos;

function cameraSuccess(imageURI) 
{   
    var name=pos.split("_");   
    var pic = $("#"+name[1]+"-photo");
    pic.append("<img class='img-responsive' src='"+imageURI+"'/>");    
var id = name[0];
var tokens = session.get_token();    
var options = new FileUploadOptions();
var vehicle = $("#vehicle_id").val();    
    
 options.fileKey = "file";
 options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
 options.mimeType = "image/jpeg"; 
 var params = new Object();
 params.token= tokens; 
 params.id= id; 
 params.vehicle_id =vehicle;
 options.params = params;
 options.chunkedMode = false;
 var headers={'token':session.get_token};
 options.headers = headers;

    
var ft = new FileTransfer();
 ft.upload(imageURI, ruta_generica+"/api/v1/upload", 
function(result){ 
     alert(result.message);
     alert(result.response.message);
     pic.append("<input type='hidden' size='10' class='photo' value='"+id+"_"+JSON.stringify(result.message)+"' >");
 }, 
function(error){ 
     alert(JSON.stringify(error));
 },
options);
 
}


/**
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 24/01/2018
 *  @function : gridInspections
 **/
function gridInspections(){
    $("#table-inspections").html("");
    let params =  (new URL(location)).searchParams;
    
    var token = session.get_token;
    $.ajax({
        url: ruta_generica+"/api/v1/inspections",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token:      token,
            vehicle_id: params.get('vehicle_id')
        },
        success:function(resp) {
            
            if( resp.status == 'ok' ) {
                
               $("#table-inspections").append(resp.table);
               $("#model").val(resp.model);
               $("#license_plate").val(resp.license_plate);
               $("#vehicle_id").val(resp.vehicle_id);
                
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
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 25/01/2018
 *  @function : muestra
 **/
function muestra(nombre){
   $('.'+nombre).toggle();
}


/**
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 29/01/2018
 *  @function : audioCapture
 **/

function audioCapture() { 
   var options = {
      limit: 1,
      duration: 30
   };
    alert("captura de audio");
   navigator.device.capture.captureAudio(successAudio, errorAudio, options);

   function successAudio(mediaFiles) {
      var i, path, len;
      for (i = 0, len = mediaFiles.length; i < len; i += 1) {
         path = mediaFiles[i].fullPath;
         console.log(mediaFiles);
      }
   }

   function errorAudio(error) {
      navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
   }
}

/**
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 24/01/2018
 *  @function : captureCamara
 **/
function captureCamara(p){
     pos=p;
     navigator.camera.getPicture(cameraSuccess, cameraFail, { quality: 90, destinationType: Camera.DestinationType.FILE_URI, saveToPhotoAlbum: true }); 
     
}