var CsoundWrapper = function(parent) {

    let self = this;

    function printOutputCallback(string) {

        console.log(string);
    }

    if (!(navigator.mimeTypes['application/x-pnacl'] !== undefined)) {

        console.log("pNaCl not supported");
        var script = document.createElement('script');
        var path = parent.resolveUrl("csound-emscripten-6.08.0/javascripts/libcsound.js");

        script.src = path;

        Module = {};
        document.body.appendChild(script);

        setTimeout(check, 0);
        function check() {

            Module['_main'] = function() {

                if (typeof parent.printOutputCallback != 'undefined') {

                    Module['print'] = Module['printErr'] = parent.printOutputCallback;
                }
                else {

                    Module['print'] = Module['printErr'] = console.log;
                }

                let csoundObj = new CsoundObj();

                let fileManager = new FileManager();

                self.play = function(string) {

                    csoundObj.reset();
                    fileManager.writeStringToFile("text.csd", string);
                    csoundObj.compileCSD("text.csd");
                    csoundObj.start();

                }

                self.reset = csoundObj.reset;
            }

            Module["memoryInitializerPrefixURL"] = parent.resolveUrl("csound-emscripten-6.08.0/");
            Module['noExitRuntime'] = true;
        }
    }
    else {


        var path = parent.resolveUrl("csound6.08-pnacl/csound.js");
        console.log("pNaCl supported");

        var script = document.createElement('script');
        script.src = path;
        script.type = "text/javascript";

        parent.appendChild(script);

        setTimeout(check, 0);

        function check() {

            if (typeof csound === 'undefined') {

                setTimeout(check, 250); // Check again in a quarter second or so
                return;
            }

            csound.attachDefaultListeners();

            function createModule() {

                var model = document.createElement('embed');
                model.setAttribute('name', 'csound_module');
                model.setAttribute('id', 'csound_module');

                path = parent.resolveUrl("csound6.08-pnacl/Release");
                model.setAttribute('path', path);
                path = parent.resolveUrl("csound6.08-pnacl/Release/csound.nmf");
                model.setAttribute('src', path);
                var mimetype = 'application/x-pnacl';
                model.setAttribute('type', mimetype);
                var csoundhook = document.getElementById('engine');
                csoundhook.appendChild(model);
            }
            createModule();

            csound.module = document.getElementById('csound_module');

            if (typeof parent.printOutputCallback != 'undefined') {

                window.handleMessage = function(message) {

                    parent.printOutputCallback(message.data);
                }
            }
            else {

                window.handleMessage = function(message) {
                    console.log(message);

                }
            }

            self.play = function(string) {
                // csound.stop();
                csound.CompileCsdText(string);
                // csound.Play();
            }

            self.reset = function() {

                csound.destroyModule();
                createModule();
            }
        }
    }
}
