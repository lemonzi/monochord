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
        filterbank: new SecondOrderSection(ctx),
        adsr: new ADSR(ctx, {tau: this.params.tau})
    };

    this.nodes.osc.connect(this.nodes.filterbank.input);
    this.nodes.filterbank.output.connect(this.nodes.adsr.input);

    this.nodes.osc.type = 'sawtooth';
    this.nodes.osc.frequency.value = this.params.frequency;
    this.nodes.osc.start();

    this.input = null;
    this.output = this.nodes.adsr.output;
}


$.extend(MonoChord.prototype, {

    play: function() {
        this.nodes.adsr.trigger();
    }

});

