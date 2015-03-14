window.onload = function() {
  document.querySelector('#greeting').innerText =
    'Manage your bluetooth connections...';

  var tab = document.getElementById("devices");
  var hdr = tab.insertRow(0);
  hdr.insertCell(0).innerHTML = "ADDRESS";
  hdr.insertCell(1).innerHTML = "NAME";
  hdr.insertCell(2).innerHTML = "TYPE";
  hdr.insertCell(3).innerHTML = "PAIRED?";
  hdr.insertCell(4).innerHTML = "CONNECTED?";
  hdr.insertCell(5).innerHTML = "UUIDS";
  hdr.insertCell(6).innerHTML = "DEVICE_CLASS";

  chrome.bluetooth.getDevices(function(devices) {
    console.log("Checking bluetooth devices");
     for (var i = 0; i < devices.length; i++) {
       console.log("Device Address: " + devices[i].address + " Device name: " + devices[i].name);
       var row = tab.insertRow(i+1);
       row.insertCell(0).innerHTML = devices[i].address;
       row.insertCell(1).innerHTML = devices[i].name;
       row.insertCell(2).innerHTML = devices[i].type;
       row.insertCell(3).innerHTML = devices[i].paired;
       row.insertCell(4).innerHTML = devices[i].connected;
       row.insertCell(5).innerHTML = devices[i].uuids;
       row.insertCell(6).innerHTML = devices[i].deviceClass;

     }
  });

/* var onConnectedCallback = function() {

    if (chrome.runtime.lastError) {
      console.log("Connection failed: " + chrome.runtime.lastError.message);
    } else {
      console.log("Socket created: " + socketId);

      //register send handler primarily for logging
      chrome.bluetoothSocket.send(socketId,str2ab(''),function(bytes_sent) {
         if (chrome.runtime.lastError) {
            console.log("Send failed: " + chrome.runtime.lastError.message);
         } else {
            console.log("Sent " + bytes_sent + " bytes")
         }
      });

      //register add listener primarily for receiving
      chrome.bluetoothSocket.onReceive.addListener(function(receiveInfo) {
        if (receiveInfo.socketId != socketId)
          return;
        var code = ab2str(receiveInfo.data);
        console.log("Data received: " + code);
        portx.postMessage({"code":code});
      });
    }
  };

var uuid = 'A55D25C2-DA5F-40B2-B8D9-B940BF39795C';
var registeredDevice = "74:45:8A:A0:AC:47";
var socketId = -1;
  chrome.bluetoothSocket.create(function(createInfo) {
          chrome.bluetoothSocket.connect(createInfo.socketId,
                registeredDevice, uuid, onConnectedCallback);
          socketId = createInfo.socketId;
          console.log(createInfo.socketId);
        });

}*/


var uuid = 'A55D25C2-DA5F-40B2-B8D9-B940BF39795C';
var registeredDevice = "74:45:8A:A0:AC:47";
var socketId = -1;
var portx;

function ab2str(buf)
{
   return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str)
{
     var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
     var bufView = new Uint16Array(buf);
     for (var i=0, strLen=str.length; i < strLen; i++) {
       bufView[i] = str.charCodeAt(i);
     }
     return buf;
}

 var onConnectedCallback = function() {

    if (chrome.runtime.lastError) {
      console.log("Connection failed: " + chrome.runtime.lastError.message);
    } else {
      console.log("Socket created: " + socketId);

      //register send handler primarily for logging
      chrome.bluetoothSocket.send(socketId,str2ab(''),function(bytes_sent) {
         if (chrome.runtime.lastError) {
            console.log("Send failed: " + chrome.runtime.lastError.message);
         } else {
            console.log("Sent " + bytes_sent + " bytes")
         }
      });

      //register add listener primarily for receiving
      chrome.bluetoothSocket.onReceive.addListener(function(receiveInfo) {
        if (receiveInfo.socketId != socketId)
          return;
        var code = ab2str(receiveInfo.data);
        console.log("Data received: " + code);
        portx.postMessage({"code":code});
        chrome.bluetoothSocket.close(receiveInfo.socketId);
      });
    }
};




// For long-lived connections:
chrome.runtime.onConnectExternal.addListener(function(port) {
  portx= port;
  port.onMessage.addListener(function(msg) {
    console.log("Received message from content_script");

    //registering the error receiver
    chrome.bluetoothSocket.onReceiveError.addListener(function(errorInfo) {
        // Cause is in errorInfo.error.
        console.log(errorInfo.errorMessage);
        portx.postMessage({"code":null,"error":errorInfo.errorMessage});
        return true;
      });

    //create connection and connect
    chrome.bluetoothSocket.create(function(createInfo) {
          console.log(createInfo.socketId);
          chrome.bluetoothSocket.connect(createInfo.socketId,
          registeredDevice, uuid, onConnectedCallback);
          socketId = createInfo.socketId;
        });
    return true;
  });
  return true;
});



/*chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log("request : " + request);
    if (request.type == "code"){
       //sendResponse({"code":"dummy_code"});
       //register receiver error listener for error handling/logging
      chrome.bluetoothSocket.onReceiveError.addListener(function(errorInfo) {
        // Cause is in errorInfo.error.
        console.log(errorInfo.errorMessage);
        portx.postMessage({"code":null,"error":errorInfo.errorMessage});
        chrome.bluetooth.setPause(socketId,false);

      });
       chrome.bluetoothSocket.create(function(createInfo) {
          chrome.bluetoothSocket.connect(createInfo.socketId,
          registeredDevice, uuid, onConnectedCallback);
          socketId = createInfo.socketId;
        });
    }
});
*/

console.log("Registered Event Listener for Messages");






  console.log("Registered Event Handler for an external event");
};

