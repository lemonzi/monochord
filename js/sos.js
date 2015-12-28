/**
 * Parallel Second Order Section
 * Quim Llimona, 2015
 */

function SecondOrderSection(ctx, params) {
    this.ctx = ctx;

    this.params = params || {};
    $.extend(this.params, {
        resonators: [
            {f: 300,  g: 0.6,  q: 10}, 
            {f: 500,  g: 0.3,  q: 10}, 
            {f: 1000, g: 0.5,  q: 10}, 
            {f: 3000, g: 1.0,  q: 0.1}
        ],
        gain: 1.0
    });

    this.nodes.input = ctx.createGain();
    this.node.output = ctx.createGain();
    this.node.output.gain = this.params.gain;
    this.nodes.resonators = this.params.resonators.map(function(r) {
        // gain
        var gain = ctx.createGain();
        gain.gain.value = r.g;
        // 2nd order resonator
        var filter = ctx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = r.f;
        filter.Q.value = this.params.r.q;
        // patch
        this.node.input.connect(filter);
        filter.connect(gain);
        gain.connect(this.node.output);
        // return resonator object
        return {r: filter, g: gain};
    }.bind(this));

    this.input = this.nodes.input;
    this.output = this.nodes.output;
}

