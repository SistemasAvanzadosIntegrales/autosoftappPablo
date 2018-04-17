var pdf = $('#pdf');
pdf.change(function(){
  var url = window.location.href;
  params = getParams(url);
  var formData = new FormData(document.getElementById("pdfform"));

  formData.append('file', pdf[0].files[0]);

  $.ajax({
    url : ruta_generica+'/api/v1/upload_price_quote?token=' + session.token + '&inspection_id=' + params.id,
    type : 'POST',
    dataType: 'JSON',
    data : formData,
    processData: false,  // tell jQuery not to process the data
    contentType: false,  // tell jQuery not to set contentType
    success : function(data) {
      navigator.notification.alert(data.message, null, 'Ok');
   },
   error: function(XMLHttpRequest, textStatus, errorThrown) {
     navigator.notification.alert('Pdf cargado correctamente', null, 'Ok');
   }
  });
  pdf.val('');
});
