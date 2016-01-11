/**
 * MonoChord
 *
 * This is the audio engine.
 *
 * Quim Llimona, 2015
 */

function MonoChord(ctx, params) {
    this.ctx = ctx;

    this.params = $.extend({
        frequency: 440,
        beta: 5, 
    }, params);

    this.nodes = {
        osc: null,
        losses: ctx.createBiquadFilter(), 
        envelope: ctx.createGain(),
        noise: ctx.createScriptProcessor(4096, 1, 1),
        noiseEnvelope: ctx.createGain()
    };

    this.nodes.noise.connect(this.nodes.noiseEnvelope);
    this.nodes.noiseEnvelope.connect(this.nodes.losses);
    this.nodes.losses.connect(this.nodes.envelope);

    this.nodes.noise.onaudioprocess = function(ev) {
        var data = ev.outputBuffer.getChannelData(0);
        var len = data.length;
        for (var i = 0; i < len; i++) {
            data[i] = (Math.random() - 0.5) * 2;
        }
    };

    this.nodes.noiseEnvelope.gain.value = 0;

    this.nodes.losses.type = this.nodes.losses.LOWPASS || 'lowpass';

    this.input = null;
    this.output = this.nodes.envelope;
}


$.extend(MonoChord.prototype, {

    play: function(when, where) {
        // Check timer 
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        // Prepare oscillator
        if (this.nodes.osc) {
            this.nodes.osc.stop();
            this.nodes.osc.disconnect();
        }
        this.nodes.osc = this.ctx.createOscillator();
        this.setBeta(where);
        this.nodes.osc.frequency.value = this.params.frequency;
        this.nodes.osc.connect(this.nodes.losses);

        var env = this.nodes.envelope.gain;
        var lop = this.nodes.losses.frequency;
        var noise = this.nodes.noiseEnvelope.gain;
        var t = when || this.ctx.currentTime;

        env.cancelScheduledValues(t);
        lop.cancelScheduledValues(t);

        t += 0;
        this.nodes.osc.start(t);
        env.setValueAtTime(1, t);
        noise.setValueAtTime(0.3, t);
        lop.setValueAtTime(8000, t);

        t += 0.03;
        noise.exponentialRampToValueAtTime(0.001, t);

        t += 2.;
        lop.exponentialRampToValueAtTime(1000, t);
        noise.linearRampToValueAtTime(0, t);

        t += 1.2;
        env.exponentialRampToValueAtTime(0.4, t);

        t += 3;
        env.exponentialRampToValueAtTime(0.01, t);
        lop.exponentialRampToValueAtTime(100, t);
        env.setTargetAtTime(0, t, 0.02);
        lop.setTargetAtTime(0, t, 0.02);
        
        this.timer = setTimeout(function() {
            this.nodes.osc.stop();
            this.nodes.osc.disconnect();
            this.nodes.osc = null;
            this.timer = null;
            this.nodes.losses.frequency.value = 20000;
            this.nodes.noiseEnvelope.gain = 0;
            this.nodes.envelope.gain = 1;
        }.bind(this), 10000);
    }, 

    setFrequency: function(freq) {
        this.params.frequency = freq;
        if (this.nodes.osc) {
            this.nodes.osc.frequency.value = freq;
        }
    },

    setBeta: function(beta) {
        if (beta) {
            this.params.beta = beta;
        }
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

