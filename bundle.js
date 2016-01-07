/* 
 * For development only
 */

(function() {

    var scripts = [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/jquery.hotkeys/jquery.hotkeys.js',
        'node_modules/jquery-knob/dist/jquery.knob.min.js',
        'js/lib/getQueryVariable.js',
        'js/lib/AudioContextMonkeyPatch.js',
        'js/sos.js',
        'js/monochord.js',
        'js/monochord-ui.js',
        'js/app.js'
    ];

    scripts.forEach(function(s) {
        document.write('<script src="' + s + '"></script>');
    });

})();
