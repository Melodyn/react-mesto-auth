setup: install-dependencies run
install-dependencies:
	npm ci

lint:
	npx stylelint "./src/**/*.css"
	npx eslint --ext .js,.jsx ./src

run:
	npm run start

build:
	npm run build

ci-build:
	NODE_ENV=development CI=false make install-dependencies
	NODE_ENV=production CI=true make build

