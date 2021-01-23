# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.10.2](https://github.com/mgrsskls/miyagi/compare/core/v1.10.1...core/v1.10.2) (2021-01-23)

### [1.10.1](https://github.com/mgrsskls/miyagi/compare/core/v1.10.0...core/v1.10.1) (2021-01-23)

## [1.10.0](https://github.com/mgrsskls/miyagi/compare/core/v1.9.0...core/v1.10.0) (2021-01-23)


### Features

* **core:** added automatically created styleguide based on custom properties ([e0e77e5](https://github.com/mgrsskls/miyagi/commit/e0e77e54bf2e0ad4f2efab796ca51b46f00fa769))
* **core:** Added theme.mode for light and dark miyagi themes ([3680f4b](https://github.com/mgrsskls/miyagi/commit/3680f4b1c53e6b327f8537fbdaae8ebccc9fcff5))
* **core:** automatically try to find a free port if defined port is in use ([7b0c2bd](https://github.com/mgrsskls/miyagi/commit/7b0c2bd5953042caffde5ae5d3b639ed3c463490))

## [1.9.0](https://github.com/mgrsskls/miyagi/compare/core/v1.8.4...core/v1.9.0) (2020-10-13)


### Features

* **core:** added assets.manifest option to be able to use a manifest file for CSS and JS files ([e357f83](https://github.com/mgrsskls/miyagi/commit/e357f83b8c273a5055cd952aa780db0b99e0b297))

### [1.8.4](https://github.com/mgrsskls/miyagi/compare/core/v1.8.3...core/v1.8.4) (2020-10-08)


### Bug Fixes

* **core:** make sure link color is always correct ([a9328c8](https://github.com/mgrsskls/miyagi/commit/a9328c8b0916bba038432d6bf515b02d103ed1b7))

### [1.8.3](https://github.com/mgrsskls/miyagi/compare/core/v1.8.2...core/v1.8.3) (2020-10-08)


### Bug Fixes

* **core:** fix variants not showing up when there are template files directly in the root folder ([5934f2e](https://github.com/mgrsskls/miyagi/commit/5934f2e2ac8c46ee8e74dcaacd59bf3145622ef7))

### [1.8.2](https://github.com/mgrsskls/miyagi/compare/core/v1.8.1...core/v1.8.2) (2020-10-05)


### Bug Fixes

* **core:** removed accidentally commited console.log ([3b9e581](https://github.com/mgrsskls/miyagi/commit/3b9e58128cb92dca6d62849fe74d30cc9120fe03))

### [1.8.1](https://github.com/mgrsskls/miyagi/compare/core/v1.8.0...core/v1.8.1) (2020-10-05)


### Bug Fixes

* **core:** components are always created relative from actual cwd when using "miyagi new" ([0139efe](https://github.com/mgrsskls/miyagi/commit/0139efed2644b1b15bccb7b3f33b825f4cc4b2e0))
* **core:** Fixes that tabs on the component view did sometimes not work in builds ([959be47](https://github.com/mgrsskls/miyagi/commit/959be47ed7977f8b3db81023bb8f27bf7337d3dd))

## [1.8.0](https://github.com/mgrsskls/miyagi/compare/core/v1.7.1...core/v1.8.0) (2020-08-27)


### Features

* **core:** allow putting info files in other folders ([59d49af](https://github.com/mgrsskls/miyagi/commit/59d49af8cb5a159185be3e41ac5426672bc0f659))
* **core:** render a view when README.md exists in a folder which is not a component folder ([0bb10ee](https://github.com/mgrsskls/miyagi/commit/0bb10eed9722eca53bf3a9c39681033785ff0af4))

## [1.7.1](https://github.com/mgrsskls/miyagi/compare/core/v1.6.3...core/v1.7.1) (2020-08-13)


### Features

* **core:** render tabs with schema and mocks on component view ([a7bd4a8](https://github.com/mgrsskls/miyagi/commit/a7bd4a8c25e4741e3289b7dd766f861b6222a4db))
* **core:** render template content on component view ([07c5790](https://github.com/mgrsskls/miyagi/commit/07c57904ef7e983a90312b8618544a75942b28cd))

### [1.6.3](https://github.com/mgrsskls/miyagi/compare/core/v1.6.2...core/v1.6.3) (2020-08-05)

### [1.6.2](https://github.com/mgrsskls/miyagi/compare/core/v1.6.1...core/v1.6.2) (2020-07-30)


### Bug Fixes

* **core:** fix validating schema when passed data is undefined instead of {} ([24289b0](https://github.com/mgrsskls/miyagi/commit/24289b03d28d028007b28948b3612017de64930c))

### [1.6.1](https://github.com/mgrsskls/miyagi/compare/core/v1.6.0...core/v1.6.1) (2020-07-23)


### Bug Fixes

* **core:** fix error when no schema option is provided ([12def85](https://github.com/mgrsskls/miyagi/commit/12def85ada686808cb3d08aa78247e148697fbb5))

## [1.6.0](https://github.com/mgrsskls/miyagi/compare/core/v1.5.0...core/v1.6.0) (2020-07-23)


### Features

* **core:** add more theme customization options ([db47814](https://github.com/mgrsskls/miyagi/commit/db4781449f50d7e601b8248ef7e26b5a2a8413e1))

## [1.5.0](https://github.com/mgrsskls/miyagi/compare/core/v1.4.3...core/v1.5.0) (2020-07-22)


### Features

* **core:** allow option es6Modules to be set for each NODE_ENV ([f83a062](https://github.com/mgrsskls/miyagi/commit/f83a06294963446263f78e28bf9cc6de1e3be349))

### [1.4.3](https://github.com/mgrsskls/miyagi/compare/core/v1.4.2...core/v1.4.3) (2020-07-22)


### Bug Fixes

* **core:** fix serving external assets in build ([0a25253](https://github.com/mgrsskls/miyagi/commit/0a252533c3aa65bb9a9ede809499a910c0ab5a0f))

### [1.4.2](https://github.com/mgrsskls/miyagi/compare/core/v1.4.1...core/v1.4.2) (2020-07-20)


### Bug Fixes

* **core:** add basePath for builds only to wrapper, not to iframe content ([6106625](https://github.com/mgrsskls/miyagi/commit/61066255700c7e36d8c3d877408ea86b800c86aa))

### [1.4.1](https://github.com/mgrsskls/miyagi/compare/core/v1.4.0...core/v1.4.1) (2020-07-20)


### Bug Fixes

* **core:** fix menu not opened when request component is deeply nested ([005a7a9](https://github.com/mgrsskls/miyagi/commit/005a7a91dc2c38407da643ddb14b3d17bee070b6))
* **core:** fix wrong link in build files ([513e350](https://github.com/mgrsskls/miyagi/commit/513e35040170c3a7645df56b9e7065da039045a0))

## [1.4.0](https://github.com/mgrsskls/miyagi/compare/core/v1.3.0...core/v1.4.0) (2020-07-20)


### Features

* **core:** added "new tab" link to component variations ([576bb5d](https://github.com/mgrsskls/miyagi/commit/576bb5d053530dee43a7909da907544e2bd1ae58))
* **core:** directories in navigation clickable ([d0b23db](https://github.com/mgrsskls/miyagi/commit/d0b23dbffc6e2ae7ccb9e147f37ac1c1469eaa4e))


### Bug Fixes

* **core:** "new" creates a new line at EOF ([256711f](https://github.com/mgrsskls/miyagi/commit/256711f0ef99fb0004a93007be4bf0d5436d6876))
* **core:** "new" creates files with yaml content if thats the defined file type ([9684edd](https://github.com/mgrsskls/miyagi/commit/9684edd0b6db10ccff24ef6818224df13e556d8f))
* **core:** "new" didnt create info file ([332f0d6](https://github.com/mgrsskls/miyagi/commit/332f0d66f12190bf2e0cadfda0aa627de16e2b1c))
* **core:** fix components in menu by names based on info file, not filesystem ([512e973](https://github.com/mgrsskls/miyagi/commit/512e9736e341172ab46d699675df1d5ecc694f18))
* **core:** fix creating mock data using generator ([8c188ca](https://github.com/mgrsskls/miyagi/commit/8c188ca042edd447bb5edd3352bb0e54dcee05e5))
* **core:** fix endless loading when $tpl reference cant be found ([d9b5161](https://github.com/mgrsskls/miyagi/commit/d9b51618d167aa6cdf96d8754cd677e5a2097e18))
* **core:** fix specific case where variation and component url in build where identical ([0afa3a0](https://github.com/mgrsskls/miyagi/commit/0afa3a0df27cf9735124a738609514f5372e702a))
* **core:** fix wrong merging of data with $ref ([0eb2397](https://github.com/mgrsskls/miyagi/commit/0eb23970ae526d5d7e7ccb2220b0831e37409d61))
* **core:** make sure component root data with $hidden is not used on overview page ([1a81adc](https://github.com/mgrsskls/miyagi/commit/1a81adc8125448ac61b21ded420e39b04de83b2f))

## [1.3.0](https://github.com/mgrsskls/miyagi/compare/core/v1.2.1...core/v1.3.0) (2020-07-17)


### Features

* **core:** allow options to be passed to schema validator ajv ([689c48e](https://github.com/mgrsskls/miyagi/commit/689c48ef048a3516594031d02f763a643fd9e3e0))

### [1.2.1](https://github.com/mgrsskls/miyagi/compare/core/v1.2.0...core/v1.2.1) (2020-07-15)


### Bug Fixes

* **core:** show build time in time format of the user ([fec0ea6](https://github.com/mgrsskls/miyagi/commit/fec0ea6538d9d7c06d9dd0dbdcdf56a1e5778d7b))

## [1.2.0](https://github.com/mgrsskls/miyagi/compare/core/v1.1.0...core/v1.2.0) (2020-07-15)


### Features

* **core:** added build date ([ea445cf](https://github.com/mgrsskls/miyagi/commit/ea445cfbaba8ebf520a2d455e79b8652c88d1b22))
* **core:** render "Page not found" when page in iframe cant be found ([6b44274](https://github.com/mgrsskls/miyagi/commit/6b442740f7465e5a44a5c1381d1e378e148d7fdd))

## [1.1.0](https://github.com/mgrsskls/miyagi/compare/core/v1.0.16...core/v1.1.0) (2020-07-14)


### Features

* **core:** basePath option for deploying the static build into a subfolder ([93b43fd](https://github.com/mgrsskls/miyagi/commit/93b43fd9964f3ea54de07d3c55bf915917ba44c1))


### Bug Fixes

* **core:** breadcrumb links not over full width ([e2cabc9](https://github.com/mgrsskls/miyagi/commit/e2cabc9291cb2267786d1d9b352a1c3aed58fd44))
* **core:** create html build file also when no mock data exists ([5038bb0](https://github.com/mgrsskls/miyagi/commit/5038bb0e033fc1cffe34fe3e05973ef12ff5b01b))
* **core:** in build serve assets from root ([8b7f029](https://github.com/mgrsskls/miyagi/commit/8b7f029aae0161732db3d6e7b3f4ff18968866b0))
* **core:** reload whole page when info file gets updated ([be86dc2](https://github.com/mgrsskls/miyagi/commit/be86dc2741e258c7ac0463a45615f1317e8587ed))

### [1.0.16](https://github.com/mgrsskls/miyagi/compare/core/v1.0.15...core/v1.0.16) (2020-07-14)


### Bug Fixes

* **core:** fix wrong iframe src in build ([09c3aff](https://github.com/mgrsskls/miyagi/commit/09c3aff911a67644d655fd11509038525672d019))

### [1.0.15](https://github.com/mgrsskls/miyagi/compare/core/v1.0.14...core/v1.0.15) (2020-07-14)


### Bug Fixes

* **core:** added id to schemas if not set in files to avoid error msg by ajv ([cdac32a](https://github.com/mgrsskls/miyagi/commit/cdac32a57b182cd54d73be4e73db57c66df67db7))
* **core:** fix certain missing build html files ([2d4153f](https://github.com/mgrsskls/miyagi/commit/2d4153f26ed74cab9c51d07867033122c58aaf1f))
* **core:** fix wrong merging of data when resolving $ref in mock files ([aedaf57](https://github.com/mgrsskls/miyagi/commit/aedaf57857df050795bba9f2c530ae83493a5545))

### [1.0.14](https://github.com/mgrsskls/miyagi/compare/core/v1.0.13...core/v1.0.14) (2020-07-09)


### Bug Fixes

* **core:** fix opening of menu when requesting component via link in iframe ([7013b18](https://github.com/mgrsskls/miyagi/commit/7013b187a985cdabaf70b55873af2376780ff520))
* **core:** make sure only the correct folders are opened in the navigation when requesting a component view ([e3bf589](https://github.com/mgrsskls/miyagi/commit/e3bf5893562cea6b05e56c7aab508a0aae6f707e))
* **core:** max width for documentation copy ([7f2c07c](https://github.com/mgrsskls/miyagi/commit/7f2c07c9e18ef91d4904d7d89ea111c73c93b174))

### [1.0.13](https://github.com/mgrsskls/miyagi/compare/core/v1.0.12...core/v1.0.13) (2020-07-09)


### Bug Fixes

* **core:** "new" creates component relative from current folder, not component folder ([e6cb345](https://github.com/mgrsskls/miyagi/commit/e6cb3451373e746b1a124053e7528fcfb788a42b))
* **core:** load all schemas when validating to make sure using $ref works ([2d501b2](https://github.com/mgrsskls/miyagi/commit/2d501b2af413a78c60674b97f44e879b72411606))

### [1.0.12](https://github.com/mgrsskls/miyagi/compare/core/v1.0.11...core/v1.0.12) (2020-07-08)


### Bug Fixes

* **core:** do not build default variant if there is no data ([6bf5c64](https://github.com/mgrsskls/miyagi/commit/6bf5c640e27f6e22a1aa0f4e01102f1db6e9bbbc))

### [1.0.11](https://github.com/mgrsskls/miyagi/compare/core/v1.0.10...core/v1.0.11) (2020-07-08)


### Bug Fixes

* **core:** copy content of asset folders when creating a build instead of complete folder ([8898b67](https://github.com/mgrsskls/miyagi/commit/8898b6700e415e24a62b897c8e7890aa943d7bf0))

### [1.0.10](https://github.com/mgrsskls/miyagi/compare/core/v1.0.9...core/v1.0.10) (2020-07-07)


### Bug Fixes

* **core:** do not resolve ignored component folders to full paths, so regexes work properly ([409ebb3](https://github.com/mgrsskls/miyagi/commit/409ebb3192aa8b72ee14d92d994977a9e7dfa29b))

### [1.0.9](https://github.com/mgrsskls/miyagi/compare/core/v1.0.8...core/v1.0.9) (2020-07-07)


### Bug Fixes

* **core:** encode variation in new tab link ([5ed8f81](https://github.com/mgrsskls/miyagi/commit/5ed8f81621c7e09430798a65c4a5644f698b888e))
* **core:** fix scrollbar in iframe ([d8fe1c1](https://github.com/mgrsskls/miyagi/commit/d8fe1c1fd157d171d8129cc36ab0294c84a1ddbe))
* **core:** fixed formatting of main tpl, causing broken styles ([2a21509](https://github.com/mgrsskls/miyagi/commit/2a21509816976653cb1842f0775c475ac27f7a6a))

### [1.0.8](https://github.com/mgrsskls/miyagi/compare/core/v1.0.7...core/v1.0.8) (2020-07-07)


### Bug Fixes

* **core:** fixed formatting of iframe tpl, causing broken styles ([338d9e0](https://github.com/mgrsskls/miyagi/commit/338d9e03bf0fbc5c5f33b4bf7f0e41125781299b))

### [1.0.7](https://github.com/mgrsskls/miyagi/compare/core/v1.0.6...core/v1.0.7) (2020-07-07)


### Bug Fixes

* **core:** added rel=noopener to new tab link ([5fc9660](https://github.com/mgrsskls/miyagi/commit/5fc96601d54bf4aba0f19188981039298f90b2ac))

### [1.0.6](https://github.com/mgrsskls/miyagi/compare/core/v1.0.5...core/v1.0.6) (2020-07-06)


### Bug Fixes

* **core:** added rel="noopener" to link in component overview ([27caead](https://github.com/mgrsskls/miyagi/commit/27caeadf8b85988c04c8a273b8edec990aa406ca))
* **core:** invalid markup on overview page ([10a9e58](https://github.com/mgrsskls/miyagi/commit/10a9e58171595b7b82e7aeedd79d533abaa4e39c))
* **core:** links not underlined in iframe ([c0cf110](https://github.com/mgrsskls/miyagi/commit/c0cf110eb329db1c7d8341b877b30b6e07787da6))

### [1.0.5](https://github.com/mgrsskls/miyagi/compare/core/v1.0.4...core/v1.0.5) (2020-06-30)


### Bug Fixes

* **core:** copy all sorts of assets to build folder ([b514120](https://github.com/mgrsskls/miyagi/commit/b514120736eb6ae43769142ee3abdce17d439001))

### [1.0.4](https://github.com/mgrsskls/miyagi/compare/core/v1.0.3...core/v1.0.4) (2020-06-28)


### Bug Fixes

* **core:** do not throw an error when schema.json is invalid ([5e6425b](https://github.com/mgrsskls/miyagi/commit/5e6425bf6026590dd5dea65ab2b4681c42ed7de4))
* **core:** fix serving static folder ([687d05f](https://github.com/mgrsskls/miyagi/commit/687d05f2eefce4ba4d6e295e74a4f0cff68d1369))
* **core:** fix wrong resolving of mock data when boolean was used in it ([20152c5](https://github.com/mgrsskls/miyagi/commit/20152c5159459ee64f0a6b2ac8cb080477e3f3aa))
* **core:** make sure no elements in component docs use css from the user project ([3db6c22](https://github.com/mgrsskls/miyagi/commit/3db6c22608c2bdbfaa9489e7f855561548bdfa6e))

## [1.0.3](https://github.com/mgrsskls/miyagi/compare/core/v1.0.2...core/v1.0.3) (2020-06-27)

## [1.0.2](https://github.com/mgrsskls/miyagi/compare/core/v1.0.1...core/v1.0.2) (2020-06-24)

## [1.0.1](https://github.com/mgrsskls/miyagi/compare/core/v1.0.0...core/v1.0.1) (2020-06-24)

# [1.0.0](https://github.com/mgrsskls/miyagi/compare/605e1990d897bb20eb5acec103ae92c82d08f4f8...core/v1.0.0) (2020-06-23)

## [0.4.1](https://github.com/mgrsskls/miyagi/compare/v0.4.0...v0.4.1) (2020-04-25)

# [0.4.0](https://github.com/mgrsskls/miyagi/compare/v0.3.1...v0.4.0) (2020-04-24)

## [0.3.1](https://github.com/mgrsskls/miyagi/compare/v0.3.0...v0.3.1) (2020-04-23)

# [0.3.0](https://github.com/mgrsskls/miyagi/compare/v0.2.0...v0.3.0) (2019-12-13)

# [0.2.0](https://github.com/mgrsskls/miyagi/compare/v0.1.7...v0.2.0) (2019-08-07)

## [0.1.7](https://github.com/mgrsskls/miyagi/compare/v0.1.6...v0.1.7) (2019-07-14)

## [0.1.6](https://github.com/mgrsskls/miyagi/compare/v0.1.4...v0.1.6) (2019-07-14)

## [0.1.4](https://github.com/mgrsskls/miyagi/compare/v0.1.3...v0.1.4) (2019-07-14)

## [0.1.3](https://github.com/mgrsskls/miyagi/compare/v0.1.2...v0.1.3) (2019-07-14)

## [0.1.2](https://github.com/mgrsskls/miyagi/compare/v0.1.1...v0.1.2) (2019-07-13)

## 0.1.1 (2019-07-12)
