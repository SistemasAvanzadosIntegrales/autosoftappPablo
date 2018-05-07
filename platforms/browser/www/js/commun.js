var ruta_generica = "http://autosoft2.avansys.com.mx";

/*
var ruta_generica = "http://localhos:8000";

$.get("js.html", function(data){
  $("#js").append(data);
});

$.get("css.html", function(data){
  $("#css").append(data);
});
*/
var session=JSON.parse(localStorage.getItem('session'));
var app_settings = JSON.parse(localStorage.getItem('app_settings'));
$.get("navbar.html", function(data){
  $("#navbar").append(data);
  $('#NavbarTitle').html($('title').html());
});

/**
 *  @author   : Pablo Diaz
 *  @Contact  : pablo_diaz@avansys.com.mx
 *  @date     : 25/01/2018
 *  @function : muestra
 **/
function muestra(nombre){
   $('.'+nombre).toggle();
}

if (!app_settings && location.pathname != "/index.html")
{
  //location.href="index.html";
}

function salir(){
   localStorage.clear();
   location.href="index.html";
}

function style()
{
  var session=JSON.parse(localStorage.getItem('session'));
  var app_settings = JSON.parse(localStorage.getItem('app_settings'));
  app_settings = app_settings ? app_settings : {"contrast_color": "dddddd", "base_color": "323232"};
  $('.table thead tr th').css('background', '#'+app_settings.contrast_color);
  $(document.body).css('background', '#'+app_settings.base_color);
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

  if (!app_settings && location.pathname == "/index.html")
  {
    $('.container-fluid').removeClass('hide');
    return elements_to_verify.remove();
  }
  if(!app_settings.user_permissions)
  {
    elements_to_verify.remove();
  }
  elements_to_verify.each(function(i, item){
    for (var x = 0; x < app_settings.user_permissions.length; x++)
    {
      var permmision = 'permission_' + app_settings.user_permissions[x];
      var access = $(item).hasClass(permmision);
      if (access)
      {
        console.log(permmision + ' is ' + access);
        $(item).removeClass('to-remove');
        $(item).removeClass('hide');
        break;
      }
      else
      {
        $(item).addClass('to-remove');
        $(item).addClass('hide');
      }
    }
  });

  navigator.splashscreen.hide();
  setTimeout(function(){
    $('.to-remove').remove();
  }, 500);


  console.log('permissions was checked');
}

function logo(){
  var logo = $('#logo');
  if (logo && app_settings) {
    logo.attr('src', 'data:image/png;base64,'+app_settings.logo)
    logo.fadeIn();
  }
  console.log('logo success');
}
document.addEventListener("deviceready", function(){
  permissions();
  logo();
  $('.container-fluid').removeClass('hide');
  console.log('device is now ready');
}, false);
