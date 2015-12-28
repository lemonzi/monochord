/**
 * Parallel Second Order Section using Web Audio API
 * Quim Llimona, 2015
 */

function SecondOrderSection(ctx, params) {
    this.ctx = ctx;

    this.params = params || {};
    $.extend(this.params, {
        frequencies: [500, 700, 800],
        q: 10
    });

    var that = this;
    this.nodes = this.params.frequencies.map(function(f) {
        var filter = ctx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = f;
        filter.Q.value = that.params.q;
        return filter;
    });

    for (var i = 1; i < this.nodes.length; i++) {
        this.nodes[i-1].connect(this.nodes[i]);
    }

    this.input = this.nodes[0];
    this.output = this.nodes[this.nodes.length-1];
}

