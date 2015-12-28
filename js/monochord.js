/**
 * MonoChord
 * Quim Llimona, 2015
 */

function MonoChord(ctx, params) {
    this.ctx = ctx;

    this.params = params || {};
    $.extend(this.params, {
        frequency: 110,
        tau: {env: 1, lop: 0.5}
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
    this.nodes.losses.frequency.value = 0;
    this.nodes.losses.gain.value = 1;

    this.nodes.envelope.gain.value = 0;

    this.input = null;
    this.output = this.nodes.envelope;
}


$.extend(MonoChord.prototype, {

    play: function() {
        var env = this.nodes.envelope.gain;
        var lop = this.nodes.losses.frequency;

        var t = this.ctx.currentTime;
        env.cancelScheduledValues(t);
        env.setValueAtTime(1, t);
        lop.cancelScheduledValues(t);
        lop.setValueAtTime(this.ctx.sampleRate / 2, t);

        t += 0.01;
        lop.setTargetAtTime(this.ctx.sampleRate / 4, t, 0.005);
        env.setTargetAtTime(0, t, this.params.tau.env);

        t += 0.01;
        lop.setTargetAtTime(3000, t, this.params.tau.lop / 2);
        
        t += this.params.tau.lop;
        lop.setTargetAtTime(this.params.frequency, t, this.params.tau.lop);
    }, 

    setFrequency: function(freq) {
        this.params.frequency = freq;
        this.nodes.osc.frequency.value = freq;
    }

});

