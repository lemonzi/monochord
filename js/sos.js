/**
 * Series Second Order Section
 *
 * This module impements a bank of second-order peaking filters 
 * (resonators) connected in series.
 *
 * Quim Llimona, 2015
 */

function SecondOrderSection(ctx, params) {
    this.ctx = ctx;

    this.params = $.extend({
        resonators: [
            {f: 100,   g: 5,  q: 5}, 
            {f: 170,   g: 6,  q: 5}, 
            {f: 200,   g: 3,  q: 7}, 
            {f: 3000,  g: 2,  q: 10}
        ],
        gain: 0.2
    }, params);

    this.nodes = {
        input: ctx.createGain(), 
        output: ctx.createGain(), 
        resonators: this.params.resonators.map(function(r) {
            var filter = ctx.createBiquadFilter();
            filter.type = filter.PEAKING || "peaking";
            filter.frequency.value = r.f;
            filter.Q.value = r.q;
            filter.gain.value = r.g;
            return filter;
        }.bind(this))
    };
    this.nodes.output.gain.value = this.params.gain;

    // Series structure
    var n = this.nodes;
    n.input.connect(n.resonators[0]);
    for (var i = 1; i < n.resonators.length; i++) {
        n.resonators[i-1].connect(n.resonators[i]);
    }
    n.resonators[n.resonators.length-1].connect(n.output);

    this.input = this.nodes.input;
    this.output = this.nodes.output;
}

