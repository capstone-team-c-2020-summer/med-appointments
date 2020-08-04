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
