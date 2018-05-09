# Change Log for sd-range-slider
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

[1.8.0] 2018.05.09
### Added
- New props, `restrictedLower` and `restrictedHigher` may be passed to the component to alter when it uses certain formatting options

[1.7.0] 2018.04.13
### Changed
- The categorical version of the component will no longer allow a user to clear all selections

[1.6.2] 2018.03.24
### Changed
- Remove duplicates from value prop if the slider is for a categorical variable

[1.6.1] 2018.03.24
### Changed
- Bugfix to actually fire values back to server

[1.6.0] 2018.03.24
### Changed
- Updates to support a categorical variable via `Checkboxes`

[1.5.0] 2018.02.24
### Changed
- Updates to use Flow instead of `prop-types` library
