/**
 * Autosoft
 * @Author:      Pablo Diaz
 * @Contact:     pablo_diaz@avansys.com.mx
 * @Copyright:   Avansys
 * @date:        24/01/2018
 * @Description: Libreria para app de Autosoft.
 **/
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
 console.log(navigator.device.audiorecorder.recordAudio);
}

/**
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 02/02/2018
 *  @function : severo
 **/
function severo(severity ,botton){
  botton = $(botton);
  botton.parent().find('input[type="hidden"]').val(severity);
  botton.parent().find('a').removeClass("btn-success btn-warning btn-danger btn-info");
  botton.addClass(botton.attr('data-class'));
}

function push(rol){
    $.ajax({
        url: ruta_generica+"/api/v1/send_notification",
        type: 'POST',
        dataType: 'JSON',
        data: {
            tipo:"rol",
            value:rol,
            mensaje:"Vehículo: "+$("#model").val()+" Placa: "+$("#license_plate").val()
        },
        success:function(resp) {
            if( resp.status == 'ok' ) {
             $("#alertaLogin").html(resp.message).show();
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
 *  @date     : 02/02/2018
 *  @function : guardar
 **/
function guardar(){
    var arr=new Array();
    var flag=true;
    $(".severity").each(function(){
        if( $(this).val() == "" ){
            var attr=$(this).attr("class").split(" ");
             navigator.notification.alert(
                "No ha inspeccionado: "+attr[1],  // message
                false,         // callback
                'Aviso',            // title
                'Aceptar'                  // buttonName
            );

            flag=false;
            return false;
        }
        if( $(this).val() == "3" ){
                if($(".p"+attr[1]).html()=""){
                    alert("Agrege evidencia para: "+attr[1]);
                    flag=false;
                    return false;
                }
            }
        arr.push($(this).attr("id")+"_"+$(this).val());

    });
    var arrPhoto=new Array();
    $(".photo").each(function(){
        arrPhoto.push($(this).val());
    });
    if(!flag)
        return false;
    else
        guarda_todo(arr,arrPhoto);
}

function guarda_todo(arr,arrPhoto){
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
                navigator.notification.alert(
                    resp.message,  // message
                    false,         // callback
                    'Aviso',            // title
                    'Aceptar'                  // buttonName
                );
            }
            else {
                navigator.notification.alert(
                    resp.message,  // message
                    false,         // callback
                    'Aviso',            // title
                    'Aceptar'                  // buttonName
                );
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
var catalogue_id;

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
    ft.onprogress = function(progressEvent) {
    if (progressEvent.lengthComputable) {
        loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
    } else {
        loadingStatus.increment();
    }
};
 ft.upload(imageURI, ruta_generica+"/api/v1/upload",
function(result){

     resp=JSON.parse(result.response);
     pic.append("<input type='hidden' size='10' class='photo' value='"+id+"_"+resp.message+"' >");
 },
function(error){
     navigator.notification.alert(
        JSON.stringify(error),  // message
        false,         // callback
        'Aviso',            // title
        'Aceptar'                  // buttonName
    );
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

function errorAudio(error) {
    alert('Error code: ' + error);
};

function successAudio(mediaFiles) {
    mediaFiles = jQuery.parseJSON(mediaFiles);
    alert(mediaFiles.full_path);
    var name=pos;
    var pic = $("#"+pos+catalogue_id+"-photo");
    pic.append(" <div class='custom-big-link-grid audio'>"+
	           "<i class='fas fa-volume-up'></i>"+
	           "<audio width='100%' height='100%' controls>"+
	           "<source src='"+mediaFiles.full_path+">"+
	           "</audio>"+
	           "</div>");   
    var id = pos;
   // pic.append("<img class='img-responsive' src='"+imageURI+"'/>");   
    var tokens = session.get_token();
    var options = new FileUploadOptions();
    var vehicle = $("#vehicle_id").val();
/*
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
    ft.onprogress = function(progressEvent) {
    if (progressEvent.lengthComputable) {
        loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
    } else {
        loadingStatus.increment();
    }
};
 ft.upload(imageURI, ruta_generica+"/api/v1/upload",
function(result){

     resp=JSON.parse(result.response);
     pic.append("<input type='hidden' size='10' class='photo' value='"+id+"_"+resp.message+"' >");
 },
function(error){
     navigator.notification.alert(
        JSON.stringify(error),  // message
        false,         // callback
        'Aviso',            // title
        'Aceptar'                  // buttonName
    );
 },
options);*/

}
function audioCapture(id,catalogue_id) {
    pos=id;
    catalogue_id=catalogue_id;

     try{
      navigator.device.audiorecorder.recordAudio(successAudio, errorAudio);
  }catch(e){
      alert(e);
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
