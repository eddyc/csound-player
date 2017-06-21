
(function () {

    "use strict";


    function initialise(self) {

        var editor = ace.edit(self.$.editor);
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/javascript");
        var output = ace.edit(self.$.output);
        output.setTheme("ace/theme/monokai");
        output.getSession().setMode("ace/mode/text");
        output.setReadOnly(true);
        output.setShowPrintMargin(false);
        output.renderer.setShowGutter(false);
        output.setHighlightActiveLine(false);
        //editor.$blockScrolling = Infinity;
        output.renderer.$cursorLayer.element.style.opacity = 0;

        getFileFromServer(self.csdFile, function(text) {

            editor.setValue(text, 1);
        });

        Split(['#editor', '#output'], {
            direction:'vertical',
            sizes: [50, 50],
            onDrag:function() {

                editor.resize();
                output.resize();
            }
        })


        self.$.csoundEngine.printOutputCallback = function(string) {

            if (output.getValue().endsWith("\n") === false) {

                string = output.getValue() + "\n"  + string
            }
            else {

                string = output.getValue() + string;
            }

            output.setValue(string, 1);
        };

        self.$.PlayButton.onclick = function() {

            self.$.csoundEngine.play(editor.getValue());
        }

        self.$.ResetButton.onclick = function() {

            self.$.csoundEngine.reset();
        }

        self.$.ClearConsole.onclick = function() {

            output.setValue("", 1);
        }
    }


    function getFileFromServer(url, doneCallback) {
        var xhr;

        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handleStateChange;
        xhr.open("GET", url, true);
        xhr.send();

        function handleStateChange() {
            if (xhr.readyState === 4) {
                doneCallback(xhr.status == 200 ? xhr.responseText : null);
            }
        }
    }


    Polymer({
        is: 'csound-player',
        properties: {
            csdFile:String,
        },
        ready:function() {

            initialise(this);
        }
    });

})();
