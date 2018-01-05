webpackJsonpjwplayer([5],Array(74).concat([
/* 74 */
/*!******************************************!*\
  !*** ./src/js/view/controls/controls.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! events/events */ 32), __webpack_require__(/*! events/states */ 31), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/constants */ 20), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! view/controls/components/button */ 77), __webpack_require__(/*! view/controls/controlbar */ 79), __webpack_require__(/*! view/controls/dock */ 93), __webpack_require__(/*! view/controls/display-container */ 75), __webpack_require__(/*! view/controls/rewind-display-icon */ 95), __webpack_require__(/*! view/controls/play-display-icon */ 97), __webpack_require__(/*! view/controls/next-display-icon */ 98), __webpack_require__(/*! view/controls/nextuptooltip */ 99), __webpack_require__(/*! view/controls/rightclick */ 101)], __WEBPACK_AMD_DEFINE_RESULT__ = function (events, states, Events, Constants, utils, _, button, Controlbar, Dock, DisplayContainer, RewindDisplayIcon, PlayDisplayIcon, NextDisplayIcon, NextUpToolTip, RightClick) {
	
	    var ACTIVE_TIMEOUT = utils.isMobile() ? 4000 : 2000;
	
	    var reasonInteraction = function reasonInteraction() {
	        return { reason: 'interaction' };
	    };
	
	    var stylesInjected = false;
	
	    return function () {
	        function Controls(context, playerContainer) {
	            var _this = this;
	
	            _classCallCheck(this, Controls);
	
	            _.extend(this, Events);
	
	            // Alphabetic order
	            // Any property on the prototype should be initialized here first
	            this.activeTimeout = -1;
	            this.context = context;
	            this.controlbar = null;
	            this.displayContainer = null;
	            this.dock = null;
	            this.enabled = true;
	            this.instreamState = null;
	            this.keydownCallback = null;
	            this.mute = null;
	            this.nextUpToolTip = null;
	            this.playerContainer = playerContainer;
	            this.rightClickMenu = null;
	            this.showing = false;
	            this.unmuteCallback = null;
	            this.div = null;
	            this.right = null;
	            this.activeListeners = {
	                mousemove: function mousemove() {
	                    return clearTimeout(_this.activeTimeout);
	                },
	                mouseout: function mouseout() {
	                    return _this.userActive();
	                }
	            };
	            this.dimensions = {};
	            if (!stylesInjected) {
	                stylesInjected = true;
	                __webpack_require__(/*! css/controls.less */ 103);
	            }
	        }
	
	        _createClass(Controls, [{
	            key: 'enable',
	            value: function enable(api, model) {
	                var _this2 = this;
	
	                var element = this.context.createElement('div');
	                element.className = 'jw-controls jw-reset';
	                this.div = element;
	
	                var touchMode = model.get('touchMode');
	
	                // Display Buttons
	                if (!this.displayContainer) {
	                    var displayContainer = new DisplayContainer();
	                    var rewindDisplayIcon = new RewindDisplayIcon(model, api);
	                    var playDisplayIcon = new PlayDisplayIcon(model);
	                    var nextDisplayIcon = new NextDisplayIcon(model, api);
	
	                    playDisplayIcon.on('click tap', function () {
	                        _this2.trigger(events.JWPLAYER_DISPLAY_CLICK);
	                        _this2.userActive(1000);
	                        api.play(reasonInteraction());
	                    });
	
	                    if (utils.isChrome() && !touchMode) {
	                        // On Chrome desktop allow media element to capture all play/pause toggle clicks
	                        // This allows swfs to capture clicks on start preventing flash-throttling
	                        playDisplayIcon.el.style.pointerEvents = 'none';
	                        playDisplayIcon.icon.style.pointerEvents = 'none';
	                    }
	
	                    displayContainer.addButton(rewindDisplayIcon);
	                    displayContainer.addButton(playDisplayIcon);
	                    displayContainer.addButton(nextDisplayIcon);
	
	                    this.div.appendChild(displayContainer.element());
	                    this.displayContainer = displayContainer;
	                }
	
	                var right = this.context.createElement('div');
	                right.className = 'jw-controls-right jw-reset';
	                element.appendChild(right);
	                this.right = right;
	
	                // Dock Area and Buttons
	                var dock = this.dock = new Dock(model);
	                this.right.appendChild(dock.element());
	
	                // Touch UI mode when we're on mobile and we have a percentage height or we can fit the large UI in
	                if (touchMode) {
	                    utils.addClass(this.playerContainer, 'jw-flag-touch');
	                } else {
	                    this.rightClickMenu = new RightClick();
	                    model.change('flashBlocked', function (modelChanged, isBlocked) {
	                        if (isBlocked) {
	                            _this2.rightClickMenu.destroy();
	                        } else {
	                            _this2.rightClickMenu.setup(modelChanged, _this2.playerContainer, _this2.playerContainer);
	                        }
	                    });
	                }
	
	                // Controlbar
	                var controlbar = this.controlbar = new Controlbar(api, model);
	                controlbar.on(events.JWPLAYER_USER_ACTION, function () {
	                    return _this2.userActive();
	                });
	                // Next Up Tooltip
	                if (model.get('nextUpDisplay') && !controlbar.nextUpToolTip) {
	                    var nextUpToolTip = new NextUpToolTip(model, api, this.playerContainer);
	                    nextUpToolTip.on('all', this.trigger, this);
	                    nextUpToolTip.setup(this.context);
	                    controlbar.nextUpToolTip = nextUpToolTip;
	
	                    // NextUp needs to be behind the controlbar to not block other tooltips
	                    this.div.appendChild(nextUpToolTip.element());
	                }
	                this.addActiveListeners(controlbar.element());
	                this.div.appendChild(controlbar.element());
	
	                // Unmute Autoplay Button. Ignore iOS9. Muted autoplay is supported in iOS 10+
	                if (model.get('autostartMuted')) {
	                    var unmuteCallback = function unmuteCallback() {
	                        return _this2.unmuteAutoplay(api, model);
	                    };
	                    this.mute = button('jw-autostart-mute jw-off', unmuteCallback, model.get('localization').volume);
	                    this.mute.show();
	                    this.div.appendChild(this.mute.element());
	                    // Set mute state in the controlbar
	                    controlbar.renderVolume(true, model.get('volume'));
	                    // Hide the controlbar until the autostart flag is removed
	                    utils.addClass(this.playerContainer, 'jw-flag-autostart');
	
	                    model.on('change:autostartFailed change:autostartMuted change:mute', unmuteCallback);
	                    this.unmuteCallback = unmuteCallback;
	                }
	
	                // Keyboard Commands
	                function adjustSeek(amount) {
	                    var min = 0;
	                    var max = model.get('duration');
	                    var position = model.get('position');
	                    if (model.get('streamType') === 'DVR') {
	                        min = max;
	                        max = Math.max(position, Constants.dvrSeekLimit);
	                    }
	                    var newSeek = utils.between(position + amount, min, max);
	                    api.seek(newSeek, reasonInteraction());
	                }
	                function adjustVolume(amount) {
	                    var newVol = utils.between(model.get('volume') + amount, 0, 100);
	                    api.setVolume(newVol);
	                }
	                var handleKeydown = function handleKeydown(evt) {
	                    // If Meta keys return
	                    if (evt.ctrlKey || evt.metaKey) {
	                        // Let event bubble upwards
	                        return true;
	                    }
	                    // On keypress show the controlbar for a few seconds
	                    if (!_this2.instreamState) {
	                        _this2.userActive();
	                    }
	                    switch (evt.keyCode) {
	                        case 27:
	                            // Esc
	                            api.setFullscreen(false);
	                            break;
	                        case 13: // enter
	                        case 32:
	                            // space
	                            api.play(reasonInteraction());
	                            break;
	                        case 37:
	                            // left-arrow, if not adMode
	                            if (!_this2.instreamState) {
	                                adjustSeek(-5);
	                            }
	                            break;
	                        case 39:
	                            // right-arrow, if not adMode
	                            if (!_this2.instreamState) {
	                                adjustSeek(5);
	                            }
	                            break;
	                        case 38:
	                            // up-arrow
	                            adjustVolume(10);
	                            break;
	                        case 40:
	                            // down-arrow
	                            adjustVolume(-10);
	                            break;
	                        case 67:
	                            // c-key
	                            {
	                                var captionsList = api.getCaptionsList();
	                                var listLength = captionsList.length;
	                                if (listLength) {
	                                    var nextIndex = (api.getCurrentCaptions() + 1) % listLength;
	                                    api.setCurrentCaptions(nextIndex);
	                                }
	                            }
	                            break;
	                        case 77:
	                            // m-key
	                            api.setMute();
	                            break;
	                        case 70:
	                            // f-key
	                            api.setFullscreen();
	                            break;
	                        default:
	                            if (evt.keyCode >= 48 && evt.keyCode <= 59) {
	                                // if 0-9 number key, move to n/10 of the percentage of the video
	                                var number = evt.keyCode - 48;
	                                var newSeek = number / 10 * model.get('duration');
	                                api.seek(newSeek, reasonInteraction());
	                            }
	                    }
	
	                    if (/13|32|37|38|39|40/.test(evt.keyCode)) {
	                        // Prevent keypresses from scrolling the screen
	                        evt.preventDefault();
	                        return false;
	                    }
	                };
	                this.playerContainer.addEventListener('keydown', handleKeydown);
	                this.keydownCallback = handleKeydown;
	
	                // Show controls when enabled
	                this.userActive();
	
	                this.playerContainer.appendChild(this.div);
	            }
	        }, {
	            key: 'disable',
	            value: function disable() {
	                this.off();
	                clearTimeout(this.activeTimeout);
	
	                if (this.div.parentNode) {
	                    utils.removeClass(this.playerContainer, 'jw-flag-touch');
	                    this.playerContainer.removeChild(this.div);
	                }
	                if (this.controlbar) {
	                    this.removeActiveListeners(this.controlbar.element());
	                }
	                if (this.rightClickMenu) {
	                    this.rightClickMenu.destroy();
	                }
	
	                if (this.keydownCallback) {
	                    this.playerContainer.removeEventListener('keydown', this.keydownCallback);
	                }
	
	                var nextUpToolTip = this.nextUpToolTip;
	                if (nextUpToolTip) {
	                    nextUpToolTip.destroy();
	                }
	            }
	        }, {
	            key: 'controlbarHeight',
	            value: function controlbarHeight() {
	                if (!this.dimensions.cbHeight) {
	                    this.dimensions.cbHeight = this.controlbar.element().clientHeight;
	                }
	                return this.dimensions.cbHeight;
	            }
	        }, {
	            key: 'element',
	            value: function element() {
	                return this.div;
	            }
	        }, {
	            key: 'logoContainer',
	            value: function logoContainer() {
	                return this.right;
	            }
	        }, {
	            key: 'resize',
	            value: function resize() {
	                this.dimensions = {};
	            }
	        }, {
	            key: 'unmuteAutoplay',
	            value: function unmuteAutoplay(api, model) {
	                var autostartSucceeded = !model.get('autostartFailed');
	                var mute = model.get('mute');
	
	                // If autostart succeeded, it means the user has chosen to unmute the video,
	                // so we should update the model, setting mute to false
	                if (autostartSucceeded) {
	                    mute = false;
	                } else {
	                    // Don't try to play again when viewable since it will keep failing
	                    model.set('playOnViewable', false);
	                }
	                if (this.unmuteCallback) {
	                    model.off('change:autostartFailed change:autostartMuted change:mute', this.unmuteCallback);
	                    this.unmuteCallback = null;
	                }
	                model.set('autostartFailed', undefined);
	                model.set('autostartMuted', undefined);
	                api.setMute(mute);
	                // the model's mute value may not have changed. ensure the controlbar's mute button is in the right state
	                this.controlbar.renderVolume(mute, model.get('volume'));
	                this.mute.hide();
	                utils.removeClass(this.playerContainer, 'jw-flag-autostart');
	            }
	        }, {
	            key: 'addActiveListeners',
	            value: function addActiveListeners(element) {
	                if (element && !utils.isMobile()) {
	                    element.addEventListener('mousemove', this.activeListeners.mousemove);
	                    element.addEventListener('mouseout', this.activeListeners.mouseout);
	                }
	            }
	        }, {
	            key: 'removeActiveListeners',
	            value: function removeActiveListeners(element) {
	                if (element) {
	                    element.removeEventListener('mousemove', this.activeListeners.mousemove);
	                    element.removeEventListener('mouseout', this.activeListeners.mouseout);
	                }
	            }
	        }, {
	            key: 'userActive',
	            value: function userActive(timeout) {
	                var _this3 = this;
	
	                clearTimeout(this.activeTimeout);
	                this.activeTimeout = setTimeout(function () {
	                    return _this3.userInactive();
	                }, timeout || ACTIVE_TIMEOUT);
	                if (!this.showing) {
	                    utils.removeClass(this.playerContainer, 'jw-flag-user-inactive');
	                    this.showing = true;
	                    this.trigger('userActive');
	                }
	            }
	        }, {
	            key: 'userInactive',
	            value: function userInactive() {
	                clearTimeout(this.activeTimeout);
	                this.showing = false;
	                if (this.controlbar) {
	                    this.controlbar.closeMenus({
	                        type: 'userInactive'
	                    });
	                }
	                utils.addClass(this.playerContainer, 'jw-flag-user-inactive');
	                this.trigger('userInactive');
	            }
	        }]);
	
	        return Controls;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 75 */
/*!***************************************************!*\
  !*** ./src/js/view/controls/display-container.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _displayContainer = __webpack_require__(/*! view/controls/templates/display-container */ 76);
	
	var _displayContainer2 = _interopRequireDefault(_displayContainer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils) {
	
	    return function () {
	        function DisplayContainer() {
	            _classCallCheck(this, DisplayContainer);
	
	            this.el = utils.createElement((0, _displayContainer2.default)());
	            this.container = this.el.querySelector('.jw-display-controls');
	        }
	
	        _createClass(DisplayContainer, [{
	            key: 'addButton',
	            value: function addButton(button) {
	                this.container.appendChild(button.el);
	            }
	        }, {
	            key: 'element',
	            value: function element() {
	                return this.el;
	            }
	        }]);
	
	        return DisplayContainer;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 76 */
/*!*************************************************************!*\
  !*** ./src/js/view/controls/templates/display-container.js ***!
  \*************************************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function () {
	    return "<div class=\"jw-display jw-reset\">" + "<div class=\"jw-display-container jw-reset\">" + "<div class=\"jw-display-controls jw-reset\"></div>" + "</div>" + "</div>";
	};

/***/ },
/* 77 */
/*!***************************************************!*\
  !*** ./src/js/view/controls/components/button.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/ui */ 78)], __WEBPACK_AMD_DEFINE_RESULT__ = function (UI) {
	
	    return function (icon, apiAction, ariaText) {
	        var _element = document.createElement('div');
	        _element.className = 'jw-icon jw-icon-inline jw-button-color jw-reset ' + icon;
	        _element.setAttribute('role', 'button');
	        _element.setAttribute('tabindex', '0');
	
	        if (ariaText) {
	            _element.setAttribute('aria-label', ariaText);
	        }
	
	        _element.style.display = 'none';
	
	        if (apiAction) {
	            // Don't send the event to the handler so we don't have unexpected results. (e.g. play)
	            new UI(_element).on('click tap', function () {
	                apiAction();
	            });
	        }
	
	        return {
	            element: function element() {
	                return _element;
	            },
	            toggle: function toggle(m) {
	                if (m) {
	                    this.show();
	                } else {
	                    this.hide();
	                }
	            },
	            show: function show() {
	                _element.style.display = '';
	            },
	            hide: function hide() {
	                _element.style.display = 'none';
	            }
	        };
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 78 */,
/* 79 */
/*!********************************************!*\
  !*** ./src/js/view/controls/controlbar.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _svgMarkup = __webpack_require__(/*! assets/svg-markup */ 80);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/constants */ 20), __webpack_require__(/*! utils/ui */ 78), __webpack_require__(/*! utils/aria */ 85), __webpack_require__(/*! view/controls/components/slider */ 81), __webpack_require__(/*! view/controls/components/timeslider */ 83), __webpack_require__(/*! view/controls/components/menu */ 88), __webpack_require__(/*! view/controls/components/selection-display-menu */ 90), __webpack_require__(/*! view/controls/components/volumetooltip */ 92), __webpack_require__(/*! view/controls/components/button */ 77)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, _, Events, Constants, UI, ariaLabel, Slider, TimeSlider, Menu, SelectionDisplayMenu, VolumeTooltip, button) {
	    function text(name, role) {
	        var element = document.createElement('span');
	        element.className = 'jw-text jw-reset ' + name;
	        if (role) {
	            element.setAttribute('role', role);
	        }
	        return element;
	    }
	
	    function menu(name, ariaText) {
	        return new Menu(name, ariaText);
	    }
	
	    function createCastButton(castToggle, localization) {
	        if (!utils.isChrome() || utils.isIOS()) {
	            return button('jw-icon-airplay jw-off', castToggle, localization.airplay);
	        }
	
	        var ariaText = localization.cast;
	
	        var castButton = document.createElement('button', 'google-cast-button');
	        castButton.className = 'jw-button-color jw-icon-inline';
	        ariaLabel(castButton, ariaText);
	
	        var _element = document.createElement('div');
	        _element.className = 'jw-reset jw-icon-cast';
	        _element.style.display = 'none';
	        _element.style.cursor = 'pointer';
	        _element.appendChild(castButton);
	
	        return {
	            element: function element() {
	                return _element;
	            },
	            toggle: function toggle(m) {
	                if (m) {
	                    this.show();
	                } else {
	                    this.hide();
	                }
	            },
	            show: function show() {
	                _element.style.display = '';
	            },
	            hide: function hide() {
	                _element.style.display = 'none';
	            },
	            button: castButton
	        };
	    }
	
	    function reasonInteraction() {
	        return { reason: 'interaction' };
	    }
	
	    function buildGroup(group, elements) {
	        var elem = document.createElement('div');
	        elem.className = 'jw-group jw-controlbar-' + group + '-group jw-reset';
	
	        _.each(elements, function (e) {
	            if (e.element) {
	                e = e.element();
	            }
	            elem.appendChild(e);
	        });
	
	        return elem;
	    }
	
	    return function () {
	        function Controlbar(_api, _model) {
	            _classCallCheck(this, Controlbar);
	
	            _.extend(this, Events);
	            this._api = _api;
	            this._model = _model;
	            this._isMobile = utils.isMobile();
	            this._localization = _model.get('localization');
	
	            this.nextUpToolTip = null;
	
	            var timeSlider = new TimeSlider(_model, _api);
	            var volumeSlider = void 0;
	            var volumeTooltip = void 0;
	            var muteButton = void 0;
	
	            var play = this._localization.play;
	            var next = this._localization.next;
	            var vol = this._localization.volume;
	            var rewind = this._localization.rewind;
	
	            // Do not initialize volume slider or tooltip on mobile
	            if (!this._isMobile) {
	                volumeSlider = new Slider('jw-slider-volume', 'horizontal'); // , vol);
	                volumeSlider.setup();
	                volumeTooltip = new VolumeTooltip(_model, 'jw-icon-volume', vol);
	            }
	            // Do not show the volume toggle in the mobile SDKs or <iOS10
	            if (!_model.get('sdkplatform') && !(utils.isIOS(8) || utils.isIOS(9))) {
	                muteButton = button('jw-icon-volume', _api.setMute, vol);
	            }
	
	            var nextButton = button('jw-icon-next', _api.next.bind(this), next);
	
	            if (_model.get('nextUpDisplay')) {
	                new UI(nextButton.element(), { useHover: true, directSelect: true }).on('over', function () {
	                    var nextUpToolTip = this.nextUpToolTip;
	                    if (nextUpToolTip) {
	                        nextUpToolTip.toggle(true, 'hover');
	                    }
	                }, this).on('out', function () {
	                    var nextUpToolTip = this.nextUpToolTip;
	                    if (nextUpToolTip) {
	                        if (nextUpToolTip.nextUpSticky) {
	                            return;
	                        }
	                        nextUpToolTip.toggle(false);
	                    }
	                }, this);
	            }
	
	            this.elements = {
	                alt: text('jw-text-alt', 'status'),
	                play: button('jw-icon-playback', _api.play.bind(this, reasonInteraction()), play),
	                rewind: button('jw-icon-rewind', this.rewind.bind(this), rewind),
	                next: nextButton,
	                elapsed: text('jw-text-elapsed', 'timer'),
	                countdown: text('jw-text-countdown', 'timer'),
	                time: timeSlider,
	                duration: text('jw-text-duration', 'timer'),
	                durationLeft: text('jw-text-duration', 'timer'),
	                hd: menu('jw-icon-hd', this._localization.hd),
	                cc: menu('jw-icon-cc', this._localization.cc),
	                audiotracks: menu('jw-icon-audio-tracks', this._localization.audioTracks),
	                playbackrates: new SelectionDisplayMenu('jw-icon-playback-rate', this._localization.playbackRates, _svgMarkup.PLAYBACK_RATE_ICON),
	                mute: muteButton,
	                volume: volumeSlider,
	                volumetooltip: volumeTooltip,
	                cast: createCastButton(_api.castToggle, this._localization),
	                fullscreen: button('jw-icon-fullscreen', _api.setFullscreen, this._localization.fullscreen)
	            };
	
	            this.layout = {
	                left: [this.elements.play, this.elements.rewind, this.elements.elapsed, this.elements.durationLeft, this.elements.countdown],
	                center: [this.elements.time, this.elements.alt],
	                right: [this.elements.duration, this.elements.next, this.elements.hd, this.elements.cc, this.elements.audiotracks, this.elements.playbackrates, this.elements.mute, this.elements.cast, this.elements.volume, this.elements.volumetooltip, this.elements.fullscreen]
	            };
	
	            this.menus = _.compact([this.elements.hd, this.elements.cc, this.elements.audiotracks, this.elements.playbackrates, this.elements.volumetooltip]);
	
	            // Remove undefined layout elements.  They are invalid for the current platform.
	            // (e.g. volume and volumetooltip on mobile)
	            this.layout.left = _.compact(this.layout.left);
	            this.layout.center = _.compact(this.layout.center);
	            this.layout.right = _.compact(this.layout.right);
	
	            this.el = document.createElement('div');
	            this.el.className = 'jw-controlbar jw-background-color jw-reset';
	
	            this.elements.left = buildGroup('left', this.layout.left);
	            this.elements.center = buildGroup('center', this.layout.center);
	            this.elements.right = buildGroup('right', this.layout.right);
	
	            this.el.appendChild(this.elements.left);
	            this.el.appendChild(this.elements.center);
	            this.el.appendChild(this.elements.right);
	
	            // Initial State
	            this.elements.play.show();
	            this.elements.fullscreen.show();
	            if (this.elements.mute) {
	                this.elements.mute.show();
	            }
	
	            // Listen for model changes
	            _model.change('volume', this.onVolume, this);
	            _model.change('mute', this.onMute, this);
	            _model.change('playlistItem', this.onPlaylistItem, this);
	            _model.change('mediaModel', this.onMediaModel, this);
	            _model.change('castAvailable', this.onCastAvailable, this);
	            _model.change('castActive', this.onCastActive, this);
	            _model.change('duration', this.onDuration, this);
	            _model.change('position', this.onElapsed, this);
	            _model.change('fullscreen', this.onFullscreen, this);
	            _model.change('captionsList', this.onCaptionsList, this);
	            _model.change('captionsIndex', this.onCaptionsIndex, this);
	            _model.change('streamType', this.onStreamTypeChange, this);
	            _model.change('nextUp', this.onNextUp, this);
	            _model.change('cues', this.addCues, this);
	            _model.change('altText', this.setAltText, this);
	
	            // Event listeners
	
	            // Volume sliders do not exist on mobile so don't assign listeners to them.
	            if (this.elements.volume) {
	                this.elements.volume.on('update', function (pct) {
	                    var val = pct.percentage;
	                    this._api.setVolume(val);
	                }, this);
	            }
	            if (this.elements.volumetooltip) {
	                this.elements.volumetooltip.on('update', function (pct) {
	                    var val = pct.percentage;
	                    this._api.setVolume(val);
	                }, this);
	                this.elements.volumetooltip.on('toggleValue', function () {
	                    this._api.setMute();
	                }, this);
	            }
	
	            if (this.elements.cast.button) {
	                new UI(this.elements.cast.button).on('click tap', function () {
	                    this._model.set('castClicked', true);
	                }, this);
	            }
	
	            this.elements.hd.on('select', function (value) {
	                this._model.getVideo().setCurrentQuality(value);
	            }, this);
	            this.elements.hd.on('toggleValue', function () {
	                this._model.getVideo().setCurrentQuality(this._model.getVideo().getCurrentQuality() === 0 ? 1 : 0);
	            }, this);
	
	            this.elements.cc.on('select', function (value) {
	                this._api.setCurrentCaptions(value);
	            }, this);
	            this.elements.cc.on('toggleValue', function () {
	                var index = this._model.get('captionsIndex');
	                this._api.setCurrentCaptions(index ? 0 : 1);
	            }, this);
	
	            this.elements.audiotracks.on('select', function (value) {
	                this._model.getVideo().setCurrentAudioTrack(value);
	            }, this);
	
	            var playbackRateControls = _model.get('playbackRateControls');
	            if (playbackRateControls) {
	                var selectedIndex = playbackRateControls.indexOf(this._model.get('playbackRate'));
	                var playbackRateLabels = playbackRateControls.map(function (playbackRate) {
	                    return {
	                        label: playbackRate + 'x',
	                        rate: playbackRate
	                    };
	                });
	
	                this.elements.playbackrates.setup(playbackRateLabels, selectedIndex, { defaultIndex: playbackRateControls.indexOf(1), isToggle: false });
	
	                _model.change('streamType provider', this.togglePlaybackRateControls, this);
	                _model.change('playbackRate', this.onPlaybackRate, this);
	
	                this.elements.playbackrates.on('select', function (index) {
	                    this._model.setPlaybackRate(playbackRateControls[index]);
	                }, this);
	
	                this.elements.playbackrates.on('toggleValue', function () {
	                    var index = playbackRateControls.indexOf(this._model.get('playbackRate'));
	                    this._model.setPlaybackRate(playbackRateControls[index ? 0 : 1]);
	                }, this);
	            }
	
	            new UI(this.elements.duration).on('click tap', function () {
	                if (this._model.get('streamType') === 'DVR') {
	                    // Seek to "Live" position within live buffer, but not before current position
	                    var currentPosition = this._model.get('position');
	                    this._api.seek(Math.max(Constants.dvrSeekLimit, currentPosition), reasonInteraction());
	                }
	            }, this);
	
	            new UI(this.elements.durationLeft).on('click tap', function () {
	                if (this._model.get('streamType') === 'DVR') {
	                    // Seek to "Live" position within live buffer, but not before current position
	                    var currentPosition = this._model.get('position');
	                    this._api.seek(Math.max(Constants.dvrSeekLimit, currentPosition));
	                }
	            }, this);
	
	            // When the control bar is interacted with, trigger a user action event
	            new UI(this.el).on('click tap drag', function () {
	                this.trigger('userAction');
	            }, this);
	
	            _.each(this.menus, function (ele) {
	                ele.on('open-tooltip', this.closeMenus, this);
	            }, this);
	        }
	
	        _createClass(Controlbar, [{
	            key: 'onCaptionsList',
	            value: function onCaptionsList(model, tracks) {
	                var index = model.get('captionsIndex');
	                this.elements.cc.setup(tracks, index, { isToggle: true });
	            }
	        }, {
	            key: 'onCaptionsIndex',
	            value: function onCaptionsIndex(model, index) {
	                this.elements.cc.selectItem(index);
	            }
	        }, {
	            key: 'togglePlaybackRateControls',
	            value: function togglePlaybackRateControls(model) {
	                var showPlaybackRateControls = model.getVideo().supportsPlaybackRate && model.get('streamType') !== 'LIVE' && model.get('playbackRateControls').length > 1;
	
	                utils.toggleClass(this.elements.playbackrates.el, 'jw-hidden', !showPlaybackRateControls);
	            }
	        }, {
	            key: 'onPlaybackRate',
	            value: function onPlaybackRate(model, value) {
	                this.elements.playbackrates.selectItem(model.get('playbackRateControls').indexOf(value));
	            }
	        }, {
	            key: 'onPlaylistItem',
	            value: function onPlaylistItem() {
	                this.elements.audiotracks.setup();
	            }
	        }, {
	            key: 'onMediaModel',
	            value: function onMediaModel(model, mediaModel) {
	                mediaModel.on('change:levels', function (levelsChangeModel, levels) {
	                    this.elements.hd.setup(levels, levelsChangeModel.get('currentLevel'));
	                }, this);
	                mediaModel.on('change:currentLevel', function (currentLevelChangeModel, level) {
	                    this.elements.hd.selectItem(level);
	                }, this);
	                mediaModel.on('change:audioTracks', function (audioTracksChangeModel, audioTracks) {
	                    var list = _.map(audioTracks, function (track) {
	                        return { label: track.name };
	                    });
	                    this.elements.audiotracks.setup(list, audioTracksChangeModel.get('currentAudioTrack'), { isToggle: false });
	                }, this);
	                mediaModel.on('change:currentAudioTrack', function (currentAudioTrackChangeModel, currentAudioTrack) {
	                    this.elements.audiotracks.selectItem(currentAudioTrack);
	                }, this);
	            }
	        }, {
	            key: 'onVolume',
	            value: function onVolume(model, pct) {
	                this.renderVolume(model.get('mute'), pct);
	            }
	        }, {
	            key: 'onMute',
	            value: function onMute(model, muted) {
	                this.renderVolume(muted, model.get('volume'));
	            }
	        }, {
	            key: 'renderVolume',
	            value: function renderVolume(muted, vol) {
	                // mute, volume, and volumetooltip do not exist on mobile devices.
	                if (this.elements.mute) {
	                    utils.toggleClass(this.elements.mute.element(), 'jw-off', muted);
	                }
	                if (this.elements.volume) {
	                    this.elements.volume.render(muted ? 0 : vol);
	                }
	                if (this.elements.volumetooltip) {
	                    this.elements.volumetooltip.volumeSlider.render(muted ? 0 : vol);
	                    utils.toggleClass(this.elements.volumetooltip.element(), 'jw-off', muted);
	                }
	            }
	        }, {
	            key: 'onCastAvailable',
	            value: function onCastAvailable(model, val) {
	                this.elements.cast.toggle(val);
	            }
	        }, {
	            key: 'onCastActive',
	            value: function onCastActive(model, val) {
	                this.elements.fullscreen.toggle(!val);
	                if (this.elements.cast.button) {
	                    utils.toggleClass(this.elements.cast.button, 'jw-off', !val);
	                }
	            }
	        }, {
	            key: 'onElapsed',
	            value: function onElapsed(model, val) {
	                var elapsedTime = void 0;
	                var countdownTime = void 0;
	                var duration = model.get('duration');
	                if (model.get('streamType') === 'DVR') {
	                    elapsedTime = countdownTime = '-' + utils.timeFormat(-duration);
	                } else {
	                    elapsedTime = utils.timeFormat(val);
	                    countdownTime = utils.timeFormat(duration - val);
	                }
	                this.elements.elapsed.textContent = elapsedTime;
	                this.elements.countdown.textContent = countdownTime;
	            }
	        }, {
	            key: 'onDuration',
	            value: function onDuration(model, val) {
	                var totalTime = void 0;
	                if (model.get('streamType') === 'DVR') {
	                    totalTime = 'Live';
	                } else {
	                    totalTime = utils.timeFormat(val);
	                }
	                this.elements.duration.textContent = totalTime;
	                this.elements.durationLeft.textContent = totalTime;
	            }
	        }, {
	            key: 'onFullscreen',
	            value: function onFullscreen(model, val) {
	                utils.toggleClass(this.elements.fullscreen.element(), 'jw-off', val);
	            }
	        }, {
	            key: 'element',
	            value: function element() {
	                return this.el;
	            }
	        }, {
	            key: 'setAltText',
	            value: function setAltText(model, altText) {
	                this.elements.alt.textContent = altText;
	            }
	        }, {
	            key: 'addCues',
	            value: function addCues(model, cues) {
	                if (this.elements.time) {
	                    _.each(cues, function (ele) {
	                        this.elements.time.addCue(ele);
	                    }, this);
	                    this.elements.time.drawCues();
	                }
	            }
	
	            // Close menus if it has no event.  Otherwise close all but the event's target.
	
	        }, {
	            key: 'closeMenus',
	            value: function closeMenus(evt) {
	                _.each(this.menus, function (ele) {
	                    if (!evt || evt.target !== ele.el) {
	                        ele.closeTooltip(evt);
	                    }
	                });
	            }
	        }, {
	            key: 'rewind',
	            value: function rewind() {
	                var currentPosition = this._model.get('position');
	                var duration = this._model.get('duration');
	                var rewindPosition = currentPosition - 10;
	                var startPosition = 0;
	
	                // duration is negative in DVR mode
	                if (this._model.get('streamType') === 'DVR') {
	                    startPosition = duration;
	                }
	                // Seek 10s back. Seek value should be >= 0 in VOD mode and >= (negative) duration in DVR mode
	                this._api.seek(Math.max(rewindPosition, startPosition), reasonInteraction());
	            }
	        }, {
	            key: 'onStreamTypeChange',
	            value: function onStreamTypeChange(model) {
	                // Hide rewind button when in LIVE mode
	                var streamType = model.get('streamType');
	                this.elements.rewind.toggle(streamType !== 'LIVE');
	                if (streamType === 'DVR') {
	                    this.elements.duration.textContent = 'Live';
	                    this.elements.durationLeft.textContent = 'Live';
	                }
	                var duration = model.get('duration');
	                this.onDuration(model, duration);
	            }
	        }, {
	            key: 'onNextUp',
	            value: function onNextUp(model, nextUp) {
	                this.elements.next.toggle(!!nextUp);
	            }
	        }]);
	
	        return Controlbar;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 80 */
/*!**********************************!*\
  !*** ./src/assets/svg-markup.js ***!
  \**********************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var PLAYBACK_RATE_ICON = exports.PLAYBACK_RATE_ICON = '<svg viewBox="112 -44 1024 684"><g><path d="M735.2,41.2c-143,0-258.8,115.9-258.8,258.8s115.9,258.8,258.8,258.8S994,443,994,300S878.1,41.2,735.2,41.2z M899.9,323.5H758.7h-47.1v-47.1V135.3h47.1v141.2h141.2V323.5z"/><rect x="288.1" y="135.3" width="141.2" height="47.1"/><rect x="194" y="276.5" width="188.2" height="47.1"/><rect x="288.1" y="417.7" width="141.2" height="47.1"/></g></svg>';

/***/ },
/* 81 */
/*!***************************************************!*\
  !*** ./src/js/view/controls/components/slider.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _slider = __webpack_require__(/*! view/controls/templates/slider */ 82);
	
	var _slider2 = _interopRequireDefault(_slider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/ui */ 78), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Events, UI, utils, _) {
	
	    var getRailBounds = function getRailBounds(elementRail) {
	        var bounds = utils.bounds(elementRail);
	        // Partial workaround of Android 'inert-visual-viewport'
	        // https://bugs.chromium.org/p/chromium/issues/detail?id=489206
	        var pageXOffset = window.pageXOffset;
	        if (pageXOffset && utils.isAndroid() && document.body.parentElement.getBoundingClientRect().left >= 0) {
	            bounds.left -= pageXOffset;
	            bounds.right -= pageXOffset;
	        }
	        return bounds;
	    };
	
	    return function () {
	        function Slider(className, orientation) {
	            _classCallCheck(this, Slider);
	
	            _.extend(this, Events);
	
	            this.className = className + ' jw-background-color jw-reset';
	            this.orientation = orientation;
	
	            this.dragStartListener = this.dragStart.bind(this);
	            this.dragMoveListener = this.dragMove.bind(this);
	            this.dragEndListener = this.dragEnd.bind(this);
	
	            this.tapListener = this.tap.bind(this);
	        }
	
	        _createClass(Slider, [{
	            key: 'setup',
	            value: function setup() {
	                this.el = utils.createElement((0, _slider2.default)(this.className, 'jw-slider-' + this.orientation));
	
	                this.elementRail = this.el.getElementsByClassName('jw-slider-container')[0];
	                this.elementBuffer = this.el.getElementsByClassName('jw-buffer')[0];
	                this.elementProgress = this.el.getElementsByClassName('jw-progress')[0];
	                this.elementThumb = this.el.getElementsByClassName('jw-knob')[0];
	
	                this.userInteract = new UI(this.element(), { preventScrolling: true });
	
	                this.userInteract.on('dragStart', this.dragStartListener);
	                this.userInteract.on('drag', this.dragMoveListener);
	                this.userInteract.on('dragEnd', this.dragEndListener);
	
	                this.userInteract.on('tap click', this.tapListener);
	            }
	        }, {
	            key: 'dragStart',
	            value: function dragStart() {
	                this.trigger('dragStart');
	                this.railBounds = getRailBounds(this.elementRail);
	            }
	        }, {
	            key: 'dragEnd',
	            value: function dragEnd(evt) {
	                this.dragMove(evt);
	                this.trigger('dragEnd');
	            }
	        }, {
	            key: 'dragMove',
	            value: function dragMove(evt) {
	                var bounds = this.railBounds = this.railBounds ? this.railBounds : getRailBounds(this.elementRail);
	                var dimension = void 0;
	                var percentage = void 0;
	
	                if (this.orientation === 'horizontal') {
	                    dimension = evt.pageX;
	                    if (dimension < bounds.left) {
	                        percentage = 0;
	                    } else if (dimension > bounds.right) {
	                        percentage = 100;
	                    } else {
	                        percentage = utils.between((dimension - bounds.left) / bounds.width, 0, 1) * 100;
	                    }
	                } else {
	                    dimension = evt.pageY;
	                    if (dimension >= bounds.bottom) {
	                        percentage = 0;
	                    } else if (dimension <= bounds.top) {
	                        percentage = 100;
	                    } else {
	                        percentage = utils.between((bounds.height - (dimension - bounds.top)) / bounds.height, 0, 1) * 100;
	                    }
	                }
	
	                var updatedPercent = this.limit(percentage);
	                this.render(updatedPercent);
	                this.update(updatedPercent);
	
	                return false;
	            }
	        }, {
	            key: 'tap',
	            value: function tap(evt) {
	                this.railBounds = getRailBounds(this.elementRail);
	                this.dragMove(evt);
	            }
	        }, {
	            key: 'limit',
	            value: function limit(percentage) {
	                // modules that extend Slider can set limits on the percentage (TimeSlider)
	                return percentage;
	            }
	        }, {
	            key: 'update',
	            value: function update(percentage) {
	                this.trigger('update', { percentage: percentage });
	            }
	        }, {
	            key: 'render',
	            value: function render(percentage) {
	                percentage = Math.max(0, Math.min(percentage, 100));
	
	                if (this.orientation === 'horizontal') {
	                    this.elementThumb.style.left = percentage + '%';
	                    this.elementProgress.style.width = percentage + '%';
	                } else {
	                    this.elementThumb.style.bottom = percentage + '%';
	                    this.elementProgress.style.height = percentage + '%';
	                }
	            }
	        }, {
	            key: 'updateBuffer',
	            value: function updateBuffer(percentage) {
	                this.elementBuffer.style.width = percentage + '%';
	            }
	        }, {
	            key: 'element',
	            value: function element() {
	                return this.el;
	            }
	        }]);
	
	        return Slider;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 82 */
/*!**************************************************!*\
  !*** ./src/js/view/controls/templates/slider.js ***!
  \**************************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function () {
	    var className = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	    return '<div class="' + className + ' ' + orientation + ' jw-reset" aria-hidden="true">' + '<div class="jw-slider-container jw-reset">' + '<div class="jw-rail jw-reset"></div>' + '<div class="jw-buffer jw-reset"></div>' + '<div class="jw-progress jw-reset"></div>' + '<div class="jw-knob jw-reset"></div>' + '</div>' + '</div>';
	};

/***/ },
/* 83 */
/*!*******************************************************!*\
  !*** ./src/js/view/controls/components/timeslider.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/constants */ 20), __webpack_require__(/*! utils/ui */ 78), __webpack_require__(/*! view/controls/components/slider */ 81), __webpack_require__(/*! view/controls/components/tooltip */ 84), __webpack_require__(/*! view/controls/components/chapters.mixin */ 86), __webpack_require__(/*! view/controls/components/thumbnails.mixin */ 87)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, utils, Constants, UI, Slider, Tooltip, ChaptersMixin, ThumbnailsMixin) {
	    var TimeTip = function (_Tooltip) {
	        _inherits(TimeTip, _Tooltip);
	
	        function TimeTip() {
	            _classCallCheck(this, TimeTip);
	
	            return _possibleConstructorReturn(this, (TimeTip.__proto__ || Object.getPrototypeOf(TimeTip)).apply(this, arguments));
	        }
	
	        _createClass(TimeTip, [{
	            key: 'setup',
	            value: function setup() {
	                this.text = document.createElement('span');
	                this.text.className = 'jw-text jw-reset';
	                this.img = document.createElement('div');
	                this.img.className = 'jw-reset';
	                this.containerWidth = 0;
	                this.textLength = 0;
	                this.dragJustReleased = false;
	
	                var wrapper = document.createElement('div');
	                wrapper.className = 'jw-time-tip jw-background-color jw-reset';
	                wrapper.appendChild(this.img);
	                wrapper.appendChild(this.text);
	
	                this.addContent(wrapper);
	            }
	        }, {
	            key: 'image',
	            value: function image(style) {
	                utils.style(this.img, style);
	            }
	        }, {
	            key: 'update',
	            value: function update(txt) {
	                this.text.textContent = txt;
	            }
	        }, {
	            key: 'getWidth',
	            value: function getWidth() {
	                if (!this.containerWidth) {
	                    this.setWidth();
	                }
	
	                return this.containerWidth;
	            }
	        }, {
	            key: 'setWidth',
	            value: function setWidth(width) {
	                if (width) {
	                    this.containerWidth = width + 16; // add a little padding so the image isn't flush against the edge
	                    return;
	                }
	
	                if (!this.container) {
	                    return;
	                }
	
	                this.containerWidth = utils.bounds(this.container).width;
	            }
	        }, {
	            key: 'resetWidth',
	            value: function resetWidth() {
	                this.containerWidth = 0;
	            }
	        }]);
	
	        return TimeTip;
	    }(Tooltip);
	
	    function reasonInteraction() {
	        return { reason: 'interaction' };
	    }
	
	    var TimeSlider = function (_Slider) {
	        _inherits(TimeSlider, _Slider);
	
	        function TimeSlider(_model, _api) {
	            _classCallCheck(this, TimeSlider);
	
	            var _this2 = _possibleConstructorReturn(this, (TimeSlider.__proto__ || Object.getPrototypeOf(TimeSlider)).call(this, 'jw-slider-time', 'horizontal'));
	
	            _this2._model = _model;
	            _this2._api = _api;
	
	            _this2.timeTip = new TimeTip('jw-tooltip-time', null, true);
	            _this2.timeTip.setup();
	
	            _this2.cues = [];
	
	            // Store the attempted seek, until the previous one completes
	            _this2.seekThrottled = _.throttle(_this2.performSeek, 400);
	            _this2.mobileHoverDistance = 5;
	
	            _this2.setup();
	            return _this2;
	        }
	
	        // These overwrite Slider methods
	
	
	        _createClass(TimeSlider, [{
	            key: 'setup',
	            value: function setup() {
	                _get(TimeSlider.prototype.__proto__ || Object.getPrototypeOf(TimeSlider.prototype), 'setup', this).apply(this, arguments);
	
	                this._model.on('duration', this.onDuration, this).change('playlistItem', this.onPlaylistItem, this).change('position', this.onPosition, this).change('buffer', this.onBuffer, this);
	
	                this.elementRail.appendChild(this.timeTip.element());
	
	                // Show the tooltip on while dragging (touch) moving(mouse), or moving over(mouse)
	                this.elementUI = new UI(this.el, { useHover: true, useMove: true }).on('drag move over', this.showTimeTooltip.bind(this), this).on('dragEnd out', this.hideTimeTooltip.bind(this), this);
	            }
	        }, {
	            key: 'limit',
	            value: function limit(percent) {
	                if (this.activeCue && _.isNumber(this.activeCue.pct)) {
	                    return this.activeCue.pct;
	                }
	                var duration = this._model.get('duration');
	                var streamType = this._model.get('streamType');
	                if (streamType === 'DVR') {
	                    var position = (1 - percent / 100) * duration;
	                    var currentPosition = this._model.get('position');
	                    var updatedPosition = Math.min(position, Math.max(Constants.dvrSeekLimit, currentPosition));
	                    var updatedPercent = updatedPosition * 100 / duration;
	                    return 100 - updatedPercent;
	                }
	                return percent;
	            }
	        }, {
	            key: 'update',
	            value: function update(percent) {
	                this.seekTo = percent;
	                this.seekThrottled();
	                _get(TimeSlider.prototype.__proto__ || Object.getPrototypeOf(TimeSlider.prototype), 'update', this).apply(this, arguments);
	            }
	        }, {
	            key: 'dragStart',
	            value: function dragStart() {
	                this._model.set('scrubbing', true);
	                _get(TimeSlider.prototype.__proto__ || Object.getPrototypeOf(TimeSlider.prototype), 'dragStart', this).apply(this, arguments);
	            }
	        }, {
	            key: 'dragEnd',
	            value: function dragEnd() {
	                _get(TimeSlider.prototype.__proto__ || Object.getPrototypeOf(TimeSlider.prototype), 'dragEnd', this).apply(this, arguments);
	                this._model.set('scrubbing', false);
	                this.dragJustReleased = true;
	            }
	
	            // Event Listeners
	
	        }, {
	            key: 'onSeeked',
	            value: function onSeeked() {
	                // When we are done scrubbing there will be a final seeked event
	                if (this._model.get('scrubbing')) {
	                    this.performSeek();
	                }
	            }
	        }, {
	            key: 'onBuffer',
	            value: function onBuffer(model, pct) {
	                this.updateBuffer(pct);
	            }
	        }, {
	            key: 'onPosition',
	            value: function onPosition(model, position) {
	                if (this.dragJustReleased) {
	                    // prevents firing an outdated position and causing the timeslider to jump back and forth
	                    this.dragJustReleased = false;
	                    return;
	                }
	                this.updateTime(position, model.get('duration'));
	            }
	        }, {
	            key: 'onDuration',
	            value: function onDuration(model, duration) {
	                this.updateTime(model.get('position'), duration);
	            }
	        }, {
	            key: 'updateTime',
	            value: function updateTime(position, duration) {
	                var pct = 0;
	                if (duration) {
	                    var streamType = this._model.get('streamType');
	                    if (streamType === 'DVR') {
	                        pct = (duration - position) / duration * 100;
	                    } else if (streamType === 'VOD') {
	                        pct = position / duration * 100;
	                    }
	                }
	                this.render(pct);
	            }
	        }, {
	            key: 'onPlaylistItem',
	            value: function onPlaylistItem(model, playlistItem) {
	                if (!playlistItem) {
	                    return;
	                }
	                this.reset();
	
	                model.mediaModel.on('seeked', this.onSeeked, this);
	
	                var tracks = playlistItem.tracks;
	                _.each(tracks, function (track) {
	                    if (track && track.kind && track.kind.toLowerCase() === 'thumbnails') {
	                        this.loadThumbnails(track.file);
	                    } else if (track && track.kind && track.kind.toLowerCase() === 'chapters') {
	                        this.loadChapters(track.file);
	                    }
	                }, this);
	            }
	        }, {
	            key: 'performSeek',
	            value: function performSeek() {
	                var percent = this.seekTo;
	                var duration = this._model.get('duration');
	                var streamType = this._model.get('streamType');
	                var position;
	                if (duration === 0) {
	                    this._api.play(reasonInteraction());
	                } else if (streamType === 'DVR') {
	                    position = (100 - percent) / 100 * duration;
	                    this._api.seek(position, reasonInteraction());
	                } else {
	                    position = percent / 100 * duration;
	                    this._api.seek(Math.min(position, duration - 0.25), reasonInteraction());
	                }
	            }
	        }, {
	            key: 'showTimeTooltip',
	            value: function showTimeTooltip(evt) {
	                var duration = this._model.get('duration');
	                if (duration === 0) {
	                    return;
	                }
	
	                var playerWidth = this._model.get('containerWidth');
	                var railBounds = utils.bounds(this.elementRail);
	                var position = evt.pageX ? evt.pageX - railBounds.left : evt.x;
	                position = utils.between(position, 0, railBounds.width);
	                var pct = position / railBounds.width;
	                var time = duration * pct;
	
	                // For DVR we need to swap it around
	                if (duration < 0) {
	                    time = duration - time;
	                }
	
	                var timetipText;
	
	                // With touch events, we never will get the hover events on the cues that cause cues to be active.
	                // Therefore use the info we about the scroll position to detect if there is a nearby cue to be active.
	                if (UI.getPointerType(evt.sourceEvent) === 'touch') {
	                    this.activeCue = _.reduce(this.cues, function (closeCue, cue) {
	                        if (Math.abs(position - parseInt(cue.pct) / 100 * railBounds.width) < this.mobileHoverDistance) {
	                            return cue;
	                        }
	                        return closeCue;
	                    }.bind(this), undefined);
	                }
	
	                if (this.activeCue) {
	                    timetipText = this.activeCue.text;
	                } else {
	                    var allowNegativeTime = true;
	                    timetipText = utils.timeFormat(time, allowNegativeTime);
	
	                    // If DVR and within live buffer
	                    if (duration < 0 && time > Constants.dvrSeekLimit) {
	                        timetipText = 'Live';
	                    }
	                }
	                var timeTip = this.timeTip;
	
	                timeTip.update(timetipText);
	                if (this.textLength !== timetipText.length) {
	                    // An activeCue may cause the width of the timeTip container to change
	                    this.textLength = timetipText.length;
	                    timeTip.resetWidth();
	                }
	                this.showThumbnail(time);
	
	                utils.addClass(timeTip.el, 'jw-open');
	
	                var timeTipWidth = timeTip.getWidth();
	                var widthPct = railBounds.width / 100;
	                var tolerance = playerWidth - railBounds.width;
	                var timeTipPct = 0;
	                if (timeTipWidth > tolerance) {
	                    // timeTip may go outside the bounds of the player. Determine the % of tolerance needed
	                    timeTipPct = (timeTipWidth - tolerance) / (2 * 100 * widthPct);
	                }
	                var safePct = Math.min(1 - timeTipPct, Math.max(timeTipPct, pct)).toFixed(3) * 100;
	                utils.style(timeTip.el, { left: safePct + '%' });
	            }
	        }, {
	            key: 'hideTimeTooltip',
	            value: function hideTimeTooltip() {
	                utils.removeClass(this.timeTip.el, 'jw-open');
	            }
	        }, {
	            key: 'reset',
	            value: function reset() {
	                this.resetChapters();
	                this.resetThumbnails();
	                this.timeTip.resetWidth();
	                this.textLength = 0;
	            }
	        }]);
	
	        return TimeSlider;
	    }(Slider);
	
	    _.extend(TimeSlider.prototype, ChaptersMixin, ThumbnailsMixin);
	
	    return TimeSlider;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 84 */
/*!****************************************************!*\
  !*** ./src/js/view/controls/components/tooltip.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/aria */ 85), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Events, ariaLabel, utils, _) {
	
	    return function () {
	        function Tooltip(name, ariaText, elementShown) {
	            _classCallCheck(this, Tooltip);
	
	            _.extend(this, Events);
	            this.el = document.createElement('div');
	            var className = 'jw-icon jw-icon-tooltip ' + name + ' jw-button-color jw-reset';
	            if (!elementShown) {
	                className += ' jw-hidden';
	            }
	
	            ariaLabel(this.el, ariaText);
	
	            this.el.className = className;
	            this.container = document.createElement('div');
	            this.container.className = 'jw-overlay jw-reset';
	            this.openClass = 'jw-open';
	            this.componentType = 'tooltip';
	
	            this.el.appendChild(this.container);
	        }
	
	        _createClass(Tooltip, [{
	            key: 'addContent',
	            value: function addContent(elem) {
	                if (this.content) {
	                    this.removeContent();
	                }
	
	                this.content = elem;
	                this.container.appendChild(elem);
	            }
	        }, {
	            key: 'removeContent',
	            value: function removeContent() {
	                if (this.content) {
	                    this.container.removeChild(this.content);
	                    this.content = null;
	                }
	            }
	        }, {
	            key: 'hasContent',
	            value: function hasContent() {
	                return !!this.content;
	            }
	        }, {
	            key: 'element',
	            value: function element() {
	                return this.el;
	            }
	        }, {
	            key: 'openTooltip',
	            value: function openTooltip(evt) {
	                this.trigger('open-' + this.componentType, evt, { isOpen: true });
	                this.isOpen = true;
	                utils.toggleClass(this.el, this.openClass, this.isOpen);
	            }
	        }, {
	            key: 'closeTooltip',
	            value: function closeTooltip(evt) {
	                this.trigger('close-' + this.componentType, evt, { isOpen: false });
	                this.isOpen = false;
	                utils.toggleClass(this.el, this.openClass, this.isOpen);
	            }
	        }, {
	            key: 'toggleOpenState',
	            value: function toggleOpenState(evt) {
	                if (this.isOpen) {
	                    this.closeTooltip(evt);
	                } else {
	                    this.openTooltip(evt);
	                }
	            }
	        }]);
	
	        return Tooltip;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 85 */
/*!******************************!*\
  !*** ./src/js/utils/aria.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return function (element, ariaLabel) {
	        if (!element || !ariaLabel) {
	            return;
	        }
	
	        element.setAttribute('aria-label', ariaLabel);
	        element.setAttribute('role', 'button');
	        element.setAttribute('tabindex', '0');
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 86 */
/*!***********************************************************!*\
  !*** ./src/js/view/controls/components/chapters.mixin.js ***!
  \***********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! parsers/captions/srt */ 46)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, utils, srt) {
	    var Cue = function () {
	        function Cue(time, text) {
	            _classCallCheck(this, Cue);
	
	            this.time = time;
	            this.text = text;
	            this.el = document.createElement('div');
	            this.el.className = 'jw-cue jw-reset';
	        }
	
	        _createClass(Cue, [{
	            key: 'align',
	            value: function align(duration) {
	                // If a percentage, use it, else calculate the percentage
	                if (this.time.toString().slice(-1) === '%') {
	                    this.pct = this.time;
	                } else {
	                    var percentage = this.time / duration * 100;
	                    this.pct = percentage + '%';
	                }
	
	                this.el.style.left = this.pct;
	            }
	        }]);
	
	        return Cue;
	    }();
	
	    return {
	
	        loadChapters: function loadChapters(file) {
	            utils.ajax(file, this.chaptersLoaded.bind(this), this.chaptersFailed, {
	                plainText: true
	            });
	        },
	
	        chaptersLoaded: function chaptersLoaded(evt) {
	            var data = srt(evt.responseText);
	            if (_.isArray(data)) {
	                _.each(data, this.addCue, this);
	                this.drawCues();
	            }
	        },
	
	        chaptersFailed: function chaptersFailed() {},
	
	        addCue: function addCue(obj) {
	            this.cues.push(new Cue(obj.begin, obj.text));
	        },
	
	        drawCues: function drawCues() {
	            var _this = this;
	
	            // We won't want to draw them until we have a duration
	            var duration = this._model.get('duration');
	            if (!duration || duration <= 0) {
	                this._model.once('change:duration', this.drawCues, this);
	                return;
	            }
	
	            _.each(this.cues, function (cue) {
	                cue.align(duration);
	                cue.el.addEventListener('mouseover', function () {
	                    _this.activeCue = cue;
	                });
	                cue.el.addEventListener('mouseout', function () {
	                    _this.activeCue = null;
	                });
	                _this.elementRail.appendChild(cue.el);
	            });
	        },
	
	        resetChapters: function resetChapters() {
	            _.each(this.cues, function (cue) {
	                if (cue.el.parentNode) {
	                    cue.el.parentNode.removeChild(cue.el);
	                }
	            });
	            this.cues = [];
	        }
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 87 */
/*!*************************************************************!*\
  !*** ./src/js/view/controls/components/thumbnails.mixin.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! parsers/captions/srt */ 46)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, utils, srt) {
	
	    function Thumbnail(obj) {
	        this.begin = obj.begin;
	        this.end = obj.end;
	        this.img = obj.text;
	    }
	
	    return {
	        loadThumbnails: function loadThumbnails(file) {
	            if (!file) {
	                return;
	            }
	            this.vttPath = file.split('?')[0].split('/').slice(0, -1).join('/');
	            // Only load the first individual image file so we can get its dimensions. All others are loaded when
	            // they're set as background-images.
	            this.individualImage = null;
	            utils.ajax(file, this.thumbnailsLoaded.bind(this), this.thumbnailsFailed.bind(this), {
	                plainText: true
	            });
	        },
	
	        thumbnailsLoaded: function thumbnailsLoaded(evt) {
	            var data = srt(evt.responseText);
	            if (_.isArray(data)) {
	                _.each(data, function (obj) {
	                    this.thumbnails.push(new Thumbnail(obj));
	                }, this);
	                this.drawCues();
	            }
	        },
	
	        thumbnailsFailed: function thumbnailsFailed() {},
	
	        chooseThumbnail: function chooseThumbnail(seconds) {
	            var idx = _.sortedIndex(this.thumbnails, { end: seconds }, _.property('end'));
	            if (idx >= this.thumbnails.length) {
	                idx = this.thumbnails.length - 1;
	            }
	            var url = this.thumbnails[idx].img;
	            if (url.indexOf('://') < 0) {
	                url = this.vttPath ? this.vttPath + '/' + url : url;
	            }
	
	            return url;
	        },
	
	        loadThumbnail: function loadThumbnail(seconds) {
	            var url = this.chooseThumbnail(seconds);
	            var style = {
	                display: 'block',
	                margin: '0 auto',
	                backgroundPosition: '0 0'
	            };
	
	            var hashIndex = url.indexOf('#xywh');
	            if (hashIndex > 0) {
	                try {
	                    var matched = /(.+)\#xywh=(\d+),(\d+),(\d+),(\d+)/.exec(url);
	                    url = matched[1];
	                    style.backgroundPosition = matched[2] * -1 + 'px ' + matched[3] * -1 + 'px';
	                    style.width = matched[4];
	                    style.height = matched[5];
	                } catch (e) {
	                    // this.vttFailed('Could not parse thumbnail');
	                    return;
	                }
	            } else if (!this.individualImage) {
	                this.individualImage = new Image();
	                this.individualImage.onload = _.bind(function () {
	                    this.individualImage.onload = null;
	                    this.timeTip.image({ width: this.individualImage.width, height: this.individualImage.height });
	                    this.timeTip.setWidth(this.individualImage.width);
	                }, this);
	                this.individualImage.src = url;
	            }
	
	            style.backgroundImage = 'url("' + url + '")';
	
	            return style;
	        },
	
	        showThumbnail: function showThumbnail(seconds) {
	            if (this.thumbnails.length < 1) {
	                return;
	            }
	            this.timeTip.image(this.loadThumbnail(seconds));
	        },
	
	        resetThumbnails: function resetThumbnails() {
	            this.timeTip.image({
	                backgroundImage: '',
	                width: 0,
	                height: 0
	            });
	            this.thumbnails = [];
	        }
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 88 */
/*!*************************************************!*\
  !*** ./src/js/view/controls/components/menu.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _menu = __webpack_require__(/*! view/controls/templates/menu */ 89);
	
	var _menu2 = _interopRequireDefault(_menu);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! view/controls/components/tooltip */ 84), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/ui */ 78)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tooltip, utils, _, UI) {
	
	    return function (_Tooltip) {
	        _inherits(Menu, _Tooltip);
	
	        function Menu() {
	            _classCallCheck(this, Menu);
	
	            return _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).apply(this, arguments));
	        }
	
	        _createClass(Menu, [{
	            key: 'setup',
	            value: function setup(list, selectedIndex, options) {
	                options = options || {};
	
	                if (!this.iconUI) {
	                    this.iconUI = new UI(this.el, { useHover: true, directSelect: true });
	
	                    this.toggleValueListener = this.toggleValue.bind(this);
	
	                    this.toggleOpenStateListener = this.toggleOpenState.bind(this);
	                    this.openTooltipListener = this.openTooltip.bind(this);
	                    this.closeTooltipListener = this.closeTooltip.bind(this);
	
	                    this.selectListener = this.select.bind(this);
	                }
	
	                this.reset();
	
	                list = _.isArray(list) ? list : [];
	
	                utils.toggleClass(this.el, 'jw-hidden', list.length < 2);
	
	                var isMenu = list.length > 2 || list.length === 2 && options && options.isToggle === false;
	                var isToggle = !isMenu && list.length === 2;
	                // Make caption menu always a toggle to show active color
	                utils.toggleClass(this.el, 'jw-toggle', isToggle || options.isToggle);
	                utils.toggleClass(this.el, 'jw-button-color', !isToggle);
	
	                if (isMenu) {
	                    utils.removeClass(this.el, 'jw-off');
	
	                    this.iconUI.on('tap', this.toggleOpenStateListener).on('over', this.openTooltipListener).on('out', this.closeTooltipListener);
	
	                    var html = (0, _menu2.default)(list);
	                    var elem = utils.createElement(html);
	                    this.addContent(elem);
	                    this.contentUI = new UI(this.content).on('click tap', this.selectListener);
	                } else if (isToggle) {
	                    this.iconUI.on('click tap', this.toggleValueListener);
	                }
	
	                this.selectItem(selectedIndex);
	            }
	        }, {
	            key: 'toggleValue',
	            value: function toggleValue() {
	                this.trigger('toggleValue');
	            }
	        }, {
	            key: 'select',
	            value: function select(evt) {
	                if (evt.target.parentElement === this.content) {
	                    var classes = utils.classList(evt.target);
	
	                    // find the class with a name of the form 'jw-item-1'
	                    var item = _.find(classes, function (c) {
	                        return c.indexOf('jw-item') === 0;
	                    });
	
	                    if (item) {
	                        this.trigger('select', parseInt(item.split('-')[2]));
	                        this.closeTooltipListener();
	                    }
	                }
	            }
	        }, {
	            key: 'selectItem',
	            value: function selectItem(selectedIndex) {
	                if (this.content) {
	                    for (var i = 0; i < this.content.children.length; i++) {
	                        utils.toggleClass(this.content.children[i], 'jw-active-option', selectedIndex === i);
	                    }
	                }
	                utils.toggleClass(this.el, 'jw-off', selectedIndex === 0);
	            }
	        }, {
	            key: 'reset',
	            value: function reset() {
	                utils.addClass(this.el, 'jw-off');
	                this.iconUI.off();
	                if (this.contentUI) {
	                    this.contentUI.off().destroy();
	                }
	                this.removeContent();
	            }
	        }]);
	
	        return Menu;
	    }(Tooltip);
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 89 */
/*!************************************************!*\
  !*** ./src/js/view/controls/templates/menu.js ***!
  \************************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function () {
	    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	
	    var itemsHtml = items.map(function (item, index) {
	        return menuItem(index, item.label);
	    }).join('');
	
	    return '<ul class="jw-menu jw-background-color jw-reset">' + ('' + itemsHtml) + '</ul>';
	};
	
	var menuItem = function menuItem() {
	    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	    return '<li class=\'jw-text jw-option jw-item-' + index + ' jw-reset\'>' + label + '</li>';
	};

/***/ },
/* 90 */
/*!*******************************************************************!*\
  !*** ./src/js/view/controls/components/selection-display-menu.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _selectiondisplaymenu = __webpack_require__(/*! view/controls/templates/selectiondisplaymenu */ 91);
	
	var _selectiondisplaymenu2 = _interopRequireDefault(_selectiondisplaymenu);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! view/controls/components/menu */ 88), __webpack_require__(/*! utils/helpers */ 8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Menu, utils) {
	    return function (_Menu) {
	        _inherits(SelectionDisplayMenu, _Menu);
	
	        function SelectionDisplayMenu(name, ariaText, defaultIconElement) {
	            _classCallCheck(this, SelectionDisplayMenu);
	
	            var _this = _possibleConstructorReturn(this, (SelectionDisplayMenu.__proto__ || Object.getPrototypeOf(SelectionDisplayMenu)).call(this, name, ariaText, false));
	
	            var menuIcons = (0, _selectiondisplaymenu2.default)(defaultIconElement);
	            var menuIconsElem = utils.createElement(menuIcons);
	
	            _this.defaultIcon = menuIconsElem.getElementsByClassName('jw-menu-selection-icon')[0];
	            _this.selectionText = menuIconsElem.getElementsByClassName('jw-menu-selection-text')[0];
	
	            _this.el.insertBefore(menuIconsElem, _this.container);
	
	            utils.addClass(_this.el, 'jw-selection-menu');
	            utils.removeClass(_this.el, 'jw-icon');
	            return _this;
	        }
	
	        _createClass(SelectionDisplayMenu, [{
	            key: 'setup',
	            value: function setup(list, selectedIndex, options) {
	                this.list = list;
	                this.defaultIndex = options && options.defaultIndex > -1 ? options.defaultIndex : -1;
	                _get(SelectionDisplayMenu.prototype.__proto__ || Object.getPrototypeOf(SelectionDisplayMenu.prototype), 'setup', this).call(this, list, selectedIndex, options);
	                utils.addClass(this.el, 'jw-button-color');
	            }
	        }, {
	            key: 'selectItem',
	            value: function selectItem(selectedIndex) {
	                _get(SelectionDisplayMenu.prototype.__proto__ || Object.getPrototypeOf(SelectionDisplayMenu.prototype), 'selectItem', this).call(this, selectedIndex);
	
	                // Show the selected item's label.  If it's not in the menu, show the default icon instead.
	                var showSelectionLabel = selectedIndex !== this.defaultIndex && selectedIndex !== -1;
	
	                if (showSelectionLabel) {
	                    this.selectionText.textContent = this.list[selectedIndex].label;
	                }
	
	                utils.toggleClass(this.defaultIcon, 'jw-hidden', showSelectionLabel);
	                utils.toggleClass(this.selectionText, 'jw-hidden', !showSelectionLabel);
	            }
	        }]);
	
	        return SelectionDisplayMenu;
	    }(Menu);
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 91 */
/*!****************************************************************!*\
  !*** ./src/js/view/controls/templates/selectiondisplaymenu.js ***!
  \****************************************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (defaultIconElement) {
	    return "<div class=\"jw-selection-menu-icon-container\">" + ("<div class=\"jw-menu-selection-icon jw-reset\">" + defaultIconElement + "</div>") + "<div class=\"jw-menu-selection-text jw-reset\"></div>" + "</div>";
	};

/***/ },
/* 92 */
/*!**********************************************************!*\
  !*** ./src/js/view/controls/components/volumetooltip.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! view/controls/components/tooltip */ 84), __webpack_require__(/*! view/controls/components/slider */ 81), __webpack_require__(/*! utils/ui */ 78), __webpack_require__(/*! utils/helpers */ 8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tooltip, Slider, UI) {
	
	    return function (_Tooltip) {
	        _inherits(VolumeTooltip, _Tooltip);
	
	        function VolumeTooltip(_model, name, ariaText) {
	            _classCallCheck(this, VolumeTooltip);
	
	            var _this = _possibleConstructorReturn(this, (VolumeTooltip.__proto__ || Object.getPrototypeOf(VolumeTooltip)).call(this, name, ariaText, true));
	
	            _this._model = _model;
	
	            _this.volumeSlider = new Slider('jw-slider-volume jw-volume-tip', 'vertical');
	            _this.volumeSlider.setup();
	
	            _this.addContent(_this.volumeSlider.element());
	
	            _this.volumeSlider.on('update', function (evt) {
	                this.trigger('update', evt);
	            }, _this);
	
	            new UI(_this.el, { useHover: true, directSelect: true }).on('click', _this.toggleValue, _this).on('tap', _this.toggleOpenState, _this).on('over', _this.openTooltip, _this).on('out', _this.closeTooltip, _this);
	
	            _this._model.on('change:volume', _this.onVolume, _this);
	            return _this;
	        }
	
	        _createClass(VolumeTooltip, [{
	            key: 'toggleValue',
	            value: function toggleValue() {
	                this.trigger('toggleValue');
	            }
	        }]);
	
	        return VolumeTooltip;
	    }(Tooltip);
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 93 */
/*!**************************************!*\
  !*** ./src/js/view/controls/dock.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _dock = __webpack_require__(/*! view/controls/templates/dock */ 94);
	
	var _dock2 = _interopRequireDefault(_dock);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/ui */ 78)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, _, UI) {
	
	    function getDockButton(evt) {
	        if (utils.hasClass(evt.target, 'jw-dock-button')) {
	            // Clicks on button container
	            return evt.target;
	        } else if (utils.hasClass(evt.target, 'jw-dock-text')) {
	            // Clicks on the text overlay
	            return evt.target.parentElement.parentElement;
	        }
	
	        // Clicks on any other children
	        return evt.target.parentElement;
	    }
	
	    function getDockContainer(buttons) {
	        var html = (0, _dock2.default)(buttons);
	        return utils.createElement(html);
	    }
	
	    return function () {
	        function Dock(_model) {
	            var _this = this;
	
	            _classCallCheck(this, Dock);
	
	            this.model = _model;
	
	            var buttons = this.model.get('dock');
	
	            this.el = getDockContainer(buttons);
	            new UI(this.el).on('click tap', this.click, this);
	
	            this.model.on('change:dock', function (model, changedButtons) {
	                var newEl = getDockContainer(changedButtons);
	                utils.emptyElement(_this.el);
	                for (var i = newEl.childNodes.length; i--;) {
	                    _this.el.appendChild(newEl.firstChild);
	                }
	            }, this);
	        }
	
	        _createClass(Dock, [{
	            key: 'click',
	            value: function click(evt) {
	                var elem = getDockButton(evt);
	
	                var btnId = elem.getAttribute('button');
	                var buttons = this.model.get('dock');
	                var btn = _.findWhere(buttons, { id: btnId });
	
	                if (btn && btn.callback) {
	                    btn.callback(evt);
	                }
	            }
	        }, {
	            key: 'element',
	            value: function element() {
	                return this.el;
	            }
	        }]);
	
	        return Dock;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 94 */
/*!************************************************!*\
  !*** ./src/js/view/controls/templates/dock.js ***!
  \************************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function () {
	    var dockButtons = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	
	    var buttonsHtml = dockButtons.map(function (button) {
	        return dockButton(button.btnClass, button.id, button.img, button.tooltip);
	    }).join('');
	
	    return '<div class="jw-dock jw-reset">' + ('' + buttonsHtml) + '</div>';
	};
	
	var dockButton = function dockButton() {
	    var buttonClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var buttonId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	    var image = arguments[2];
	    var tooltipText = arguments[3];
	
	    var style = image ? 'style="background-image: url(' + image + ')"' : '';
	    var tooltipHtml = tooltipText ? tooltip(tooltipText) : '';
	    var aria = tooltipText ? 'aria-label="' + tooltipText + '" role="button" tabindex="0"' : '';
	    return '<div class="jw-dock-button jw-background-color jw-reset ' + buttonClass + '" button="' + buttonId + '">' + ('<div class="jw-icon jw-dock-image jw-button-color jw-reset" ' + style + ' ' + aria + '></div>') + '<div class="jw-arrow jw-reset"></div>' + ('' + tooltipHtml) + '</div>';
	};
	
	var tooltip = function tooltip(text) {
	    return '<div class="jw-overlay jw-background-color jw-reset">' + ('<span class="jw-text jw-dock-text jw-reset">' + text + '</span>') + '</div>';
	};

/***/ },
/* 95 */
/*!*****************************************************!*\
  !*** ./src/js/view/controls/rewind-display-icon.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _displayIcon = __webpack_require__(/*! view/controls/templates/display-icon */ 96);
	
	var _displayIcon2 = _interopRequireDefault(_displayIcon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/ui */ 78)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, UI) {
	
	    return function () {
	        function RewindDisplayIcon(model, api) {
	            _classCallCheck(this, RewindDisplayIcon);
	
	            this.el = utils.createElement((0, _displayIcon2.default)('rewind', model.get('localization').playback));
	
	            this.iconUI = new UI(this.el).on('click tap', function () {
	                var currentPosition = model.get('position');
	                var duration = model.get('duration');
	                var rewindPosition = currentPosition - 10;
	                var startPosition = 0;
	
	                // duration is negative in DVR mode
	                if (model.get('streamType') === 'DVR') {
	                    startPosition = duration;
	                }
	                // Seek 10s back. Seek value should be >= 0 in VOD mode and >= (negative) duration in DVR mode
	                api.seek(Math.max(rewindPosition, startPosition));
	            });
	        }
	
	        _createClass(RewindDisplayIcon, [{
	            key: 'element',
	            value: function element() {
	                return this.el;
	            }
	        }]);
	
	        return RewindDisplayIcon;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 96 */
/*!********************************************************!*\
  !*** ./src/js/view/controls/templates/display-icon.js ***!
  \********************************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function () {
	    var iconName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var ariaLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	    return '<div class="jw-display-icon-container jw-display-icon-' + iconName + ' jw-background-color jw-reset">' + ('<div class="jw-icon jw-icon-' + iconName + ' jw-button-color jw-reset" role="button" tabindex="0" aria-label="' + ariaLabel + '"></div>') + '</div>';
	};

/***/ },
/* 97 */
/*!***************************************************!*\
  !*** ./src/js/view/controls/play-display-icon.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _displayIcon = __webpack_require__(/*! view/controls/templates/display-icon */ 96);
	
	var _displayIcon2 = _interopRequireDefault(_displayIcon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/ui */ 78), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, Events, UI, _) {
	
	    return function () {
	        function PlayDisplayIcon(_model) {
	            var _this = this;
	
	            _classCallCheck(this, PlayDisplayIcon);
	
	            _.extend(this, Events);
	
	            var localization = _model.get('localization');
	            var element = utils.createElement((0, _displayIcon2.default)('display', localization.playback));
	            var iconDisplay = element.getElementsByClassName('jw-icon-display')[0];
	            element.style.cursor = 'pointer';
	            this.icon = iconDisplay;
	            this.el = element;
	
	            this.iconUI = new UI(this.el).on('click tap', function (evt) {
	                _this.trigger(evt.type);
	            });
	
	            _model.on('change:state', function (model, newstate) {
	                var newstateLabel = void 0;
	                switch (newstate) {
	                    case 'buffering':
	                        newstateLabel = localization.buffer;
	                        break;
	                    case 'playing':
	                        newstateLabel = localization.pause;
	                        break;
	                    case 'paused':
	                        newstateLabel = localization.playback;
	                        break;
	                    case 'complete':
	                        newstateLabel = localization.replay;
	                        break;
	                    default:
	                        newstateLabel = '';
	                        break;
	                }
	                if (newstateLabel === '') {
	                    iconDisplay.removeAttribute('aria-label');
	                } else {
	                    iconDisplay.setAttribute('aria-label', newstateLabel);
	                }
	            });
	        }
	
	        _createClass(PlayDisplayIcon, [{
	            key: 'element',
	            value: function element() {
	                return this.el;
	            }
	        }]);
	
	        return PlayDisplayIcon;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 98 */
/*!***************************************************!*\
  !*** ./src/js/view/controls/next-display-icon.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _displayIcon = __webpack_require__(/*! view/controls/templates/display-icon */ 96);
	
	var _displayIcon2 = _interopRequireDefault(_displayIcon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/ui */ 78)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, UI) {
	
	    return function () {
	        function NextDisplayIcon(model, api) {
	            _classCallCheck(this, NextDisplayIcon);
	
	            var element = utils.createElement((0, _displayIcon2.default)('next', model.get('localization').next));
	
	            this.iconUI = new UI(element).on('click tap', function () {
	                api.next();
	            });
	
	            model.change('nextUp', function (nextUpChangeModel, nextUp) {
	                element.style.display = nextUp ? '' : 'none';
	            });
	
	            this.el = element;
	        }
	
	        _createClass(NextDisplayIcon, [{
	            key: 'element',
	            value: function element() {
	                return this.el;
	            }
	        }]);
	
	        return NextDisplayIcon;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 99 */
/*!***********************************************!*\
  !*** ./src/js/view/controls/nextuptooltip.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _nextup = __webpack_require__(/*! view/controls/templates/nextup */ 100);
	
	var _nextup2 = _interopRequireDefault(_nextup);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/dom */ 14), __webpack_require__(/*! utils/ui */ 78), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/helpers */ 8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (dom, UI, _, Events, utils) {
	
	    return function () {
	        function NextUpTooltip(_model, _api, playerElement) {
	            _classCallCheck(this, NextUpTooltip);
	
	            _.extend(this, Events);
	            this._model = _model;
	            this._api = _api;
	            this._playerElement = playerElement;
	            this.nextUpText = _model.get('localization').nextUp;
	            this.nextUpClose = _model.get('localization').nextUpClose;
	            this.state = 'tooltip';
	            this.enabled = false;
	            this.shown = false;
	            this.reset();
	        }
	
	        _createClass(NextUpTooltip, [{
	            key: 'setup',
	            value: function setup(context) {
	                this.container = context.createElement('div');
	                this.container.className = 'jw-nextup-container jw-reset';
	                var element = utils.createElement((0, _nextup2.default)());
	                this.addContent(element);
	
	                this.closeButton = this.content.querySelector('.jw-nextup-close');
	                this.closeButton.setAttribute('aria-label', this.nextUpClose);
	                this.tooltip = this.content.querySelector('.jw-nextup-tooltip');
	
	                var model = this._model;
	                // Next Up is hidden until we get a valid NextUp item from the nextUp event
	                this.enabled = false;
	
	                // Events
	                model.on('change:nextUp', this.onNextUp, this);
	
	                // Listen for duration changes to determine the offset from the end for when next up should be shown
	                model.change('duration', this.onDuration, this);
	                // Listen for position changes so we can show the tooltip when the offset has been crossed
	                model.change('position', this.onElapsed, this);
	
	                model.change('streamType', this.onStreamType, this);
	                model.change('mediaModel', this.onMediaModel, this);
	
	                // Close button
	                new UI(this.closeButton, { directSelect: true }).on('click tap', function () {
	                    this.nextUpSticky = false;
	                    this.toggle(false);
	                }, this);
	                // Tooltip
	                new UI(this.tooltip).on('click tap', this.click, this);
	            }
	        }, {
	            key: 'loadThumbnail',
	            value: function loadThumbnail(url) {
	                this.nextUpImage = new Image();
	                this.nextUpImage.onload = function () {
	                    this.nextUpImage.onload = null;
	                }.bind(this);
	                this.nextUpImage.src = url;
	
	                return {
	                    backgroundImage: 'url("' + url + '")'
	                };
	            }
	        }, {
	            key: 'click',
	            value: function click() {
	                this.reset();
	                this._api.next();
	            }
	        }, {
	            key: 'toggle',
	            value: function toggle(show, reason) {
	                if (!this.enabled) {
	                    return;
	                }
	                dom.toggleClass(this.container, 'jw-nextup-sticky', !!this.nextUpSticky);
	                if (this.shown !== show) {
	                    this.shown = show;
	                    dom.toggleClass(this.container, 'jw-nextup-container-visible', show);
	                    dom.toggleClass(this._playerElement, 'jw-flag-nextup', show);
	                    var nextUp = this._model.get('nextUp');
	                    if (show && nextUp) {
	                        this.trigger('nextShown', {
	                            mode: nextUp.mode,
	                            ui: 'nextup',
	                            itemsShown: [nextUp],
	                            feedData: nextUp.feedData,
	                            reason: reason
	                        });
	                    }
	                }
	            }
	        }, {
	            key: 'setNextUpItem',
	            value: function setNextUpItem(nextUpItem) {
	                var _this = this;
	
	                // Give the previous item time to complete its animation
	                setTimeout(function () {
	                    // Set thumbnail
	                    _this.thumbnail = _this.content.querySelector('.jw-nextup-thumbnail');
	                    dom.toggleClass(_this.thumbnail, 'jw-nextup-thumbnail-visible', !!nextUpItem.image);
	                    if (nextUpItem.image) {
	                        var thumbnailStyle = _this.loadThumbnail(nextUpItem.image);
	                        utils.style(_this.thumbnail, thumbnailStyle);
	                    }
	
	                    // Set header
	                    _this.header = _this.content.querySelector('.jw-nextup-header');
	                    _this.header.innerText = _this.nextUpText;
	
	                    // Set title
	                    _this.title = _this.content.querySelector('.jw-nextup-title');
	                    var title = nextUpItem.title;
	                    _this.title.innerText = title ? utils.createElement(title).textContent : '';
	                }, 500);
	            }
	        }, {
	            key: 'onNextUp',
	            value: function onNextUp(model, nextUp) {
	                this.reset();
	                if (!nextUp) {
	                    return;
	                }
	
	                this.enabled = !!(nextUp.title || nextUp.image);
	
	                if (this.enabled) {
	                    if (!nextUp.showNextUp) {
	                        // The related plugin will countdown the nextUp item
	                        this.nextUpSticky = false;
	                        this.toggle(false);
	                    }
	                    this.setNextUpItem(nextUp);
	                }
	            }
	        }, {
	            key: 'onDuration',
	            value: function onDuration(model, duration) {
	                if (!duration) {
	                    return;
	                }
	
	                // Use nextupoffset if set or default to 10 seconds from the end of playback
	                var offset = utils.seconds(model.get('nextupoffset') || -10);
	                if (offset < 0) {
	                    // Determine offset from the end. Duration may change.
	                    offset += duration;
	                }
	
	                this.offset = offset;
	            }
	        }, {
	            key: 'onMediaModel',
	            value: function onMediaModel(model, mediaModel) {
	                mediaModel.change('state', function (stateChangeMediaModel, state) {
	                    if (state === 'complete') {
	                        this.toggle(false);
	                    }
	                }, this);
	            }
	        }, {
	            key: 'onElapsed',
	            value: function onElapsed(model, val) {
	                var nextUpSticky = this.nextUpSticky;
	                if (!this.enabled || nextUpSticky === false) {
	                    return;
	                }
	                // Show nextup during VOD streams if:
	                // - in playlist mode but not playing an ad
	                // - autoplaying in related mode and autoplaytimer is set to 0
	                var showUntilEnd = val >= this.offset;
	                if (showUntilEnd && nextUpSticky === undefined) {
	                    // show if nextUpSticky is unset
	                    this.nextUpSticky = showUntilEnd;
	                    this.toggle(showUntilEnd, 'time');
	                } else if (!showUntilEnd && nextUpSticky) {
	                    // reset if there was a backward seek
	                    this.reset();
	                }
	            }
	        }, {
	            key: 'onStreamType',
	            value: function onStreamType(model, streamType) {
	                if (streamType !== 'VOD') {
	                    this.nextUpSticky = false;
	                    this.toggle(false);
	                }
	            }
	        }, {
	            key: 'element',
	            value: function element() {
	                return this.container;
	            }
	        }, {
	            key: 'addContent',
	            value: function addContent(elem) {
	                if (this.content) {
	                    this.removeContent();
	                }
	                this.content = elem;
	                this.container.appendChild(elem);
	            }
	        }, {
	            key: 'removeContent',
	            value: function removeContent() {
	                if (this.content) {
	                    this.container.removeChild(this.content);
	                    this.content = null;
	                }
	            }
	        }, {
	            key: 'reset',
	            value: function reset() {
	                this.nextUpSticky = undefined;
	                this.toggle(false);
	            }
	        }, {
	            key: 'destroy',
	            value: function destroy() {
	                this.off();
	                this._model.off(null, null, this);
	            }
	        }]);
	
	        return NextUpTooltip;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 100 */
/*!**************************************************!*\
  !*** ./src/js/view/controls/templates/nextup.js ***!
  \**************************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function () {
	    var header = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	    var closeAriaLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	
	    return '<div class="jw-nextup jw-reset">' + '<div class="jw-nextup-tooltip jw-reset">' + ('<div class="jw-nextup-header jw-reset">' + header + '</div>') + '<div class="jw-nextup-body jw-background-color jw-reset">' + '<div class="jw-nextup-thumbnail jw-reset"></div>' + ('<div class="jw-nextup-title jw-reset">' + title + '</div>') + '</div>' + '</div>' + ('<button class="jw-icon jw-nextup-close jw-reset" aria-label="' + closeAriaLabel + '"></button>') + '</div>';
	};

/***/ },
/* 101 */
/*!********************************************!*\
  !*** ./src/js/view/controls/rightclick.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _rightclick = __webpack_require__(/*! view/controls/templates/rightclick */ 102);
	
	var _rightclick2 = _interopRequireDefault(_rightclick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/ui */ 78), __webpack_require__(/*! version */ 21)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, UI, version) {
	
	    return function () {
	        function RightClick() {
	            _classCallCheck(this, RightClick);
	        }
	
	        _createClass(RightClick, [{
	            key: 'buildArray',
	            value: function buildArray() {
	                var semverParts = version.split('+');
	                var majorMinorPatchPre = semverParts[0];
	
	                var menu = {
	                    items: [{
	                        title: 'Powered by JW Player ' + majorMinorPatchPre,
	                        featured: true,
	                        showLogo: true,
	                        link: 'https://jwplayer.com/learn-more'
	                    }]
	                };
	
	                var isPrerelease = majorMinorPatchPre.indexOf('-') > 0;
	                var versionMeta = semverParts[1];
	                if (isPrerelease && versionMeta) {
	                    var pairs = versionMeta.split('.');
	                    menu.items.push({
	                        title: 'build: (' + pairs[0] + '.' + pairs[1] + ')',
	                        link: '#'
	                    });
	                }
	
	                var provider = this.model.get('provider');
	                if (provider && provider.name.indexOf('flash') >= 0) {
	                    var text = 'Flash Version ' + utils.flashVersion();
	                    menu.items.push({
	                        title: text,
	                        link: 'http://www.adobe.com/software/flash/about/'
	                    });
	                }
	
	                return menu;
	            }
	        }, {
	            key: 'rightClick',
	            value: function rightClick(evt) {
	                this.lazySetup();
	
	                if (this.mouseOverContext) {
	                    // right click on menu item should execute it
	                    return false;
	                }
	
	                this.hideMenu();
	                this.showMenu(evt);
	
	                return false;
	            }
	        }, {
	            key: 'getOffset',
	            value: function getOffset(evt) {
	                var target = evt.target;
	                // offsetX is from the W3C standard, layerX is how Firefox does it
	                var x = evt.offsetX || evt.layerX;
	                var y = evt.offsetY || evt.layerY;
	                while (target !== this.playerElement) {
	                    x += target.offsetLeft;
	                    y += target.offsetTop;
	
	                    target = target.parentNode;
	                }
	
	                return { x: x, y: y };
	            }
	        }, {
	            key: 'showMenu',
	            value: function showMenu(evt) {
	                var _this = this;
	
	                // Offset relative to player element
	                var off = this.getOffset(evt);
	
	                this.el.style.left = off.x + 'px';
	                this.el.style.top = off.y + 'px';
	
	                utils.addClass(this.playerElement, 'jw-flag-rightclick-open');
	                utils.addClass(this.el, 'jw-open');
	                clearTimeout(this._menuTimeout);
	                this._menuTimeout = setTimeout(function () {
	                    return _this.hideMenu();
	                }, 3000);
	                return false;
	            }
	        }, {
	            key: 'hideMenu',
	            value: function hideMenu() {
	                this.elementUI.off('out', this.hideMenu, this);
	                if (this.mouseOverContext) {
	                    // If mouse is over the menu, hide the menu when mouse moves out
	                    this.elementUI.on('out', this.hideMenu, this);
	                    return;
	                }
	                utils.removeClass(this.playerElement, 'jw-flag-rightclick-open');
	                utils.removeClass(this.el, 'jw-open');
	            }
	        }, {
	            key: 'lazySetup',
	            value: function lazySetup() {
	                var html = (0, _rightclick2.default)(this.buildArray());
	                if (this.el) {
	                    if (this.html !== html) {
	                        this.html = html;
	                        var newEl = utils.createElement(html);
	                        utils.emptyElement(this.el);
	                        for (var i = newEl.childNodes.length; i--;) {
	                            this.el.appendChild(newEl.firstChild);
	                        }
	                    }
	                    return;
	                }
	
	                this.html = html;
	                this.el = utils.createElement(this.html);
	
	                this.layer.appendChild(this.el);
	
	                this.hideMenuHandler = this.hideMenu.bind(this);
	                this.addOffListener(this.playerElement);
	                this.addOffListener(document);
	
	                // Track if the mouse is above the menu or not
	                this.elementUI = new UI(this.el, { useHover: true }).on('over', function () {
	                    this.mouseOverContext = true;
	                }, this).on('out', function () {
	                    this.mouseOverContext = false;
	                }, this);
	            }
	        }, {
	            key: 'setup',
	            value: function setup(_model, _playerElement, layer) {
	                this.playerElement = _playerElement;
	                this.model = _model;
	                this.mouseOverContext = false;
	                this.layer = layer;
	
	                // Defer the rest of setup until the first click
	                _playerElement.oncontextmenu = this.rightClick.bind(this);
	            }
	        }, {
	            key: 'addOffListener',
	            value: function addOffListener(element) {
	                element.addEventListener('mousedown', this.hideMenuHandler);
	                element.addEventListener('touchstart', this.hideMenuHandler);
	                element.addEventListener('pointerdown', this.hideMenuHandler);
	            }
	        }, {
	            key: 'removeOffListener',
	            value: function removeOffListener(element) {
	                element.removeEventListener('mousedown', this.hideMenuHandler);
	                element.removeEventListener('touchstart', this.hideMenuHandler);
	                element.removeEventListener('pointerdown', this.hideMenuHandler);
	            }
	        }, {
	            key: 'destroy',
	            value: function destroy() {
	                clearTimeout(this._menuTimeout);
	                if (this.el) {
	                    this.hideMenu();
	                    this.elementUI.off();
	                    this.removeOffListener(this.playerElement);
	                    this.removeOffListener(document);
	                    this.hideMenuHandler = null;
	                    this.el = null;
	                }
	
	                if (this.playerElement) {
	                    this.playerElement.oncontextmenu = null;
	                    this.playerElement = null;
	                }
	
	                if (this.model) {
	                    this.model = null;
	                }
	            }
	        }]);
	
	        return RightClick;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 102 */
/*!******************************************************!*\
  !*** ./src/js/view/controls/templates/rightclick.js ***!
  \******************************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (menu) {
	    var _menu$items = menu.items,
	        items = _menu$items === undefined ? [] : _menu$items;
	
	    var itemsHtml = items.map(function (item) {
	        return rightClickItem(item.link, item.title, item.featured, item.showLogo);
	    }).join('');
	
	    return '<div class="jw-rightclick jw-reset">' + '<ul class="jw-reset">' + ('' + itemsHtml) + '</ul>' + '</div>';
	};
	
	var rightClickItem = function rightClickItem() {
	    var link = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	    var featured = arguments[2];
	    var showLogo = arguments[3];
	
	    var logo = showLogo ? '<span class="jw-icon jw-rightclick-logo jw-reset"></span>' : '';
	    return '<li class="jw-reset ' + (featured ? 'jw-featured' : '') + '">' + ('<a href="' + link + '" class="jw-reset" target="_blank">') + ('' + logo) + ('' + title) + '</a>' + '</li>';
	};

/***/ },
/* 103 */
/*!*******************************!*\
  !*** ./src/css/controls.less ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !../../~/css-loader!../../~/postcss-loader!../../~/less-loader/dist?compress!./controls.less */ 104);
	if(typeof content === 'string') content = [['all-players', content, '']];
	// add the styles to the DOM
	__webpack_require__(/*! ../../~/simple-style-loader/addStyles.js */ 17).style(content,'all-players');
	if(content.locals) module.exports = content.locals;

