Changelog
=========

## Unreleased

- Upgrade dev-dependencies
  * Upgrade `documentation` to 9.0.0 to support babel7
  * Upgrade all other dependencies
- Use minified build for the browsers via the `browser` field
- Fix eslint errors introduced with recent dep upgrade
- Add note about using CDNs to README
- Add files field to package.json to reduce module size


## v0.7.0 - 2018-10-04

- Upgrade build stack
- Replace standard with prettier
- Build only UMD files
- Remove dist files from repo
  * jsdelivr.com and unpkg.com are good enough
  * TODO: update README after release
- Format code with prettier
- Add CHANGELOG


## v0.6.0 - 2018-03-05

- Add node 8 series to travis config since it became LTS
- chore(package): update tap to version 11.0.0
- chore(package): update documentation to version 6.0.0
- chore(package): update rollup to version 0.56.4
- Use airbnb-base instead of full airbnb eslint config
- Upgrade babel tools and move config into own file
- Upgrade eslint deps and move config into own files
- Update package-lock
- Re-build distribution files


## v0.5.0 - 2017-10-06

- chore(package): update rollup to version 0.50.0
- chore(package): update eslint-config-airbnb to version 16.0.0
- Remove ignore modules from greenkeeper
- Upgrade dependencies and fix linting errors
- Build distribution files


## v0.3.2 - 2017-08-28

- Add tests for domList
- Add eslint-config-airbnb for stricter linting
- Fix linting errors reported by airbnb config
- Override airbnb's max line length configuration
- Adjust lines to 80 chars
- Remove empty lines
- Update dev-dependencies
- Add more alternatives
- chore(package): update dependencies
- docs(readme): add Greenkeeper badge
- Ignore eslint-plugin-jsx-a11y v6
- Better place the greenkeeper badge
- Remove extra empty line in README
- Update lock file


## v0.3.1 - 2017-07-15

- Add missing URLs to repo badges


## v0.3.0 - 2017-07-15

- Update distribution builds
- Add documentationjs linter to lint script


## v0.2.0 - 2017-07-15

- Add JSDoc blocks for dom-list.js
- Add JSDoc blocks for dom-toc.js
- Fix some doc typos in tree.js
- Add JSDoc blocks for md-list.js
- Add JSDoc blocks for md-toc.js
- Add CONTRIBUTING guide
- Improve content in README.md
- Add keywords to package.json
- Add missing repository link to package.json
- Add docs script to generate API docs using `documentation`
- Add publish-docs script that uses `gh-pages`
- Add homepage to package.json


## v0.1.2 - 2017-07-13

- Remove node v4 from travis build
- Add some badges to README
