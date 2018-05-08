var inspection = {
    id: null,
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
                                if (call_back_function)
                                    call_back_function.call();
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

        var accordion = $('#accordion');
        var z = 0;
        for(var f = 0; f < self.categories.length; f++){
            if (!self.categories[f].category_name){
                return;
            }
            var clone = $("#clone").clone();
            var category_name = clone.find('.category_name');

            category_name.html(self.categories[f].category_name);
            category_name.attr('href', '#'+self.categories[f].category_name);
            category_name.attr('aria-controls', self.categories[f].category_name);
            clone.find('.panel-collapse').attr('id', self.categories[f].category_name);
            var clone_success = true;
            while(self.points[z] && (self.categories[f].category_name == self.points[z].category_name)){

                var clone_point = $('#clone-list').clone();
                var point_id = self.points[z].id;
                var severity = clone_point.find('button[data-severity="'+self.points[z].severity+'"]');
                var update_price = clone_point.find('.update-price')

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
                status_point.html(self.severities[self.points[z].severity].icon);
                status_point.attr('class', 'btn btn-sm ' + self.severities[self.points[z].severity].class);

                clone_point.find('.inspection_price').html('$' + _price_float.toFixed(2));

                clone_point.find('.gallery-link').attr('href', '#gallery' + point_id);
                clone_point.find('.gallery').attr('id', 'gallery' + point_id);

                clone_point.find('.delete-point').attr('data-point-id', point_id);

                clone_point.find('.carousel').attr('id', 'carousel' + point_id);
                clone_point.find('.carousel-control').attr('href', '#carousel' + point_id);

                clone_point.attr('id', null);
                clone_point.find('.point_name').append(self.points[z].name);
                clone.find('.list-group').append(clone_point.removeClass('hide'));

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
                '<a class="navbar-link" onclick="inspection.update(\'status\', \'5\')" ><i class="fa fa-check "></i></a>'+
                '<a class="navbar-link" onclick="inspection.update(\'status\', \'3\')" ><i class="fa fa-paper-plane "></i></a>'
            )
        }
        if(status >= 1 && can_close)
        {
            $('#buttonmenu').append('<a class="navbar-link" onclick="inspection.update(\'status\', \'6\')" ><i class="fa fa-power-off "></i></a>')
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
            self.update_point($(this).attr('data-point-id'), 'severity', $(this).attr('data-severity'));
        });

        $('.capture-photo').click(function(){
            self.capture_photo($(this).attr('data-point-id'));
        });

        $('.capture-video').click(function(){
            self.capture_video($(this).attr('data-point-id'));
        });

        $('.capture-audio').click(function(){
            self.capture_audio($(this).attr('data-point-id'));
        });

        $('.delete-point').click(function(){
            var button = $(this);
            navigator.notification.confirm(
                'Elimina punto de inspección?',
                function(result){
                    if(result === 1){
                        self.update_point(button.attr('data-point-id'), 'status', 0);
                        button.parent().parent().parent().addClass('hide');
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
                    navigator.notification.alert(data.message, null, 'Ok');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    navigator.notification.alert('Pdf cargado correctamente', null, 'Ok');
                }
            });
            pdf.val('');
        });

    },
    capture_video: function(point_id){
        var self = this;
         navigator.device.capture.captureVideo(
            function(file){
                var options = new FileUploadOptions();
                var videoURI=file[0].fullPath;
                options.fileKey = "file";
                options.fileName = videoURI.substr(videoURI.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                var params = new Object();
                params.token = session.token;
                params.point_id = point_id;
                params.inspection_id =self.id;
                options.params = params;
                options.chunkedMode = true;

                var ft = new FileTransfer();
                var progress = $('#progress');
                var progress_bar = $('#progress').find('.progress-bar');
                var progress_status = $('#progress').find('.progress-status');
                ft.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        progress_bar.removeClass(hide)
                        progress_bar.css('width', $Math.floor(progressEvent.loaded / progressEvent.total));
                    } else {
                        progress_status.removeClass('hide');
                        if(progress_status.html() == "") {
                            progress_status.html("Loading");
                        } else {
                            rogress_status.html(rogress_status.html()+ ".");
                        }
                    }
                    progress.removeClass('hide');
                };

                var carousel = $('#carousel'+point_id);
                ft.upload(
                    videoURI,
                    ruta_generica+"/api/v1/upload",
                    function(result){
                        console.log(result);
                        let itemDefault = carousel.find('#itemDefault');
                        if (itemDefault)
                        {
                            itemDefault.remove();
                        }
                        carousel.find('.carousel-inner active').addClass('active');
                        carousel.find('.carousel-inner').append("<div class='item active'><video style='height:300px; margin:auto; display: inherit; 'controls><source src='"+videoURI+"' type='video/mp4'></video></div>");
                    },
                    function(error){
                        navigator.notification.alert(JSON.stringify(error), false, 'Aviso', 'Aceptar');
                    },
                    options
                );
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
                var options = new FileUploadOptions();
                 options.fileKey = "file";
                 options.fileName = photoURI.substr(photoURI.lastIndexOf('/') + 1);
                 options.mimeType = "image/jpeg";
                 var params = new Object();
                 params.token = session.token;
                 params.point_id = point_id;
                 params.inspection_id =self.id;
                 options.params = params;
                 options.chunkedMode = true;

                var ft = new FileTransfer();
                var progress = $('#progress');
                var progress_bar = $('#progress').find('.progress-bar');
                var progress_status = $('#progress').find('.progress-status');
                ft.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        progress_bar.removeClass(hide)
                        progress_bar.css('width', $Math.floor(progressEvent.loaded / progressEvent.total));
                    } else {
                        progress_status.removeClass('hide');
                        if(progress_status.html() == "") {
                            progress_status.html("Loading");
                        } else {
                            rogress_status.html(rogress_status.html()+ ".");
                        }
                    }
                    progress.removeClass('hide');
                };
                var carouserl = $('#carousel'+point_id);
                ft.upload(
                    photoURI,
                    ruta_generica+"/api/v1/upload",
                    function(result){
                        console.log(result);
                        let itemDefault = carousel.find('#itemDefault');
                        if (itemDefault)
                        {
                            itemDefault.remove();
                        }
                        carousel.find('.carousel-inner active').addClass('active');
                        carousel.find('.carousel-inner').append('<div class="item active"><img style="height:300px; margin:auto; display: inherit;" src="'+photoURI+'"></div>');
                    },
                    function(error){
                        navigator.notification.alert(JSON.stringify(error), false, 'Aviso', 'Aceptar');
                    },
                    options
                );
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
        navigator.device.audiorecorder.recordAudio(
            function(mediaFiles) {
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
                 options.chunkedMode = true;

                var ft = new FileTransfer();
                var progress = $('#progress');
                var progress_bar = $('#progress').find('.progress-bar');
                var progress_status = $('#progress').find('.progress-status');
                ft.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        progress_bar.removeClass(hide)
                        progress_bar.css('width', $Math.floor(progressEvent.loaded / progressEvent.total));
                    } else {
                        progress_status.removeClass('hide');
                        if(progress_status.html() == "") {
                            progress_status.html("Loading");
                        } else {
                            rogress_status.html(rogress_status.html()+ ".");
                        }
                    }
                    progress.removeClass('hide');
                };
                var carousel = $('#carousel'+point_id);
                ft.upload(
                    audioURI,
                    ruta_generica+"/api/v1/upload",
                    function(result){
                        console.log(result);
                        let itemDefault = carousel.find('#itemDefault');
                        if (itemDefault)
                        {
                            itemDefault.remove();
                        }
                        carousel.find('.carousel-inner active').addClass('active');

                        let item  = "<div class='item'>"+
                        "<i class='fa fa-volume-up'></i><audio style='height:300px; margin:auto; display: inherit;' controls>"+
                        "<source src='"+mediaFiles.full_path+"'></audio></div>";
                        carousel.find('.carousel-inner').append(item);
                    },
                    function(error){
                        navigator.notification.alert(JSON.stringify(error), false, 'Aviso', 'Aceptar');
                    },
                    options
                );
            },
            function(error){
                console.log(error);
            });

    },
    update: function(field, value){
        var self = this;
        var charter = '"';
        if (field =='status')
             charter = '';

         self.db.transaction(function(tx){
             let sql = "UPDATE inspections SET origen = 'modified', " + field + " = " + charter + value + charter + " where id = " + self.id;
             console.log(sql);
             tx.executeSql(sql);
         }, function(error) {
             debug('algo fallo', true);
         }, function() {
             location.href = 'dashboard.html';
         });
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
            let sql = "UPDATE vehicle_inspections SET  origen = 'modified', " + field + " = " + charter + value + charter + " where id = " + id;
            tx.executeSql(sql);
        }, function(error) {
            debug('algo fallo', true);
        }, function() {
            sync_data();
        });
    },
    upload_pdf: function(){
         $('#pdf').trigger('click');
     },
};



/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};