/***/ },
/* 104 */
/*!***********************************************************************************************!*\
  !*** ./~/css-loader!./~/postcss-loader!./~/less-loader/dist?compress!./src/css/controls.less ***!
  \***********************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 105)();
	// imports
	
	
	// module
	exports.push([module.id, "@font-face{font-family:\"jw-icons\";src:url(" + __webpack_require__(/*! ../../assets/fonts/jw-icons.woff */ 106) + ") format(\"woff\"),url(" + __webpack_require__(/*! ../../assets/fonts/jw-icons.ttf */ 107) + ") format(\"truetype\")}.jw-icon{font-family:\"jw-icons\";font-style:normal;font-weight:normal;text-transform:none;background-color:transparent;font-variant:normal;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.jw-icon-audio-tracks:before{content:\"\\E600\"}.jw-icon-buffer:before{content:\"\\E601\"}.jw-icon-airplay:before{content:\"\\E901\"}.jw-icon-airplay.jw-off:before{content:\"\\E901\"}.jw-icon-cc:before{content:\"\\E605\"}.jw-icon-error:before{content:\"\\E607\"}.jw-icon-fullscreen:before{content:\"\\E608\"}.jw-icon-fullscreen.jw-off:before{content:\"\\E613\"}.jw-icon-hd:before{content:\"\\E60A\"}.jw-rightclick-logo:before{content:\"\\E60B\"}.jw-icon-next:before{content:\"\\E60C\"}.jw-icon-pause:before{content:\"\\E60D\"}.jw-icon-play:before{content:\"\\E60E\"}.jw-icon-replay:before{content:\"\\E610\"}.jw-icon-volume:before{content:\"\\E612\"}.jw-icon-volume.jw-off:before{content:\"\\E611\"}.jw-icon-close:before{content:\"\\E615\"}.jw-icon-rewind:before{content:\"\\E900\";font-size:24px}.jw-overlays{cursor:auto;pointer-events:none}.jw-controls{overflow:hidden;pointer-events:none}.jw-controls .jw-controls-right{position:absolute;top:0;right:0;left:0;bottom:2.5em}.jw-overlays,.jw-controls{position:absolute;width:100%;height:100%;top:0;left:0;bottom:0;right:0}.jw-flag-small-player .jw-controls{text-align:center}.jw-icon-playback:before{content:\"\\E60E\"}.jw-text{height:1em;font-family:Arial,Helvetica,sans-serif;font-size:.75em;font-style:normal;font-weight:normal;color:#fff;text-align:center;font-variant:normal;font-stretch:normal}.jw-dock .jw-dock-button,.jw-controlbar,.jw-skip,.jw-display-icon-container,.jw-display-icon-container .jw-icon,.jw-nextup-container,.jw-autostart-mute{pointer-events:all}.jw-overlays .jw-plugin{pointer-events:all}.jwplayer .jw-display-icon-container,.jw-error .jw-display-icon-container{width:auto;height:auto;box-sizing:content-box}.jw-display{display:table;height:100%;padding:2.5em 0;position:relative;width:100%}.jw-flag-dragging .jw-display{display:none}.jw-state-idle:not(.jw-flag-cast-available) .jw-display{padding:0}.jw-display-container{display:table-cell;height:100%;text-align:center;vertical-align:middle}.jw-display-controls{display:inline-block}.jwplayer .jw-display-icon-container{float:left}.jw-display-icon-container{display:inline-block;margin:0 .25em}.jw-display-icon-container .jw-icon{cursor:pointer;width:75px;height:75px;line-height:75px;text-align:center}.jw-display-icon-container .jw-icon.jw-icon-rewind:before{padding:.2em .05em}.jw-display-icon-container .jw-icon:before{font-size:33px;position:relative}.jw-state-idle .jw-display-icon-container .jw-icon.jw-icon-display:before,.jw-state-paused .jw-display-icon-container .jw-icon.jw-icon-display:before{left:1px}.jw-breakpoint-0 .jw-display-icon-next,.jw-breakpoint-0 .jw-display-icon-rewind{display:none}.jw-breakpoint-0 .jw-display .jw-icon{height:44px;line-height:44px;width:44px}.jw-breakpoint-0 .jw-display .jw-icon:before{font-size:22px}.jw-breakpoint-1 .jw-display .jw-icon{height:55px;line-height:55px;width:55px}.jw-breakpoint-1 .jw-display .jw-icon:before{font-size:22px}.jw-breakpoint-1 .jw-display .jw-icon.jw-icon-rewind:before{font-size:33px}.jw-breakpoint-3 .jw-display .jw-icon{height:77px;line-height:77px;width:77px}.jw-breakpoint-3 .jw-display .jw-icon:before{font-size:38.5px}.jw-breakpoint-4 .jw-display .jw-icon,.jw-breakpoint-5 .jw-display .jw-icon,.jw-breakpoint-6 .jw-display .jw-icon,.jw-breakpoint-7 .jw-display .jw-icon{height:88px;line-height:88px;width:88px}.jw-breakpoint-4 .jw-display .jw-icon:before,.jw-breakpoint-5 .jw-display .jw-icon:before,.jw-breakpoint-6 .jw-display .jw-icon:before,.jw-breakpoint-7 .jw-display .jw-icon:before{font-size:44px}.jw-controlbar{display:table;position:absolute;left:0;bottom:0;height:2.5em;width:100%;padding:0 .5em}.jw-slider-horizontal{background-color:transparent}.jw-group{display:table-cell}.jw-controlbar-center-group{padding:0 .5em;position:relative;width:100%}.jw-controlbar-center-group .jw-slider-time,.jw-controlbar-center-group .jw-text-alt{padding:0}.jw-controlbar-center-group .jw-text-alt{display:none;position:absolute;top:-1px;bottom:0;width:100%;height:auto;line-height:2.5em;margin:.5em 0;padding-right:.5em;overflow:hidden;text-align:left;text-overflow:ellipsis;vertical-align:middle;white-space:nowrap}.jw-controlbar-left-group,.jw-controlbar-right-group{white-space:nowrap}.jw-icon-inline,.jw-icon-tooltip,.jw-slider-horizontal,.jw-text-elapsed,.jw-text-duration,.jw-text-countdown{display:inline-block;height:2.5em;position:relative;line-height:2.5em;vertical-align:middle;cursor:pointer;padding:0 .5em}.jw-selection-menu{padding:0 .25em}.jw-icon-inline,.jw-icon-tooltip{min-width:1.5625em;text-align:center}.jw-knob:hover,.jw-icon-inline:hover,.jw-icon-tooltip:hover,.jw-icon-display:hover,.jw-option:before:hover{color:#fff}.jw-controlbar-left-group .jw-text-duration{display:none}.jw-icon-playback{min-width:2.25em}.jw-icon-volume{min-width:1.75em;text-align:left}.jw-time-tip{line-height:1em;pointer-events:none}.jw-icon-cast{display:none;margin:0;padding:0}.jw-icon-cast button{background-color:transparent;border:none;cursor:pointer;font-size:inherit;width:2.25em}.jw-slider-volume.jw-slider-horizontal,.jw-icon-inline.jw-icon-volume{display:none}.jwplayer .jw-text-countdown{display:none}.jw-breakpoint-0 .jw-controlbar .jw-text-duration,.jw-breakpoint-1:not(.jw-flag-time-slider-above) .jw-controlbar .jw-text-duration,.jw-breakpoint-0 .jw-controlbar .jw-text-elapsed,.jw-breakpoint-1:not(.jw-flag-time-slider-above) .jw-controlbar .jw-text-elapsed{display:none}.jw-flag-small-player:not(.jw-flag-audio-player) .jw-group>.jw-icon-rewind,.jw-flag-small-player:not(.jw-flag-audio-player) .jw-group>.jw-icon-next,.jw-flag-small-player:not(.jw-flag-audio-player) .jw-group>.jw-icon-playback{display:none}.jw-flag-ads-vpaid:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controlbar,.jw-flag-autostart:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controlbar,.jw-flag-user-inactive.jw-state-playing:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controlbar,.jw-flag-user-inactive.jw-state-buffering:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controlbar{visibility:hidden;pointer-events:none;opacity:0}.jw-dock{clear:right;margin:.75em;display:block;opacity:1}.jw-dock:after{content:\"\";clear:both;display:block}.jw-dock-button{cursor:pointer;float:right;height:2.5em;margin:.5em;position:relative;width:2.5em}.jw-dock-button .jw-arrow{visibility:hidden;opacity:0;pointer-events:none;position:absolute;bottom:-0.2em;width:.5em;height:.2em;left:50%;margin-left:-0.25em}.jw-dock-button .jw-overlay{visibility:hidden;opacity:0;pointer-events:none;position:absolute;top:2.5em;right:0;margin-top:.25em;padding:.5em;white-space:nowrap}.jw-dock-button:hover .jw-overlay,.jw-dock-button:hover .jw-arrow{visibility:visible;opacity:1}.jw-dock-image{width:100%;height:100%;background-position:50% 50%;background-repeat:no-repeat;opacity:.75}.jw-flag-small-player .jw-dock{margin:0}.jw-flag-small-player .jw-dock-button{margin:1px;height:44px;width:44px}.jw-breakpoint-1 .jw-dock{padding:0 1%}.jw-breakpoint-1 .jw-dock-button{margin:2% 1%}.jw-slider-container{height:1em;width:100%;position:relative;-ms-touch-action:none;touch-action:none}.jw-rail,.jw-buffer,.jw-progress{position:absolute;cursor:pointer}.jw-progress{background-color:#fff}.jw-rail{background-color:rgba(255,255,255,0.2)}.jw-buffer{background-color:rgba(255,255,255,0.3)}.jw-cue{position:absolute;cursor:pointer;height:.3em;background-color:rgba(33,33,33,0.9);border-radius:25%;width:.5em}.jw-knob{position:absolute;pointer-events:none;width:.6em;height:.6em;border-radius:.3em}.jw-slider-horizontal{height:.3em;padding:0}.jw-slider-horizontal.jw-slider-volume{width:4em;margin:0 .5em}.jw-slider-horizontal .jw-rail{width:100%}.jw-slider-horizontal .jw-knob{top:-0.15em;margin-left:-0.3em}.jw-slider-horizontal .jw-rail,.jw-slider-horizontal .jw-buffer,.jw-slider-horizontal .jw-progress{height:.3em}.jw-slider-vertical{padding:.66666667em 1em;position:absolute}.jw-slider-vertical .jw-rail,.jw-slider-vertical .jw-buffer,.jw-slider-vertical .jw-progress{bottom:0;height:100%;left:0;right:0;margin:0 auto}.jw-slider-vertical .jw-slider-container,.jw-slider-vertical .jw-rail,.jw-slider-vertical .jw-progress{width:.3em}.jw-slider-vertical .jw-slider-container{height:4em}.jw-slider-vertical .jw-knob{right:0;left:-0.15em;margin-bottom:-0.3em}.jw-slider-time{width:100%}.jw-tooltip-time{position:absolute}.jw-slider-volume .jw-buffer{display:none}.jwplayer .jw-rightclick{display:none;position:absolute;white-space:nowrap}.jwplayer .jw-rightclick.jw-open{display:block}.jwplayer .jw-rightclick ul{list-style:none;font-weight:bold;border-radius:.15em;margin:0;border:1px solid #444;padding:0}.jwplayer .jw-rightclick ul li{background-color:#000;border-bottom:1px solid #444;margin:0}.jwplayer .jw-rightclick ul li .jw-rightclick-logo{font-size:2em;color:#ff0147;vertical-align:middle;padding-right:.3em;margin-right:.3em;border-right:1px solid #444}.jwplayer .jw-rightclick ul li a{color:#fff;text-decoration:none;padding:1em;display:block;font-size:.6875em;line-height:1em;border:0}.jwplayer .jw-rightclick ul li:last-child{border-bottom:none}.jwplayer .jw-rightclick ul li:hover{background-color:#1a1a1a;cursor:pointer}.jwplayer .jw-rightclick ul .jw-featured{background-color:#252525;vertical-align:middle}.jwplayer .jw-rightclick ul .jw-featured a{color:#777}.jw-icon-tooltip.jw-open .jw-overlay{opacity:1;visibility:visible}.jw-overlay:before{position:absolute;top:0;bottom:0;left:-50%;width:100%;background-color:transparent;content:\" \"}.jw-slider-time .jw-overlay:before{height:1em;top:auto}.jw-time-tip,.jw-volume-tip,.jwplayer .jw-menu{position:relative;left:-50%;margin:0}.jw-volume-tip{width:100%;height:100%;display:block}.jw-time-tip{text-align:center;font-family:inherit;bottom:1.25em;padding:.5em;border-radius:.3em}.jw-time-tip .jw-text{color:#fff;line-height:1em}.jw-controlbar .jw-overlay{margin:0;position:absolute;bottom:2.5em;left:50%;opacity:0;visibility:hidden}.jw-controlbar .jw-overlay .jw-contents{position:relative}.jw-controlbar .jw-option{position:relative;white-space:nowrap;cursor:pointer;list-style:none;height:1.5em;font-family:inherit;line-height:1.5em;padding:0 .5em;font-size:.8em;margin:0}.jw-controlbar .jw-option:before{padding-right:.125em}.jw-selection-menu{display:inline-block;width:2.5em;height:2.5em}.jw-selection-menu .jw-selection-menu-icon-container{pointer-events:none;height:inherit}.jw-selection-menu .jw-menu-selection-text{vertical-align:baseline;font-size:.75em;height:100%;line-height:3.335em;text-align:center}.jw-selection-menu .jw-menu-selection-icon{height:100%}.jw-selection-menu .jw-menu-selection-icon svg{height:100%;width:100%}.jw-skip{cursor:default;position:absolute;float:right;display:inline-block;right:.75em;bottom:3em;padding:.5em}.jw-skip.jw-skippable{cursor:pointer}.jw-skip .jw-skip-icon{display:none;margin-left:-0.75em}.jw-skip .jw-skip-icon:before{content:\"\\E60C\"}.jw-skip .jw-text,.jw-skip .jw-skip-icon{color:rgba(255,255,255,0.6);vertical-align:middle;line-height:1.5em;font-size:.7em}.jw-skip.jw-skippable:hover{cursor:pointer}.jw-skip.jw-skippable:hover .jw-text,.jw-skip.jw-skippable:hover .jw-skip-icon{color:#fff}.jw-skip.jw-skippable .jw-skip-icon{display:inline;margin:0}.jw-cast{background-size:cover;display:none;height:100%;position:relative;width:100%}.jw-cast-container{background:-webkit-linear-gradient(top, rgba(25,25,25,0.75), rgba(25,25,25,0.25), rgba(25,25,25,0));background:linear-gradient(180deg, rgba(25,25,25,0.75), rgba(25,25,25,0.25), rgba(25,25,25,0));left:0;padding:20px 20px 80px;position:absolute;top:0;width:100%}.jw-cast-text{color:#fff;font-size:1.6em}.jw-breakpoint-0 .jw-cast-text{font-size:1.15em}.jw-breakpoint-1 .jw-cast-text,.jw-breakpoint-2 .jw-cast-text,.jw-breakpoint-3 .jw-cast-text{font-size:1.3em}.jw-nextup-container{background-color:transparent;bottom:2.5em;cursor:pointer;left:0;margin:0 auto;opacity:0;padding:5px .5em;position:absolute;right:0;text-align:right;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);-webkit-transition:all 150ms ease;transition:all 150ms ease;visibility:hidden;width:100%;pointer-events:none}.jw-flag-small-player .jw-nextup-container{display:none}.jw-nextup-container-visible{opacity:1;-webkit-transform:translateY(5px);-ms-transform:translateY(5px);transform:translateY(5px);visibility:visible}.jw-nextup{border-radius:0;display:inline-block;overflow:hidden;position:relative;max-width:300px;width:100%;pointer-events:all}.jw-nextup-header{background:rgba(33,33,33,0.8);box-sizing:border-box;color:#fff;font-size:12px;font-weight:bold;line-height:normal;padding:8px}.jw-nextup-body{background:rgba(0,0,0,0.8);color:#fff;overflow:hidden}.jw-nextup-thumbnail{background-position:center;background-size:cover;display:none;float:left;height:60px;width:45%}.jw-nextup-thumbnail-visible{display:block}.jw-nextup-title{box-sizing:border-box;float:left;font-size:12px;font-weight:bold;line-height:1.3;overflow:hidden;padding:5px 6px;position:relative;text-overflow:ellipsis;white-space:nowrap;width:100%}.jw-nextup-thumbnail-visible+.jw-nextup-title{height:60px;white-space:normal;width:55%}.jw-nextup-thumbnail-visible+.jw-nextup-title:after{background:-webkit-linear-gradient(top, rgba(0,0,0,0) 0, #000 100%);background:linear-gradient(-180deg, rgba(0,0,0,0) 0, #000 100%);bottom:0;content:\"\";height:30px;left:0;position:absolute;width:100%}.jw-nextup-close{border:none;color:rgba(255,255,255,0.6);font-size:13px;opacity:0;position:absolute;right:5px;top:6px;-webkit-transition:color 150ms ease,opacity 150ms ease,visibility 150ms ease;transition:color 150ms ease,opacity 150ms ease,visibility 150ms ease;visibility:hidden}.jw-nextup-close:hover{color:#fff}.jw-nextup-close:before{content:\"\\E615\"}.jw-nextup-close:active{color:#fff}.jw-nextup-close:hover{color:#fff}.jw-nextup-sticky .jw-nextup-close{opacity:1;visibility:visible}.jw-autostart-mute{min-width:1.75em;text-align:left;position:absolute;bottom:.5em;right:.5em;height:44px;width:44px;text-align:center}.jw-autostart-mute:before{content:\"\\E612\"}.jw-autostart-mute.jw-off:before{content:\"\\E611\"}.jw-autostart-mute:before{background-color:rgba(33,33,33,0.8);padding:5px 4px 5px 6px}.jwplayer.jw-flag-autostart:not(.jw-flag-media-audio):not(.jw-state-buffering):not(.jw-state-error):not(.jw-state-complete) .jw-display,.jwplayer.jw-flag-autostart:not(.jw-flag-media-audio) .jw-nextup{display:none}.jw-state-setup .jw-controls{visibility:hidden}.jw-state-idle:not(.jw-flag-cast-available) .jw-display{padding:0}.jwplayer.jw-state-buffering .jw-display-icon-display .jw-icon{-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite}.jwplayer.jw-state-buffering .jw-display-icon-display .jw-icon:before{content:\"\\E601\"}@-webkit-keyframes spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.jwplayer.jw-state-buffering .jw-icon-playback:before{content:\"\\E60D\"}.jwplayer.jw-state-playing .jw-display .jw-icon-display:before,.jwplayer.jw-state-playing .jw-icon-playback:before{content:\"\\E60D\"}.jwplayer.jw-state-paused .jw-autostart-mute{display:none}.jwplayer.jw-state-complete .jw-display .jw-icon-display:before{content:\"\\E610\"}.jwplayer.jw-state-complete .jw-display .jw-text{display:none}.jw-state-idle .jw-icon-display:before,.jwplayer.jw-state-paused .jw-icon-playback:before,.jwplayer.jw-state-paused .jw-icon-display:before,.jwplayer.jw-state-complete .jw-icon-playback:before{content:\"\\E60E\"}.jw-state-idle .jw-display-icon-rewind,.jwplayer.jw-state-buffering .jw-display-icon-rewind,.jwplayer.jw-state-complete .jw-display-icon-rewind,body .jw-error .jw-display-icon-rewind,body .jwplayer.jw-state-error .jw-display-icon-rewind,.jw-state-idle .jw-display-icon-next,.jwplayer.jw-state-buffering .jw-display-icon-next,.jwplayer.jw-state-complete .jw-display-icon-next,body .jw-error .jw-display-icon-next,body .jwplayer.jw-state-error .jw-display-icon-next{display:none}body .jw-error .jw-icon-display,body .jwplayer.jw-state-error .jw-icon-display{cursor:default}body .jw-error .jw-icon-display:before,body .jwplayer.jw-state-error .jw-icon-display:before{content:\"\\E607\"}body .jw-error .jw-icon-container{position:absolute;width:100%;height:100%;top:0;left:0;bottom:0;right:0}body .jwplayer.jw-state-error.jw-flag-audio-player .jw-preview{display:none}body .jwplayer.jw-state-error.jw-flag-audio-player .jw-title{padding-top:4px}body .jwplayer.jw-state-error.jw-flag-audio-player .jw-title-primary{width:auto;display:inline-block;padding-right:0}body .jwplayer.jw-state-error.jw-flag-audio-player .jw-title-secondary{width:auto;display:inline-block;padding-left:0}body .jwplayer.jw-state-error .jw-controlbar,.jwplayer.jw-state-idle:not(.jw-flag-audio-player):not(.jw-flag-casting):not(.jw-flag-cast-available) .jw-controlbar{display:none}.jwplayer.jw-state-playing.jw-flag-user-inactive .jw-display{visibility:hidden;pointer-events:none;opacity:0}.jwplayer.jw-state-playing:not(.jw-flag-touch):not(.jw-flag-small-player):not(.jw-flag-casting) .jw-display,.jwplayer.jw-state-paused:not(.jw-flag-touch):not(.jw-flag-small-player):not(.jw-flag-casting) .jw-display{display:none}.jwplayer.jw-state-buffering .jw-display-icon-display .jw-text,.jwplayer.jw-state-complete .jw-display .jw-text{display:none}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima) .jw-controlbar{display:table}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jw-flag-small-player .jw-display{padding-top:44px;padding-bottom:66px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jw-state-idle:not(.jw-flag-cast-available) .jw-display,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jw-state-error .jw-display{padding:0}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-controlbar{background:-webkit-linear-gradient(top, rgba(0,0,0,0) 0, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.5) 100%);background:linear-gradient(180deg, rgba(0,0,0,0) 0, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.5) 100%);border:none;border-radius:0;background-size:auto;height:44px;width:100%;padding:0 10px;box-shadow:none}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-controlbar .jw-overlay{bottom:44px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-controlbar .jw-overlay:after{content:\"\";display:block;height:22px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-state-idle:not(.jw-flag-cast-available) .jw-controls,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-state-playing.jw-flag-user-inactive:not(.jw-flag-casting) .jw-controls{background:none}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-flag-ads) .jw-controlbar,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-flag-live) .jw-controlbar{height:66px;padding:22px 0 0}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-group>.jw-icon,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-group>.jw-text{height:44px;line-height:40px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-group>.jw-icon{font-size:20px;padding:0 8px;max-width:44px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-group>.jw-icon:before{background-color:transparent;background:none;background-size:auto;border:none;border-radius:0;box-shadow:none;height:auto;padding:0}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-group .jw-icon-cast button{font-size:inherit;height:36px;margin-bottom:.5em;width:44px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-flag-ads):not(.jw-flag-live) .jw-controlbar-center-group{height:22px;left:0;padding:0 15px;position:absolute;right:0;top:0;width:100%}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-flag-ads):not(.jw-flag-live) .jw-controlbar-center-group .jw-slider-horizontal .jw-knob{border-radius:100%;height:16px;margin-left:-8px;margin-top:-8px;width:16px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-flag-ads):not(.jw-flag-live) .jw-controlbar-left-group{padding-left:0}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-flag-ads):not(.jw-flag-live) .jw-controlbar-left-group .jw-text-elapsed,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-flag-ads):not(.jw-flag-live) .jw-controlbar-left-group .jw-text-countdown{padding:0 .5em}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-flag-ads):not(.jw-flag-live) .jw-controlbar-left-group .jw-text-duration{padding:0 .5em 0 0}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-flag-ads):not(.jw-flag-live).jw-breakpoint-0 .jw-text-countdown{display:inline-block}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-flag-ads):not(.jw-flag-live).jw-flag-small-player .jw-text-elapsed,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-flag-ads):not(.jw-flag-live).jw-flag-small-player .jw-text-countdown{padding-left:15px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-breakpoint-0) .jw-text-duration{display:inline-block}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer:not(.jw-breakpoint-0) .jw-text-duration:before{content:\"/\";display:inline-block;padding-right:.5em}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-controlbar-right-group{padding-right:6px;text-align:right}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-controlbar-right-group .jw-text-duration{display:none}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-volume.jw-slider-vertical{padding:.5em}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-volume.jw-slider-horizontal{margin-bottom:2px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-small-player .jw-controlbar .jw-slider-volume.jw-slider-horizontal{display:none}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time{background:none;background-color:transparent;height:22px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-slider-container{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;height:22px;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-cue{top:auto}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-rail,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-progress,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-buffer,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-knob{border:none;box-shadow:none}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-rail,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-buffer,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-progress{height:2px;margin:auto;top:0;bottom:0}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-rail{background-color:rgba(255,255,255,0.25)}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-buffer{background-color:rgba(255,255,255,0.5)}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-slider-time .jw-knob{background:none;background-color:#fff;border-radius:100%;box-shadow:0 0 1px 1px rgba(0,0,0,0.1);opacity:1;height:16px;margin-left:-8px;margin-top:-8px;top:50%;width:16px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-tooltip-time{bottom:0;height:auto;line-height:normal;padding:0;pointer-events:none;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%)}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-tooltip-time .jw-overlay{bottom:22px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-tooltip-time .jw-overlay:after{content:none}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-tooltip-time .jw-time-tip{bottom:0;border-radius:.3em}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads .jw-controlbar,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-live .jw-controlbar{padding-right:5px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads .jw-controlbar-center-group,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-live .jw-controlbar-center-group{height:auto}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads .jw-group>.jw-text-alt,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-live .jw-group>.jw-text-alt{display:inline-block;margin:0;line-height:44px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads.jw-ie .jw-text-alt,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-live.jw-ie .jw-text-alt{top:-1px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads .jw-text-duration,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-live .jw-text-duration{display:none}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads .jw-controlbar .jw-overlay:after,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-live .jw-controlbar .jw-overlay:after{display:none}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads .jw-nextup-container,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-live .jw-nextup-container{bottom:44px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-live .jw-controlbar{padding-left:10px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-live .jw-text-elapsed,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-live .jw-text-duration{display:none}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads .jw-controlbar{pointer-events:none}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads .jw-icon,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads .jw-slider-horizontal{pointer-events:all}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads .jw-controlbar-left-group{display:table-cell}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer.jw-flag-ads.jw-flag-small-player .jw-group .jw-icon-playback{display:inline-block}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-plugin{bottom:66px}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-captions,.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer video::-webkit-media-text-track-container{max-height:calc(100% - 64px)}.jw-flag-time-slider-above:not(.jw-flag-ads-googleima).jwplayer .jw-nextup-container{bottom:66px;padding:5px 20px}.jwplayer.jw-flag-casting .jw-cast{display:block}.jwplayer.jw-flag-casting.jw-flag-airplay-casting .jw-display-icon-container{display:none}.jwplayer.jw-flag-casting .jw-icon-hd,.jwplayer.jw-flag-casting .jw-captions,.jwplayer.jw-flag-casting .jw-icon-fullscreen,.jwplayer.jw-flag-casting .jw-icon-audio-tracks{display:none}.jwplayer.jw-flag-casting.jw-flag-airplay-casting .jw-icon-volume{display:none}.jwplayer.jw-flag-casting.jw-flag-airplay-casting .jw-icon-airplay{color:#fff}.jwplayer.jw-flag-casting .jw-sharing-dock-btn{display:none}.jwplayer.jw-state-playing.jw-flag-casting .jw-display,.jwplayer.jw-state-paused.jw-flag-casting .jw-display{display:table}.jwplayer.jw-flag-cast-available .jw-icon-cast{display:inline-block}.jwplayer.jw-flag-cast-available .jw-icon-airplay{display:inline-block}.jwplayer.jw-flag-live .jw-display-icon-rewind{display:none}.jwplayer.jw-flag-live .jw-controlbar .jw-text-elapsed,.jwplayer.jw-flag-live .jw-controlbar .jw-text-duration,.jwplayer.jw-flag-live .jw-controlbar .jw-text-countdown,.jwplayer.jw-flag-live .jw-controlbar .jw-slider-time{display:none}.jwplayer.jw-flag-live .jw-controlbar .jw-text-alt{display:inline-block}.jwplayer.jw-flag-live.jw-ie .jw-controlbar-center-group{overflow:hidden}.jwplayer.jw-flag-live.jw-ie .jw-controlbar-center-group .jw-text-alt{display:table}.jwplayer.jw-flag-controls-hidden .jw-dock,.jwplayer.jw-flag-controls-hidden .jw-logo.jw-hide{visibility:hidden;pointer-events:none;opacity:0}.jwplayer.jw-flag-controls-hidden:not(.jw-flag-casting) .jw-logo-top-right{top:0}.jwplayer.jw-flag-controls-hidden .jw-plugin,.jwplayer.jw-flag-controls-hidden .jw-nextup-container{bottom:.5em}.jw-flag-controls-hidden .jw-controlbar,.jw-flag-controls-hidden .jw-display{visibility:hidden;pointer-events:none;opacity:0}.jw-flag-controls-hidden .jw-logo{visibility:visible}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing .jw-dock,.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing .jw-logo.jw-hide{visibility:hidden;pointer-events:none;opacity:0}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing:not(.jw-flag-casting) .jw-logo-top-right{top:0}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing .jw-plugin,.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing .jw-nextup-container{bottom:.5em}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing .jw-captions{max-height:none}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing video::-webkit-media-text-track-container{max-height:none}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing .jw-media{cursor:none;-webkit-cursor-visibility:auto-hide}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing.jw-flag-casting .jw-display{display:table}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing.jw-flag-casting .jw-dock{display:block}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-flag-casting .jw-nextup-container{bottom:2.5em}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-flag-casting.jw-flag-time-slider-above .jw-nextup-container{bottom:66px}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-flag-casting.jw-state-idle .jw-nextup-container{display:none}.jwplayer.jw-flag-media-audio .jw-autostart-mute{display:none}.jw-flag-media-audio .jw-preview{display:block}.jwplayer.jw-flag-ads .jw-preview,.jwplayer.jw-flag-ads .jw-dock,.jwplayer.jw-flag-ads .jw-logo,.jwplayer.jw-flag-ads .jw-captions.jw-captions-enabled,.jwplayer.jw-flag-ads .jw-nextup-container,.jwplayer.jw-flag-ads .jw-autostart-mute{display:none}.jwplayer.jw-flag-ads video::-webkit-media-text-track-container{display:none}.jwplayer.jw-flag-ads.jw-flag-small-player .jw-display-icon-rewind,.jwplayer.jw-flag-ads.jw-flag-small-player .jw-display-icon-next,.jwplayer.jw-flag-ads.jw-flag-small-player .jw-display-icon-display{display:none}.jwplayer.jw-flag-ads.jw-flag-small-player.jw-state-buffering .jw-display-icon-display{display:inline-block}.jwplayer.jw-flag-ads.jw-flag-small-player .jw-controlbar-center-group{padding:0}.jwplayer.jw-flag-ads .jw-controlbar .jw-icon-inline,.jwplayer.jw-flag-ads .jw-controlbar .jw-icon-tooltip,.jwplayer.jw-flag-ads .jw-controlbar .jw-icon-cast,.jwplayer.jw-flag-ads .jw-controlbar .jw-text,.jwplayer.jw-flag-ads .jw-controlbar .jw-slider-horizontal{display:none}.jwplayer.jw-flag-ads .jw-controlbar .jw-icon-playback,.jwplayer.jw-flag-ads .jw-controlbar .jw-icon-volume,.jwplayer.jw-flag-ads .jw-controlbar .jw-slider-volume,.jwplayer.jw-flag-ads .jw-controlbar .jw-icon-fullscreen{display:inline-block}.jwplayer.jw-flag-ads .jw-controlbar .jw-text-alt{display:inline-block}.jwplayer.jw-flag-ads .jw-controlbar .jw-slider-volume.jw-slider-horizontal,.jwplayer.jw-flag-ads .jw-controlbar .jw-icon-inline.jw-icon-volume{display:inline-block}.jwplayer.jw-flag-ads .jw-controlbar .jw-icon-tooltip.jw-icon-volume{display:none}.jwplayer.jw-flag-ads.jw-ie .jw-controlbar-center-group{overflow:hidden}.jwplayer.jw-flag-ads.jw-ie .jw-controlbar-center-group .jw-text-alt{display:table}.jwplayer.jw-flag-ads.jw-flag-ads.jw-flag-touch:not(.jw-flag-ads-vpaid) .jw-controls .jw-controlbar,.jwplayer.jw-flag-ads.jw-flag-ads.jw-flag-touch:not(.jw-flag-ads-vpaid).jw-flag-autostart .jw-controls .jw-controlbar{display:table;pointer-events:all;visibility:visible;opacity:1}.jwplayer.jw-flag-ads-googleima.jw-flag-touch .jw-controlbar{font-size:1em}.jwplayer.jw-flag-ads-googleima.jw-flag-touch .jw-display-icon-display,.jwplayer.jw-flag-ads-googleima.jw-flag-touch .jw-display-icon-display .jw-icon-display{pointer-events:none}.jwplayer.jw-flag-ads-googleima.jw-skin-seven .jw-controlbar{font-size:.9em}.jwplayer.jw-flag-ads-vpaid .jw-display-container,.jwplayer.jw-flag-touch.jw-flag-ads-vpaid .jw-display-container,.jwplayer.jw-flag-ads-vpaid .jw-skip,.jwplayer.jw-flag-touch.jw-flag-ads-vpaid .jw-skip{display:none}.jwplayer.jw-flag-ads-vpaid.jw-flag-small-player .jw-controls{background:none}.jwplayer.jw-flag-ads-hide-controls .jw-controls{display:none !important}.jw-flag-overlay-open-sharing.jw-flag-small-player .jw-controls,.jw-flag-overlay-open-related .jw-controls,.jw-flag-overlay-open-sharing.jw-flag-small-player .jw-title,.jw-flag-overlay-open-related .jw-title{display:none}.jw-flag-overlay-open-sharing:not(.jw-flag-small-player) .jw-logo-top-right{display:none}.jwplayer.jw-flag-rightclick-open{overflow:visible}.jwplayer.jw-flag-rightclick-open .jw-rightclick{z-index:16777215}body .jwplayer.jw-flag-flash-blocked .jw-controls,body .jwplayer.jw-flag-flash-blocked .jw-overlays,body .jwplayer.jw-flag-flash-blocked .jw-preview{display:none}.jw-flag-touch.jw-breakpoint-7 .jw-controlbar,.jw-flag-touch.jw-breakpoint-6 .jw-controlbar,.jw-flag-touch.jw-breakpoint-5 .jw-controlbar,.jw-flag-touch.jw-breakpoint-4 .jw-controlbar,.jw-flag-touch.jw-breakpoint-7 .jw-skip,.jw-flag-touch.jw-breakpoint-6 .jw-skip,.jw-flag-touch.jw-breakpoint-5 .jw-skip,.jw-flag-touch.jw-breakpoint-4 .jw-skip,.jw-flag-touch.jw-breakpoint-7 .jw-plugin,.jw-flag-touch.jw-breakpoint-6 .jw-plugin,.jw-flag-touch.jw-breakpoint-5 .jw-plugin,.jw-flag-touch.jw-breakpoint-4 .jw-plugin{font-size:1.5em}.jw-flag-touch.jw-breakpoint-7 .jw-captions,.jw-flag-touch.jw-breakpoint-6 .jw-captions,.jw-flag-touch.jw-breakpoint-5 .jw-captions,.jw-flag-touch.jw-breakpoint-4 .jw-captions,.jw-flag-touch.jw-breakpoint-7 .jw-nextup-container,.jw-flag-touch.jw-breakpoint-6 .jw-nextup-container,.jw-flag-touch.jw-breakpoint-5 .jw-nextup-container,.jw-flag-touch.jw-breakpoint-4 .jw-nextup-container{bottom:4.25em}.jw-flag-touch.jw-breakpoint-7 video::-webkit-media-text-track-container,.jw-flag-touch.jw-breakpoint-6 video::-webkit-media-text-track-container,.jw-flag-touch.jw-breakpoint-5 video::-webkit-media-text-track-container,.jw-flag-touch.jw-breakpoint-4 video::-webkit-media-text-track-container{max-height:calc(100% - 60px)}.jw-flag-touch .jw-controlbar .jw-icon-volume{display:inline-block}.jw-flag-touch .jw-display,.jw-flag-touch .jw-display-container,.jw-flag-touch .jw-display-controls{pointer-events:none}.jw-flag-touch.jw-state-paused:not(.jw-breakpoint-1) .jw-display-icon-next,.jw-flag-touch.jw-state-playing:not(.jw-breakpoint-1) .jw-display-icon-next,.jw-flag-touch.jw-state-paused:not(.jw-breakpoint-1) .jw-display-icon-rewind,.jw-flag-touch.jw-state-playing:not(.jw-breakpoint-1) .jw-display-icon-rewind{display:none}.jw-flag-touch.jw-state-paused.jw-flag-dragging .jw-display{display:none}.jw-flag-audio-player{background-color:transparent}.jw-flag-audio-player:not(.jw-flag-flash-blocked) .jw-media{visibility:hidden}.jw-flag-audio-player .jw-title{background:none}.jw-flag-audio-player object{min-height:45px}.jw-flag-audio-player .jw-preview,.jw-flag-audio-player .jw-display,.jw-flag-audio-player .jw-title,.jw-flag-audio-player .jw-nextup-container,.jw-flag-audio-player .jw-dock{display:none}.jw-flag-audio-player .jw-controlbar{vertical-align:middle;display:table;height:100%;left:0;bottom:0;margin:0;width:100%;min-width:100%}.jw-flag-audio-player .jw-controlbar .jw-icon-fullscreen,.jw-flag-audio-player .jw-controlbar .jw-icon-tooltip{display:none}.jw-flag-audio-player .jw-controlbar .jw-slider-volume.jw-slider-horizontal,.jw-flag-audio-player .jw-controlbar .jw-icon-inline.jw-icon-volume{display:inline-block}.jw-flag-audio-player .jw-controlbar .jw-icon-tooltip.jw-icon-volume{display:none}.jw-flag-audio-player .jw-icon-inline{height:auto;line-height:normal}.jw-flag-audio-player .jw-group{vertical-align:middle}.jw-flag-audio-player .jw-controlbar-center-group{padding-bottom:2px}.jw-flag-audio-player.jw-flag-small-player .jw-text-elapsed,.jw-flag-audio-player.jw-flag-small-player .jw-text-duration{display:none}.jw-hidden{display:none}.jw-controls-right,.jw-plugin-sharing,.jw-display,.jw-overlay,.jw-dock{-webkit-transition:opacity .3s ease,visibility .3s ease;transition:opacity .3s ease,visibility .3s ease}.jw-background-color{-webkit-transition:background-color .3s ease,opacity .3s ease,visibility .3s ease;transition:background-color .3s ease,opacity .3s ease,visibility .3s ease}.jw-button-color{-webkit-transition:color .3s ease,fill .3s ease;transition:color .3s ease,fill .3s ease}.jw-knob{-webkit-transition:opacity .15s ease;transition:opacity .15s ease}.jw-skin-seven .jw-display-icon-container{border-radius:3.5em}.jw-skin-seven .jw-display-icon-container>.jw-icon{color:rgba(255,255,255,0.9)}.jw-skin-seven.jw-breakpoint-2 .jw-display .jw-icon{width:66px;height:66px;line-height:66px}.jw-skin-seven .jw-dock-button{border-radius:2.5em}.jw-skin-seven .jw-dock-button:hover{background:rgba(33,33,33,0.8)}.jw-skin-seven .jw-menu{padding:0}.jw-skin-seven .jw-dock .jw-overlay{border-radius:.5em}.jw-skin-seven .jw-skip{border-radius:.5em}.jw-skin-seven .jw-text{text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.jw-skin-seven .jw-slider-container .jw-knob{opacity:0}.jw-skin-seven .jw-slider-container:hover .jw-knob{opacity:1}.jw-skin-seven.jw-flag-touch .jw-knob{opacity:1}", ""]);
	
	// exports


/***/ },
/* 105 */,
/* 106 */
/*!************************************!*\
  !*** ./assets/fonts/jw-icons.woff ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "jw-icons.woff";

/***/ },
/* 107 */
/*!***********************************!*\
  !*** ./assets/fonts/jw-icons.ttf ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "jw-icons.ttf";

/***/ }
]));
//# sourceMappingURL=jwplayer.controls.a8bf8f3cb1a82cfe5f6e.map