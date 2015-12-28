Monochord App
=============

This web application is a prototype made for Prof. Peter Schubert at McGill University. It consists on a number of WebAudio-based monochord instruments that can be tuned with extreme precision, and will serve as an educational tool for learning about intervals and tuning systems.

The application itself is a static web page that can be embedded anywhere, but it required some Node.js tools for bundling everything together. If you are a user of this, you are looking for the `dist` folder (only included in git releases).

Contributing
------------

* See the attached `Makefile` for compilation and bundling.
* All new CSS and JS files (including external libraries) must be listed _both_ in `bundle.{js,css}` and `Makefile`. 
* If you add additional assets (an image folder, etc.) you must include them in the `Makefile` as well.
* `bundle.*` files are for development only, to ease dependency injection.
* You may place HTML fragments in `fragments/`, and load them with jQuery's `.load()`.
* Client-side dependencies are managed with NPM.

