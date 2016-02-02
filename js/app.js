/**
 * Monochord demo app
 *
 * This is the main script. After the document is loaded:
 *
 * - We define global callbacks with their state for the buttons
 * - We read the settings from the URL, be it raw or encoded in a preset
 * - We create the monochords accordingly
 * - We setup the required callbacks for user intpu
 *
 * Quim Llimona, 2015
 */

$(function() {

    // Save the original URL and parse the base64-encoded preset if provided
    var settings = new URI(window.location.href);
    var preset = getQueryVariable("p");
    if (preset) {
        preset = JSON.parse(atob(URI.decode(preset)));
    }

    // This function can show or hide all monochord frequencies
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
            osc.play(when);
        });
        if (e && e.preventDefault) {
            e.preventDefault();
        }
    }

    // This function creates a link with the current monochord settings 
    // embedded in a base64-encoded JSON object.
    function createLink(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        var freqs = monochords.map(function(m) {
            return m.osc.params.frequency;
        });
        var enabled = monochords.map(function(m) {
            return m.monochord.hasClass("enabled");
        });
        settings.removeQuery("f");
        settings.removeQuery("p");
        var preset = {freqs: freqs, enabled: enabled};
        settings.addQuery("p", btoa(JSON.stringify(preset)));
        var url = settings.toString();
        window.prompt("The current settings have been saved at:", url);
    }
     
    // Create the global audio context (one per app!)
    var ctx = new AudioContext();

    // Create instrument body and send to speakers
    var body = new SecondOrderSection(ctx);
    body.output.connect(ctx.destination);

    // Parse frequencies (preset, manually set, or default)
    var freqs = [];
    if (preset) {
        freqs = preset.freqs;
    } else {
        freqs = getQueryVariable("f");
        if (freqs) {
            freqs = freqs.split(",").map(parseFloat);
        } else {
            freqs = [200, 400, 600, 800];
        }
    }

    var minFreq = getQueryVariable("min", "number") || 100;
    var maxFreq = getQueryVariable("max", "number") || 800;
    var where = getQueryVariable("timbre", "number") || 0.01;

    // Create monochords
    var monochords = [];
    $.get("fragments/monochord.html", function(t) {
        monochords = freqs.map(function(f) {
            var m = new MonoChordUI({
                ctx: ctx,
                beta: where, 
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
        if (preset) {
            for (var i = 0; i < preset.enabled.length; i++) {
                if (!preset.enabled[i]) {
                    monochords[i].monochord.find(".play").click();
                }
            }
        } else {
            if (getQueryVariable("disable", "boolean")) {
                $(".monochord .play").click();
                monochords[0].monochord.find(".play").click();
                if (monochords.length > 1) {
                    monochords[1].monochord.find(".play").click();
                }
            }
        }

        // Hide frequency by default if requested. In that case, we don't
        // allow users to enable its display.
        var hide = getQueryVariable("hide", "boolean");
        if (hide) {
            $(".freq-btn").hide();
        }
        toggleDisplayFrequencies(!hide);
    });

    // Keyboard shortcuts
    $(document).bind('keydown', 'space', playAll);

    // This is bit hacky, but it display the play sign when shift
    // is presssed on the monochords to play them alone.
    $(document).bind('keydown', 'shift', function() {
        $(".monochord .play").addClass("alt");
    });
    $(document).bind('keyup', 'shift', function() {
        $(".monochord .play").removeClass("alt");
    });

    // Buttons
    $(".play-btn").click(playAll);
    $(".freq-btn").click(toggleDisplayFrequencies);
    $('.link-btn').click(createLink);

});

