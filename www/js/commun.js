var ruta_generica = "http://autosoft2.avansys.com.mx";
var session;
var app_settings;
var inspectionStatus = [
    {text: "Nueva",         icon: "fa fa-question"},
    {text: "En revisión",   icon: "fa fa-wrench"},
    {text: "Verificación",  icon: "fa fa-stethoscope"},
    {text: "Espera cliente",icon: "fa fa-clock-o"},
    {text: "Respondido",    icon: "fa fa-comments-o"},
    {text: "Revisado",      icon: "fa fa-check-square-o"},
    {text: "Cerrado",       icon: "fa fa-power-off"}
 ];


 document.addEventListener("online", function() {
     var app_settings = JSON.parse(localStorage.getItem('app_settings'));
     app_settings = app_settings ? app_settings : {"config_company": {"contrast_color": "dddddd", "base_color": "012d4a"}};
     var contrast_color = '#'+app_settings.config_company.contrast_color;
     var base_color = '#'+app_settings.config_company.base_color;
     $('#netStatus').attr('style', 'color:' +  contrast_color+ '!important');
      localStorage.setItem("network", 'online');

      if($('.online').length)
      {
          $('.online').removeAttr('disabled')
          $('.online').removeAttr('readonly');
      }


 }, false);

 document.addEventListener("offline", function(){
     $('#netStatus').attr('style', 'color: red!important');
     localStorage.setItem("network", 'offline');
     if($('.online').length){
         $('.online').attr('disabled', true);
         $('.online').attr('readonly', true);
     }

 }, false);
/**
 *  @author Ivan Vazquez
 **/
 var xhr, token, user_id, session, data = {};
 document.addEventListener("deviceready", function(){
    session=JSON.parse(localStorage.getItem('session'));
    app_settings=JSON.parse(localStorage.getItem('app_settings'));


    token = session.token;
    user_id = app_settings.user.id;

 });

/*
var ruta_generica = "http://localhos:8000";

$.get("js.html", function(data){
  $("#js").append(data);
});

$.get("css.html", function(data){
  $("#css").append(data);
});
*/


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

function salir(){
    localStorage.clear();
   location.href="index.html";
}

function style()
{
	var session=JSON.parse(localStorage.getItem('session'));
	var app_settings = JSON.parse(localStorage.getItem('app_settings'));
	app_settings = app_settings ? app_settings : {"config_company": {"contrast_color": "dddddd", "base_color": "323232"}};
	var version_tag = [
		'<h5 class="text-center" style="position: absolute;bottom: 0px;width: 100%;font-size: 0.8em;font-weight: bold;color:'+app_settings.config_company.contrast_color+'">Versión:',
		'version',
		'</h5>'
	];
	try {
		cordova.getAppVersion.getVersionNumber(function (version) {
			version_tag[1] = version;
			$('body').append(version_tag.join(''));
		});
	} catch (e) {
		console.log(e);
	} finally {
		version_tag[1] = 'Debug';
		$('body').append(version_tag.join(''));
	}
	$('.table thead tr th').css('background', '#'+app_settings.config_company.contrast_color);
	$(document.body).css('background', '#'+app_settings.config_company.base_color);
}

/*
Ddefault permissions
[
  "see_binnacle",
  "see_users",
  "add_users",
  "edit_users",
  "delete_users",
  "see_clients",
  "add_clients",
  "edit_clients",
  "delete_clients",
  "edit_notice_of_privacy",
  "see_inspections",
  "add_inspections",
  "edit_inspections",
  "delete_inspections",
  "see_permits",
  "add_permits",
  "edit_permits",
  "delete_permits",
  "technical_group",
  "advisory_group",
  "attach_budget",
  "mark_as_attended",
  "close"
];
*/
function permissions(){
  var elements_to_verify = $('*[data-permissions="true"]');
  var session=JSON.parse(localStorage.getItem('session'));
  var app_settings = JSON.parse(localStorage.getItem('app_settings'));
  if (app_settings.licensing_access == 'readonly'){
    $('.fullaccess').remove();
    $('#readonly-alert').removeClass('hide');
  }

  var screen =  (new URL(location)).pathname;
  screen = screen.split('/');
  screen = screen[screen.length - 1];

  if(!app_settings.user_permissions)
  {
    elements_to_verify.remove();
  }
  var item_screen = '';
  elements_to_verify.each(function(i, item){
    var item = $(item);
    item_screen = item.attr('data-screen');
    if (item_screen && item_screen != screen)
    {
        item.addClass('to-remove');
    }
    else
    {
        for (var x = 0; x < app_settings.user_permissions.length; x++)
        {
          var permmision = 'permission_' + app_settings.user_permissions[x];
          var access = item.hasClass(permmision);
          if (access)
          {
            //console.log(permmision + ' is ' + access);
            item.removeClass('to-remove');
            break;
          }
          else
          {
            item.addClass('to-remove');
          }
        }
    }
  });
  $('#user_name').html(app_settings.user.name);
  $('.to-remove').remove();
  $('#loading').fadeOut();


  //console.log('permissions was checked');
}
function logo(){
  var logo = $('#logo');
  if (logo && app_settings) {
      if (app_settings.logo)
      {
          logo.attr('src', 'data:image/png;base64,'+app_settings.logo)
      }
      else {
          logo.attr('src', 'img/logo.png')
      }
      logo.fadeIn();
    //console.log('logo success');
  }
}

document.addEventListener("deviceready", function(){
  session=JSON.parse(localStorage.getItem('session'));
  app_settings = JSON.parse(localStorage.getItem('app_settings'));

  $.get("navbar.html", function(data){
    $("#navbar").append(data);
    $('#NavbarTitle').html($('title').html());
    logo();
    style();
    permissions();
  });
  //console.log('device is now ready');
}, false);
