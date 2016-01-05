JS_SRC=$(shell echo js/{lib/{getQueryVariable,AudioContextMonkeyPatch},sos,monochord,app}.js)
JS_LIB=$(shell echo node_modules/{jquery/dist/jquery.min.js,jquery-knob/dist/jquery.knob.min.js})
CSS_SRC=$(shell echo node_modules/normalize.css/normalize.css css/{monochord,style}.css)

all: serve

dist: $(JS_SRC) $(JS_LIB) $(CSS_SRC) fragments index.html
	mkdir -p $@
	cp index.html $@
	cp -R fragments $@
	uglifyjs $(JS_LIB) $(JS_SRC) >$@/bundle.js
	cat $(CSS_SRC) >$@/bundle.css

serve:
	open http://localhost:3000
	serve .

serve-dist: dist
	open http://localhost:3001
	serve -p 3001 dist

clean:
	rm -r dist

.PHONY: all serve clean

