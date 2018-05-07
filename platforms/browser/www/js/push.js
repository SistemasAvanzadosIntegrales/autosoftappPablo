// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.
document.addEventListener('deviceready', function () {
    // Enable to debug issues.
    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    try {
        var notificationOpenedCallback = function(jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };
        window.plugins.OneSignal
            .startInit("9279844e-0f7c-4469-a616-79df5e864a5a")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
        var session=JSON.parse(localStorage.getItem('session'));
        window.plugins.OneSignal.sendTag("rol",session.rol+session.token);
        window.plugins.OneSignal.sendTag("id", session.id_cliente+session.token);

    } catch (e) {
        console.log(e);
    }


}, false);
