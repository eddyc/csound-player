
(function () {

    let self;
    let csoundWrapper;

    function initialise(parent) {

        self = parent;
        console.log("Everything online and looking good");
        csoundWrapper = new CsoundWrapper(parent);

        self.play = function(string) {

            csoundWrapper.play(string);
            console.log(string);
        }

        self.reset =  function() {
             csoundWrapper.reset();
        }

    }

    Polymer({
        is: 'csound-engine',
        properties: {
            csdFile:String,

        },
        attached:function() {

            initialise(this);
        }
    });

})();
