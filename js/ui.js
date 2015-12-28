$("whatever").knob({
    min: 0,
    max: 20,
    stopper: false,
    change: function() {
	if (b > this.cv) {
	    if (up) {
		decr();
		up = 0;
	    } else {
		up = 1;
		down = 0;
	    }
	} else {
	    if (v < this.cv) {
		if (down) {
		    incr();
		    down = 0;

		} else {
		    down = 1;
		    up = 0
		}
	    }
	}
	v = this.cv;
    }
});
