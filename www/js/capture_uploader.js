function getBrowser(target, dataDir) {
  dataDir = dataDir || 'temp_chrome_user_data_dir_for_cordova';
  var chromeArgs = ' --user-data-dir=/tmp/' + dataDir + ' --disable-web-security';
}

var r = new Resumable({
    target:ruta_generica+'/api/v1/video_upload',
    chunkSize:1*1024*1024,
    simultaneousUploads:4,
    testChunks:false,
    throttleProgressCallbacks:1
});

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
videoURI=file[0].fullPath;
var pic = $("#"+inspection_id+catalogo_id+"-photo");    
var id = catalogue_id;        
pic.append("<video width='100%' controls>"+
           "<source src='"+videoURI+"' type='video/mp4''>"+
		   "</video>");
 var tokens = session.get_token();
 var options = new FileUploadOptions();
 var vehicle = $("#vehicle_id").val();

 options.fileKey = "file";
 options.fileName = videoURI.substr(videoURI.lastIndexOf('/') + 1);
 options.mimeType = "video/mp4";
 var params = new Object();
 params.token= tokens;
 params.id= catalogo_id;
 params.vehicle_id =vehicle;
 options.params = params;
 options.chunkedMode = false;
 var headers={'token':session.get_token()};
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
     pic.append("<input type='hidden' size='10' class='photo' value='"+id+"-"+resp.message+"' >");
 },
function(error){
     alert(result.response);
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


