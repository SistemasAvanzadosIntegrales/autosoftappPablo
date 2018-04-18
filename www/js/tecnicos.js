function obtenerTecnicos(take, skip, target = null, search = null){
    session=JSON.parse(localStorage.getItem('session'));
    app_settings = JSON.parse(localStorage.getItem('app_settings'));
    $("#table-clients-users").html("");
    var token = session.token;
    var url = window.location.href;
    params = getParams(url);

    $.ajax({
        url: ruta_generica+"/api/v1/techs",
        type: 'GET',
        dataType: 'JSON',
        data: {
            token: token,
            take: take,
            search:search,
            skip: skip,
            vehicle_id: params.vehicle_id
        },
        success:function(resp) {
                console.log(resp.sql);
		   $("#tecnicos").append(resp.table);
           if (target){
             $(target).parent().parent().remove();
           }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
    });

}

function asignar(vehicle_id, user_id){
    session=JSON.parse(localStorage.getItem('session'));
    app_settings = JSON.parse(localStorage.getItem('app_settings'));
    navigator.notification.confirm(
        'Confirme la asignacion de tecnico!',  // message
        function(result){
            if(result === 1){
                $.ajax({
                   url: ruta_generica+"/api/v1/save_inspections",
                   type: 'POST',
                   dataType: 'JSON',
                   data: {
                       token:      token,
                       vehicle_id: vehicle_id,
                       inspection_id:  null,
                       user_id: user_id,
                       dataForm: [],
                       dataPhoto: []
                   },
                   success:function(resp) {
                       location.href="dashboard.html";
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log("Status: " + textStatus);
                        console.log("Error: " + errorThrown);
                    }
                });
            }else {
                 location.href="dashboard.html";
            }
        },              // callback to invoke with index of button pressed
        'Crear inspeccion',            // title
        'Ok,Cancelar'          // buttonLabels
    );


}
