/**
 * Monochord demo app
 * Quim Llimona, 2015
 */

$(function() {
    
    // Create the global audio context (one per app!)
    var ctx = new AudioContext();

    // Create audio blocks
    var osc = new MonoChord(ctx);
    var body = new SecondOrderSection(ctx);

    // Connect everything together
    osc.output.connect(body.input);
    body.output.connect(ctx.destination);
    
    // Global exposure for debugging
    window.chord = osc;

    // Load monochords
    $(".monochord").load("fragments/monochord.html", function() {
        $(".knob").knob({min: 0, max: 1000, step: 0.01});
        $(".play").click(function() {
            osc.play();
        });
    });

});

