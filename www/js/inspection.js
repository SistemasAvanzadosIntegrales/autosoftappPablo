var inspection = {
    id: null,
    files:[],
    vehicle: null,
    client: null,
    inspection: null,
    severities: [
        {class:"hide", icon: ''},
        {class:"btn-success", icon: '<i class="fa fa-check"> </i>'},
        {class:"btn-warning", icon: '<i class="fa fa-exclamation"> </i>'},
        {class:"btn-danger" , icon: '<i class="fa fa-times"> </i>'},
        {class:"btn-primary", icon: '<i class="fa fa-ban"> </i>'}
    ],
    vehicle_inspections: null,
    categories: null,
    points: null,
    db: null,
    start: function(id){
        var self = this;
        self.id = parseInt(id);
        self.db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        self.fill_data(function(){
            self.ui(function(){
                self.rules(function(){
                    self.add_events();
                });
            });
        });
    },
    fill_data: function(call_back_function = null){
        var self = this;
        self.db.transaction(function(tx) {
            tx.executeSql("select * from inspections where id = ? ", [self.id], function (tx, inspections){
                self.inspection = inspections.rows.item(0);
                tx.executeSql("select * from vehicles where id = ? ", [self.inspection.vehicle_id], function(tx, vehicles){
                    self.vehicle = vehicles.rows.item(0);
                    tx.executeSql("select * from clients where id = ? ", [self.vehicle.user_id], function(tx, clients){
                        self.client = clients.rows.item(0);
                        tx.executeSql("select * from catalogue group by category_name ", [], function(tx, categories){
                            self.categories = categories.rows;
                            tx.executeSql("select * from catalogue AS c LEFT JOIN vehicle_inspections AS vi ON c.id = vi.point_id WHERE vi.inspection_id = ? AND vi.status != '0' order by c.category_name", [self.id], function(tx, points){
                                self.points = points.rows;
                                if (call_back_function){
                                    call_back_function.call();
                                }
                            });
                        });
                    });
                });
            });
        });
    },
    ui: function(call_back_function = null){
        var self = this;

        $("#model").val(self.vehicle.model);
        $("#license_plate").val(self.vehicle.license_plate);
        $("#vehicle_id").val(self.vehicle.id);
        $("#inspection_id").val(self.id);
        $("#name").val(self.client.name);
        $("#email").val(self.client.email);
        $("#cell").val(self.client.cellphone);
        $("#vin").val(self.vehicle.vin);
        $("#brand").val(self.vehicle.brand);
        if (self.inspection.presupuesto != ''){
            self.presupuesto_navbar(self.inspection.presupuesto);
        }
        var accordion = $('#accordion');
        var z = 0;
        for(var f = 0; f < self.categories.length; f++){
            if (!self.categories[f].category_name){
                return;
            }
            var clone = $("#clone").clone();
            var category_name = clone.find('.category_name');
            var presupuesto = $('#presupuesto');
            var pivot = self.categories[f].category_name.replace(/[^a-zA-Z0-9]+/g,'');
            category_name.html(self.categories[f].category_name);
            category_name.attr('href', '#'+pivot);
            category_name.attr('aria-controls', pivot);
            clone.find('.panel-collapse').attr('id', pivot);

            var clone_success = true;

            if(localStorage.getItem("network") == 'offline'){
                $('.online-required').attr('disabled', true).addClass('disabled');
            }
            while(self.points[z] && (self.categories[f].category_name == self.points[z].category_name)){

                var clone_point = $('#clone-list').clone();
                var point_id = self.points[z].id;
                var severity = clone_point.find('button[data-severity="'+self.points[z].severity+'"]');
                var update_price = clone_point.find('.update-price')
                var files = JSON.parse(self.points[z].files);
                var files_length = files.length;

                clone_point.find('.severity-picker').attr('data-severity', self.points[z].severity);
                clone_point.find('.update-severity').attr('data-point-id', point_id);
                severity.addClass(severity.attr('data-class'));
                severity.removeClass('btn-link');

                update_price.attr('data-point-id', point_id);

                clone_point.find('.capture-photo').attr('data-point-id', point_id);
                clone_point.find('.capture-video').attr('data-point-id', point_id);
                clone_point.find('.capture-audio').attr('data-point-id', point_id);

                var _price_float = parseFloat(self.points[z].price);
                clone_point.find('.point_status_'+self.points[z].status).removeClass('hide');
                _price_float = _price_float ? _price_float : 0;
                update_price.val(self.points[z].price);
                clone_point.find('.update-price').attr('data-point-id', point_id);
                var status_point = clone_point.find('.status-point')

                if (self.severities[self.points[z].severity]) {
                    status_point.html(self.severities[self.points[z].severity].icon);


                    status_point.attr('class', 'btn btn-sm status-point ' + self.severities[self.points[z].severity].class);
                }
                clone_point.find('.inspection_price').html('$' + _price_float.toFixed(2));

                clone_point.find('.gallery-link').attr('href', '#gallery' + point_id);
                clone_point.find('.gallery').attr('id', 'gallery' + point_id);

                clone_point.find('.delete-point').attr('data-point-id', point_id);

                clone_point.find('.carousel').attr('id', 'carousel' + point_id);
                clone_point.find('.carousel-control').attr('href', '#carousel' + point_id);

                clone_point.attr('id', null);
                clone_point.find('.point_name').append(self.points[z].name);
                clone.find('.list-group').append(clone_point.removeClass('hide'));
                var uri = 'http://172.16.0.13:8000/files/';
                for (var w = 0; w < files_length; w++){
                    var __file_name = files[w].name;
                    var item = false;
                    if (__file_name.indexOf('.mp4') > 0){
                        item = "<div class='item active'><video style='height:300px; margin:auto; display: inherit; 'controls><source src='"+uri + __file_name +"' type='video/mp4'></video></div>";
                    }
                    if (__file_name.indexOf('.3gp') > 0){
                        item = "<div class='item active'><video style='height:300px; margin:auto; display: inherit; 'controls><source src='"+uri + __file_name +"' type='video/3gp'></video></div>";
                    }
                    else if (__file_name.indexOf('.m4a') > 0){
                        item  = "<div class='item active'>"+
                        "<i class='fa fa-volume-up'></i><audio style='height:300px; margin:auto; display: inherit;' controls>"+
                        "<source src='"+uri + __file_name+"'></audio></div>";
                    }
                    else if (__file_name.indexOf('.jpg') > 0){
                        item = '<div class="item active"><img style="height:300px; margin:auto; display: inherit;" src="'+uri + __file_name +'"></div>';
                    }
                    var itemDefault =  clone_point.find('.carousel').find('#itemDefault');
                    if (item && itemDefault)
                    {
                        itemDefault.remove();
                    }
                    clone_point.find('.carousel').find('.active').removeClass('active');
                    clone_point.find('.carousel').find('.carousel-inner').append(item);
                }

                z++;
            };
            if (clone_success){
                accordion.append(clone.removeClass('hide'));
            }
            if (f + 1 == self.categories.length && call_back_function) {
                call_back_function.call();
            }
        }
    },
    rules: function(call_back_function = null){
        var self = this;
        var app_settings = JSON.parse(localStorage.getItem('app_settings'));

        var is_asesor = app_settings.user_permissions.indexOf('advisory_group') >= 0;
        var is_tech = app_settings.user_permissions.indexOf('technical_group') >= 0;
        var can_close = app_settings.user_permissions.indexOf('close') >= 0;
        var can_mark_as_attended = app_settings.user_permissions.indexOf('mark_as_attended') >= 0;

        var status = parseInt(self.inspection.status)
        if(status == 1 && is_tech)
        {
            $('#buttonmenu').append('<a class="navbar-link" onclick="inspection.update(\'status\', \'2\')" ><i class="fa fa-paper-plane"></i></a>');
        }
        if(status == 2 && is_asesor)
        {
            $('#buttonmenu').append('<a class="navbar-link" onclick="inspection.update(\'status\', \'3\')" ><i class="fa fa-paper-plane "></i></a>');
        }
        if(status == 4 && is_asesor)
        {
            $('#buttonmenu').append(
                '<a class="navbar-link" onclick="inspection.update(\'status\', \'3\')" ><i class="fa fa-paper-plane "></i></a>'+
                '<a class="navbar-link" onclick="inspection.update(\'status\', \'1\')" ><i class="fa fa-wrench"></i></a>'
            )
        }
        if(status >= 2 && status < 5 && can_mark_as_attended)
        {
            $('#buttonmenu').append('<a class="navbar-link" onclick="inspection.update(\'status\', \'5\')" ><i class="fa fa-check "></i></a>')
        }
        if(status >= 1 && can_close)
        {
            $('#buttonmenu').append('<a class="navbar-link" onclick="inspection.update(\'status\', \'6\')" ><i class="fa fa-power-off "></i></a>')
        }
        if(status == 1 && is_tech){
            $('.status-point').addClass('hide');
        }
        $('.inspection_status_1').addClass('hide');
        $('.inspection_status_2').addClass('hide');
        $('.inspection_status_3').addClass('hide');
        $('.inspection_status_4').addClass('hide');
        $('.inspection_status_5').addClass('hide');
        $('.inspection_status_5').addClass('hide');
        $('.inspection_status_'+status).removeClass('hide');
        if (call_back_function){
            call_back_function.call();
        }
    },
    add_events: function(){
        var self = this;
        var SeverityPicker = $('.severity-picker');

        SeverityPicker.find('button').click(function(e){
            $(this).parent('.severity-picker').find('button').attr('class', 'btn btn-link');
            $(this).attr('class', 'btn ' + $(this).attr('data-class'));
            $(this).parent('.severity-picker').find('.severity').val($(this).attr('data-severity'));
        });

        $('.update-price').change(function(){
            self.update_point($(this).attr('data-point-id'), 'price', $(this).val());
        });

        $('.update-severity').click(function(){
            $(this).parent().parent().parent().parent().find(".btn-link").prop("disabled",true);
            $(this).parent().attr('data-severity',  $(this).attr('data-severity'));
            self.update_point($(this).attr('data-point-id'), 'severity', $(this).attr('data-severity'));            
            setTimeout(function(){
                alert("remoev las prop");
                alert(count($(this).parent().parent().parent().parent().find(".btn-link")));
                $(this).parent().parent().parent().parent().find(".btn-link").prop("disabled",false);
                $(this).parent().parent().parent().parent().find(".btn-link").removeProp("disabled");
                $(this).parent().parent().parent().parent().find(".btn-link").removeAttr("disabled");
                //$(this).parent().parent().parent().parent().find(".btn-link").attr("disabled",false);
            }, 2000);
        });

        $('.capture-photo').click(function(){
            self.capture_photo($(this).attr('data-point-id'));
        });

        $('.capture-video').click(function(){
            self.capture_video($(this).attr('data-point-id'));
        });

        $('.capture-audio').click(function(){item =
            self.capture_audio($(this).attr('data-point-id'));
        });

        $('.delete-point').click(function(){
            var button = $(this);
            navigator.notification.confirm(
                'Elimina punto de inspección?',
                function(result){
                    if(result === 1){
                        self.update_point(button.attr('data-point-id'), 'status', 0);
                        button.parent().parent().parent().remove();
                    }
                },
                'Eliminar',
                'Ok,Cancelar'
            );
        });

        var pdf = $('#pdf');
        pdf.change(function(){
            var url = window.location.href;
            params = getParams(url);
            var formData = new FormData(document.getElementById("pdfform"));

            formData.append('file', pdf[0].files[0]);

            $.ajax({
                url : ruta_generica+'/api/v1/upload_price_quote?token=' + session.token + '&inspection_id=' + self.id,
                type : 'POST',
                dataType: 'JSON',
                data : formData,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                success : function(data) {
                    navigator.notification.alert(data.message, function(){
                        self.inspection.presupuesto = data.file;
                        self.presupuesto_navbar(data.file)
                    }, 'Ok');

                }
            });
            pdf.val('');
        });

    },
    capture_video: function(point_id){
        var self = this;
         navigator.device.capture.captureVideo(function(file){
             var options = new FileUploadOptions();
             var videoURI=file[0].fullPath;
             options.fileKey = "file";
             options.fileName = videoURI.substr(videoURI.lastIndexOf('/') + 1);
             options.mimeType = "video/mp4";
             var params = new Object();
             params.token = session.token;
             params.point_id = point_id;
             params.inspection_id =self.id;
             options.params = params;
             options.chunkedMode = false;
             self.files.push([videoURI, options]);
             self.upload_files()
         },
            function(error){
                navigator.notification.alert(JSON.stringify(error), false, 'Aviso', 'Aceptar');
            }, {
                quality: 90,
                destinationType: Camera.DestinationType.FILE_URI,
                saveToPhotoAlbum: true
            });
    },
    capture_photo: function(point_id){
        var self = this;
        navigator.camera.getPicture(
            function(photoURI){
                console.log(photoURI);
                var options = new FileUploadOptions();
                 options.fileKey = "file";
                 options.fileName = photoURI.substr(photoURI.lastIndexOf('/') + 1);
                 options.mimeType = "image/jpeg";
                 var params = new Object();
                 params.token = session.token;
                 params.point_id = point_id;
                 params.inspection_id =self.id;
                 options.params = params;
                chunkedMode = false;
                self.files.push([photoURI, options]);
                self.upload_files()
            },
            function(error){
                navigator.notification.alert(JSON.stringify(error), false, 'Aviso', 'Aceptar');
            }, {
                quality: 90,
                destinationType: Camera.DestinationType.FILE_URI,
                saveToPhotoAlbum: true
            });
    },
    capture_audio: function(point_id){
        var self = this;
        navigator.device.audiorecorder.recordAudio(function(mediaFiles) {
            console.log(mediaFiles);
            mediaFiles = jQuery.parseJSON(mediaFiles);
            audioURI=mediaFiles.full_path;
            var options = new FileUploadOptions();

             options.fileKey = "file";
             options.fileName = audioURI.substr(audioURI.lastIndexOf('/') + 1);
             options.mimeType = "image/jpeg";
             var params = new Object();
             params.token = session.token;
             params.point_id = point_id;
             params.inspection_id =self.id;
             options.params = params;
             options.chunkedMode = false;

            self.files.push([audioURI, options]);
            self.upload_files()
        });
    },
    upload_files: function(){
        var self = this;

        if(!self.files)
            return;

        for(var d = 0; d < self.files.length; d++){
            if(!self.files[d])
                continue;

            var _file_path = self.files[d][0];
            var options = self.files[d][1];
            var ft = new FileTransfer();
            if (navigator.connection.type !== Connection.NONE) {
                ft.upload(
                    _file_path,
                    ruta_generica+"/api/v1/upload",
                    function(result){
                        console.log(delete self.files[d]);
                        var itemDefault =  $('#carousel'+options.params.point_id).find('#itemDefault');
                        if (itemDefault)
                        {
                            itemDefault.remove();
                        }

                    },
                    function(error){
                        navigator.notification.alert(JSON.stringify(error), false, 'Aviso', 'Aceptar');
                    },
                    options
                );
            }
            $('#carousel'+options.params.point_id).find('.active').removeClass('active');
            if (_file_path.indexOf('.3gp') > 0){
                $('#carousel'+options.params.point_id).find('.carousel-inner').append("<div class='item active'><video style='height:300px; margin:auto; display: inherit; 'controls><source src='"+_file_path +"' type='video/3gp'></video></div>");
            }
            if (_file_path.indexOf('.m4a') > 0){
                $('#carousel'+options.params.point_id).find('.active').removeClass('active');
                var item  = "<div class='item active'>"+
                "<i class='fa fa-volume-up'></i><audio style='height:300px; margin:auto; display: inherit;' controls>"+
                "<source src='"+_file_path+"'><item = /audio></div>";
                $('#carousel'+options.params.point_id).find('.carousel-inner').append(item);
            }
            if (_file_path.indexOf('.jpg') > 0){
                $('#carousel'+options.params.point_id).find('.carousel-inner').append('<div class="item active"><img style="height:300px; margin:auto; display: inherit;" src="'+_file_path+'"></div>');
            }
            if (_file_path.indexOf('.mp4') > 0){

                $('#carousel'+options.params.point_id).find('.carousel-inner').append("<div class='item active'><video style='height:300px; margin:auto; display: inherit; 'controls><source src='"+_file_path+"' type='video/mp4'></video></div>");
            }

        }
    },
    update: function(field, value){
        var is_valid_to_send = true;
        var self = this;
        var charter = '"';
        if (field =='status')
             charter = '';

        if (value == 2 && field == 'status'){
            $('.clone-point').each(function(key, item){
                var item = $(item);
                var severity = item.find('.severity-picker').attr('data-severity');
                if (severity == 0){
                    is_valid_to_send = false;
                    navigator.notification.alert('Debe inspeccionar ' + item.find('.point_name').html(), false, 'Error', 'Aceptar');
                }

                if (severity == 3 && item.find('.carousel .item:not(#itemDefault)').length == 0){
                    is_valid_to_send = false;
                    navigator.notification.alert('Debe agregar evidencia en ' + item.find('.point_name').html(), false, 'Error', 'Aceptar');
                }
            });
        }

        if (value == 3 && field == 'status'){
            $('.clone-point:not(.hide)').each(function(key, item){
                var price = $(item).find('.update-price');
                if (!price.val() && !self.inspection.presupuesto){
                    is_valid_to_send = false;
                    navigator.notification.alert('Debe llenar el precio de ' + $(item).find('.point_name').html(), false, 'Error', 'Aceptar');
                }
            });
            if(is_valid_to_send)
            {
                self.db.transaction(function(tx){
                    var sql = "UPDATE vehicle_inspections SET status = 1, origen = 'modified' where inspection_id = " + self.id;
                    tx.executeSql(sql);
                });
            }
        }
        if (is_valid_to_send) {
            self.db.transaction(function(tx){
                 var sql = "UPDATE inspections SET origen = 'modified', " + field + " = " + charter + value + charter + " where id = " + self.id;
                 tx.executeSql(sql);
            }, function(error) {
                 debug('algo fallo', true);
            }, function() {
                sync_data(function(){
                    location.href = 'dashboard.html';
                }, 0);

            });
        }

    },
    update_point: function(id, field, value){
        var self = this;
        var post_data = {
            inspections: [],
            points: [],
        };
        var charter = '"';
        if (field =='severity')
             charter = '';

        self.db.transaction(function(tx){
            var sql = "UPDATE vehicle_inspections SET  origen = 'modified', " + field + " = " + charter + value + charter + " where id = " + id;
            tx.executeSql(sql);
        }, function(error) {
            debug('algo fallo', true);
        }, function() {
            sync_data(null, 1000);
        });
    },
    upload_pdf: function(){
         $('#pdf').trigger('click');
     },

     presupuesto_navbar: function(file){
         var presupuesto = $('#presupuesto');
         var self = this;
         presupuesto.find('.delete-presupuesto').unbind('click');
         presupuesto.find('.download-presupuesto').attr('href', ruta_generica + '/api/v1/download_price_quote/'+file);
         presupuesto.find('.delete-presupuesto').click(function(){
             self.delete_presupuesto(file);
         });
         presupuesto.removeClass('hide');
     },
     delete_presupuesto: function(file){
         navigator.notification.confirm(
             'Eliminar presupuesto?',
             function(result){
                 if(result === 1){
                     $.ajax({
                         url :  ruta_generica + '/api/v1/delete_price_quote/'+file,
                         type : 'POST',
                         dataType: 'JSON',
                         processData: false,  // tell jQuery not to process the data
                         contentType: false,  // tell jQuery not to set contentType
                         success : function(data) {
                             $('#presupuesto').addClass('hide');
                         },
                     });
                 }
             },
             'Eliminar',
             'Ok,Cancelar'
         );
     }
};
document.addEventListener("online", inspection.upload_files, false);
