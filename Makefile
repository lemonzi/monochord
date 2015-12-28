JS_SRC=$(shell echo js/{AudioContextMonkeyPatch,adsr,sos,monochord,app}.js)
JS_LIB=$(shell echo node_modules/jquery/dist/jquery.min.js)
CSS_SRC=$(shell echo css/style.css)

all: serve

dist: $(JS_SRC) $(JS_LIB) $(CSS_SRC) index.html
	mkdir -p $@
	cp index.html $@
	cat $(JS_LIB) $(JS_SRC) | uglify >$@/bundle.js
	cat $(CSS_SRC) >$@/bundle.css

serve:
	open http://localhost:4000
	python -m SimpleHTTPServer 4000

clean:
	rm -r dist

.PHONY: all serve clean

