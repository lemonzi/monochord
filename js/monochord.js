/**
 * MonoChord
 *
 * This is the audio engine. Pipeline:
 * 
 * Additive synth  -----------|
 *                            |-- Low-pass filter -- ADSR
 * Noise generator -- ADSR  --|
 *
 * The output of this pipeline is then connected to a bank of resonators
 * in the main script.
 *
 * The beta mentioned in the code is a timbre control parameter. It's supposed
 * to simulate plucking the string at different positions by interpolating
 * how triangular or sawtooth the wave looks like, but it doesn't work very 
 * well.
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
        noise: new AudioWorkletNode(ctx , 'noise_worklet', {}),
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

    /*
     * This is where the magic happens. We have a custom additive synth
     * with some transient noise. In this function, we define all the
     * envelopes and trigger them.
     */
    play: function(when, where) {
        // Check that this monochord wasn't already playing.
        // If it was, we will override it, so we just clear the timeout.
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        // Prepare oscillator by clearing it
        if (this.nodes.osc) {
            this.nodes.osc.stop();
            this.nodes.osc.disconnect();
        }
        // Create the oscillator for this note
        this.nodes.osc = this.ctx.createOscillator();
        // Set the partial amplitudes (spectrum)
        this.setBeta(where);
        // Set the required frequency
        this.nodes.osc.frequency.value = this.params.frequency;
        // Conect to the pipeline
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
        
        // Make sure we reset the system and stop the note after 10 seconds
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
        for (var n = 1; n <= nfft; n++) {
            real[n-1] = c1 * Math.pow(-1, n) * Math.sin(n * c2) / (n*n);
        }

        this.nodes.osc.setPeriodicWave(
            this.ctx.createPeriodicWave(real, imag)
        );
    }

});

