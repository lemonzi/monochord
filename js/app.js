$(function() {
    
    var ctx = new AudioContext();
    var chord = new MonoChord(ctx);
    chord.output.connect(ctx.destination);
    
    window.chord = chord;

});
