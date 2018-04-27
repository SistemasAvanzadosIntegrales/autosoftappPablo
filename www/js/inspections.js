

function upload_pdf(){
 $('#pdf').trigger('click');
};

function ver(str)
{
  $('#'+str).toggle();
}
function getInspectionsDetail(){
  $("#table-body").html("");
  ;
  var url = window.location.href;
  params = getParams(url);
  $.ajax({
      url: ruta_generica+"/api/v1/inspections_details",
      type: 'POST',
      dataType: 'JSON',
      data: {
          token: session.token,
          id: params.id
      },
      success:function(resp) {
        if(resp.status === 'ok') {
            $("#table-body").append(resp.table != "" ? resp.table : '<h3 class="text-danger text-center">Sin inspección</h3>');
            $("#model").val(resp.inspection.vehicle.model);
            $("#license_plate").val(resp.inspection.vehicle.license_plate);
            $("#vehicle_id").val(resp.inspection.vehicle.id);
            $("#inspection_id").val(params.id);
            $("#name").val(resp.inspection.vehicle.owner.name);
            $("#email").val(resp.inspection.vehicle.owner.email);
            $("#cell").val(resp.inspection.vehicle.owner.cellphone);
            $("#vin").val(resp.inspection.vehicle.vin);
            $("#brand").val(resp.inspection.vehicle.brand);
            $("#brand").val(resp.inspection.vehicle.brand);
            var next_status = parseInt(resp.inspections.status) + 1;

            var status = ['Cerrado', 'En revision','Verificación','Espera cliente','Respondido','Revisado','Cerrado'];
            permissions();
                   alert('Status actual '+status[resp.inspections.status] + ' es posible actualizar a ' + status[next_status]);
         if($('a.update_inspection_status_'+next_status).length){

          $('a.update_inspection_status_'+next_status).removeClass('hide');
         }
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
              location.href="dashboard.html";
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

        navigator.notification.confirm("Eliminar punto de inspección?", function(result){
            if(result == 2){

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
                    $(target).parent().parent().remove();
                }
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
