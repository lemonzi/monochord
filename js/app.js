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

    // Load monochords
    $(".monochord").load("fragments/monochord.html", function() {
        var $m = $(this);
        $m.each(function() {
            var osc = new MonoChord(ctx, {frequency: $(this).data("freq")});
            osc.output.connect(body.input);
            $(this).data("osc", osc);
        });
        $m.find(".chord .knob").data({min: 100, max: 1000});
        $m.find(".fine .knob").data("incr", 0.05);
        $m.find(".super-fine .knob").data("incr", 0.005);
        $m.find(".knob").knob({
            min: 0,
            max: 1000,
            step: 0.01,
            change: function(v) {
                var monochord = this.$.parents(".monochord");
                var osc = monochord.data("osc");
                var chord = monochord.find(".chord .knob");
                var vn = v / 1000;
                if (this.$.data("relative")) {
                    var diff = vn - (this.$.data("lastValue") || 0);
                    if (diff > 0.5) diff -= 1;
                    if (diff < -0.5) diff += 1;
                    var incr = 1 - this.$.data("incr") * diff;
                    var newFreq = osc.params.frequency * incr;
                    osc.setFrequency(newFreq);
                    chord.val(newFreq).trigger("change");
                    this.$.data("lastValue", vn);
                } else {
                    var offset = this.$.data("min");
                    var range = this.$.data("max") - offset;
                    osc.setFrequency(vn * range + offset);
                }
            }
        })
        $m.each(function() {
            var knob = $(this).find(".chord .knob");
            knob.val($(this).data("freq")).trigger("change");   
        });
        $m.find(".play").click(function() {
            $(this).parents(".monochord").data("osc").play();
        });
        $(document).keypress(function(e) {
            if (e.which == 32) {
                $(".monochord").each(function() {
                    $(this).data("osc").play();
                });
            }
        });
    });

});

