/**
 *  @author Ivan Vazquez
 **/
 var xhr, token, user_id, session, data = {};
 document.addEventListener("deviceready", function(){
   session=JSON.parse(localStorage.getItem('session'));
   app_settings=JSON.parse(localStorage.getItem('app_settings'));
   if(!session){
     return location.href = "index.html";
   }
   token = session.token;
   user_id = app_settings.user.id;
 });

function upload_pdf(){
 $('#pdf').trigger('click');
};

function ver(str)
{
  $('#'+str).toggle();
}
function getInspectionsDetail(){
  $("#table-body").html("");session.token;
  var url = window.location.href;
  params = getParams(url);
  $.ajax({
      url: ruta_generica+"/api/v1/inspections_details",
      type: 'POST',
      dataType: 'JSON',
      data: {
          token: token,
          id: params.id
      },
      success:function(resp) {
        if(resp.status === 'ok') {
            $("#table-body").append(resp.table ? resp.table : '<h3 class="text-danger text-center">Ningun punto inspeccionado</h3>');
            $("#model").val(resp.inspection.vehicle.model);
            $("#license_plate").val(resp.inspection.vehicle.license_plate);
            $("#vehicle_id").val(resp.inspection.vehicle.id);
            $("#inspection_id").val(params.id);
            $("#name").val(resp.inspection.vehicle.owner.name);
            $("#email").val(resp.inspection.vehicle.owner.email);
            $("#cell").val(resp.inspection.vehicle.owner.cellphone);
            $("#vin").val(resp.inspection.vehicle.vin);
            $("#brand").val(resp.inspection.vehicle.brand);
            permissions();
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Status: " + textStatus);
          console.log("Error: " + errorThrown);
      }
  });
};


function update_inspection(field, value){
  $.ajax({
      url: ruta_generica+"/api/v1/inspection_update",
      type: 'POST',
      dataType: 'JSON',
      data: {
          token: token,
          field: field,
          value: value,
          id: $('#inspection_id').val()
      },
      success:function(resp) {
          if(resp.status === 'ok') {
            navigator.notification.alert('Transaction succesfuly', function(){
              location.href="dashboard.html";
            });
        }
          else {
            navigator.notification.alert(resp.message);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Status: " + textStatus);
          console.log("Error: " + errorThrown);
      }
  });
}

function update(id, field, value, target=null){
    if (field === "status" && value === 0)
    {

        navigator.notification.confirm("Eliminar punto de inspeccion?", function(result){
            if(result === 1){

                set_update(id, field, value, target);
             }
        },
        'Confirmar', ["Cancelar","Aceptar"]);
    }
    else
    {
        set_update(id, field, value, target)
    }
}

function set_update(id, field, value, target=null){

    $.ajax({
        url: ruta_generica+"/api/v1/inspection_point_update",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token: token,
            field: field,
            value: value,
            id: id
        },
        success:function(resp) {
            if(resp.status === 'ok') {
                if (target && field === "status" && value === 0) {
                    console.log($(target));
                    $(target).parent().parent().remove();
                }
              navigator.notification.alert('Transaction succesfuly');
          }
            else {
              navigator.notification.alert(resp.message);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
    });
}


function getInspectionsList(take, skip, target = null, search = null)
{
  $.ajax({
      url: ruta_generica+"/api/v1/inspections_list",
      type: 'POST',
      dataType: 'JSON',
      data: {
          token: token,
          take: take,
          skip: skip,
          search: search,
          user_id: user_id
      },
      success:function(resp) {
          if(resp.status === 'ok') {
              if (target){
                $(target).parent().parent().hide();
              }
              $("#table-body").append(resp.table);

              permissions();
        }
          else {
            navigator.notification.alert(resp.message);
          }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Status: " + textStatus);
          console.log("Error: " + errorThrown);
      }
  });
}
