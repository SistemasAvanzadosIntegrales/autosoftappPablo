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
       alert("jaaaaa");
        if(resp.status === 'ok') {
            $("#table-body").append(resp.table != "" ? resp.table : '<h3 class="text-danger text-center">Ningun punto inspeccionado</h3>');
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
            var next_status = parseInt(resp.inspection.status) + 1;


            permissions();
                   alert('a.update_inspection_status_'+next_status);
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

        navigator.notification.confirm("Eliminar punto de inspeccion?", function(result){
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
                    console.log($(target));
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

var getInspectionsListClones = [];

function getInspectionsList(take, skip, search = null)
{
  if (localStorage.getItem("network") == 'online' || true ){
      if (skip === 0){
           localStorage.setItem("InspectionsList", JSON.stringify([]));
      }
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

                  for(i in resp.inspections){
                    var clone = $('#table-body #clone').clone();
                    clone.attr('id', 'clone'+i);
                    clone.find(".fill-data").each(function(x, item){
                        field = $(item).attr('data-field').split('.');
                        if(field)
                        {
                            $(item).append(resp.inspections[i][field]);
                        }
                    });
                    clone.removeClass('hide');

                    $('#table-body').append(clone);
                    $('#show_more').unbind('click');
                    if($('#table-body tr:not(.hide)').length < resp.count_rows){
                        $('#show_more').click(function(){
                            getInspectionsList(take, skip + take, search)
                        });
                    }else {
                        $('#show_more').parent().parent().addClass('hide');
                    }
                    getInspectionsListClones.push("<tr>" + clone.html() + "</tr>");
                  }
                  setTimeout(function(){
                      localStorage.setItem("InspectionsList", JSON.stringify(getInspectionsListClones));
                      console.log(getInspectionsListClones);
                  }, 100);
                  $("#table-body").append(resp.table);
                  permissions();
            }
              else {
                navigator.notification.alert(resp.message);
              }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {

          }
      });
  }else {
       $("#table-body").append(JSON.parse(localStorage.getItem("InspectionsList")));
  }
}
