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
        } else if (show && show.preventDefault) {
            show.preventDefault();
        }
        displayFrequencies = show;
        if (show) {
            $(".monochord .chord .knob").show();
        } else {
            $(".monochord .chord .knob").hide();
        }
        $(".freq-btn").text((show ? "Hide" : "Show") + " frequencies");
    }

    // This function plays all enabled monochords trying to 
    // minimize latency
    var where = getQueryVariable("timbre", "number") || 0.01;
    var jitter = getQueryVariable("jitter", "number") || 0.03;
    function playAll(e) {
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
        if (e && e.preventDefault) {
            e.preventDefault();
        }
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

    var minFreq = getQueryVariable("min", "number") || 100;
    var maxFreq = getQueryVariable("max", "number") || 800;

    // Create monochords
    var monochords = [];
    $.get("fragments/monochord.html",  function(t) {
        monochords = freqs.map(function(f) {
            var m = new MonoChordUI({
                ctx: ctx,
                frequency: f, 
                min: minFreq,
                max: maxFreq, 
                template: $(t)
            });
            m.osc.output.connect(body.input);
            $(".container").append(m.monochord);
            $(".string").append(m.bridge);
            return m;
        });

        // Initially disable monochords if requested
        var disable = getQueryVariable("disable", "boolean");
        if (disable) {
            $(".monochord .play").click();
            monochords[0].monochord.find(".play").click();
            if (monochords.length > 1) {
                monochords[1].monochord.find(".play").click();
            }
        }

        // Hide frequency if requested
        var hide = getQueryVariable("hide", "boolean");
        if (hide) {
            $(".freq-btn").hide();
        }
        toggleDisplayFrequencies(!hide);
    });

    // Keyboard shortcuts
    $(document).bind('keydown', 'space', playAll);

    // Buttons
    $(".play-btn").click(playAll);
    $(".freq-btn").click(toggleDisplayFrequencies);

});

