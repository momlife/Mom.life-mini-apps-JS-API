# Description
Below you can become familiar with description of connection and use "Preggie extension js api" - JavaScript library for working with PreggieAPP (Preggie native application).

"Preggie extension js api" is a bridge between PreggieAPP and developer’s JS application. JS-API provides the ability to call native methods of PreggieAPP application.
 
# Connection
Download\ clone project from bitbucket.
 
- git clone git@bitbucket.org:momlife/extensions-js-api.git
- https://bitbucket.org/momlife/extensions-js-api

Create html page with connected js-api:
    
    <!DOCTYPE html>
    <html>
    <head lang="en">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <title>Test Preggie App</title>
    
        <script src="path-to-preggie-extensions-js-api/build/preggieapi.min.js"></script>        
    </head>
    <body>
    <p>
        <button onclick="alert(PREGGIEAPI.API.getCurrentUserId());">Get current user id</button>
    </p>
    
    <p>
        <input type="text" id="message" placeholder="Message">
        <button onclick="PREGGIEAPI.API.showToast(document.getElementById('message').value)">showToast</button>
    </p>
    
    <p>
        <button id="upload">Upload file</button>
        <div id="uploadLog"></div>
        <script>
            var log = function(id){
    
                return function(message){
                    if(!message){
                        document.getElementById(id).innerHTML = '';
    
                        return;
                    }
    
                    var span = document.createElement('div');
                    span.innerHTML = message;
    
                    document.getElementById(id).appendChild(span);
    
                    return message;
                }
            };
    
            document.getElementById('upload').onclick = function(){
                var _log = log('uploadLog');
    
                _log(null);
    
                PREGGIEAPI.API.upload('path-to-self-server/upload/file', {
                    progress: function(data){
                        _log('upload progress=' + data.progress);
                    },
                    success: function(data){
                        _log('success. name is ' + data.name);
    
                    },
                    error: function(error){
                        _log('Error: ' + JSON.stringify(error));
                    },
                    preview: function(base64){
                        _log('base64 image is - <img src="data:image/gif;base64,' + base64 + '" />');
                    }
                })
            }
        </script>
    </p>
    
    <p>
        <button onclick="alert('getAppId()->' + PREGGIEAPI.API.getAppId());">Get AppId</button>
    </p>
    
    <p>
        <button id="makePaiment">Make payment in the amount of 100 rubles - makePaiment()</button>
        <div id="makePaimentLog"></div>
        <script>
            document.getElementById('makePaiment').onclick = function () {
                var _log = log('makePaimentLog');
    
                PREGGIEAPI.API.makePayment(100, {
                    success: function(data){
                        _log('success. transaction_id is ' + data.transaction_id);
                    },
                    error: function(data){
                        _log('error. statusText is ' + data.statusText);
                        _log('status is ' + data.status);
                    }
                });
            }
        </script>
    </p>
    
    
    <p>
        <button id="canExit">get canExit()</button>
        <button id="canExitOff">set canExit() to false</button>
        <button id="canExitOn">set canExit() to true</button>
        <div id="canExitLog"></div>
        <script>
            document.getElementById('canExit').onclick = function () {
                var _log = log('canExitLog');
    
                _log('canExit() = ' + PREGGIEAPI.API.canExit());
            };
    
            document.getElementById('canExitOff').onclick = function () {
                var _log = log('canExitLog');
    
    
                _log('canExit() = ' + PREGGIEAPI.API.canExit(false));
            };
    
            document.getElementById('canExitOn').onclick = function () {
                var _log = log('canExitLog');
    
    
                _log('canExit() = ' + PREGGIEAPI.API.canExit(true));
            }
    
        </script>
    </p>
    
    </body>
    </html>


Example above contains calls to available methods from PreggieAPP. The entry point to APP is a global object **PREGGIEAPI**.

If this page runs in browser (not in Preggie application), will be used mock data (for development). 
 If runs in PreggieAPP application, will be used data obtained directly from the very PreggieAPP.

Full description of methods can be found [here](http://docs.momlifeextensionsdocumentation.apiary.io/#reference).