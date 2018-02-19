/**
 *  @author Ivan Vazquez
 **/

var xhr, token, role, session, data = {};
document.addEventListener("deviceready", function(){
  session=JSON.parse(localStorage.getItem('session'));
  token = session.token;
  role = session.rol == 'admin' ? 'admin' : 'user';
});

function xhrError(XMLHttpRequest, textStatus, errorThrown) {
  navigator.notification.alert(
    textStatus,  // message
    function(){
      location.href="dashboard.html";
    },         // callback
    errorThrown,            // title
    'Done'                  // buttonName
  );
}

function getInspectionsDetail(){
  $("#table-body").html("");
  let params =  (new URL(location)).searchParams;

  xhr = new XMLHttpRequest();
  xhr.open('POST', ruta_generica+"/api/v1/inspections_details");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send('token=' + token +'&role='+role + '&id=' + params.get('id'));
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      var resp = JSON.parse(this.responseText);
      if (this.status === 200 && resp.status === 'ok') {
          console.log(resp);
          $("#table-body").append(resp.table ? resp.table : '<h3 class="text-danger text-center">Ningun punto inspeccionado</h3>');
          $("#model").val(resp.inspection.vehicle.model);
          $("#license_plate").val(resp.inspection.vehicle.license_plate);
          $("#vehicle_id").val(resp.inspection.vehicle.id);
          $("#inspection_id").val( params.get('id'));
          $("#name").val(resp.inspection.vehicle.owner.name);
          $("#email").val(resp.inspection.vehicle.owner.email);
          $("#cell").val(resp.inspection.vehicle.owner.cellphone);
          $("#vin").val(resp.inspection.vehicle.vin);
          $("#brand").val(resp.inspection.vehicle.brand);
          $('.'+role).removeClass('hide');
      }

    }
  }
};


function update_inspection(field, value){
  xhr = new XMLHttpRequest();
  xhr.open('POST', ruta_generica+"/api/v1/inspection_update");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send('token=' + token +'&role='+role + '&field=' + field +'&value='+value +'&id=' + $('#inspection_id').val());

  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      var resp = JSON.parse(this.responseText);
        if (xhr.status === 200 && resp.status === 'ok') {
          navigator.notification.alert('Transaction succesfuly')
      }
      else {
        navigator.notification.alert(resp.message);
      }
    }
  }
}

function update(id, field, value){
  xhr = new XMLHttpRequest();
  xhr.open('POST', ruta_generica+"/api/v1/inspection_point_update");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send('token=' + token +'&role='+role + '&field=' + field +'&value='+value +'&id=' + id);
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      var resp = JSON.parse(this.responseText);
        if (this.status === 200 && resp.status === 'ok') {
          navigator.notification.alert('Transaction succesfuly')
      }
      else {
        navigator.notification.alert(resp.message);
      }
    }
  }
}

function getInspectionsList()
{
  $('.'+role).removeClass('hide');
  $("#table-body").html("");

  xhr = new XMLHttpRequest();
  xhr.open('POST', ruta_generica+"/api/v1/inspections_list");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send('token=' + token +'&role='+role);

  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      var resp = JSON.parse(xhr.responseText);
        if (this.status === 200 && resp.status === 'ok') {
         $("#table-body").append(resp.table);
         $('.'+role).removeClass('hide');
         var myFilter = Filter;
         myFilter.constructor($('#search'), $('#word'),$('#inspections'));
      }
      else {
          $("#alertaLogin").html(resp.message).show();
      }
    }
  }

}
