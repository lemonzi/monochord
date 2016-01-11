/**
 * Monochord UI component, with everything needed
 * Quim Llimona, 2015
 */

function MonoChordUI(opts) {
    
    this.ctx = opts.ctx;
    this.range = {min: opts.min, max: opts.max};
    this.osc = new MonoChord(this.ctx);
    this.monochord = $('<div class="monochord enabled">');
    this.bridge = $('<div class="bridge enabled">');

    this.monochord.append(opts.template.clone());

    this.knobs = {
        chord: this.monochord.find(".chord .knob"),
        fine: this.monochord.find(".fine .knob"),
        superfine: this.monochord.find(".super-fine .knob")
    };

    // Some specific default values
    this.knobs.chord.data({min: this.range.min, max: this.range.max});
    this.knobs.fine.data({incr: 0.05, min: 1, max: 1000});
    this.knobs.superfine.data({incr: 0.005, min: 1, max: 1000});

    // Init knobs
    var that = this;
    this.monochord.find(".knob").knob({
        step: 0.01,
        format: function(v) { return v.toFixed(2) + " Hz" }, 
        change: function(v) {
            var chord = that.knobs.chord;
            if (this.$.data("relative")) {
                var vn = v / this.$.data("max");
                var diff = vn - (this.$.data("lastValue") || vn);
                if (diff > 0.5) diff -= 1;
                if (diff < -0.5) diff += 1;
                var incr = 1 + this.$.data("incr") * diff;
                var newFreq = that.frequency * incr;
                newFreq = Math.min(newFreq, chord.data("max"));
                newFreq = Math.max(newFreq, chord.data("min"));
                that.setFrequency(newFreq);
                this.$.data("lastValue", vn);
            } else {
                that.setFrequency(v, true);
            }
        }, 
        release: function() {
            if (this.$.data("relative")) {
                this.$.data("lastValue", 0);
            }
        }
    });
    
    this.knobs.fine.val(1).trigger('change');
    this.knobs.superfine.val(1).trigger('change');

    // Bridge highlight
    this.monochord.hover(function() {
        that.bridge.addClass("active");
    }, function() {
        that.bridge.removeClass("active");
    });

    // Toggle button
    this.monochord.find(".play").click(function() {
        $([that.monochord, that.bridge]).toggleClass("enabled");
    });

    // Default frequency
    this.setFrequency(opts.frequency);
}


$.extend(MonoChordUI.prototype, {

    setFrequency: function(f, silent) {
        this.frequency = f;
        this.osc.setFrequency(f);
        if (!silent) {
            this.knobs.chord.val(f);
            this.knobs.chord.trigger("change");
        }
        var pos = 100 * (this.range.min/f) + "%";
        this.bridge.css("right", pos);
    }

});

