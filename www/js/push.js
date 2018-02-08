// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.
    
document.addEventListener('deviceready', function () {
    // Enable to debug issues.
    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    
    var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };   
    window.plugins.OneSignal
        .startInit("9279844e-0f7c-4469-a616-79df5e864a5a")
        .handleNotificationOpened(notificationOpenedCallback)        
        .endInit();         
    // Call syncHashedEmail anywhere in your app if you have the user's email.
    // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
    // window.plugins.OneSignal.syncHashedEmail(userEmail);
    window.plugins.sendTags({rol:  "session.get_rol()", id: "session.get_id_cliente()"},
        onSuccess: { (result) in
        alert("success!");
    }) { (error) in
        alert("Error sending tags - \(error?.localizedDescription)");
    }
}, false);

alert("rol:"+"roles"+" id:"+"1");