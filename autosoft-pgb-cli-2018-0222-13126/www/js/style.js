var conf = JSON.parse(localStorage.getItem('conf'));
$('.table thead tr th').css('background', '#'+conf.contrast_color);
$(document.body).css('background', '#'+conf.base_color);
