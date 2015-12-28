/**
 * AR envelope with the Web Audio API
 * Quim Llimona, 2015
 */

function ADSR(ctx, params) {
    this.ctx = ctx;

    this.params = params || {};
    $.extend(this.params, {
        tau: 1
    });

    this.nodes = {
        gain: ctx.createGain()
    };

    this.nodes.gain.gain.value = 0;

    this.input = this.nodes.gain;
    this.output = this.nodes.gain;
};


$.extend(ADSR.prototype, {

    trigger: function() {
        var now = this.ctx.currentTime;
        var g = this.nodes.gain.gain;
        g.cancelScheduledValues(now);
        g.setValueAtTime(1, now);
        g.setTargetAtTime(0, now, this.params.tau);
    }

});

