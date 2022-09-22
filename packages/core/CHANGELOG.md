# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.3.5](https://github.com/miyagi-dev/miyagi/compare/core/v3.3.4...core/v3.3.5) (2022-09-22)

### [3.3.4](https://github.com/miyagi-dev/miyagi/compare/core/v3.3.3...core/v3.3.4) (2022-09-22)


### Bug Fixes

* **core:** Fixes missing space before defer attribute ([8d6bea7](https://github.com/miyagi-dev/miyagi/commit/8d6bea7abc671d043e11a0334db129c579d43a71))

### [3.3.3](https://github.com/miyagi-dev/miyagi/compare/core/v3.3.2...core/v3.3.3) (2022-09-20)


### Bug Fixes

* **core:** check data type if overwriting multi-dimensional arrays ([1578ab4](https://github.com/miyagi-dev/miyagi/commit/1578ab4dde22e619dc559c66b04f0c89f087c4c4))

### [3.3.2](https://github.com/mgrsskls/miyagi/compare/core/v3.3.1...core/v3.3.2) (2022-07-13)


### Bug Fixes

* **core:** Properly exit the process when linting a single component fails ([eec23b7](https://github.com/mgrsskls/miyagi/commit/eec23b7775df93002750d860ea386fae7628efea))

### [3.3.1](https://github.com/mgrsskls/miyagi/compare/core/v3.3.0...core/v3.3.1) (2022-07-11)


### Bug Fixes

* **core:** Fixes "new" component when using node directly instead of npm or yarn ([d3e75b8](https://github.com/mgrsskls/miyagi/commit/d3e75b81dda53145023cc220db7165755a59be11))

## [3.3.0](https://github.com/mgrsskls/miyagi/compare/core/v3.2.1...core/v3.3.0) (2022-07-11)


### Features

* **core:** Verbose error logging for mock data validation ([#181](https://github.com/mgrsskls/miyagi/issues/181)) ([39414a0](https://github.com/mgrsskls/miyagi/commit/39414a05ebbad9aadbca9bf73d970c3a727c2f05))

### [3.2.1](https://github.com/mgrsskls/miyagi/compare/core/v3.2.0...core/v3.2.1) (2022-07-07)

## [3.2.0](https://github.com/mgrsskls/miyagi/compare/core/v3.1.10...core/v3.2.0) (2022-07-07)


### Features

* **core:** Adds styling for tables in documentation ([2709a9f](https://github.com/mgrsskls/miyagi/commit/2709a9fb6f9660a834df1affa1887534c085ea2c))

### [3.1.10](https://github.com/mgrsskls/miyagi/compare/core/v3.1.9...core/v3.1.10) (2022-06-23)


### Bug Fixes

* **core:** Fixes a JS error in chrome when navigating back after having used the GOTO function ([3d7a998](https://github.com/mgrsskls/miyagi/commit/3d7a998d70074742932786b88486ec0aeb9e8f52))

### [3.1.9](https://github.com/mgrsskls/miyagi/compare/core/v3.1.8...core/v3.1.9) (2022-06-02)


### Bug Fixes

* **core:** fixes using manifest not working when no assets.root directory is set ([e6c8b9b](https://github.com/mgrsskls/miyagi/commit/e6c8b9b21a1d8a90a5747c807eb8495e4cbfd0d4))

### [3.1.8](https://github.com/mgrsskls/miyagi/compare/core/v3.1.7...core/v3.1.8) (2022-05-17)


### Bug Fixes

* **core:** fix double linting error message in cli when creating a build ([a040fbb](https://github.com/mgrsskls/miyagi/commit/a040fbbff692b5b11b70088a15bceab009e2695c))
* **core:** Fix wrong result for "miyagi lint" when component has only default data which is hidden using $hidden: true ([f629c02](https://github.com/mgrsskls/miyagi/commit/f629c02d7a79053bb00aef7c270dd51cfcc3b098))

### [3.1.7](https://github.com/mgrsskls/miyagi/compare/core/v3.1.6...core/v3.1.7) (2022-03-23)

### [3.1.6](https://github.com/mgrsskls/miyagi/compare/core/v3.1.5...core/v3.1.6) (2022-03-23)

### [3.1.5](https://github.com/mgrsskls/miyagi/compare/core/v3.1.4...core/v3.1.5) (2022-02-18)

### [3.1.4](https://github.com/mgrsskls/miyagi/compare/core/v3.1.3...core/v3.1.4) (2022-02-09)


### Bug Fixes

* **core:** Fixes uppercase menu items were changed to lowercase when using the search ([d134039](https://github.com/mgrsskls/miyagi/commit/d13403973310b72b2afa040bc7144ecfbd40ae7c))
* **core:** Make sure the body color of the project is used instead of miyagi's body color ([7f94b32](https://github.com/mgrsskls/miyagi/commit/7f94b326d2a2c14fa3031da674dc2df8b89c3800))

### [3.1.3](https://github.com/mgrsskls/miyagi/compare/core/v3.1.2...core/v3.1.3) (2022-02-09)


### Bug Fixes

* **core:** fix JS error in Chrome when pressing keys f or g ([eedbf4d](https://github.com/mgrsskls/miyagi/commit/eedbf4d5802bfb7453985c2340e51a0aeb763d13))

### [3.1.2](https://github.com/mgrsskls/miyagi/compare/core/v3.1.1...core/v3.1.2) (2022-02-08)


### Bug Fixes

* **core:** Adds missing JS script on component view if position:"body" is used ([0572e31](https://github.com/mgrsskls/miyagi/commit/0572e31790c0084a8a3e9914f31eb54867fa7a03))
* **core:** do not trigger goto/search when form element is focused ([ead9878](https://github.com/mgrsskls/miyagi/commit/ead98782ae2966e0318656a2f4d92eb955e37e36))

### [3.1.1](https://github.com/mgrsskls/miyagi/compare/core/v3.1.0...core/v3.1.1) (2022-02-05)

## [3.1.0](https://github.com/mgrsskls/miyagi/compare/core/v3.0.4...core/v3.1.0) (2022-01-21)


### Features

* **core:** added multiple options to merge arrays in mock data ([ee4956d](https://github.com/mgrsskls/miyagi/commit/ee4956d2ff2a534c8dd53480b9199ab3e42c1bb0))


### Bug Fixes

* **core:** fixes missing variant in menu when it does not have any data ([9963b43](https://github.com/mgrsskls/miyagi/commit/9963b4374159a3445ac9cef6a4b88f134b285799))

### [3.0.4](https://github.com/mgrsskls/miyagi/compare/core/v3.0.3...core/v3.0.4) (2022-01-15)

### [3.0.3](https://github.com/mgrsskls/miyagi/compare/core/v3.0.2...core/v3.0.3) (2022-01-08)


### Bug Fixes

* **core:** Fix missing JS not served when "position" is not defined by user ([33b929f](https://github.com/mgrsskls/miyagi/commit/33b929f4b419e13302ac2849f1d7e35e4a63dd9c))

### [3.0.2](https://github.com/mgrsskls/miyagi/compare/core/v3.0.1...core/v3.0.2) (2022-01-08)


### Bug Fixes

* **core:** fix default font family in content ([c7b60f3](https://github.com/mgrsskls/miyagi/commit/c7b60f31d71626533a3e3869bb682333be4bf7bd))

### [3.0.1](https://github.com/mgrsskls/miyagi/compare/core/v3.0.0...core/v3.0.1) (2022-01-08)

## [3.0.0](https://github.com/mgrsskls/miyagi/compare/core/v2.10.0...core/v3.0.0) (2022-01-08)


### ⚠ BREAKING CHANGES

* **core:** added more options for adding JS files
* **core:** removed option ui.renderComponentOverview
* **core:** removed dependency fs-extra and use node internals instead (required node >= 16.7.0 instead of >= 14)

### Features

* **core:** added "go to" function ([9ab776a](https://github.com/mgrsskls/miyagi/commit/9ab776ad80d260dca8d2abb43afe07141b8a4c63))
* **core:** added a text direction switcher to the menu ([5665e9f](https://github.com/mgrsskls/miyagi/commit/5665e9fce2121e12fa4fbbe6f196bd4bb4d4d46d))
* **core:** added more options for adding JS files ([24099c7](https://github.com/mgrsskls/miyagi/commit/24099c73c8a673837763da98421c48718a228fd6))
* **core:** added search for component menu ([c7a899e](https://github.com/mgrsskls/miyagi/commit/c7a899edf410bd3dbc08d67f5721f969d9cbf872))
* **core:** allow setting assets.root per NODE_ENV ([ccf2761](https://github.com/mgrsskls/miyagi/commit/ccf2761133b68a9f591537f48faa4adc04d888b3))
* **core:** allows using $ref in mock data on top level ([60a1e92](https://github.com/mgrsskls/miyagi/commit/60a1e9243e610c4a64a9b04e7c393c1ba6d6424c))
* **core:** custom miyagi css and js files for components ([8764340](https://github.com/mgrsskls/miyagi/commit/876434043d5de50eb3fd4537f4a29c8ae97d1c47))
* **core:** for invalid component/variation requests redirect to index, for other invalid requests respond with 404 ([04324b9](https://github.com/mgrsskls/miyagi/commit/04324b988059bd7ac5e9ad57e82f863387fb56ed))
* **core:** render original instead of resolved mock data in mock data overlays ([76dc59a](https://github.com/mgrsskls/miyagi/commit/76dc59a1b2e420eea4a870105d79d404b72c1726))
* **core:** some visual improvements ([4f6e0d4](https://github.com/mgrsskls/miyagi/commit/4f6e0d4e4568e42f331d600672e6ec458ac84086))
* **core:** sticky search and config switchers in menu ([2dfe3f8](https://github.com/mgrsskls/miyagi/commit/2dfe3f864efdb7e64e41d2705f81be2dcfd11d3f))
* **core:** theme switcher that allows switching between light, dark and auto (os based) mode ([dc69b64](https://github.com/mgrsskls/miyagi/commit/dc69b645f6cb7b4828b181258ddcf16eda3b878d))


### Bug Fixes

* **core:** config not updated on the fly when config file changed ([be06cd1](https://github.com/mgrsskls/miyagi/commit/be06cd197ccda6a32477151f4b6fadfa2382ab20))
* **core:** do not render information in component view if there is nothing but a README ([54abcfd](https://github.com/mgrsskls/miyagi/commit/54abcfd2a0f25f3be31aeb8128091baca072f531))
* **core:** fix miyagi crashing when the file watcher cant find a watched asset folder ([82e2316](https://github.com/mgrsskls/miyagi/commit/82e2316321e627ffc742e62043103817bfc6a7f1))
* **core:** fixes a minor security warning ([6afbb10](https://github.com/mgrsskls/miyagi/commit/6afbb109b257a31c85e7df5ded677098c199fb51))


* **core:** removed dependency fs-extra and use node internals instead (required node >= 16.7.0 instead of >= 14) ([94b2049](https://github.com/mgrsskls/miyagi/commit/94b20495a8d064ba3d0c1099a317714391e7d724))
* **core:** removed option ui.renderComponentOverview ([240395a](https://github.com/mgrsskls/miyagi/commit/240395afa1dd6df85658c0eef97f11a5d24e27b2))

## [2.10.0](https://github.com/mgrsskls/miyagi/compare/core/v2.9.0...core/v2.10.0) (2021-12-01)


### Features

* **core:** added option components.lang which allows defining the language of your components (used for the html `lang` attribute) ([39d59ab](https://github.com/mgrsskls/miyagi/commit/39d59ab22ebd2f12beab7d555a39be0fb3940005))
* **core:** added option ui.textDirection which allows right-to-left text direction of the miyagi UI ([3022880](https://github.com/mgrsskls/miyagi/commit/3022880ab2fe2d6f6626871c1122cc52e836a105))

## [2.9.0](https://github.com/mgrsskls/miyagi/compare/core/v2.8.2...core/v2.9.0) (2021-12-01)


### Features

* **core:** improved catching multiple possible errors and added proper messages to console ([a91b89f](https://github.com/mgrsskls/miyagi/commit/a91b89f26b0f91834db3e58fddebe9f1ec1ca794))


### Bug Fixes

* **core:** fix error "invalid mock data" in variation view when no schema has been defined ([893cc1b](https://github.com/mgrsskls/miyagi/commit/893cc1b6885ddc4bb09a50549a1080213dc36482))
* **core:** fixes an error when mock data only includes default data which is hidden with $hidden: true ([aa7bbf7](https://github.com/mgrsskls/miyagi/commit/aa7bbf72331d4571d27f91fd842432f8b966c18e))

### [2.8.2](https://github.com/mgrsskls/miyagi/compare/core/v2.8.1...core/v2.8.2) (2021-11-09)


### Bug Fixes

* **core:** fix minor visual issue with file content on component view ([121408c](https://github.com/mgrsskls/miyagi/commit/121408c432f27d56d44c6f68b949ea827a662096))

### [2.8.1](https://github.com/mgrsskls/miyagi/compare/core/v2.8.0...core/v2.8.1) (2021-11-09)


### Bug Fixes

* **core:** fix missing global data in a variation if not specific mock data is defined ([894376a](https://github.com/mgrsskls/miyagi/commit/894376a2937bf6613fafb81bd46aafaca3f5ef83))

## [2.8.0](https://github.com/mgrsskls/miyagi/compare/core/v2.7.1...core/v2.8.0) (2021-11-07)


### Features

* **core:** automatically apply updated configuration, no need to restart miyagi anymore ([00d5c1b](https://github.com/mgrsskls/miyagi/commit/00d5c1bb2e308f3e89acda9552b4846f47d402c1))
* **core:** implement option render variants in component view in iframe ([8397445](https://github.com/mgrsskls/miyagi/commit/83974457b0168a8e9210aa3937ecac7297016917))
* **core:** use details element instead of tabs for rendering file contents in component view ([38e2fc7](https://github.com/mgrsskls/miyagi/commit/38e2fc79ded18e656ee41af382d408937bbd45c2))


### Bug Fixes

* **core:** Updated wording "Variations" to "Variants" ([db49c27](https://github.com/mgrsskls/miyagi/commit/db49c27a1329e0c9815c91f6d2d6662d9d738485))

### [2.7.1](https://github.com/mgrsskls/miyagi/compare/core/v2.7.0...core/v2.7.1) (2021-11-03)


### Bug Fixes

* **core:** apply textDirection also on component view ([d8a9fdc](https://github.com/mgrsskls/miyagi/commit/d8a9fdc85bdb402f1a0870bb772f71903b1e9a4a))

## [2.7.0](https://github.com/mgrsskls/miyagi/compare/core/v2.6.4...core/v2.7.0) (2021-11-03)


### Features

* **core:** support dir attribute on html element for components (not miyagi itself) ([ab74746](https://github.com/mgrsskls/miyagi/commit/ab747460ccf71f7cd783799766b7e247c6725a00))

### [2.6.4](https://github.com/mgrsskls/miyagi/compare/core/v2.6.3...core/v2.6.4) (2021-10-05)


### Bug Fixes

* **core:** upgraded directory-tree node module ([878cfb9](https://github.com/mgrsskls/miyagi/commit/878cfb9e2d1402bb72483afe0e8a1ef312ab8de2))

### [2.6.3](https://github.com/mgrsskls/miyagi/compare/core/v2.6.2...core/v2.6.3) (2021-10-05)

### [2.6.2](https://github.com/mgrsskls/miyagi/compare/core/v2.6.1...core/v2.6.2) (2021-10-05)


### Bug Fixes

* **core:** axe-core causing error in chromium and webkit browsers ([ac59f52](https://github.com/mgrsskls/miyagi/commit/ac59f52ab0fbcd8194735cf4e90ea9020d95b3ec))

### [2.6.1](https://github.com/mgrsskls/miyagi/compare/core/v2.6.0...core/v2.6.1) (2021-08-09)

## [2.6.0](https://github.com/mgrsskls/miyagi/compare/core/v2.5.3...core/v2.6.0) (2021-08-05)


### Features

* **core:** make sure validation results wrap properly ([e9efaf0](https://github.com/mgrsskls/miyagi/commit/e9efaf0ada74670ad9591757b0d2dc6d3e1782e2))
* **core:** render component variation in an iframe to make sure that e.g. MQs behave properly ([edcefc2](https://github.com/mgrsskls/miyagi/commit/edcefc2e244679212c5dbd79981388fb0ab9ba5d))

### [2.5.3](https://github.com/mgrsskls/miyagi/compare/core/v2.5.2...core/v2.5.3) (2021-08-04)


### Bug Fixes

* **core:** minimum node version is 14 ([f3c6c60](https://github.com/mgrsskls/miyagi/commit/f3c6c60f322b5aa69af637b3e1e4028835a0c6a4))

### [2.5.2](https://github.com/mgrsskls/miyagi/compare/core/v2.5.1...core/v2.5.2) (2021-08-04)


### Bug Fixes

* **core:** use "Warning" instead of "Error" is customPropertyFile cannot be found ([e29e86a](https://github.com/mgrsskls/miyagi/commit/e29e86af7dbe6769b748426207cd8bc7594dd36d))

### [2.5.1](https://github.com/mgrsskls/miyagi/compare/core/v2.5.0...core/v2.5.1) (2021-08-02)


### Bug Fixes

* **core:** used normalized ID to open mock data modal ([1af0736](https://github.com/mgrsskls/miyagi/commit/1af073641dff32ca4dc6de548b3636a2abd450f0))

## [2.5.0](https://github.com/mgrsskls/miyagi/compare/core/v2.4.2...core/v2.5.0) (2021-06-24)


### Features

* **core:** Allow serving different asset.folder based on your NODE_ENV ([32bf92c](https://github.com/mgrsskls/miyagi/commit/32bf92c4f596d62b44d62e4ff64c5b23e6719086))

### [2.4.2](https://github.com/mgrsskls/miyagi/compare/core/v2.4.1...core/v2.4.2) (2021-06-22)


### Bug Fixes

* **core:** Fix missing "open in new tab" icon in Chrome ([4786bdd](https://github.com/mgrsskls/miyagi/commit/4786bdda6b41ecbe4a4440bf67a26d2e4beb772e))

### [2.4.1](https://github.com/mgrsskls/miyagi/compare/core/v2.4.0...core/v2.4.1) (2021-06-22)


### Bug Fixes

* **core:** Fix showing mock data for variants when creating a build ([d73e827](https://github.com/mgrsskls/miyagi/commit/d73e82749bf6baf74b0c86d61c5ebe1486f90007))

## [2.4.0](https://github.com/mgrsskls/miyagi/compare/core/v2.3.1...core/v2.4.0) (2021-06-21)


### Features

* **core:** show mock data used for each variation on component view and on variation view ([b5116ef](https://github.com/mgrsskls/miyagi/commit/b5116eff5ae098ab6dbe1b366d67f3c38bb7ef8a))

### [2.3.1](https://github.com/mgrsskls/miyagi/compare/core/v2.3.0...core/v2.3.1) (2021-06-20)


### Bug Fixes

* **core:** properly exit the process after running the lint cli command ([c25fec5](https://github.com/mgrsskls/miyagi/commit/c25fec54d5c79fd9c7353150bdec1db6e8f1f8a8))

## [2.3.0](https://github.com/mgrsskls/miyagi/compare/core/v2.2.1...core/v2.3.0) (2021-06-20)


### Features

* **core:** Adds cli command "lint" which validates schema files and mock data ([4ff84fe](https://github.com/mgrsskls/miyagi/commit/4ff84fe1f055557ae4546854d089b5f11d3d4323))

### [2.2.1](https://github.com/mgrsskls/miyagi/compare/core/v2.2.0...core/v2.2.1) (2021-06-11)


### Bug Fixes

* **core:** log error messages in all cases ([907c1d8](https://github.com/mgrsskls/miyagi/commit/907c1d8182bd5cd211f59038d1f736d0dd42c0d6))

## [2.2.0](https://github.com/mgrsskls/miyagi/compare/core/v2.1.1...core/v2.2.0) (2021-06-10)


### Features

* **core:** adds getHtml and getNode to JS api ([b5c47cd](https://github.com/mgrsskls/miyagi/commit/b5c47cdfe3a515a76ca852c2806d1a9fa9baccdb))

### [2.1.1](https://github.com/mgrsskls/miyagi/compare/core/v2.1.0...core/v2.1.1) (2021-06-06)


### Bug Fixes

* **core:** fix incorrectly merged mock data ([ad769bb](https://github.com/mgrsskls/miyagi/commit/ad769bb2ec9a10858420deef9fed578cf64f1725))

## [2.1.0](https://github.com/mgrsskls/miyagi/compare/core/v2.0.1...core/v2.1.0) (2021-06-06)


### Features

* **core:** enables using symlinks for directories in the components folder ([820fd53](https://github.com/mgrsskls/miyagi/commit/820fd532aa1dca6e135d91534f7b273503f0b780))
* **twig-drupal:** improved Drupal attributes support ([decff30](https://github.com/mgrsskls/miyagi/commit/decff303fd62537fdae5b8ca975fdf7611f9936f))


### Bug Fixes

* **core:** fix calling extendTemplateData of extension when extension is added as array in miyagi config ([bfb6eb1](https://github.com/mgrsskls/miyagi/commit/bfb6eb176669fbf811bbf67102fb9b643fdbfef4))
* **core:** fix updating engine via extension ([fae34d9](https://github.com/mgrsskls/miyagi/commit/fae34d9022fbadac32720f67552d50c1067e445d))
* **core:** make sure variant data gets merged with root data first, then resolved ([21cc023](https://github.com/mgrsskls/miyagi/commit/21cc0236d411f9d2fef4b3c326e00013baabdd23))
* **core:** proper error handling when a file is included in a template which does not exist ([9e42d96](https://github.com/mgrsskls/miyagi/commit/9e42d9672ca5eec888a9638209bac44f0ad3ed52))

### [2.0.1](https://github.com/mgrsskls/miyagi/compare/core/v2.0.0...core/v2.0.1) (2021-06-03)


### Bug Fixes

* **core:** fix writing outputFile.json ([cf3fde3](https://github.com/mgrsskls/miyagi/commit/cf3fde3113da859fe2a28af351cfaa9754b1948d))

## [2.0.0](https://github.com/mgrsskls/miyagi/compare/core/v1.18.2...core/v2.0.0) (2021-06-03)


### ⚠ BREAKING CHANGES

* **core:** properly exit the process when a build fails

### Bug Fixes

* **core:** fix assets in build might have been missing in specific cases ([58218bc](https://github.com/mgrsskls/miyagi/commit/58218bce25d58a156f692f1fc45db2608003ed7c))
* **core:** properly exit the process when a build fails ([598a184](https://github.com/mgrsskls/miyagi/commit/598a184166d9998ffbc9678585b0405f28867622))

### [1.18.2](https://github.com/mgrsskls/miyagi/compare/core/v1.18.1...core/v1.18.2) (2021-05-28)


### Bug Fixes

* **core:** fix race condition ([381e13c](https://github.com/mgrsskls/miyagi/commit/381e13cb1e556ccd62d05fa879e7167b5136ba8a))

### [1.18.1](https://github.com/mgrsskls/miyagi/compare/core/v1.18.0...core/v1.18.1) (2021-05-28)


### Bug Fixes

* **core:** publish api folder ([98690d2](https://github.com/mgrsskls/miyagi/commit/98690d29ba619df0c17fc77475203d7cc000dd02))

## [1.18.0](https://github.com/mgrsskls/miyagi/compare/core/v1.17.1...core/v1.18.0) (2021-05-28)


### Features

* **core:** added javascript api for resolving mock data ([30ec270](https://github.com/mgrsskls/miyagi/commit/30ec270ba51ec71d3436452de20aa07fba1f7937))

### [1.17.1](https://github.com/mgrsskls/miyagi/compare/core/v1.17.0...core/v1.17.1) (2021-05-27)


### Bug Fixes

* **core:** fix serving static assets ([96513f3](https://github.com/mgrsskls/miyagi/commit/96513f32ef5da7703ffd76e9befbb2b670667b68))

## [1.17.0](https://github.com/mgrsskls/miyagi/compare/core/v1.16.1...core/v1.17.0) (2021-05-26)


### Features

* **core:** improve accessibility for schema/mock status in component view ([31a0771](https://github.com/mgrsskls/miyagi/commit/31a077197778dd345a9325447f75a479413ed745))

### [1.16.1](https://github.com/mgrsskls/miyagi/compare/core/v1.16.0...core/v1.16.1) (2021-05-25)


### Bug Fixes

* **core:** fix missing custom props css in build ([846ad0a](https://github.com/mgrsskls/miyagi/commit/846ad0a6e04ff282661f2a26b4b29a9215855f35))

## [1.16.0](https://github.com/mgrsskls/miyagi/compare/core/v1.15.2...core/v1.16.0) (2021-05-25)


### Features

* **core:** added assets.root option (see docs) ([f7692aa](https://github.com/mgrsskls/miyagi/commit/f7692aa3c743ce46cc8c0f49fbe1746d652f82ee))

### [1.15.2](https://github.com/mgrsskls/miyagi/compare/core/v1.15.1...core/v1.15.2) (2021-05-22)

### [1.15.1](https://github.com/mgrsskls/miyagi/compare/core/v1.15.0...core/v1.15.1) (2021-05-22)


### Bug Fixes

* **core:** fix corrupted css/js files in build when two files have the same name ([8f594ca](https://github.com/mgrsskls/miyagi/commit/8f594caa6fa94465532a3f6a5dee88858eb4f395))

## [1.15.0](https://github.com/mgrsskls/miyagi/compare/core/v1.14.0...core/v1.15.0) (2021-05-21)


### Features

* **core:** added theme.js which can be used to add additional js to components ([c349874](https://github.com/mgrsskls/miyagi/commit/c3498742a0c8a8bc43ca3ed4c2c8eb305fb6a10c))

## [1.14.0](https://github.com/mgrsskls/miyagi/compare/core/v1.13.3...core/v1.14.0) (2021-05-21)


### Features

* **core:** also serve root folder for static files ([3c0bce0](https://github.com/mgrsskls/miyagi/commit/3c0bce044f167ac98cf3419bde24661f4ded4256))

### [1.13.3](https://github.com/mgrsskls/miyagi/compare/core/v1.13.2...core/v1.13.3) (2021-05-10)


### Bug Fixes

* **core:** fix extending template data via extensions not working when a component does not have mock data ([93c9a51](https://github.com/mgrsskls/miyagi/commit/93c9a51e707af91e36cf22befbf7e243876db830))

### [1.13.2](https://github.com/mgrsskls/miyagi/compare/core/v1.13.1...core/v1.13.2) (2021-05-07)


### Bug Fixes

* **core:** when using custom css for the theme, render it in separate style tag to make sure [@import](https://github.com/import) works ([fb62ffa](https://github.com/mgrsskls/miyagi/commit/fb62ffaafcf417fc198e48d478e0c264f5037081))

### [1.13.1](https://github.com/mgrsskls/miyagi/compare/core/v1.13.0...core/v1.13.1) (2021-05-05)


### Bug Fixes

* **core:** fix mock generator not working when yaml is used for schema and/or mock files ([0af52fe](https://github.com/mgrsskls/miyagi/commit/0af52fe75ced9cde58440b794a9ddc0a18b5c67c))
* **core:** fix parsing templates when file names have two extensions like *.html.twig ([5a9fb0f](https://github.com/mgrsskls/miyagi/commit/5a9fb0fb79d81ddea214923a8601e99fa0ace621))

## [1.13.0](https://github.com/mgrsskls/miyagi/compare/core/v1.11.5...core/v1.13.0) (2021-03-23)


### Features

* **core:** allow extensions to extend watch files and engine ([972a330](https://github.com/mgrsskls/miyagi/commit/972a3301c4a1ab657c98aec7bda769b5ece7e463))


### Bug Fixes

* **core:** fix resolving assets when using manifest file ([c21f9a6](https://github.com/mgrsskls/miyagi/commit/c21f9a6ffc26faa739c7993b35bf1a1709d348ca))
* **core:** fix watching asset files ([1cb67b9](https://github.com/mgrsskls/miyagi/commit/1cb67b9df8c9b9a1ca77bb6f54a0d576796f74aa))

## [1.12.0](https://github.com/mgrsskls/miyagi/compare/core/v1.11.5...core/v1.12.0) (2021-03-22)


### Features

* **core:** allow extensions to extend watch files and engine ([f14ffd5](https://github.com/mgrsskls/miyagi/commit/f14ffd5f64cc86cd4c9d71d9916af29a1ca91e1a))


### Bug Fixes

* **core:** fix watching asset files ([44e19b4](https://github.com/mgrsskls/miyagi/commit/44e19b450941586bae958d1caea6196018c14237))

### [1.11.5](https://github.com/mgrsskls/miyagi/compare/core/v1.11.4...core/v1.11.5) (2021-03-17)


### Bug Fixes

* **core:** added missing customProperties files to build ([8de8899](https://github.com/mgrsskls/miyagi/commit/8de8899b2e8d5024e2eb66666298ca003de2a322))

### [1.11.4](https://github.com/mgrsskls/miyagi/compare/core/v1.11.3...core/v1.11.4) (2021-03-04)


### Bug Fixes

* **core:** fix broken auto reload due to socket.io not found ([f9718ba](https://github.com/mgrsskls/miyagi/commit/f9718baf946c64e1d9333e772dfdf3b63b5da645))

### [1.11.3](https://github.com/mgrsskls/miyagi/compare/core/v1.11.2...core/v1.11.3) (2021-02-24)


### Bug Fixes

* **core:** fixes from previous dependency updates ([fa81ce6](https://github.com/mgrsskls/miyagi/commit/fa81ce6a1c52b9b9b4c96654fa95926e61791d09))

### [1.11.2](https://github.com/mgrsskls/miyagi/compare/core/v1.11.1...core/v1.11.2) (2021-02-24)


### Bug Fixes

* **core:** separately serve custom properties files to make sure custom props are available in styleguide ([9f10958](https://github.com/mgrsskls/miyagi/commit/9f10958e2a6e86cf110e77fc7809aeb07ef4954b))

### [1.11.1](https://github.com/mgrsskls/miyagi/compare/core/v1.11.0...core/v1.11.1) (2021-02-06)


### Bug Fixes

* **core:** better detection of colors for styleguide ([3828f08](https://github.com/mgrsskls/miyagi/commit/3828f0862f284022c5f64adfade9c7c04b2a596a))
* **core:** make sure miyagi is reloaded when any css or js file changes ([0e133e2](https://github.com/mgrsskls/miyagi/commit/0e133e2d6109371f047591cebca5e7f768ea057f))

## [1.11.0](https://github.com/mgrsskls/miyagi/compare/core/v1.10.3...core/v1.11.0) (2021-02-05)


### Features

* **core:** allow adding extra css to change miyagi styling ([c870d85](https://github.com/mgrsskls/miyagi/commit/c870d85bcd6fab05faaac74f65748be3917e5a99))


### Bug Fixes

* **core:** fix error message caused by watcher ([f6f610d](https://github.com/mgrsskls/miyagi/commit/f6f610d3d06f662e8aad3fc53cbce080a609ea0c))

### [1.10.3](https://github.com/mgrsskls/miyagi/compare/core/v1.10.2...core/v1.10.3) (2021-01-23)


### Bug Fixes

* **core:** added missing styleguide js to build ([c760344](https://github.com/mgrsskls/miyagi/commit/c760344e7d00769265dce16b2ae3ae177f355798))

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
