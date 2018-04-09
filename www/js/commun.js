var ruta_generica = "http://autosoft2.avansys.com.mx";
var session;
var app_settings;

document.addEventListener("online", onOnline, false);

function onOnline() {
    $('#online-status').addClass('hide');
}

// Wait for Cordova to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
//
function onDeviceReady() {
    var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
}
document.addEventListener("offline", onOffline, false);

function onOffline() {
    $('#online-status').removeClass('hide');
}

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
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 25/01/2018
 *  @function : muestra
 **/
function muestra(nombre){
   $('.'+nombre).toggle();
}

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
            item.removeClass('hide');
            break;
          }
          else
          {
            item.addClass('to-remove');
            item.addClass('hide');
          }
        }
    }
  });

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
  if (!app_settings && location.pathname != "/index.html")
  {
    location.href="index.html";
  }
  $.get("navbar.html", function(data){
    $("#navbar").append(data);
    $('#NavbarTitle').html($('title').html());
    logo();
    style();
    permissions();
  });
  //console.log('device is now ready');
}, false);
