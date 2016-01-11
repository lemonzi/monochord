/**
 * Monochord demo app
 * Quim Llimona, 2015
 */

$(function() {

    // This function can show and hide monochord frequencies
    var displayFrequencies = false;
    function toggleDisplayFrequencies(show) {
        if (typeof show !== "boolean") {
            show = !displayFrequencies;
        }
        displayFrequencies = show;
        if (show) {
            $(".monochord .chord .knob").show();
        } else {
            $(".monochord .chord .knob").hide();
        }
        $(".freq-btn").text((show ? "Hide" : "Show") + " frequencies");
        $(".freq-btn").blur();
    }

    // This function plays all enabled monochords trying to 
    // minimize latency
    var where = parseFloat(getQueryVariable("timbre")) || 0.01;
    var jitter = parseFloat(getQueryVariable("jitter")) || 0.03;
    function playAll() {
        var oscs = monochords.filter(function(m) {
            return m.monochord.hasClass("enabled");
        }).map(function(m) {
            return m.osc;
        });
        var now = ctx.currentTime + 0.05;
        oscs.forEach(function(osc) {
            var when = now + Math.random() * jitter;
            osc.play(when, where);
        });
        $(".play-btn").blur();
    }
     
    // Create the global audio context (one per app!)
    var ctx = new AudioContext();

    // Create body and send to speakers
    var body = new SecondOrderSection(ctx);
    body.output.connect(ctx.destination);

    // Parse frequencies
    var freqs = getQueryVariable("f");
    if (freqs) {
        freqs = freqs.split(",").map(parseFloat);
    } else {
        freqs = [200, 400, 600, 800];
    }

    // Create monochords
    var monochords = freqs.map(function(f) {
        var m = new MonoChordUI({
            ctx: ctx,
            frequency: f
        });
        m.osc.output.connect(body.input);
        $(".container").append(m.monochord);
        $(".string").append(m.bridge);
        return m;
    });

    // Hide frequency if requested
    var hide = getQueryVariable("hide") && hide !== "false";
    toggleDisplayFrequencies(!hide);

    // Keyboard shortcuts
    $(document).bind('keydown', 'space', playAll);
    $(document).bind('keydown', 'f', toggleDisplayFrequencies);

    // Buttons
    $(".play-btn").click(playAll);
    $(".freq-btn").click(toggleDisplayFrequencies);

});

