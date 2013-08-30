test: jshint
	@./node_modules/.bin/mocha -R spec test.js

jshint:
	@./node_modules/.bin/jshint index.js test.js

.PHONY: jshint test
