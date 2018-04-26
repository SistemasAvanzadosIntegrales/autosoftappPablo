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
            var next_status = parseInt(resp.inspections.status) + 1;

            var status = ['Cerrado', 'En revision','Verificación','Espera cliente','Respondido','Revisado','Cerrado'];
            permissions();
                ///   alert('Status actual '+status[resp.inspections.status] + ' es posible actualizar a ' + status[next_status]);
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
    if (localStorage.getItem("network") == 'online' ){
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
            success:function(data) {
                if(data.status === 'ok')
                    buildSDashboardTable(data, skip, take);
                else
                    navigator.notification.alert(resp.message);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    }
    else {

    }

    var db;
    if (device.platform == "browser")
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    else
        db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default', androidDatabaseImplementation: 2});

    db.transaction(function(tx) {
        tx.executeSql(" SELECT * FROM inspections AS i INNER JOIN vehicles AS v ON v.id = i.vehicle_id ", [], function (tx, results) {
            debug(results, true);
            //buildSDashboardTable(data);
        });
    });

    db.transaction(function(tx) {
        tx.executeSql(" SELECT v.brand FROM inspections AS i LEFT JOIN vehicles AS v ON v.id = i.vehicle_id ", [], function (tx, results) {
            debug(results, true);
            //buildSDashboardTable(data);
        });
    });

    db.transaction(function(tx) {
        tx.executeSql(" SELECT * FROM inspections AS i JOIN vehicles AS v ON v.id = i.vehicle_id ", [], function (tx, results) {
            debug(results, true);
            //buildSDashboardTable(data);
        });
    });

    db.transaction(function(tx) {
        tx.executeSql(" SELECT * FROM inspections ", [], function (tx, results) {
            debug(results, true);
            //buildSDashboardTable(data);
        });
    });

    db.transaction(function(tx) {
        tx.executeSql(" SELECT * FROM vehicles ", [], function (tx, results) {
            console.log(results);
            //buildSDashboardTable(data);
        });
    });

}


function buildSDashboardTable(data, skip, take)
{
    for(i in data.inspections){
      var clone = $('#table-body #clone').clone();
      clone.attr('id', 'clone'+i);
      clone.find(".fill-data").each(function(x, item){
          field = $(item).attr('data-field').split('.');
          if(field)
          {
              $(item).append(data.inspections[i][field]);
          }
      });
      clone.removeClass('hide');

      $('#table-body').append(clone);
      $('#show_more').unbind('click');
      $('#show_more').parent().parent().removeClass('hide');
      if(skip + take < data.count_rows){
          $('#show_more').click(function(){
              getInspectionsList(take, skip + take, search)
          });
      }
      else {
          $('#show_more').parent().parent().addClass('hide');
      }
      getInspectionsListClones.push("<tr>" + clone.html() + "</tr>");
    }
    permissions();
}
