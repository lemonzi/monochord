/**
 * Monochord demo app
 * Quim Llimona, 2015
 */

$(function() {
    
    // Create the global audio context (one per app!)
    var ctx = new AudioContext();

    // Create body and send to speakers
    var body = new SecondOrderSection(ctx);
    body.output.connect(ctx.destination);

    // Create monochords
    var freqs = getQueryVariable("f");
    if (freqs) {
        freqs = freqs.split(",").map(parseFloat);
    } else {
        freqs = [200, 400, 600, 800];
    }
    var mono = '<div class="monochord enabled">';
    freqs.forEach(function(f) {
        $(".container").append($(mono).data({freq: f}));
    });

    // Load monochords
    $(".monochord").load("fragments/monochord.html", function() {
        // Get real monochord
        var $m = $(this).find(".monochord-wrapper");

        // Create synthesizer
        $m.each(function() {
            var freq = $(this).parent().data("freq");
            var osc = new MonoChord(ctx, {frequency: freq});
            osc.output.connect(body.input);
            $(this).data("osc", osc);
        });

        // Some specific default values
        $m.find(".chord .knob").data({min: 100, max: 1000});
        $m.find(".fine .knob").data({incr: 0.05, min: 1, max: 1000});
        $m.find(".super-fine .knob").data({incr: 0.005, min: 1, max: 1000});

        // Init knobs
        $m.find(".knob").knob({
            step: 0.01,
            format: function(v) { return v.toFixed(2) + " Hz" }, 
            change: function(v) {
                var monochord = this.$.parents(".monochord-wrapper");
                var osc = monochord.data("osc");
                var chord = monochord.find(".chord .knob");
                if (this.$.data("relative")) {
                    var vn = v / 1000;
                    var diff = vn - (this.$.data("lastValue") || vn);
                    if (diff > 0.5) diff -= 1;
                    if (diff < -0.5) diff += 1;
                    var incr = 1 + this.$.data("incr") * diff;
                    var newFreq = osc.params.frequency * incr;
                    newFreq = Math.min(newFreq, 1000);
                    newFreq = Math.max(newFreq, 100);
                    osc.setFrequency(newFreq);
                    chord.val(newFreq).trigger("change");
                    this.$.data("lastValue", vn);
                } else {
                    osc.setFrequency(v);
                }
            }, 
            release: function() {
                if (this.$.data("relative")) {
                    this.$.data("lastValue", 0);
                }
            }
        });

        // Set initial frequencies
        $m.each(function() {
            $(this).find(".knob").val(0).trigger("change");
            var knob = $(this).find(".chord .knob");
            knob.val($(this).parent().data("freq")).trigger("change");   
        });

        // Toggle button
        $m.find(".play").click(function() {
            var m = $(this).parents(".monochord-wrapper");
            var enabled = m.toggleClass("enabled");
        });

        // Hide frequency if requested
        var hide = getQueryVariable("hide") && hide !== "false";
        $m.find(".chord .knob").trigger('configure', {displayInput: !hide});

    });

    // Play with space bar at a random pluck position with jitter
    $(document).keypress(function(e) {
        if (e.which == 32) {
            $(".monochord-wrapper.enabled").each(function() {
                var osc = $(this).data("osc");
                var where = Math.random() * 4 + 3;
                var when = Math.random() * 0.05;
                osc.setBeta(where);
                osc.play(when);
            });
            e.preventDefault();
        }
    });

});

