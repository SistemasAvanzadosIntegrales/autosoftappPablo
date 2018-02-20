function getBrowser(target, dataDir) {
  dataDir = dataDir || 'temp_chrome_user_data_dir_for_cordova';
  var chromeArgs = ' --user-data-dir=/tmp/' + dataDir + ' --disable-web-security';
}

var r = new Resumable({
    target:ruta_generica+'/api/v1/pdf_upload',
    chunkSize:1*1024*1024,
    simultaneousUploads:4,
    testChunks:false,
    throttleProgressCallbacks:1
});

if(r.support) {
  r.assignBrowse($('.resumable-browse'));
  r.on('fileAdded', function(file){
      r.upload();
  });
  r.on('fileSuccess', function(file,message){
    navigator.notification.alert(
      'El presupuesto se a cargado correctamente!',  // message
      null,         // callback
      'Presupuesto cargado satisfactoriamente.',            // title
      'Aceptar'                  // buttonName
    );
  });
  r.on('fileError', function(file, message){
    navigator.notification.alert(
      'Error, el presupuesto no se a cargado!',  // message
      null,         // callback
      'Error al subir presupuesto',            // title
      'Aceptar'                  // buttonName
    );
  });
}
