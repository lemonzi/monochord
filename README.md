Monochord App
=============

This web application is a prototype made for Prof. Peter Schubert at McGill University. It consists on a number of WebAudio-based monochord instruments that can be tuned with extreme precision, and will serve as an educational tool for learning about intervals and tuning systems.

The application itself is a static web page that can be embedded anywhere, but it requires some Node.js tools for bundling everything together. If you are a user of this, you are looking for the `dist` folder (only included in releases).

Usage
-----

### How to distribute this

All that is needed are the contents of the `dist` folder, which includes `index.html` (the web page itself), `bundle.js` and `bundle.css` (the code), `img/` (some image assets), and `fragments/` (some template also required). You can place this in a subfolder of any webpage, and it will be served on there, or you can host it elsewhere and embed it using an iFrame. In both cases, you can use URL-parameters as will be detailed next for configuration; using an iFrame hides the parameters from the user, so it could be helpful. You could also use a URL shortener, but they will be access to the parameters once opened. 

### Available parameters

Used as follows:

`http://{website}?{parameter_1}={value}&{parameters_2}={value}`

Since the parameters are part of the URL, it's possible to save "presets" as web bookmarks or share them directly as links.

* `hide`: can be `true` or `false` (default: false). It hides both the frequency display and the frequency display button.
* `disable`: can be `true` or `false` (default: false). Disable all notes except the first two when the page is opened.
* `f`: is a list of number in the format `f=110,200,300` that defines the notes available and their default tuning.
* `timbre`: is a number that affects the timbre of the sound (similar to how the string is plucked).
* `jitter`: controls a small random de-synchronization during the onset, in seconds.
* `min`: minimum frequency (in Hz). This will be the reference point (open string) of the monochord.
* `max`: maximum frequency (in Hz).

Example:

`http://monochord.bitballoon.com/?f=220,331,442&timbre=0.01&jitter=0.2&hide=false&disable=true&min=100&max=800`

### Interface

* Click the Play button or hit the space bar to play all enabled notes (the ones with the power button in blue).
* The Show/Hide frequencies button toggles the display of each note's frequency on and off.
* You may click on the power buttons to enable or disable individual notes.
* You can drag the outer knob of the notes to directly set their frequency (in Hz).
* Inner knobs are relative and modify frequency in smaller increments. You can turn them as much as you want.
* It is also possible to directly write down the desired frequency in the display.
* The monochord on the top shows the position of the bridges that would result in the tuned notes if plucked on their right side, relative to the minimum available frequency. 

Contributing
------------

* See the attached `Makefile` for compilation and bundling strategies.
* All new CSS and JS files (including external libraries) must be listed _both_ in `bundle.{js,css}` and `Makefile`.
* If you add additional assets outside `img` or `fragments` you must include them in the `Makefile` as well.
* `bundle.*` files are for development only, to ease dependency injection.
* You may place HTML fragments in `fragments/`, and load them with AJAX. TODO: bundle this as well.
* Client-side dependencies are managed with NPM.

