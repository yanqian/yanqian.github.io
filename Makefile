.PHONY: help init verify test build serve

BASE_URL ?= https://yanqian.github.io/

help:
	@echo "Available targets:"
	@echo "  make init     Run the full verification entry point"
	@echo "  make verify   Alias for init"
	@echo "  make test     Run Python unittest discovery"
	@echo "  make build    Run production-style Hugo build"
	@echo "  make serve    Start local Hugo preview server"

init:
	./init.sh

verify: init

test:
	python3 -m unittest discover -s tests

build:
	hugo --gc --minify --baseURL "$(BASE_URL)"
	test -f public/index.html

serve:
	hugo server

