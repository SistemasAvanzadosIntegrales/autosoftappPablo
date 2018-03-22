var inspection_id;
var catalogo_id;

function captureVideoInspection(inspection_id_parametro, catalogo_id_parametro){
    inspection_id = inspection_id_parametro;
    catalogo_id = catalogo_id_parametro;
var options = { limit: 1, quality: 1 };
  try{
      navigator.device.capture.captureVideo(captureSuccess, captureError, options);
  }catch(e){
      console.log(e);
  }
}

function captureSuccess(file)
{
session=JSON.parse(localStorage.getItem('session'));
videoURI=file[0].fullPath;
var pic = $("#"+inspection_id+catalogo_id+"-photo");
var id = catalogo_id;

 var tokens = session.get_token;
 var options = new FileUploadOptions();
 var vehicle = $("#vehicle_id").val();

 options.fileKey = "file";
 options.fileName = videoURI.substr(videoURI.lastIndexOf('/') + 1);
 options.mimeType = "video/mp4";
 var params = new Object();
 params.token= session.token;
 params.id= catalogo_id;
 params.vehicle_id =vehicle;
 options.params = params;
 options.chunkedMode = false;
 var headers={'token':session.get_token};
 options.headers = headers;

statusDom = document.querySelector('#status');
var ft = new FileTransfer();
ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                statusDom.innerHTML = perc + "% de video subido"
		} else {
			if(statusDom.innerHTML == "") {
				statusDom.innerHTML = "Loading";
			} else {
				statusDom.innerHTML += ".";
			}
        }
};
 ft.upload(videoURI, ruta_generica+"/api/v1/upload",
function(result){
statusDom.innerHTML = "";
     resp=JSON.parse(result.response);
     pic.append("<video  data-inspection-id='"+resp.id+"' width='100%' class='media' data-name='"+resp.message+"' controls>"+
                "<source src='"+videoURI+"' type='video/mp4''>"+
     		   "</video>");
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

function captureError(error) {
  var msg = "capture error: "+JSON.stringify(error);
  navigator.notification.alert(msg, null, 'Take a video, try again.');
  loadUrl();
}
