/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: {width: 800, height: 600}
    }
  );
});


/*chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });*/

// chrome.runtime.onMessageExternal.addListener(
//   function(request, sender, sendResponse) {
//     console.log("Response : " + response);
//     if (request.type == "code"){
//       console.log("Message received in app background");
//       sendResponse({"code":"dummy_code"});
//       // chrome.runtime.sendMessage({"code":"dummy_code"});
//     }
//   });