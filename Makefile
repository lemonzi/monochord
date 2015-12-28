SRC=$(shell echo js/{AudioContextMonkeyPatch,adsr,sos,monochord,app}.js)
LIB=$(shell echo node_modules/jquery/dist/jquery.min.js)

all: dist

dist: dev
	mkdir $@
	cp index.html bundle.css $@
	cat $(LIB) $(SRC) | uglify >$@/bundle.js

serve: dev
	open http://localhost:4000
	python -m SimpleHTTPServer 4000

dev: bundle.js bundle.css index.html
	echo "Dev is done"

clean:
	rm -r dist

.PHONY: all dev clean

