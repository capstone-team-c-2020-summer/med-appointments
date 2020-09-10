# ---------- ---------- ---------- ---------- ---------- ----------
#
#   med-appointments
#
# ---------- ---------- ---------- ---------- ---------- ----------


target: help


.PHONY: help
help:
	@echo "Usage: make [PHONY]"
	@sed -n -e '/sed/! s/\.PHONY: //p' Makefile


.PHONY: all
all: run


.PHONY: run
run:
	@npm run serve


.PHONY: upgrade
upgrade:
	vue upgrade
	npm audit fix
	@echo "Suggestion: sudo npm update -g @vue/cli"


.PHONY: init
init:
	@npm install


.PHONY: build
build:
	@npm run build
	@mkdir -p output
	@mkdir -p output/css
	@mkdir -p output/js
	@cp -r ./dist/css/app.*.css ./output/css/app.css
	@cp -r ./dist/js/about.*.js ./output/js/about.js
	@cp -r ./dist/js/about.*.js.map ./output/js/about.js.map
	@cp -r ./dist/js/app.*.js ./output/js/app.js
	@cp -r ./dist/js/app.*.js.map ./output/js/app.js.map
	@cp -r ./dist/js/chunk-vendors.*.js ./output/js/chunk-vendors.js
	@cp -r ./dist/js/chunk-vendors.*.js.map ./output/js/chunk-vendors.js.map
	@printf '\n    '`git rev-parse HEAD`
	@printf '\n\n'


.PHONY: rebuild
rebuild: clean build


.PHONY: clean
clean:
	@rm -rf dist/ output/
