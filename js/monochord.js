/**
 * MonoChord
 * Quim Llimona, 2015
 */

function MonoChord(ctx, params) {
    this.ctx = ctx;

    this.params = $.extend({
        frequency: 440,
        beta: 5, 
    }, params);

    this.nodes = {
        osc: ctx.createOscillator(),
        losses: ctx.createBiquadFilter(), 
        envelope: ctx.createGain()
    };
    
    this.nodes.osc.connect(this.nodes.losses);
    this.nodes.losses.connect(this.nodes.envelope);

    this.setBeta(this.params.beta);
    this.setFrequency(this.params.frequency);
    this.nodes.osc.start();

    this.nodes.losses.type = this.nodes.losses.LOWPASS || 'lowpass';
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
        lop.cancelScheduledValues(t);

        t += 0;
        env.setValueAtTime(1, t);
        lop.setValueAtTime(4000, t);

        t += 0.01;
        env.setTargetAtTime(0.5, t, 0.1);
        lop.setTargetAtTime(2000, t, 0.3);

        t += 0.4;
        env.setTargetAtTime(0, t, 1);
        lop.setTargetAtTime(1000, t, 1);
        
        t += 0.5;
        lop.setTargetAtTime(500, t, 0.5);
    }, 

    setFrequency: function(freq) {
        this.params.frequency = freq;
        this.nodes.osc.frequency.value = freq;
    },

    setBeta: function(beta) {
        this.params.beta = beta;
        var nfft = 512;

        var real = new Float32Array(nfft);
        var imag = new Float32Array(nfft);

        var m = this.params.beta;
        var c1 = 2 * m * m / ((m-1) * Math.PI * Math.PI);
        var c2 = (m-1) * Math.PI / m;
        for (var n = 0; n < nfft; n++) {
            real[n] = c1 * Math.pow(-1, n) * Math.sin(n * c2) / (n*n);
        }

        this.nodes.osc.setPeriodicWave(
            this.ctx.createPeriodicWave(real, imag)
        );
    }

});

