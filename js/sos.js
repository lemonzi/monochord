/**
 * Series Second Order Section
 * Quim Llimona, 2015
 */

function SecondOrderSection(ctx, params) {
    this.ctx = ctx;

    this.params = params || {};
    $.extend(this.params, {
        resonators: [
            {f: 300,   g: 3,  q: 20}, 
            {f: 500,   g: 6,  q: 30}, 
            {f: 1000,  g: 3,  q: 20}, 
            {f: 3000,  g: 10, q: 40}
        ],
        gain: 0.5
    });

    this.nodes = {
        input: ctx.createGain(), 
        output: ctx.createGain(), 
        resonators: this.params.resonators.map(function(r) {
            var filter = ctx.createBiquadFilter();
            filter.type = "peaking";
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

