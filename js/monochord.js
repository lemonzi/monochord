/**
 * MonoChord
 * Quim Llimona, 2015
 */

function MonoChord(ctx, params) {
    this.ctx = ctx;

    this.params = params || {};
    $.extend(this.params, {
        frequency: 110,
        tau: 1
    });

    this.nodes = {
        osc: ctx.createOscillator(),
        losses: ctx.createBiquadFilter(), 
        envelope: ctx.createGain()
    };
    
    this.nodes.osc.connect(this.nodes.losses);
    this.nodes.losses.connect(this.nodes.envelope);

    this.nodes.osc.type = 'sawtooth';
    this.nodes.osc.frequency.value = this.params.frequency;
    this.nodes.osc.start();

    this.nodes.losses.type = 'lowpass';
    this.nodes.losses.frequency.value = ctx.sampleRate / 2;

    this.input = null;
    this.output = this.nodes.envelope;
}


$.extend(MonoChord.prototype, {

    play: function() {
        var now = this.ctx.currentTime;

        var env = this.nodes.envelope.gain;
        env.cancelScheduledValues(now);
        env.setValueAtTime(1, now);
        env.setTargetAtTime(0, now, this.params.tau);

        var lop = this.nodes.losses.frequency;
        lop.cancelScheduledValues(now);
        lop.setValueAtTime(this.ctx.sampleRate / 2,  now);
        lop.setTargetAtTime(0, now,  this.params.tau);
    }, 

    setFrequency: function(freq) {
        this.nodes.osc.frequency.value = freq;
    }

});

