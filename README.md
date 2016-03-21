# Описание
Ниже идет описание подключения и использования "Preggie extension js api" - JavaScript библиотеки для работы с PreggieAPP (нативное приложение Preggie).

"Preggie extension js api" - это мост между PreggieAPP и JS приложением разработчика. JS-API дает возможность вызывать native методы приложения PreggieAPP.
 
# Подключение
Скачать\склонировать с bitbucket проект.
 
- git clone git@bitbucket.org:preggieapp/preggie-extensions-js-api.git
- https://bitbucket.org/preggieapp/preggie-extensions-js-api

Создать html страницу с подключенным js-api:
    
    <!DOCTYPE html>
    <html>
    <head lang="en">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <title>Test Preggie App</title>
    
        <script type="text/javascript">
            (Modules = window.Modules || {}).name = 'PREGGIEAPI';
        </script>
    
        <script src="path-to-preggie-extensions-js-api/build/preggieapi.min.js"></script>        
    </head>
    <body>
    <p>
        <button onclick="alert(PREGGIEAPI.API.getCurrentUserId());">Получить id текущего пользователя</button>
    </p>
    
    <p>
        <input type="text" id="message">
        <button onclick="PREGGIEAPI.API.showToast(document.getElementById('message').value)">showToast</button>
    </p>
    
    <p>
        <button id="upload">Загрузить файл</button>
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
        <button onclick="alert('getAppId()->' + PREGGIEAPI.API.getAppId());">Получить AppId</button>
    </p>
    
    <p>
        <button id="makePaiment">Совершить платеж в размере 100 рублей - makePaiment()</button>
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


В примере выше находятся вызовы доступных методов с PreggieAPP. 
Если эту страницу запустить не на уровное приложения Preggie, а в браузере - будут использоваться mock данные (для разработки) 

Полное описаниее методов можно найти по [ссылке](http://docs.preggieextensionsdocumentation.apiary.io/#).