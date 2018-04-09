/**
 * Autosoft
 * @Author:      Pablo Diaz
 * @Contact:     pablo_diaz@avansys.com.mx
 * @Copyright:   Avansys
 * @date:        24/01/2018
 * @Description: Libreria para app de Autosoft.
 **/
 var session;
 var xhr, token, role, session, data = {};
document.addEventListener("deviceready", function(){
  session=JSON.parse(localStorage.getItem('session'));
  token = session.token;
  role = session.rol;
  gridInspections();
});

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
};
function push(rol){
        var session=JSON.parse(localStorage.getItem('session'));
        var url = window.location.href;
        params = getParams(url);

        $.ajax({
            url: ruta_generica+"/api/v1/send_notification",
            type: 'POST',
            dataType: 'JSON',
            data: {
                tipo:"rol",
                value:rol,
                inspection_id: params.inspection_id,
                token:token,
                mensaje:"Vehículo: "+$("#model").val()+" Placa: "+$("#license_plate").val()
            },
            success:function(resp) {
                if( resp.status == 'ok' ) {
                 $("#alertaLogin").html(resp.message).show();
                    location.href="resultado_inspeccion.html";
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
function guardar(rol){
    var arrPhoto = [];
    var arr=new Array();
    var flag=true;
    $(".severity").each(function(i, item){
      var attr = $(item).attr("class").split(" ");
      if(  $(item).val() == "" ){
         navigator.notification.alert(
            "No ha inspeccionado: "+attr[1].replace(/_/g, " "),  // message
            false,         // callback
            'Aviso',            // title
            'Aceptar'                  // buttonName
        );

        flag=false;
      }

        if(parseInt($(item).val()) == 3 &&  $("#"+ $(item).attr('data-media')).html().trim() == ''){
            navigator.notification.alert("Agrege evidencia para: "+attr[1].replace(/_/g, " "));
            flag=false;
        }

        arr.push($(item).attr("id")+"_"+ $(item).val());
        arrPhoto[parseInt($(item).attr("id").replace(/severity_/g, ""))] = [];

    });
    console.log(arrPhoto);

    $(".media").each(function(i, item){
        console.log(item);
        arrPhoto[$(item).attr('data-inspection-id')].push($(item).attr('data-name'));
    });

    setTimeout(function(){
        console.log(arrPhoto);
    if(!flag)
            return false;
        else
            guarda_todo(arr,arrPhoto,rol);
    },500)

}

function guarda_todo(arr,arrPhoto,rol){
    var url = window.location.href;
    params = getParams(url);
     $.ajax({
        url: ruta_generica+"/api/v1/save_inspections",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token:      token,
            vehicle_id: params.vehicle_id,
            inspection_id: params.inspection_id,
            dataForm: arr,
            dataPhoto: arrPhoto
        },
        success:function(resp) {

            if( resp.status == 'ok' ) {
                navigator.notification.alert(
                    resp.message,  // message
                    function(){
                      location.href="dashboard.html";
                    },         // callback
                    'Aviso',            // title
                    'Aceptar'                  // buttonName
                );
                if(rol!=0)
                    push(rol);
            }
            else {
                navigator.notification.alert(
                    resp.message,  // message
                    false,         // callback
                    'Aviso',            // title
                    'Aceptar'                  // buttonName
                );
                return false;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
            return false;
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
    var pic = $("#"+name[0]+name[1]+"-photo");

    var id = name[1];
    var options = new FileUploadOptions();
    var vehicle = $("#vehicle_id").val();

     options.fileKey = "file";
     options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
     options.mimeType = "image/jpeg";
     var params = new Object();
     params.token= token;
     params.id= id;
     params.vehicle_id =vehicle;
     options.params = params;
     options.chunkedMode = false;
     var headers={'token':token};
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
     pic.append("<img data-inspection-id='"+resp.id+"' class='img-responsive media' data-name='"+resp.message+"' src='"+imageURI+"'/>");
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
    var url = window.location.href;
    params = getParams(url);

    $.ajax({
        url: ruta_generica+"/api/v1/inspections",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token:token,
            vehicle_id: params.vehicle_id,
            inspection_id: params.inspection_id
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
 *  @date     : 29/01/2018
 *  @function : audioCapture
 **/

function errorAudio(error) {
    alert('Error code: ' + error);
};

function successAudio(mediaFiles) {
    mediaFiles = jQuery.parseJSON(mediaFiles);
    audioURI=mediaFiles.full_path;
    var name=pos.split("_");
    var pic = $("#"+name[0]+name[1]+"-photo");
    var id = name[1];

   // pic.append("<img class='img-responsive' src='"+imageURI+"'/>");
    var options = new FileUploadOptions();
    var vehicle = $("#vehicle_id").val();

     options.fileKey = "file";
     options.fileName = audioURI.substr(audioURI.lastIndexOf('/') + 1);
     options.mimeType = "image/jpeg";
     var params = new Object();
     params.token= token;
     params.id= id;
     params.vehicle_id =vehicle;
     options.params = params;
     options.chunkedMode = false;
     var headers={'token':token};
     options.headers = headers;


    var ft = new FileTransfer();
    ft.onprogress = function(progressEvent) {
    if (progressEvent.lengthComputable) {
        loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
    } else {
        loadingStatus.increment();
    }
};
 ft.upload(audioURI, ruta_generica+"/api/v1/upload",
function(result){

     resp=JSON.parse(result.response);
     console.log(resp.message);

     pic.append(" <div class='custom-big-link-grid audio media' data-inspection-id='"+resp.id+"'  data-name='"+resp.message+"'>"+
               "<i class='fa fa-volume-up'></i>"+
               "<audio width='100%' height='100%' controls>"+
               "<source src='"+mediaFiles.full_path+"'>"+
               "</audio>"+
               "</div>");
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
function audioCapture(p) {
    pos=p;
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
