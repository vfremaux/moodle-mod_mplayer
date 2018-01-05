(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jwplayer"] = factory();
	else
		root["jwplayer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonpjwplayer"];
/******/ 	window["webpackJsonpjwplayer"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		0:0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);
/******/
/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;
/******/
/******/ 			script.src = __webpack_require__.p + "" + ({"1":"provider.html5","2":"vttparser","3":"provider.flash","4":"provider.youtube","5":"jwplayer.controls","6":"polyfills.promise","7":"polyfills.base64","8":"polyfills.intersection-observer","9":"polyfills.vttrenderer"}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** multi jwplayer ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./src/js/jwplayer.js */1);


/***/ },
/* 1 */
/*!****************************!*\
  !*** ./src/js/jwplayer.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! api/global-api */ 2), __webpack_require__(/*! utils/helpers */ 8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (GlobalApi, utils) {
	    /* global __webpack_public_path__:true*/
	    /* eslint camelcase: 0 */
	    __webpack_require__.p = utils.loadFrom();
	
	    return GlobalApi.selectPlayer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 2 */
/*!**********************************!*\
  !*** ./src/js/api/global-api.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! api/api */ 3), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! providers/providers */ 34), __webpack_require__(/*! providers/providers-supported */ 36), __webpack_require__(/*! plugins/plugins */ 61)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Api, _, Providers, ProvidersSupported, plugins) {
	    var _instances = [];
	    var _uniqueIndex = 0;
	
	    var selectPlayer = function selectPlayer(query) {
	        var player;
	        var domElement;
	
	        // prioritize getting a player over querying an element
	        if (!query) {
	            player = _instances[0];
	        } else if (typeof query === 'string') {
	            player = _playerById(query);
	            if (!player) {
	                domElement = document.getElementById(query);
	            }
	        } else if (typeof query === 'number') {
	            player = _instances[query];
	        } else if (query.nodeType) {
	            domElement = query;
	            player = _playerById(domElement.id);
	        }
	        // found player
	        if (player) {
	            return player;
	        }
	        // create player
	        if (domElement) {
	            return _addPlayer(new Api(domElement, _removePlayer));
	        }
	        // invalid query
	        return {
	            registerPlugin: plugins.registerPlugin
	        };
	    };
	
	    var _playerById = function _playerById(id) {
	        for (var p = 0; p < _instances.length; p++) {
	            if (_instances[p].id === id) {
	                return _instances[p];
	            }
	        }
	
	        return null;
	    };
	
	    var _addPlayer = function _addPlayer(api) {
	        _uniqueIndex++;
	        api.uniqueId = _uniqueIndex;
	        _instances.push(api);
	        return api;
	    };
	
	    var _removePlayer = function _removePlayer(api) {
	        for (var i = _instances.length; i--;) {
	            if (_instances[i].uniqueId === api.uniqueId) {
	                _instances.splice(i, 1);
	                break;
	            }
	        }
	    };
	
	    var api = {
	        selectPlayer: selectPlayer,
	        registerProvider: Providers.registerProvider,
	        availableProviders: ProvidersSupported,
	        registerPlugin: plugins.registerPlugin
	    };
	
	    selectPlayer.api = api;
	
	    return api;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 3 */
/*!***************************!*\
  !*** ./src/js/api/api.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! events/events */ 32), __webpack_require__(/*! events/states */ 31), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/timer */ 22), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! controller/controller */ 4), __webpack_require__(/*! api/api-actions */ 136), __webpack_require__(/*! api/api-mutators */ 137), __webpack_require__(/*! api/callbacks-deprecate */ 138), __webpack_require__(/*! version */ 21)], __WEBPACK_AMD_DEFINE_RESULT__ = function (events, states, Events, utils, Timer, _, Controller, actionsInit, mutatorsInit, legacyInit, version) {
	
	    var Api = function Api(container, globalRemovePlayer) {
	        var _this = this;
	        var _controller;
	
	        // Set up event handling
	        _.extend(this, Events);
	
	        // Provide module access to plugins from the player instance
	        this.utils = utils;
	        this._ = _;
	        this.Events = Events;
	        this.version = version;
	
	        this.trigger = function (type, args) {
	            if (_.isObject(args)) {
	                args = _.extend({}, args);
	            } else {
	                args = {};
	            }
	            args.type = type;
	            var jwplayer = window.jwplayer;
	            if (jwplayer && jwplayer.debug) {
	                return Events.trigger.call(_this, type, args);
	            }
	            return Events.triggerSafe.call(_this, type, args);
	        };
	
	        // Required by vast
	        // <deprecate>
	        this.dispatchEvent = this.trigger;
	        this.removeEventListener = this.off.bind(this);
	        // </deprecate>
	
	        var _setupController = function _setupController() {
	            _controller = new Controller(container);
	
	            // Add a bunch of methods
	            actionsInit(_this, _controller);
	            mutatorsInit(_this, _controller);
	            _controller.on(events.JWPLAYER_MEDIA_META, function (data) {
	                var itemMeta = _controller._model.get('itemMeta');
	                _.extend(itemMeta, data.metadata);
	            });
	
	            // capture the ready event and add setup time to it
	            _controller.on(events.JWPLAYER_READY, function (event) {
	                _qoe.tick('ready');
	                event.setupTime = _qoe.between('setup', 'ready');
	            });
	            _controller.on('all', _this.trigger);
	        };
	        _setupController();
	        legacyInit(this);
	
	        // These should be read-only model properties
	        this.id = container.id;
	
	        // Intialize QOE timer
	        var _qoe = this._qoe = new Timer();
	        _qoe.tick('init');
	
	        var _reset = function _reset() {
	            _this.off();
	
	            if (_controller) {
	                _controller.off();
	            }
	
	            // so players can be removed before loading completes
	            if (_controller && _controller.playerDestroy) {
	                _controller.playerDestroy();
	            }
	        };
	
	        this.getPlugin = function (name) {
	            return _this.plugins && _this.plugins[name];
	        };
	
	        this.addPlugin = function (name, pluginInstance) {
	            this.plugins = this.plugins || {};
	            this.plugins[name] = pluginInstance;
	
	            this.onReady(pluginInstance.addToPlayer);
	
	            // A swf plugin may rely on resize events
	            if (pluginInstance.resize) {
	                this.onResize(pluginInstance.resizeHandler);
	            }
	        };
	
	        this.setup = function (options) {
	            _qoe.tick('setup');
	
	            _reset();
	            _setupController();
	
	            // bind event listeners passed in to the config
	            utils.foreach(options.events, function (evt, val) {
	                var fn = _this[evt];
	                if (typeof fn === 'function') {
	                    fn.call(_this, val);
	                }
	            });
	
	            options.id = _this.id;
	            _controller.setup(options, this);
	
	            return _this;
	        };
	
	        this.qoe = function () {
	            var qoeItem = _controller.getItemQoe();
	
	            var setupTime = _qoe.between('setup', 'ready');
	            var firstFrame = qoeItem.getFirstFrame();
	
	            return {
	                setupTime: setupTime,
	                firstFrame: firstFrame,
	                player: _qoe.dump(),
	                item: qoeItem.dump()
	            };
	        };
	
	        // Request this from the view/controller
	        this.getContainer = function () {
	            if (_controller.getContainer) {
	                // If the controller has fully set up...
	                return _controller.getContainer();
	            }
	            // If the controller hasn't set up yet, and we need this (due a setup to error), send the container
	            return container;
	        };
	
	        this.getMeta = this.getItemMeta = function () {
	            return _controller._model.get('itemMeta') || {};
	        };
	
	        this.getPlaylistItem = function (index) {
	            if (!utils.exists(index)) {
	                return _controller._model.get('playlistItem');
	            }
	            var playlist = _this.getPlaylist();
	            if (playlist) {
	                return playlist[index];
	            }
	            return null;
	        };
	
	        this.getRenderingMode = function () {
	            return 'html5';
	        };
	
	        this.getMute = function () {
	            return _controller._model.getMute();
	        };
	
	        this.load = function (toLoad, feedData) {
	            _controller.load(toLoad, feedData);
	            return _this;
	        };
	
	        this.play = function (state, meta) {
	            if (_.isObject(state) && state.reason) {
	                meta = state;
	            }
	            if (!meta) {
	                meta = { reason: 'external' };
	            }
	            if (state === true) {
	                _controller.play(meta);
	                return _this;
	            } else if (state === false) {
	                _controller.pause(meta);
	                return _this;
	            }
	
	            state = _this.getState();
	            switch (state) {
	                case states.PLAYING:
	                case states.BUFFERING:
	                    _controller.pause(meta);
	                    break;
	                default:
	                    _controller.play(meta);
	            }
	
	            return _this;
	        };
	
	        this.pause = function (state, meta) {
	            if (_.isBoolean(state)) {
	                return this.play(!state, meta);
	            }
	
	            return this.play(meta);
	        };
	
	        this.seek = function (pos) {
	            var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { reason: 'external' };
	
	            _controller.seek(pos, meta);
	            return _this;
	        };
	
	        this.playlistNext = function () {
	            var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { reason: 'external' };
	
	            _controller.playlistNext(meta);
	            return _this;
	        };
	
	        this.playlistPrev = function () {
	            var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { reason: 'external' };
	
	            _controller.playlistPrev(meta);
	            return _this;
	        };
	
	        this.playlistItem = function (index) {
	            var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { reason: 'external' };
	
	            _controller.playlistItem(index, meta);
	            return _this;
	        };
	
	        this.createInstream = function () {
	            return _controller.createInstream();
	        };
	
	        this.castToggle = function () {
	            if (_controller && _controller.castToggle) {
	                _controller.castToggle();
	            }
	        };
	
	        // These may be overridden by ad plugins
	        this.playAd = this.pauseAd = utils.noop;
	
	        this.remove = function () {
	            // Remove from array of players
	            globalRemovePlayer(_this);
	
	            // terminate state
	            _this.trigger('remove');
	
	            // Unbind listeners and destroy controller/model/...
	            _reset();
	
	            return _this;
	        };
	
	        return this;
	    };
	
	    return Api;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 4 */
/*!*****************************************!*\
  !*** ./src/js/controller/controller.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _setConfig = __webpack_require__(/*! api/set-config */ 5);
	
	var _setConfig2 = _interopRequireDefault(_setConfig);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! api/config */ 7), __webpack_require__(/*! controller/instream-adapter */ 27), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! controller/Setup */ 59), __webpack_require__(/*! controller/captions */ 111), __webpack_require__(/*! controller/model */ 33), __webpack_require__(/*! controller/storage */ 112), __webpack_require__(/*! playlist/playlist */ 113), __webpack_require__(/*! playlist/loader */ 66), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! view/view */ 114), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! events/change-state-event */ 30), __webpack_require__(/*! events/states */ 31), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! view/error */ 133), __webpack_require__(/*! controller/events-middleware */ 135)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Config, InstreamAdapter, _, Setup, Captions, Model, Storage, Playlist, PlaylistLoader, utils, View, Events, changeStateEvent, states, events, error, eventsMiddleware) {
	
	    function _queueCommand(command) {
	        return function () {
	            var args = Array.prototype.slice.call(arguments, 0);
	
	            if (!this._model.getVideo()) {
	                this.eventsQueue.push([command, args]);
	            } else {
	                this['_' + command].apply(this, args);
	            }
	        };
	    }
	
	    // The model stores a different state than the provider
	    function normalizeState(newstate) {
	        if (newstate === states.LOADING || newstate === states.STALLED) {
	            return states.BUFFERING;
	        }
	        return newstate;
	    }
	
	    var Controller = function Controller(originalContainer) {
	        this.originalContainer = this.currentContainer = originalContainer;
	        this.eventsQueue = [];
	        _.extend(this, Events);
	
	        this._model = new Model();
	    };
	
	    Controller.prototype = {
	        /** Controller API / public methods **/
	        play: _queueCommand('play'),
	        pause: _queueCommand('pause'),
	        seek: _queueCommand('seek'),
	        stop: _queueCommand('stop'),
	        load: _queueCommand('load'),
	        playlistNext: _queueCommand('next'),
	        playlistPrev: _queueCommand('prev'),
	        playlistItem: _queueCommand('item'),
	        setCurrentCaptions: _queueCommand('setCurrentCaptions'),
	        setCurrentQuality: _queueCommand('setCurrentQuality'),
	        setFullscreen: _queueCommand('setFullscreen'),
	        setup: function setup(options, _api) {
	            var _model = this._model;
	            var _view;
	            var _captions;
	            var _setup;
	            var _preplay = false;
	            var _actionOnAttach;
	            var _stopPlaylist = false;
	            var _interruptPlay;
	            var _this = this;
	            var checkAutoStartLastContext = {};
	
	            var _video = function _video() {
	                return _model.getVideo();
	            };
	
	            var storage = new Storage();
	            storage.track(_model);
	            var config = new Config(options, storage);
	
	            var _eventQueuedUntilReady = [];
	
	            _model.setup(config, storage);
	            _view = this._view = new View(_api, _model);
	
	            _setup = new Setup(_api, _model, _view, _setPlaylist);
	
	            _setup.on(events.JWPLAYER_READY, _playerReady, this);
	            _setup.on(events.JWPLAYER_SETUP_ERROR, this.setupError, this);
	
	            _model.mediaController.on('all', _triggerAfterReady, this);
	            _model.mediaController.on(events.JWPLAYER_MEDIA_COMPLETE, function () {
	                // Insert a small delay here so that other complete handlers can execute
	                _.defer(_completeHandler);
	            });
	            _model.mediaController.on(events.JWPLAYER_MEDIA_ERROR, this.triggerError, this);
	
	            // If we attempt to load flash, assume it is blocked if we don't hear back within a second
	            _model.on('change:flashBlocked', function (model, isBlocked) {
	                if (!isBlocked) {
	                    this._model.set('errorEvent', undefined);
	                    return;
	                }
	                // flashThrottle indicates whether this is a throttled event or plugin blocked event
	                var throttled = !!model.get('flashThrottle');
	                var errorEvent = {
	                    message: throttled ? 'Click to run Flash' : 'Flash plugin failed to load'
	                };
	                // Only dispatch an error for Flash blocked, not throttled events
	                if (!throttled) {
	                    this.trigger(events.JWPLAYER_ERROR, errorEvent);
	                }
	                this._model.set('errorEvent', errorEvent);
	            }, this);
	
	            _model.on('change:state', changeStateEvent, this);
	
	            _model.on('change:duration', function (model, duration) {
	                var minDvrWindow = model.get('minDvrWindow');
	                var streamType = utils.streamType(duration, minDvrWindow);
	                model.setStreamType(streamType);
	            });
	
	            _model.on('change:castState', function (model, evt) {
	                _this.trigger(events.JWPLAYER_CAST_SESSION, evt);
	            });
	            _model.on('change:fullscreen', function (model, bool) {
	                _this.trigger(events.JWPLAYER_FULLSCREEN, {
	                    fullscreen: bool
	                });
	                if (bool) {
	                    // Stop autoplay behavior when the player enters fullscreen
	                    model.set('playOnViewable', false);
	                }
	            });
	            _model.on('itemReady', function () {
	                _this.triggerAfterReady(events.JWPLAYER_PLAYLIST_ITEM, {
	                    index: _model.get('item'),
	                    item: _model.get('playlistItem')
	                });
	            });
	            _model.on('change:playlist', function (model, playlist) {
	                if (playlist.length) {
	                    var eventData = {
	                        playlist: playlist
	                    };
	                    var feedData = _model.get('feedData');
	                    if (feedData) {
	                        var eventFeedData = _.extend({}, feedData);
	                        delete eventFeedData.playlist;
	                        eventData.feedData = eventFeedData;
	                    }
	                    _this.triggerAfterReady(events.JWPLAYER_PLAYLIST_LOADED, eventData);
	                }
	            });
	            _model.on('change:volume', function (model, vol) {
	                _this.trigger(events.JWPLAYER_MEDIA_VOLUME, {
	                    volume: vol
	                });
	            });
	            _model.on('change:mute', function (model, mute) {
	                _this.trigger(events.JWPLAYER_MEDIA_MUTE, {
	                    mute: mute
	                });
	            });
	
	            _model.on('change:playbackRate', function (model, rate) {
	                _this.trigger(events.JWPLAYER_PLAYBACK_RATE_CHANGED, {
	                    playbackRate: rate,
	                    position: model.get('position')
	                });
	            });
	
	            _model.on('change:scrubbing', function (model, state) {
	                if (state) {
	                    _pause();
	                } else {
	                    _play({ reason: 'interaction' });
	                }
	            });
	
	            // For onCaptionsList and onCaptionsChange
	            _model.on('change:captionsList', function (model, captionsList) {
	                _this.triggerAfterReady(events.JWPLAYER_CAPTIONS_LIST, {
	                    tracks: captionsList,
	                    track: _model.get('captionsIndex') || 0
	                });
	            });
	
	            _model.on('change:mediaModel', function (model) {
	                model.mediaModel.on('change:state', function (mediaModel, state) {
	                    model.set('state', normalizeState(state));
	                });
	            });
	
	            // Ensure captionsList event is raised after playlistItem
	            _captions = new Captions(_model);
	
	            function _triggerAfterReady(type, e) {
	                _this.triggerAfterReady(type, e);
	            }
	
	            function triggerControls(model, enable) {
	                _this.trigger(events.JWPLAYER_CONTROLS, {
	                    controls: enable
	                });
	            }
	
	            _model.on('change:viewSetup', function (model, viewSetup) {
	                if (viewSetup) {
	                    var mediaElement = this.currentContainer.querySelector('video, audio');
	                    _this.showView(_view.element());
	                    if (mediaElement) {
	                        var mediaContainer = _model.get('mediaContainer');
	                        mediaContainer.appendChild(mediaElement);
	                    }
	                }
	            }, this);
	
	            function _playerReady() {
	                _setup = null;
	
	                _view.on('all', _triggerAfterReady, _this);
	
	                var related = _api.getPlugin('related');
	                if (related) {
	                    related.on('nextUp', function (nextUp) {
	                        _model.set('nextUp', nextUp);
	                    });
	                }
	
	                // Fire 'ready' once the view has resized so that player width and height are available
	                // (requires the container to be in the DOM)
	                _view.once(events.JWPLAYER_RESIZE, _playerReadyNotify);
	
	                _view.init();
	            }
	
	            function _playerReadyNotify() {
	                _model.change('visibility', _updateViewable);
	                _model.on('change:controls', triggerControls);
	
	                // Tell the api that we are loaded
	                _this.trigger(events.JWPLAYER_READY, {
	                    // this will be updated by Api
	                    setupTime: 0
	                });
	
	                // Stop queueing certain events
	                _this.triggerAfterReady = _this.trigger;
	
	                // Send queued events
	                for (var i = 0; i < _eventQueuedUntilReady.length; i++) {
	                    var event = _eventQueuedUntilReady[i];
	                    _preplay = event.type === events.JWPLAYER_MEDIA_BEFOREPLAY;
	                    _this.trigger(event.type, event.args);
	                    _preplay = false;
	                }
	
	                _checkAutoStart();
	                _model.change('viewable', viewableChange);
	                _model.change('viewable', _checkPlayOnViewable);
	                _model.once('change:autostartFailed change:autostartMuted change:mute', function (model) {
	                    model.off('change:viewable', _checkPlayOnViewable);
	                });
	            }
	
	            function _updateViewable(model, visibility) {
	                if (!_.isUndefined(visibility)) {
	                    _model.set('viewable', Math.round(visibility));
	                }
	            }
	
	            function _checkAutoStart() {
	                if (!utils.isMobile() && _model.get('autostart') === true) {
	                    // Autostart immediately if we're not mobile and not waiting for the player to become viewable first
	                    _autoStart();
	                }
	            }
	
	            function autostartFallbackOnItemReady() {
	                cancelAutostartFallbackOnItemReady();
	                checkAutoStartLastContext = { bail: false };
	                _model.once('itemReady', checkAutoStartLast, checkAutoStartLastContext);
	            }
	
	            function cancelAutostartFallbackOnItemReady() {
	                checkAutoStartLastContext.bail = true;
	                _model.off('itemReady', checkAutoStartLast);
	            }
	
	            function checkAutoStartLast() {
	                var _this2 = this;
	
	                // Use promise as setImmediate() to allow synchonous calls to load() and play() set the playReason
	                Promise.resolve().then(function () {
	                    var context = _this2;
	                    if (context.bail) {
	                        return;
	                    }
	                    _checkAutoStart();
	                });
	            }
	
	            function viewableChange(model, viewable) {
	                _this.trigger('viewable', {
	                    viewable: viewable
	                });
	            }
	
	            function _checkPlayOnViewable(model, viewable) {
	                if (_model.get('playOnViewable')) {
	                    if (viewable) {
	                        _autoStart();
	                    } else if (utils.isMobile()) {
	                        _this.pause({ reason: 'autostart' });
	                    }
	                }
	            }
	
	            this.triggerAfterReady = function (type, args) {
	                _eventQueuedUntilReady.push({
	                    type: type,
	                    args: args
	                });
	            };
	
	            function _loadProvidersForPlaylist(playlist) {
	                var providersManager = _model.getProviders();
	                var providersNeeded = providersManager.required(playlist, _model.get('primary'));
	                return providersManager.load(providersNeeded).then(function () {
	                    if (!_this.getProvider()) {
	                        _model.setProvider(_model.get('playlistItem'));
	
	                        _executeQueuedEvents();
	                    }
	                });
	            }
	
	            function _executeQueuedEvents() {
	                while (_this.eventsQueue.length > 0) {
	                    var q = _this.eventsQueue.shift();
	                    var method = q[0];
	                    var args = q[1] || [];
	                    _this['_' + method].apply(_this, args);
	                }
	            }
	
	            function _load(item, feedData) {
	                if (_model.get('state') === states.ERROR) {
	                    _model.set('state', states.IDLE);
	                }
	                _model.set('preInstreamState', 'instream-idle');
	
	                _this.trigger('destroyPlugin', {});
	                _stop(true);
	
	                autostartFallbackOnItemReady();
	
	                _primeMediaElementForPlayback();
	
	                switch (typeof item === 'undefined' ? 'undefined' : _typeof(item)) {
	                    case 'string':
	                        _loadPlaylist(item);
	                        break;
	                    case 'object':
	                        var success = _setPlaylist(item, feedData);
	                        if (success) {
	                            _setItem(0);
	                        }
	                        break;
	                    case 'number':
	                        _setItem(item);
	                        break;
	                    default:
	                        break;
	                }
	            }
	
	            function _loadPlaylist(toLoad) {
	                var loader = new PlaylistLoader();
	                loader.on(events.JWPLAYER_PLAYLIST_LOADED, function (data) {
	                    _load(data.playlist, data);
	                });
	                loader.on(events.JWPLAYER_ERROR, function (evt) {
	                    evt.message = 'Error loading playlist: ' + evt.message;
	                    _this.triggerError(evt);
	                }, _this);
	                loader.load(toLoad);
	            }
	
	            function _getAdState() {
	                return _this._instreamAdapter && _this._instreamAdapter.getState();
	            }
	
	            function _getState() {
	                var adState = _getAdState();
	                if (_.isString(adState)) {
	                    return adState;
	                }
	                return _model.get('state');
	            }
	
	            function _play() {
	                var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	                cancelAutostartFallbackOnItemReady();
	                _model.set('playReason', meta.reason);
	
	                if (_model.get('state') === states.ERROR) {
	                    return;
	                }
	
	                var adState = _getAdState();
	                if (_.isString(adState)) {
	                    // this will resume the ad. _api.playAd would load a new ad
	                    _api.pauseAd(false);
	                    return;
	                }
	
	                if (_model.get('state') === states.COMPLETE) {
	                    _stop(true);
	                    _setItem(0);
	                }
	
	                if (!_preplay) {
	                    _preplay = true;
	                    _this.triggerAfterReady(events.JWPLAYER_MEDIA_BEFOREPLAY, { playReason: _model.get('playReason') });
	                    _preplay = false;
	                    if (_interruptPlay) {
	                        _interruptPlay = false;
	                        _actionOnAttach = null;
	                        return;
	                    }
	                }
	
	                // TODO: The state is idle while providers load
	                var status;
	                if (_isIdle()) {
	                    if (_model.get('playlist').length === 0) {
	                        return;
	                    }
	                    status = utils.tryCatch(function () {
	                        // FIXME: playAttempt is not triggered until this is called. Should be on play()
	                        _model.loadVideo();
	                    });
	                } else if (_model.get('state') === states.PAUSED) {
	                    status = utils.tryCatch(function () {
	                        _model.playVideo();
	                    });
	                }
	
	                if (status instanceof utils.Error) {
	                    _this.triggerError(status);
	                    _actionOnAttach = null;
	                }
	            }
	
	            function _inInteraction(event) {
	                return event && /^(?:mouse|pointer|touch|gesture|click|key)/.test(event.type);
	            }
	
	            function _primeMediaElementForPlayback() {
	                // If we're in a user-gesture event call load() on video to allow async playback
	                if (_inInteraction(window.event)) {
	                    var mediaElement = _this.currentContainer.querySelector('video, audio');
	                    if (mediaElement && _isIdle()) {
	                        mediaElement.load();
	                    }
	                }
	            }
	
	            function _autoStart() {
	                var state = _model.get('state');
	
	                if (state === states.IDLE || state === states.PAUSED) {
	                    _play({ reason: 'autostart' });
	                }
	            }
	
	            function _stop(internal) {
	                cancelAutostartFallbackOnItemReady();
	
	                var fromApi = !internal;
	
	                _actionOnAttach = null;
	
	                var status = utils.tryCatch(function () {
	                    _model.stopVideo();
	                }, _this);
	
	                if (status instanceof utils.Error) {
	                    _this.triggerError(status);
	                    return false;
	                }
	
	                if (fromApi) {
	                    _stopPlaylist = true;
	                }
	
	                if (_preplay) {
	                    _interruptPlay = true;
	                }
	
	                return true;
	            }
	
	            function _pause() {
	                var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	                _actionOnAttach = null;
	
	                _model.set('pauseReason', meta.reason);
	                // Stop autoplay behavior if the video is paused by the user or an api call
	                if (meta.reason === 'interaction' || meta.reason === 'external') {
	                    _model.set('playOnViewable', false);
	                }
	
	                var adState = _getAdState();
	                if (_.isString(adState)) {
	                    _api.pauseAd(true);
	                    return;
	                }
	
	                switch (_model.get('state')) {
	                    case states.ERROR:
	                        return;
	                    case states.PLAYING:
	                    case states.BUFFERING:
	                        var status = utils.tryCatch(function () {
	                            _video().pause();
	                        }, this);
	
	                        if (status instanceof utils.Error) {
	                            _this.triggerError(status);
	                            return;
	                        }
	                        break;
	                    default:
	                        if (_preplay) {
	                            _interruptPlay = true;
	                        }
	                }
	                return;
	            }
	
	            function _isIdle() {
	                var state = _model.get('state');
	                return state === states.IDLE || state === states.COMPLETE || state === states.ERROR;
	            }
	
	            function _seek(pos, meta) {
	                if (_model.get('state') === states.ERROR) {
	                    return;
	                }
	                if (!_model.get('scrubbing') && _model.get('state') !== states.PLAYING) {
	                    _play(meta);
	                }
	                _video().seek(pos);
	            }
	
	            function _item(index, meta) {
	                _stop(true);
	                if (_model.get('state') === states.ERROR) {
	                    _model.set('state', states.IDLE);
	                }
	                _setItem(index);
	                _play(meta);
	            }
	
	            function _setPlaylist(array, feedData) {
	                _model.set('feedData', feedData);
	
	                var playlist = Playlist(array);
	                playlist = Playlist.filterPlaylist(playlist, _model, feedData);
	
	                _model.set('playlist', playlist);
	
	                if (!_.isArray(playlist) || playlist.length === 0) {
	                    _this.triggerError({
	                        message: 'Error loading playlist: No playable sources found'
	                    });
	                    return false;
	                }
	
	                _loadProvidersForPlaylist(playlist);
	
	                return true;
	            }
	
	            function _setItem(index) {
	                _model.setItemIndex(index);
	            }
	
	            function _prev(meta) {
	                _item(_model.get('item') - 1, meta);
	            }
	
	            function _next(meta) {
	                _item(_model.get('item') + 1, meta);
	            }
	
	            function _completeHandler() {
	                if (!_isIdle()) {
	                    // Something has made an API call before the complete handler has fired.
	                    return;
	                } else if (_stopPlaylist) {
	                    // Stop called in onComplete event listener
	                    _stopPlaylist = false;
	                    return;
	                }
	
	                _actionOnAttach = _completeHandler;
	
	                var idx = _model.get('item');
	                if (idx === _model.get('playlist').length - 1) {
	                    // If it's the last item in the playlist
	                    if (_model.get('repeat')) {
	                        _next({ reason: 'repeat' });
	                    } else {
	                        // Exit fullscreen on IOS so that our overlays show to the user
	                        if (utils.isIOS()) {
	                            _setFullscreen(false);
	                        }
	                        // Autoplay/pause no longer needed since there's no more media to play
	                        // This prevents media from replaying when a completed video scrolls into view
	                        _model.set('playOnViewable', false);
	                        _model.set('state', states.COMPLETE);
	                        _this.trigger(events.JWPLAYER_PLAYLIST_COMPLETE, {});
	                    }
	                    return;
	                }
	
	                // It wasn't the last item in the playlist,
	                //  so go to the next one
	                _next({ reason: 'playlist' });
	            }
	
	            function _setCurrentQuality(index) {
	                if (_video()) {
	                    index = parseInt(index, 10) || 0;
	                    _video().setCurrentQuality(index);
	                }
	            }
	
	            function _getCurrentQuality() {
	                if (_video()) {
	                    return _video().getCurrentQuality();
	                }
	                return -1;
	            }
	
	            function _getConfig() {
	                return this._model ? this._model.getConfiguration() : undefined;
	            }
	
	            function _getVisualQuality() {
	                if (this._model.mediaModel) {
	                    return this._model.mediaModel.get('visualQuality');
	                }
	                // if quality is not implemented in the provider,
	                // return quality info based on current level
	                var qualityLevels = _getQualityLevels();
	                if (qualityLevels) {
	                    var levelIndex = _getCurrentQuality();
	                    var level = qualityLevels[levelIndex];
	                    if (level) {
	                        return {
	                            level: _.extend({
	                                index: levelIndex
	                            }, level),
	                            mode: '',
	                            reason: ''
	                        };
	                    }
	                }
	                return null;
	            }
	
	            function _getQualityLevels() {
	                if (_video()) {
	                    return _video().getQualityLevels();
	                }
	                return null;
	            }
	
	            function _setCurrentAudioTrack(index) {
	                if (_video()) {
	                    index = parseInt(index, 10) || 0;
	                    _video().setCurrentAudioTrack(index);
	                }
	            }
	
	            function _getCurrentAudioTrack() {
	                if (_video()) {
	                    return _video().getCurrentAudioTrack();
	                }
	                return -1;
	            }
	
	            function _getAudioTracks() {
	                if (_video()) {
	                    return _video().getAudioTracks();
	                }
	                return null;
	            }
	
	            function _setCurrentCaptions(index) {
	                index = parseInt(index, 10) || 0;
	
	                // update provider subtitle track
	                _model.persistVideoSubtitleTrack(index);
	
	                _this.trigger(events.JWPLAYER_CAPTIONS_CHANGED, {
	                    tracks: _getCaptionsList(),
	                    track: index
	                });
	            }
	
	            function _getCurrentCaptions() {
	                return _captions.getCurrentIndex();
	            }
	
	            function _getCaptionsList() {
	                return _captions.getCaptionsList();
	            }
	
	            /** Used for the InStream API **/
	            function _detachMedia() {
	                return _model.detachMedia();
	            }
	
	            function _attachMedia() {
	                // Called after instream ends
	                var status = utils.tryCatch(function () {
	                    _model.attachMedia();
	                });
	
	                if (status instanceof utils.Error) {
	                    utils.log('Error calling _attachMedia', status);
	                    return;
	                }
	
	                if (typeof _actionOnAttach === 'function') {
	                    _actionOnAttach();
	                }
	            }
	
	            function _setFullscreen(state) {
	                if (!_.isBoolean(state)) {
	                    state = !_model.get('fullscreen');
	                }
	
	                _model.set('fullscreen', state);
	                if (this._instreamAdapter && this._instreamAdapter._adModel) {
	                    this._instreamAdapter._adModel.set('fullscreen', state);
	                }
	            }
	
	            function _nextUp() {
	                var related = _api.getPlugin('related');
	                if (related) {
	                    var nextUp = _model.get('nextUp');
	                    if (nextUp) {
	                        _this.trigger('nextClick', {
	                            mode: nextUp.mode,
	                            ui: 'nextup',
	                            target: nextUp,
	                            itemsShown: [nextUp],
	                            feedData: nextUp.feedData
	                        });
	                    }
	                    related.next();
	                }
	            }
	
	            /** Controller API / public methods **/
	            this._play = _play;
	            this._pause = _pause;
	            this._seek = _seek;
	            this._stop = _stop;
	            this._load = _load;
	            this._next = _next;
	            this._prev = _prev;
	            this._item = _item;
	            this._setCurrentCaptions = _setCurrentCaptions;
	            this._setCurrentQuality = _setCurrentQuality;
	            this._setFullscreen = _setFullscreen;
	
	            this.detachMedia = _detachMedia;
	            this.attachMedia = _attachMedia;
	            this.getCurrentQuality = _getCurrentQuality;
	            this.getQualityLevels = _getQualityLevels;
	            this.setCurrentAudioTrack = _setCurrentAudioTrack;
	            this.getCurrentAudioTrack = _getCurrentAudioTrack;
	            this.getAudioTracks = _getAudioTracks;
	            this.getCurrentCaptions = _getCurrentCaptions;
	            this.getCaptionsList = _getCaptionsList;
	            this.getVisualQuality = _getVisualQuality;
	            this.getConfig = _getConfig;
	            this.getState = _getState;
	
	            // Model passthroughs
	            this.setVolume = _model.setVolume.bind(_model);
	            this.setMute = _model.setMute.bind(_model);
	            this.setPlaybackRate = _model.setPlaybackRate.bind(_model);
	            this.getProvider = function () {
	                return _model.get('provider');
	            };
	            this.getWidth = function () {
	                return _model.get('containerWidth');
	            };
	            this.getHeight = function () {
	                return _model.get('containerHeight');
	            };
	
	            // View passthroughs
	            this.getContainer = function () {
	                return this.currentContainer;
	            };
	            this.resize = _view.resize;
	            this.getSafeRegion = _view.getSafeRegion;
	            this.setCues = _view.addCues;
	            this.setCaptions = _view.setCaptions;
	            this.next = _nextUp;
	            this.setConfig = function (newConfig) {
	                return (0, _setConfig2.default)(_this, newConfig);
	            };
	            this.addButton = function (img, tooltip, callback, id, btnClass) {
	                var newButton = {
	                    img: img,
	                    tooltip: tooltip,
	                    callback: callback,
	                    id: id,
	                    btnClass: btnClass
	                };
	                var replaced = false;
	                var dock = _.map(_model.get('dock'), function (dockButton) {
	                    var replaceButton = dockButton !== newButton && dockButton.id === newButton.id;
	
	                    // replace button if its of the same id/type,
	                    // but has different values
	                    if (replaceButton) {
	                        replaced = true;
	                        return newButton;
	                    }
	                    return dockButton;
	                });
	
	                // add button if it has not been replaced
	                if (!replaced) {
	                    dock.push(newButton);
	                }
	
	                _model.set('dock', dock);
	            };
	
	            this.removeButton = function (id) {
	                var dock = _model.get('dock') || [];
	                dock = _.reject(dock, _.matches({ id: id }));
	                _model.set('dock', dock);
	            };
	
	            this.checkBeforePlay = function () {
	                return _preplay;
	            };
	
	            this.getItemQoe = function () {
	                return _model._qoeItem;
	            };
	
	            this.setControls = function (mode) {
	                if (!_.isBoolean(mode)) {
	                    mode = !_model.get('controls');
	                }
	                _model.set('controls', mode);
	
	                var provider = _model.getVideo();
	                if (provider) {
	                    provider.setControls(mode);
	                }
	            };
	
	            this.playerDestroy = function () {
	                this.stop();
	                this.showView(this.originalContainer);
	
	                if (_view) {
	                    _view.destroy();
	                }
	                if (_model) {
	                    _model.destroy();
	                }
	                if (_setup) {
	                    _setup.destroy();
	                    _setup = null;
	                }
	            };
	
	            this.isBeforePlay = this.checkBeforePlay;
	
	            this.isBeforeComplete = function () {
	                return _model.checkComplete();
	            };
	
	            this.createInstream = function () {
	                this.instreamDestroy();
	                _primeMediaElementForPlayback();
	                this._instreamAdapter = new InstreamAdapter(this, _model, _view);
	                return this._instreamAdapter;
	            };
	
	            this.skipAd = function () {
	                if (this._instreamAdapter) {
	                    this._instreamAdapter.skipAd();
	                }
	            };
	
	            this.instreamDestroy = function () {
	                if (_this._instreamAdapter) {
	                    _this._instreamAdapter.destroy();
	                }
	            };
	
	            // Delegate trigger so we can run a middleware function before any event is bubbled through the API
	            this.trigger = function (type, args) {
	                var data = eventsMiddleware(_model, type, args);
	                return Events.trigger.call(this, type, data);
	            };
	
	            _setup.start();
	        },
	
	        showView: function showView(viewElement) {
	            if (!document.body.contains(this.currentContainer)) {
	                // This implies the player was removed from the DOM before setup completed
	                //   or a player has been "re" setup after being removed from the DOM
	                var newContainer = document.getElementById(this._model.get('id'));
	                if (newContainer) {
	                    this.currentContainer = newContainer;
	                }
	            }
	
	            if (this.currentContainer.parentElement) {
	                this.currentContainer.parentElement.replaceChild(viewElement, this.currentContainer);
	            }
	            this.currentContainer = viewElement;
	        },
	
	        triggerError: function triggerError(evt) {
	            this._model.set('errorEvent', evt);
	            this._model.set('state', states.ERROR);
	            this._model.once('change:state', function () {
	                this._model.set('errorEvent', undefined);
	            }, this);
	
	            this.trigger(events.JWPLAYER_ERROR, evt);
	        },
	
	        setupError: function setupError(evt) {
	            var message = evt.message;
	            var errorElement = utils.createElement(error(this._model.get('id'), this._model.get('skin'), message));
	
	            var width = this._model.get('width');
	            var height = this._model.get('height');
	
	            utils.style(errorElement, {
	                width: width.toString().indexOf('%') > 0 ? width : width + 'px',
	                height: height.toString().indexOf('%') > 0 ? height : height + 'px'
	            });
	
	            this.showView(errorElement);
	
	            var _this = this;
	            _.defer(function () {
	                _this.trigger(events.JWPLAYER_SETUP_ERROR, {
	                    message: message
	                });
	            });
	        }
	    };
	
	    return Controller;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 5 */
/*!**********************************!*\
  !*** ./src/js/api/set-config.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var _ = __webpack_require__(/*! utils/underscore */ 6);
	
	var supportedFields = ['repeat', 'volume', 'mute', 'autostart'];
	
	function setAutoStart(model, controller, autoStart) {
	    model.setAutoStart(autoStart);
	
	    if (model.get('state') === 'idle' && autoStart === true) {
	        controller.play({ reason: 'autostart' });
	    }
	}
	
	exports.default = function (controller, newConfig) {
	    var model = controller._model;
	
	    if (!_.size(newConfig)) {
	        return;
	    }
	
	    supportedFields.forEach(function (field) {
	        var newValue = newConfig[field];
	
	        if (_.isUndefined(newValue)) {
	            return;
	        }
	
	        switch (field) {
	            case 'mute':
	                controller.setMute(newValue);
	                break;
	            case 'volume':
	                controller.setVolume(newValue);
	                break;
	            case 'autostart':
	                setAutoStart(model, controller, newValue);
	                break;
	            default:
	                model.set(field, newValue);
	        }
	    });
	};

/***/ },
/* 6 */
/*!************************************!*\
  !*** ./src/js/utils/underscore.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	//     Underscore.js 1.6.0
	//     http://underscorejs.org
	//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.
	
	// https://github.com/jashkenas/underscore/blob/1f4bf626f23a99f7a676f5076dc1b1475554c8f7/underscore.js
	
	/* eslint no-eq-null: 0 */
	/* eslint eqeqeq: 0 */
	/* eslint no-void: 0 */
	/* eslint guard-for-in: 0 */
	/* eslint no-constant-condition: 0 */
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	
	    // Establish the object that gets returned to break out of a loop iteration.
	    var breaker = {};
	
	    // Save bytes in the minified (but not gzipped) version:
	    var ArrayProto = Array.prototype;
	    var ObjProto = Object.prototype;
	    var FuncProto = Function.prototype;
	
	    // Create quick reference variables for speed access to core prototypes.
	    var slice = ArrayProto.slice;
	    var concat = ArrayProto.concat;
	    var toString = ObjProto.toString;
	    var hasOwnProperty = ObjProto.hasOwnProperty;
	
	    // All **ECMAScript 5** native function implementations that we hope to use
	    // are declared here.
	    var nativeMap = ArrayProto.map;
	    var nativeReduce = ArrayProto.reduce;
	    var nativeForEach = ArrayProto.forEach;
	    var nativeFilter = ArrayProto.filter;
	    var nativeEvery = ArrayProto.every;
	    var nativeSome = ArrayProto.some;
	    var nativeIndexOf = ArrayProto.indexOf;
	    var nativeIsArray = Array.isArray;
	    var nativeKeys = Object.keys;
	    var nativeBind = FuncProto.bind;
	
	    // Create a safe reference to the Underscore object for use below.
	    var _ = function _(obj) {
	        if (obj instanceof _) {
	            return obj;
	        }
	        if (!(this instanceof _)) {
	            return new _(obj);
	        }
	    };
	
	    // Collection Functions
	    // --------------------
	
	    // The cornerstone, an `each` implementation, aka `forEach`.
	    // Handles objects with the built-in `forEach`, arrays, and raw objects.
	    // Delegates to **ECMAScript 5**'s native `forEach` if available.
	    var each = _.each = _.forEach = function (obj, iterator, context) {
	        var i;
	        var length;
	        if (obj == null) {
	            return obj;
	        }
	        if (nativeForEach && obj.forEach === nativeForEach) {
	            obj.forEach(iterator, context);
	        } else if (obj.length === +obj.length) {
	            for (i = 0, length = obj.length; i < length; i++) {
	                if (iterator.call(context, obj[i], i, obj) === breaker) {
	                    return;
	                }
	            }
	        } else {
	            var keys = _.keys(obj);
	            for (i = 0, length = keys.length; i < length; i++) {
	                if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) {
	                    return;
	                }
	            }
	        }
	        return obj;
	    };
	
	    // Return the results of applying the iterator to each element.
	    // Delegates to **ECMAScript 5**'s native `map` if available.
	    _.map = _.collect = function (obj, iterator, context) {
	        var results = [];
	        if (obj == null) {
	            return results;
	        }
	        if (nativeMap && obj.map === nativeMap) {
	            return obj.map(iterator, context);
	        }
	        each(obj, function (value, index, list) {
	            results.push(iterator.call(context, value, index, list));
	        });
	        return results;
	    };
	
	    var reduceError = 'Reduce of empty array with no initial value';
	
	    // **Reduce** builds up a single result from a list of values, aka `inject`,
	    // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
	    _.reduce = _.foldl = _.inject = function (obj, iterator, memo, context) {
	        var initial = arguments.length > 2;
	        if (obj == null) {
	            obj = [];
	        }
	        if (nativeReduce && obj.reduce === nativeReduce) {
	            if (context) {
	                iterator = _.bind(iterator, context);
	            }
	            return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
	        }
	        each(obj, function (value, index, list) {
	            if (!initial) {
	                memo = value;
	                initial = true;
	            } else {
	                memo = iterator.call(context, memo, value, index, list);
	            }
	        });
	        if (!initial) {
	            throw new TypeError(reduceError);
	        }
	        return memo;
	    };
	
	    // Return the first value which passes a truth test. Aliased as `detect`.
	    _.find = _.detect = function (obj, predicate, context) {
	        var result;
	        any(obj, function (value, index, list) {
	            if (predicate.call(context, value, index, list)) {
	                result = value;
	                return true;
	            }
	        });
	        return result;
	    };
	
	    // Return all the elements that pass a truth test.
	    // Delegates to **ECMAScript 5**'s native `filter` if available.
	    // Aliased as `select`.
	    _.filter = _.select = function (obj, predicate, context) {
	        var results = [];
	        if (obj == null) {
	            return results;
	        }
	        if (nativeFilter && obj.filter === nativeFilter) {
	            return obj.filter(predicate, context);
	        }
	        each(obj, function (value, index, list) {
	            if (predicate.call(context, value, index, list)) {
	                results.push(value);
	            }
	        });
	        return results;
	    };
	
	    // Return all the elements for which a truth test fails.
	    _.reject = function (obj, predicate, context) {
	        return _.filter(obj, function (value, index, list) {
	            return !predicate.call(context, value, index, list);
	        }, context);
	    };
	
	    // Trim out all falsy values from an array.
	    _.compact = function (array) {
	        return _.filter(array, _.identity);
	    };
	
	    // Determine whether all of the elements match a truth test.
	    // Delegates to **ECMAScript 5**'s native `every` if available.
	    // Aliased as `all`.
	    _.every = _.all = function (obj, predicate, context) {
	        predicate || (predicate = _.identity);
	        var result = true;
	        if (obj == null) {
	            return result;
	        }
	        if (nativeEvery && obj.every === nativeEvery) {
	            return obj.every(predicate, context);
	        }
	        each(obj, function (value, index, list) {
	            if (!(result = result && predicate.call(context, value, index, list))) {
	                return breaker;
	            }
	        });
	        return !!result;
	    };
	
	    // Determine if at least one element in the object matches a truth test.
	    // Delegates to **ECMAScript 5**'s native `some` if available.
	    // Aliased as `any`.
	    var any = _.some = _.any = function (obj, predicate, context) {
	        predicate || (predicate = _.identity);
	        var result = false;
	        if (obj == null) {
	            return result;
	        }
	        if (nativeSome && obj.some === nativeSome) {
	            return obj.some(predicate, context);
	        }
	        each(obj, function (value, index, list) {
	            if (result || (result = predicate.call(context, value, index, list))) {
	                return breaker;
	            }
	        });
	        return !!result;
	    };
	
	    // returns the size of an object
	    _.size = function (obj) {
	        if (obj == null) {
	            return 0;
	        }
	        return obj.length === +obj.length ? obj.length : _.keys(obj).length;
	    };
	
	    // Array Functions
	    // ---------------
	
	
	    // Get the last element of an array. Passing **n** will return the last N
	    // values in the array. The **guard** check allows it to work with `_.map`.
	    _.last = function (array, n, guard) {
	        if (array == null) {
	            return void 0;
	        }
	        if (n == null || guard) {
	            return array[array.length - 1];
	        }
	        return slice.call(array, Math.max(array.length - n, 0));
	    };
	
	    // Returns a function that will only be executed after being called N times.
	    _.after = function (times, func) {
	        return function () {
	            if (--times < 1) {
	                return func.apply(this, arguments);
	            }
	        };
	    };
	
	    // Returns a function that will only be executed up to (but not including) the Nth call.
	    _.before = function (times, func) {
	        var memo;
	        return function () {
	            if (--times > 0) {
	                memo = func.apply(this, arguments);
	            }
	            if (times <= 1) {
	                func = null;
	            }
	            return memo;
	        };
	    };
	
	    // An internal function to generate lookup iterators.
	    var lookupIterator = function lookupIterator(value) {
	        if (value == null) {
	            return _.identity;
	        }
	        if (_.isFunction(value)) {
	            return value;
	        }
	        return _.property(value);
	    };
	
	    // An internal function used for aggregate "group by" operations.
	    var group = function group(behavior) {
	        return function (obj, iterator, context) {
	            var result = {};
	            iterator = lookupIterator(iterator);
	            each(obj, function (value, index) {
	                var key = iterator.call(context, value, index, obj);
	                behavior(result, key, value);
	            });
	            return result;
	        };
	    };
	
	    // Groups the object's values by a criterion. Pass either a string attribute
	    // to group by, or a function that returns the criterion.
	    _.groupBy = group(function (result, key, value) {
	        _.has(result, key) ? result[key].push(value) : result[key] = [value];
	    });
	
	    // Indexes the object's values by a criterion, similar to `groupBy`, but for
	    // when you know that your index values will be unique.
	    _.indexBy = group(function (result, key, value) {
	        result[key] = value;
	    });
	
	    // Use a comparator function to figure out the smallest index at which
	    // an object should be inserted so as to maintain order. Uses binary search.
	    _.sortedIndex = function (array, obj, iterator, context) {
	        iterator = lookupIterator(iterator);
	        var value = iterator.call(context, obj);
	        var low = 0;
	        var high = array.length;
	        while (low < high) {
	            var mid = low + high >>> 1;
	            iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
	        }
	        return low;
	    };
	
	    _.contains = _.include = function (obj, target) {
	        if (obj == null) {
	            return false;
	        }
	        if (obj.length !== +obj.length) {
	            obj = _.values(obj);
	        }
	        return _.indexOf(obj, target) >= 0;
	    };
	
	    // Convenience version of a common use case of `map`: fetching a property.
	    _.pluck = function (obj, key) {
	        return _.map(obj, _.property(key));
	    };
	
	    // Convenience version of a common use case of `filter`: selecting only objects
	    // containing specific `key:value` pairs.
	    _.where = function (obj, attrs) {
	        return _.filter(obj, _.matches(attrs));
	    };
	
	    // Convenience version of a common use case of `find`: getting the first object
	    // containing specific `key:value` pairs.
	    _.findWhere = function (obj, attrs) {
	        return _.find(obj, _.matches(attrs));
	    };
	
	    // Return the maximum element or (element-based computation).
	    // Can't optimize arrays of integers longer than 65,535 elements.
	    // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
	    _.max = function (obj, iterator, context) {
	        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
	            return Math.max.apply(Math, obj);
	        }
	        var result = -Infinity;
	        var lastComputed = -Infinity;
	        each(obj, function (value, index, list) {
	            var computed = iterator ? iterator.call(context, value, index, list) : value;
	            if (computed > lastComputed) {
	                result = value;
	                lastComputed = computed;
	            }
	        });
	        return result;
	    };
	
	    // Take the difference between one array and a number of other arrays.
	    // Only the elements present in just the first array will remain.
	    _.difference = function (array) {
	        var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
	        return _.filter(array, function (value) {
	            return !_.contains(rest, value);
	        });
	    };
	
	    // Return a version of the array that does not contain the specified value(s).
	    _.without = function (array) {
	        return _.difference(array, slice.call(arguments, 1));
	    };
	
	    // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
	    // we need this function. Return the position of the first occurrence of an
	    // item in an array, or -1 if the item is not included in the array.
	    // Delegates to **ECMAScript 5**'s native `indexOf` if available.
	    // If the array is large and already in sort order, pass `true`
	    // for **isSorted** to use binary search.
	    _.indexOf = function (array, item, isSorted) {
	        if (array == null) {
	            return -1;
	        }
	        var i = 0;
	        var length = array.length;
	        if (isSorted) {
	            if (typeof isSorted == 'number') {
	                i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
	            } else {
	                i = _.sortedIndex(array, item);
	                return array[i] === item ? i : -1;
	            }
	        }
	        if (nativeIndexOf && array.indexOf === nativeIndexOf) {
	            return array.indexOf(item, isSorted);
	        }
	        for (; i < length; i++) {
	            if (array[i] === item) {
	                return i;
	            }
	        }
	        return -1;
	    };
	
	    // Function (ahem) Functions
	    // ------------------
	
	
	    // Reusable constructor function for prototype setting.
	    var ctor = function ctor() {};
	
	    // Create a function bound to a given object (assigning `this`, and arguments,
	    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	    // available.
	    _.bind = function (func, context) {
	        var args;
	        var _bound;
	        if (nativeBind && func.bind === nativeBind) {
	            return nativeBind.apply(func, slice.call(arguments, 1));
	        }
	        if (!_.isFunction(func)) {
	            throw new TypeError();
	        }
	        args = slice.call(arguments, 2);
	        _bound = function bound() {
	            if (!(this instanceof _bound)) {
	                return func.apply(context, args.concat(slice.call(arguments)));
	            }
	            ctor.prototype = func.prototype;
	            var self = new ctor();
	            ctor.prototype = null;
	            var result = func.apply(self, args.concat(slice.call(arguments)));
	            if (Object(result) === result) {
	                return result;
	            }
	            return self;
	        };
	        return _bound;
	    };
	
	    // Partially apply a function by creating a version that has had some of its
	    // arguments pre-filled, without changing its dynamic `this` context. _ acts
	    // as a placeholder, allowing any combination of arguments to be pre-filled.
	    _.partial = function (func) {
	        var boundArgs = slice.call(arguments, 1);
	        return function () {
	            var position = 0;
	            var args = boundArgs.slice();
	            for (var i = 0, length = args.length; i < length; i++) {
	                if (args[i] === _) {
	                    args[i] = arguments[position++];
	                }
	            }
	            while (position < arguments.length) {
	                args.push(arguments[position++]);
	            }
	            return func.apply(this, args);
	        };
	    };
	
	    // Returns a function that will be executed at most one time, no matter how
	    // often you call it. Useful for lazy initialization.
	    _.once = _.partial(_.before, 2);
	
	    // Returns the first function passed as an argument to the second,
	    // allowing you to adjust arguments, run code before and after, and
	    // conditionally execute the original function.
	    // _.wrap = function(func, wrapper) {
	    //    return _.partial(wrapper, func);
	    // };
	
	
	    // Memoize an expensive function by storing its results.
	    _.memoize = function (func, hasher) {
	        var memo = {};
	        hasher || (hasher = _.identity);
	        return function () {
	            var key = hasher.apply(this, arguments);
	            return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments);
	        };
	    };
	
	    // Delays a function for the given number of milliseconds, and then calls
	    // it with the arguments supplied.
	    _.delay = function (func, wait) {
	        var args = slice.call(arguments, 2);
	        return setTimeout(function () {
	            return func.apply(null, args);
	        }, wait);
	    };
	
	    // Defers a function, scheduling it to run after the current call stack has
	    // cleared.
	    _.defer = function (func) {
	        return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
	    };
	
	    // Returns a function, that, when invoked, will only be triggered at most once
	    // during a given window of time. Normally, the throttled function will run
	    // as much as it can, without ever going more than once per `wait` duration;
	    // but if you'd like to disable the execution on the leading edge, pass
	    // `{leading: false}`. To disable execution on the trailing edge, ditto.
	    _.throttle = function (func, wait, options) {
	        var context;
	        var args;
	        var result;
	        var timeout = null;
	        var previous = 0;
	        options || (options = {});
	        var later = function later() {
	            previous = options.leading === false ? 0 : _.now();
	            timeout = null;
	            result = func.apply(context, args);
	            context = args = null;
	        };
	        return function () {
	            var now = _.now();
	            if (!previous && options.leading === false) {
	                previous = now;
	            }
	            var remaining = wait - (now - previous);
	            context = this;
	            args = arguments;
	            if (remaining <= 0) {
	                clearTimeout(timeout);
	                timeout = null;
	                previous = now;
	                result = func.apply(context, args);
	                context = args = null;
	            } else if (!timeout && options.trailing !== false) {
	                timeout = setTimeout(later, remaining);
	            }
	            return result;
	        };
	    };
	
	    // Retrieve the names of an object's properties.
	    // Delegates to **ECMAScript 5**'s native `Object.keys`
	    _.keys = function (obj) {
	        if (!_.isObject(obj)) {
	            return [];
	        }
	        if (nativeKeys) {
	            return nativeKeys(obj);
	        }
	        var keys = [];
	        for (var key in obj) {
	            if (_.has(obj, key)) {
	                keys.push(key);
	            }
	        }
	        return keys;
	    };
	
	    _.invert = function (obj) {
	        var result = {};
	        var keys = _.keys(obj);
	        for (var i = 0, length = keys.length; i < length; i++) {
	            result[obj[keys[i]]] = keys[i];
	        }
	        return result;
	    };
	
	    // Fill in a given object with default properties.
	    _.defaults = function (obj) {
	        each(slice.call(arguments, 1), function (source) {
	            if (source) {
	                for (var prop in source) {
	                    if (obj[prop] === void 0) {
	                        obj[prop] = source[prop];
	                    }
	                }
	            }
	        });
	        return obj;
	    };
	
	    // Extend a given object with all the properties in passed-in object(s).
	    _.extend = function (obj) {
	        each(slice.call(arguments, 1), function (source) {
	            if (source) {
	                for (var prop in source) {
	                    obj[prop] = source[prop];
	                }
	            }
	        });
	        return obj;
	    };
	
	    // Return a copy of the object only containing the whitelisted properties.
	    _.pick = function (obj) {
	        var copy = {};
	        var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
	        each(keys, function (key) {
	            if (key in obj) {
	                copy[key] = obj[key];
	            }
	        });
	        return copy;
	    };
	
	    // Return a copy of the object without the blacklisted properties.
	    _.omit = function (obj) {
	        var copy = {};
	        var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
	        for (var key in obj) {
	            if (!_.contains(keys, key)) {
	                copy[key] = obj[key];
	            }
	        }
	        return copy;
	    };
	
	    // Create a (shallow-cloned) duplicate of an object.
	    _.clone = function (obj) {
	        if (!_.isObject(obj)) {
	            return obj;
	        }
	        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	    };
	
	    // Is a given value an array?
	    // Delegates to ECMA5's native Array.isArray
	    _.isArray = nativeIsArray || function (obj) {
	        return toString.call(obj) == '[object Array]';
	    };
	
	    // Is a given variable an object?
	    _.isObject = function (obj) {
	        return obj === Object(obj);
	    };
	
	    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
	    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
	        _['is' + name] = function (obj) {
	            return toString.call(obj) == '[object ' + name + ']';
	        };
	    });
	
	    // Define a fallback version of the method in browsers (ahem, IE), where
	    // there isn't any inspectable "Arguments" type.
	    if (!_.isArguments(arguments)) {
	        _.isArguments = function (obj) {
	            return !!(obj && _.has(obj, 'callee'));
	        };
	    }
	
	    // Optimize `isFunction` if appropriate.
	    if (true) {
	        _.isFunction = function (obj) {
	            return typeof obj === 'function';
	        };
	    }
	
	    // Is a given object a finite number?
	    _.isFinite = function (obj) {
	        return isFinite(obj) && !isNaN(parseFloat(obj));
	    };
	
	    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	    _.isNaN = function (obj) {
	        return _.isNumber(obj) && obj != +obj;
	    };
	
	    // Is a given value a boolean?
	    _.isBoolean = function (obj) {
	        return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
	    };
	
	    // Is a given value equal to null?
	    _.isNull = function (obj) {
	        return obj === null;
	    };
	
	    // Is a given variable undefined?
	    _.isUndefined = function (obj) {
	        return obj === void 0;
	    };
	
	    // Shortcut function for checking if an object has a given property directly
	    // on itself (in other words, not on a prototype).
	    _.has = function (obj, key) {
	        return hasOwnProperty.call(obj, key);
	    };
	
	    // Keep the identity function around for default iterators.
	    _.identity = function (value) {
	        return value;
	    };
	
	    _.constant = function (value) {
	        return function () {
	            return value;
	        };
	    };
	
	    _.property = function (key) {
	        return function (obj) {
	            return obj[key];
	        };
	    };
	
	    _.propertyOf = function (obj) {
	        return obj == null ? function () {} : function (key) {
	            return obj[key];
	        };
	    };
	
	    // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
	    _.matches = function (attrs) {
	        return function (obj) {
	            // avoid comparing an object to itself.
	            if (obj === attrs) {
	                return true;
	            }
	            for (var key in attrs) {
	                if (attrs[key] !== obj[key]) {
	                    return false;
	                }
	            }
	            return true;
	        };
	    };
	
	    // A (possibly faster) way to get the current timestamp as an integer.
	    _.now = Date.now || function () {
	        return new Date().getTime();
	    };
	
	    // If the value of the named `property` is a function then invoke it with the
	    // `object` as context; otherwise, return it.
	    _.result = function (object, property) {
	        if (object == null) {
	            return void 0;
	        }
	        var value = object[property];
	        return _.isFunction(value) ? value.call(object) : value;
	    };
	
	    // Generate a unique integer id (unique within the entire client session).
	    // Useful for temporary DOM ids.
	    var idCounter = 0;
	    _.uniqueId = function (prefix) {
	        var id = ++idCounter + '';
	        return prefix ? prefix + id : id;
	    };
	
	    return _;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 7 */
/*!******************************!*\
  !*** ./src/js/api/config.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, _) {
	    /* global __webpack_public_path__:true*/
	    /* eslint camelcase: 0 */
	    // Defaults
	    var Defaults = {
	        autostart: false,
	        controls: true,
	        displaytitle: true,
	        displaydescription: true,
	        mobilecontrols: false,
	        defaultPlaybackRate: 1,
	        playbackRateControls: false,
	        repeat: false,
	        castAvailable: false,
	        skin: 'seven',
	        stretching: 'uniform',
	        mute: false,
	        volume: 90,
	        width: 480,
	        height: 270,
	        audioMode: false,
	        localization: {
	            player: 'Video Player',
	            play: 'Play',
	            playback: 'Start playback',
	            pause: 'Pause',
	            volume: 'Volume',
	            prev: 'Previous',
	            next: 'Next',
	            cast: 'Chromecast',
	            airplay: 'Airplay',
	            fullscreen: 'Fullscreen',
	            playlist: 'Playlist',
	            hd: 'Quality',
	            cc: 'Closed captions',
	            audioTracks: 'Audio tracks',
	            playbackRates: 'Playback rates',
	            replay: 'Replay',
	            buffer: 'Loading',
	            more: 'More',
	            liveBroadcast: 'Live broadcast',
	            loadingAd: 'Loading ad',
	            rewind: 'Rewind 10s',
	            nextUp: 'Next Up',
	            nextUpClose: 'Next Up Close',
	            related: 'Discover',
	            close: 'Close'
	        },
	        renderCaptionsNatively: true,
	        nextUpDisplay: true
	    };
	
	    function _deserialize(options) {
	        _.each(options, function (val, key) {
	            options[key] = utils.serialize(val);
	        });
	    }
	
	    function _normalizeSize(val) {
	        if (val.slice && val.slice(-2) === 'px') {
	            val = val.slice(0, -2);
	        }
	        return val;
	    }
	
	    var createConfig = function createConfig(options, storage) {
	        var persisted = storage && storage.getAllItems();
	        var allOptions = _.extend({}, (window.jwplayer || {}).defaults, persisted, options);
	
	        _deserialize(allOptions);
	
	        allOptions.localization = _.extend({}, Defaults.localization, allOptions.localization);
	
	        var config = _.extend({}, Defaults, allOptions);
	        if (config.base === '.') {
	            config.base = utils.getScriptPath('jwplayer.js');
	        }
	        config.base = (config.base || utils.loadFrom()).replace(/\/?$/, '/');
	        __webpack_require__.p = config.base;
	        config.width = _normalizeSize(config.width);
	        config.height = _normalizeSize(config.height);
	        var pathToFlash = utils.getScriptPath('jwplayer.js') || config.base;
	        config.flashplayer = config.flashplayer || pathToFlash + 'jwplayer.flash.swf';
	        config.flashloader = config.flashloader || pathToFlash + 'jwplayer.loader.swf';
	
	        // Non ssl pages can only communicate with flash when it is loaded
	        //   from a non ssl location
	        if (window.location.protocol === 'http:') {
	            config.flashplayer = config.flashplayer.replace('https', 'http');
	            config.flashloader = config.flashloader.replace('https', 'http');
	        }
	
	        config.aspectratio = _evaluateAspectRatio(config.aspectratio, config.width);
	
	        if (_.isObject(config.skin)) {
	            config.skinUrl = config.skin.url;
	            config.skinColorInactive = config.skin.inactive; // default icon color
	            config.skinColorActive = config.skin.active; // icon hover, on, slider color
	            config.skinColorBackground = config.skin.background; // control elements background
	            config.skin = _.isString(config.skin.name) ? config.skin.name : Defaults.skin; // get skin name if it exists
	        }
	
	        if (_.isString(config.skin) && config.skin.indexOf('.xml') > 0) {
	            console.warn('JW Player does not support XML skins, please update your config');
	            config.skin = config.skin.replace('.xml', '');
	        }
	
	        var rateControls = config.playbackRateControls;
	
	        if (rateControls) {
	            var rates = [0.5, 1, 1.25, 1.5, 2];
	
	            if (_.isArray(rateControls)) {
	                rates = rateControls.filter(function (rate) {
	                    return _.isNumber(rate) && rate >= 0.25 && rate <= 4;
	                }).map(function (rate) {
	                    return Math.round(rate * 4) / 4;
	                });
	
	                if (rates.indexOf(1) < 0) {
	                    rates.push(1);
	                }
	
	                rates.sort();
	            }
	
	            config.playbackRateControls = rates;
	        }
	
	        // Set defaultPlaybackRate to 1 if the value from storage isn't in the playbackRateControls menu
	        if (!config.playbackRateControls || config.playbackRateControls.indexOf(config.defaultPlaybackRate) < 0) {
	            config.defaultPlaybackRate = 1;
	        }
	
	        config.playbackRate = config.defaultPlaybackRate;
	
	        if (!config.aspectratio) {
	            delete config.aspectratio;
	        }
	
	        var configPlaylist = config.playlist;
	        if (!configPlaylist) {
	            // This is a legacy fallback, assuming a playlist item has been flattened into the config
	            var obj = _.pick(config, ['title', 'description', 'type', 'mediaid', 'image', 'file', 'sources', 'tracks', 'preload']);
	
	            config.playlist = [obj];
	        } else if (_.isArray(configPlaylist.playlist)) {
	            // The "playlist" in the config is actually a feed that contains a playlist
	            config.feedData = configPlaylist;
	            config.playlist = configPlaylist.playlist;
	        }
	
	        config.qualityLabels = config.qualityLabels || config.hlslabels;
	
	        return config;
	    };
	
	    function _evaluateAspectRatio(ar, width) {
	        if (width.toString().indexOf('%') === -1) {
	            return 0;
	        }
	        if (typeof ar !== 'string' || !utils.exists(ar)) {
	            return 0;
	        }
	        if (/^\d*\.?\d+%$/.test(ar)) {
	            return ar;
	        }
	        var index = ar.indexOf(':');
	        if (index === -1) {
	            return 0;
	        }
	        var w = parseFloat(ar.substr(0, index));
	        var h = parseFloat(ar.substr(index + 1));
	        if (w <= 0 || h <= 0) {
	            return 0;
	        }
	        return h / w * 100 + '%';
	    }
	
	    return createConfig;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 8 */
/*!*********************************!*\
  !*** ./src/js/utils/helpers.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/strings */ 12), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/browser */ 13), __webpack_require__(/*! utils/dom */ 14), __webpack_require__(/*! utils/css */ 16), __webpack_require__(/*! utils/parser */ 10), __webpack_require__(/*! utils/id3Parser */ 18), __webpack_require__(/*! utils/ajax */ 9), __webpack_require__(/*! utils/validator */ 11), __webpack_require__(/*! utils/playerutils */ 19), __webpack_require__(/*! utils/timer */ 22), __webpack_require__(/*! utils/trycatch */ 24), __webpack_require__(/*! utils/stream-type */ 25), __webpack_require__(/*! utils/quality-labels */ 26)], __WEBPACK_AMD_DEFINE_RESULT__ = function (strings, _, browser, dom, css, parser, id3Parser, ajax, validator, playerutils, Timer, trycatch, streamType, qualityLabels) {
	    var utils = {};
	
	    utils.log = function () {
	        /* eslint no-console: 0 */
	        if (!window.console) {
	            return;
	        }
	        if (_typeof(console.log) === 'object') {
	            console.log(Array.prototype.slice.call(arguments, 0));
	        } else {
	            console.log.apply(console, arguments);
	        }
	    };
	
	    utils.between = function (num, min, max) {
	        return Math.max(Math.min(num, max), min);
	    };
	
	    /**
	     * Iterates over an object and executes a callback function for each property (if it exists)
	     * This is a safe way to iterate over objects if another script has modified the object prototype
	     */
	    utils.foreach = function (aData, fnEach) {
	        var key;
	        var val;
	
	        for (key in aData) {
	            if (utils.typeOf(aData.hasOwnProperty) === 'function') {
	                if (aData.hasOwnProperty(key)) {
	                    val = aData[key];
	                    fnEach(key, val);
	                }
	            } else {
	                // IE8 has a problem looping through XML nodes
	                val = aData[key];
	                fnEach(key, val);
	            }
	        }
	    };
	
	    utils.indexOf = _.indexOf;
	    utils.noop = function () {};
	
	    utils.seconds = strings.seconds;
	    utils.prefix = strings.prefix;
	    utils.suffix = strings.suffix;
	
	    utils.Timer = Timer;
	
	    _.extend(utils, parser, id3Parser, validator, browser, ajax, dom, css, playerutils, trycatch, streamType, qualityLabels);
	
	    return utils;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 9 */
/*!******************************!*\
  !*** ./src/js/utils/ajax.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/parser */ 10)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, parser) {
	    var noop = function noop() {};
	    var useDomParser = false;
	
	    var crossdomain = function crossdomain(uri) {
	        var a = document.createElement('a');
	        var b = document.createElement('a');
	        a.href = location.href;
	        try {
	            b.href = uri;
	            b.href = b.href; /* IE fix for relative urls */
	            return a.protocol + '//' + a.host !== b.protocol + '//' + b.host;
	        } catch (e) {/* swallow */}
	        return true;
	    };
	
	    var ajax = function ajax(url, completeCallback, errorCallback, args) {
	        if (_.isObject(url)) {
	            args = url;
	            url = args.url;
	        }
	        var xhr;
	        var options = _.extend({
	            xhr: null,
	            url: url,
	            withCredentials: false,
	            retryWithoutCredentials: false,
	            timeout: 60000,
	            timeoutId: -1,
	            oncomplete: completeCallback || noop,
	            onerror: errorCallback || noop,
	            mimeType: args && !args.responseType ? 'text/xml' : '',
	            requireValidXML: false, /* Require responseXML */
	            responseType: args && args.plainText ? 'text' : '' /* xhr.responseType ex: "json" or "text" */
	        }, args);
	
	        if ('XDomainRequest' in window && crossdomain(url)) {
	            // IE8 / 9
	            xhr = options.xhr = new window.XDomainRequest();
	            xhr.onload = _ajaxComplete(options);
	            xhr.ontimeout = xhr.onprogress = noop;
	            useDomParser = true;
	        } else if ('XMLHttpRequest' in window) {
	            // Firefox, Chrome, Opera, Safari
	            xhr = options.xhr = new window.XMLHttpRequest();
	            xhr.onreadystatechange = _readyStateChangeHandler(options);
	        } else {
	            // browser cannot make xhr requests
	            options.onerror('', url);
	            return;
	        }
	        var requestError = _requestError('Error loading file', options);
	        xhr.onerror = requestError;
	
	        if ('overrideMimeType' in xhr) {
	            if (options.mimeType) {
	                xhr.overrideMimeType(options.mimeType);
	            }
	        } else {
	            useDomParser = true;
	        }
	
	        try {
	            // remove anchors from the URL since they can't be loaded in IE
	            url = url.replace(/#.*$/, '');
	            xhr.open('GET', url, true);
	        } catch (e) {
	            requestError(e);
	            return xhr;
	        }
	
	        if (options.responseType) {
	            try {
	                xhr.responseType = options.responseType;
	            } catch (e) {/* ignore */}
	        }
	
	        if (options.timeout) {
	            options.timeoutId = setTimeout(function () {
	                _abortAjax(xhr);
	                options.onerror('Timeout', url, xhr);
	            }, options.timeout);
	            xhr.onabort = function () {
	                clearTimeout(options.timeoutId);
	            };
	        }
	
	        try {
	            // xhr.withCredentials must must be set after xhr.open() is called
	            // otherwise older WebKit browsers will throw INVALID_STATE_ERR (PhantomJS 1.x)
	            if (options.withCredentials && 'withCredentials' in xhr) {
	                xhr.withCredentials = true;
	            }
	            xhr.send();
	        } catch (e) {
	            requestError(e);
	        }
	        return xhr;
	    };
	
	    function _abortAjax(xhr) {
	        xhr.onload = null;
	        xhr.onprogress = null;
	        xhr.onreadystatechange = null;
	        xhr.onerror = null;
	        if ('abort' in xhr) {
	            xhr.abort();
	        }
	    }
	
	    function _requestError(message, options) {
	        return function (e) {
	            var xhr = e.currentTarget || options.xhr;
	            clearTimeout(options.timeoutId);
	            // Handle Access-Control-Allow-Origin wildcard error when using withCredentials to send cookies
	            if (options.retryWithoutCredentials && options.xhr.withCredentials) {
	                _abortAjax(xhr);
	                var args = _.extend({}, options, {
	                    xhr: null,
	                    withCredentials: false,
	                    retryWithoutCredentials: false
	                });
	                ajax(args);
	                return;
	            }
	            options.onerror(message, options.url, xhr);
	        };
	    }
	
	    function _readyStateChangeHandler(options) {
	        return function (e) {
	            var xhr = e.currentTarget || options.xhr;
	            if (xhr.readyState === 4) {
	                clearTimeout(options.timeoutId);
	                if (xhr.status >= 400) {
	                    var message;
	                    if (xhr.status === 404) {
	                        message = 'File not found';
	                    } else {
	                        message = '' + xhr.status + '(' + xhr.statusText + ')';
	                    }
	                    return options.onerror(message, options.url, xhr);
	                }
	                if (xhr.status === 200) {
	                    return _ajaxComplete(options)(e);
	                }
	            }
	        };
	    }
	
	    function _ajaxComplete(options) {
	        return function (e) {
	            var xhr = e.currentTarget || options.xhr;
	            clearTimeout(options.timeoutId);
	            if (options.responseType) {
	                if (options.responseType === 'json') {
	                    return _jsonResponse(xhr, options);
	                }
	            } else {
	                // Handle the case where an XML document was returned with an incorrect MIME type.
	                var xml = xhr.responseXML;
	                var firstChild;
	                if (xml) {
	                    try {
	                        // This will throw an error on Windows Mobile 7.5.
	                        // We want to trigger the error so that we can move down to the next section
	                        firstChild = xml.firstChild;
	                    } catch (error) {
	                        /* ignore */
	                    }
	                }
	                if (xml && firstChild) {
	                    return _xmlResponse(xhr, xml, options);
	                }
	                // IE9
	                if (useDomParser && xhr.responseText && !xml) {
	                    xml = parser.parseXML(xhr.responseText);
	                    if (xml && xml.firstChild) {
	                        return _xmlResponse(xhr, xml, options);
	                    }
	                }
	                if (options.requireValidXML) {
	                    options.onerror('Invalid XML', options.url, xhr);
	                    return;
	                }
	            }
	            options.oncomplete(xhr);
	        };
	    }
	
	    function _jsonResponse(xhr, options) {
	        // insure that xhr.response is parsed JSON
	        if (!xhr.response || _.isString(xhr.response) && xhr.responseText.substr(1) !== '"') {
	            try {
	                xhr = _.extend({}, xhr, {
	                    response: JSON.parse(xhr.responseText)
	                });
	            } catch (err) {
	                options.onerror('Invalid JSON', options.url, xhr);
	                return;
	            }
	        }
	        return options.oncomplete(xhr);
	    }
	
	    function _xmlResponse(xhr, xml, options) {
	        // Handle DOMParser 'parsererror'
	        var doc = xml.documentElement;
	        if (options.requireValidXML && (doc.nodeName === 'parsererror' || doc.getElementsByTagName('parsererror').length)) {
	            options.onerror('Invalid XML', options.url, xhr);
	            return;
	        }
	        if (!xhr.responseXML) {
	            xhr = _.extend({}, xhr, {
	                responseXML: xml
	            });
	        }
	        return options.oncomplete(xhr);
	    }
	
	    return {
	        ajax: ajax,
	        crossdomain: crossdomain
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 10 */
/*!********************************!*\
  !*** ./src/js/utils/parser.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/validator */ 11)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, validator) {
	    var parser = {};
	
	    // Gets an absolute file path based on a relative filepath
	    parser.getAbsolutePath = function (path, base) {
	        if (!validator.exists(base)) {
	            base = document.location.href;
	        }
	
	        if (!validator.exists(path)) {
	            return;
	        }
	
	        if (isAbsolutePath(path)) {
	            return path;
	        }
	
	        var protocol = base.substring(0, base.indexOf('://') + 3);
	        var domain = base.substring(protocol.length, base.indexOf('/', protocol.length + 1));
	        var patharray;
	
	        if (path.indexOf('/') === 0) {
	            patharray = path.split('/');
	        } else {
	            var basepath = base.split('?')[0];
	            basepath = basepath.substring(protocol.length + domain.length + 1, basepath.lastIndexOf('/'));
	            patharray = basepath.split('/').concat(path.split('/'));
	        }
	        var result = [];
	        for (var i = 0; i < patharray.length; i++) {
	            if (patharray[i] && validator.exists(patharray[i]) && patharray[i] !== '.') {
	                if (patharray[i] === '..') {
	                    result.pop();
	                } else {
	                    result.push(patharray[i]);
	                }
	            }
	        }
	        return protocol + domain + '/' + result.join('/');
	    };
	
	    function isAbsolutePath(path) {
	        return (/^(?:(?:https?|file)\:)?\/\//.test(path)
	        );
	    }
	
	    parser.getScriptPath = _.memoize(function (scriptName) {
	        var scripts = document.getElementsByTagName('script');
	        for (var i = 0; i < scripts.length; i++) {
	            var src = scripts[i].src;
	            if (src) {
	                var index = src.indexOf('/' + scriptName);
	                if (index >= 0) {
	                    return src.substr(0, index + 1);
	                }
	            }
	        }
	        return '';
	    });
	
	    function containsParserErrors(childNodes) {
	        return _.some(childNodes, function (node) {
	            return node.nodeName === 'parsererror';
	        });
	    }
	
	    /** Takes an XML string and returns an XML object **/
	    parser.parseXML = function (input) {
	        var parsedXML = null;
	        try {
	            // Parse XML in FF/Chrome/Safari/Opera
	            if ('DOMParser' in window) {
	                parsedXML = new window.DOMParser().parseFromString(input, 'text/xml');
	                // In Firefox the XML doc may contain the parsererror, other browsers it's further down
	                if (containsParserErrors(parsedXML.childNodes) || parsedXML.childNodes && containsParserErrors(parsedXML.childNodes[0].childNodes)) {
	                    parsedXML = null;
	                }
	            } else {
	                // Internet Explorer
	                parsedXML = new window.ActiveXObject('Microsoft.XMLDOM');
	                parsedXML.async = 'false';
	                parsedXML.loadXML(input);
	            }
	        } catch (e) {/* Expected when content is not XML */}
	
	        return parsedXML;
	    };
	
	    /**
	     * String representations of booleans and numbers that are 5 characters in length or less
	     * are returned typed
	     */
	    parser.serialize = function (val) {
	        if (val === undefined) {
	            return null;
	        }
	        if (typeof val === 'string' && val.length < 6) {
	            var lowercaseVal = val.toLowerCase();
	            if (lowercaseVal === 'true') {
	                return true;
	            }
	            if (lowercaseVal === 'false') {
	                return false;
	            }
	            if (!isNaN(Number(val)) && !isNaN(parseFloat(val))) {
	                return Number(val);
	            }
	        }
	        return val;
	    };
	
	    /**
	     * Cleans up a css dimension (e.g. '420px') and returns an integer.
	     */
	    parser.parseDimension = function (dimension) {
	        if (typeof dimension === 'string') {
	            if (dimension === '') {
	                return 0;
	            } else if (dimension.lastIndexOf('%') > -1) {
	                return dimension;
	            }
	            return parseInt(dimension.replace('px', ''), 10);
	        }
	        return dimension;
	    };
	
	    /** Format the elapsed / remaining text. **/
	    parser.timeFormat = function (sec, allowNegative) {
	        if (sec <= 0 && !allowNegative || _.isNaN(parseInt(sec))) {
	            return '00:00';
	        }
	
	        // If negative add a minus sign
	        var prefix = sec < 0 ? '-' : '';
	        sec = Math.abs(sec);
	
	        var hrs = Math.floor(sec / 3600);
	        var mins = Math.floor((sec - hrs * 3600) / 60);
	        var secs = Math.floor(sec % 60);
	
	        return prefix + (hrs ? hrs + ':' : '') + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
	    };
	
	    return parser;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 11 */
/*!***********************************!*\
  !*** ./src/js/utils/validator.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	    var validator = {};
	
	    // Returns true if the value of the object is null, undefined or the empty string
	    validator.exists = function (item) {
	        switch (typeof item === 'undefined' ? 'undefined' : _typeof(item)) {
	            case 'string':
	                return item.length > 0;
	            case 'object':
	                return item !== null;
	            case 'undefined':
	                return false;
	            default:
	                return true;
	        }
	    };
	
	    /** Determines if the current page is HTTPS **/
	    validator.isHTTPS = function () {
	        return window.location.href.indexOf('https') === 0;
	    };
	
	    /**
	     * Determines if a URL is an RTMP link
	     */
	    validator.isRtmp = function (file, type) {
	        return file.indexOf('rtmp') === 0 || type === 'rtmp';
	    };
	
	    /**
	     * Determines if a URL is a YouTube link
	     */
	    validator.isYouTube = function (path, type) {
	        return type === 'youtube' || /^(http|\/\/).*(youtube\.com|youtu\.be)\/.+/.test(path);
	    };
	
	    /**
	     * Returns a YouTube ID from a number of YouTube URL formats:
	     *
	     * Matches the following YouTube URL types:
	     *  - http://www.youtube.com/watch?v=YE7VzlLtp-4
	     *  - http://www.youtube.com/watch?v=YE7VzlLtp-4&extra_param=123
	     *  - http://www.youtube.com/watch#!v=YE7VzlLtp-4
	     *  - http://www.youtube.com/watch#!v=YE7VzlLtp-4?extra_param=123&another_param=456
	     *  - http://www.youtube.com/v/YE7VzlLtp-4
	     *  - http://www.youtube.com/v/YE7VzlLtp-4?extra_param=123&another_param=456
	     *  - http://youtu.be/YE7VzlLtp-4
	     *  - http://youtu.be/YE7VzlLtp-4?extra_param=123&another_param=456
	     *  - YE7VzlLtp-4
	     **/
	    validator.youTubeID = function (path) {
	        // Left as a dense regular expression for brevity.
	        var matches = /v[=\/]([^?&]*)|youtu\.be\/([^?]*)|^([\w-]*)$/i.exec(path);
	        if (!matches) {
	            return '';
	        }
	        return matches.slice(1).join('').replace('?', '');
	    };
	
	    /** Returns the true type of an object * */
	    validator.typeOf = function (value) {
	        if (value === null) {
	            return 'null';
	        }
	        var typeofString = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	        if (typeofString === 'object') {
	            if (_.isArray(value)) {
	                return 'array';
	            }
	        }
	        return typeofString;
	    };
	
	    return validator;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 12 */
/*!*********************************!*\
  !*** ./src/js/utils/strings.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	    var trim = function trim(inputString) {
	        return inputString.replace(/^\s+|\s+$/g, '');
	    };
	
	    var pad = function pad(str, length, padder) {
	        str = '' + str;
	        padder = padder || '0';
	        while (str.length < length) {
	            str = padder + str;
	        }
	        return str;
	    };
	
	    // Get the value of a case-insensitive attribute in an XML node
	    var xmlAttribute = function xmlAttribute(xml, attribute) {
	        for (var attrib = 0; attrib < xml.attributes.length; attrib++) {
	            if (xml.attributes[attrib].name && xml.attributes[attrib].name.toLowerCase() === attribute.toLowerCase()) {
	                return xml.attributes[attrib].value.toString();
	            }
	        }
	        return '';
	    };
	
	    // This does not return the file extension, instead it returns a media type extension
	    function getAzureFileFormat(path) {
	        if (/[\(,]format=m3u8-/i.test(path)) {
	            return 'm3u8';
	        } else if (/[\(,]format=mpd-/i.test(path)) {
	            return 'mpd';
	        }
	        return false;
	    }
	
	    var extension = function extension(path) {
	        if (!path || path.substr(0, 4) === 'rtmp') {
	            return '';
	        }
	
	        var azureFormat = getAzureFileFormat(path);
	        if (azureFormat) {
	            return azureFormat;
	        }
	
	        path = path.split('?')[0].split('#')[0];
	        if (path.lastIndexOf('.') > -1) {
	            return path.substr(path.lastIndexOf('.') + 1, path.length).toLowerCase();
	        }
	    };
	
	    // Convert seconds to HH:MN:SS.sss
	    var hms = function hms(seconds) {
	        var h = parseInt(seconds / 3600);
	        var m = parseInt(seconds / 60) % 60;
	        var s = seconds % 60;
	        return pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s.toFixed(3), 6);
	    };
	
	    // Convert a time-representing string to a number
	    var seconds = function seconds(str, frameRate) {
	        if (_.isNumber(str)) {
	            return str;
	        }
	
	        str = str.replace(',', '.');
	        var arr = str.split(':');
	        var arrLength = arr.length;
	        var sec = 0;
	        if (str.slice(-1) === 's') {
	            sec = parseFloat(str);
	        } else if (str.slice(-1) === 'm') {
	            sec = parseFloat(str) * 60;
	        } else if (str.slice(-1) === 'h') {
	            sec = parseFloat(str) * 3600;
	        } else if (arrLength > 1) {
	            var secIndex = arrLength - 1;
	            if (arrLength === 4) {
	                // if frame is included in the string, calculate seconds by dividing by frameRate
	                if (frameRate) {
	                    sec = parseFloat(arr[secIndex]) / frameRate;
	                }
	                secIndex -= 1;
	            }
	            sec += parseFloat(arr[secIndex]);
	            sec += parseFloat(arr[secIndex - 1]) * 60;
	            if (arrLength >= 3) {
	                sec += parseFloat(arr[secIndex - 2]) * 3600;
	            }
	        } else {
	            sec = parseFloat(str);
	        }
	        return sec;
	    };
	
	    var prefix = function prefix(arr, add) {
	        return _.map(arr, function (val) {
	            return add + val;
	        });
	    };
	
	    var suffix = function suffix(arr, add) {
	        return _.map(arr, function (val) {
	            return val + add;
	        });
	    };
	
	    return {
	        trim: trim,
	        pad: pad,
	        xmlAttribute: xmlAttribute,
	        extension: extension,
	        hms: hms,
	        seconds: seconds,
	        suffix: suffix,
	        prefix: prefix
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 13 */
/*!*********************************!*\
  !*** ./src/js/utils/browser.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	    var browser = {};
	
	    var _userAgentMatch = _.memoize(function (regex) {
	        var agent = navigator.userAgent.toLowerCase();
	        return agent.match(regex) !== null;
	    });
	
	    function _browserCheck(regex) {
	        return function () {
	            return _userAgentMatch(regex);
	        };
	    }
	
	    var _isInt = browser.isInt = function (value) {
	        return parseFloat(value) % 1 === 0;
	    };
	
	    browser.isFlashSupported = function () {
	        var flashVersion = browser.flashVersion();
	        return flashVersion && flashVersion >= (18);
	    };
	
	    browser.isFF = _browserCheck(/gecko\//i);
	    browser.isIPod = _browserCheck(/iP(hone|od)/i);
	    browser.isIPad = _browserCheck(/iPad/i);
	    browser.isSafari602 = _browserCheck(/Macintosh.*Mac OS X 10_8.*6\.0\.\d* Safari/i);
	    browser.isOSX = _browserCheck(/Mac OS X/i);
	    // Check for Facebook App Version to see if it's Facebook
	    browser.isFacebook = _browserCheck(/FBAV/i);
	
	    var _isEdge = browser.isEdge = function (browserVersion) {
	        if (browserVersion) {
	            return _userAgentMatch(new RegExp('\\sedge\\/' + browserVersion, 'i'));
	        }
	        return _userAgentMatch(/\sEdge\/\d+/i);
	    };
	
	    var _isIETrident = browser.isIETrident = _browserCheck(/trident\/.+rv:\s*11/i);
	
	    var _isMSIE = browser.isMSIE = function (browserVersion) {
	        if (browserVersion) {
	            browserVersion = parseFloat(browserVersion).toFixed(1);
	            return _userAgentMatch(new RegExp('msie\\s*' + browserVersion, 'i'));
	        }
	        return _userAgentMatch(/msie/i);
	    };
	
	    browser.isChrome = function () {
	        return _userAgentMatch(/\s(?:Chrome|CriOS)\//i) && !browser.isEdge();
	    };
	
	    browser.isIE = function (browserVersion) {
	        if (browserVersion) {
	            browserVersion = parseFloat(browserVersion).toFixed(1);
	            if (browserVersion >= 12) {
	                return _isEdge(browserVersion);
	            } else if (browserVersion >= 11) {
	                return _isIETrident();
	            }
	            return _isMSIE(browserVersion);
	        }
	        return _isEdge() || _isIETrident() || _isMSIE();
	    };
	
	    browser.isSafari = function () {
	        return _userAgentMatch(/safari/i) && !_userAgentMatch(/chrome/i) && !_userAgentMatch(/crios/i) && !_userAgentMatch(/chromium/i) && !_userAgentMatch(/android/i);
	    };
	
	    /** Matches iOS devices **/
	    var _isIOS = browser.isIOS = function (osVersion) {
	        if (osVersion) {
	            return _userAgentMatch(new RegExp('iP(hone|ad|od).+\\s(OS\\s' + osVersion + '|.*\\sVersion/' + osVersion + ')', 'i'));
	        }
	        return _userAgentMatch(/iP(hone|ad|od)/i);
	    };
	
	    /** Matches Android devices **/
	    browser.isAndroidNative = function (osVersion) {
	        return _isAndroid(osVersion, true);
	    };
	
	    var _isAndroid = browser.isAndroid = function (osVersion, excludeChrome) {
	        // Android Browser appears to include a user-agent string for Chrome/18
	        if (excludeChrome && _userAgentMatch(/chrome\/[123456789]/i) && !_userAgentMatch(/chrome\/18/)) {
	            return false;
	        }
	        if (osVersion) {
	            // make sure whole number version check ends with point '.'
	            if (_isInt(osVersion) && !/\./.test(osVersion)) {
	                osVersion = '' + osVersion + '.';
	            }
	            return _userAgentMatch(new RegExp('Android\\s*' + osVersion, 'i'));
	        }
	        return _userAgentMatch(/Android/i);
	    };
	
	    /** Matches iOS and Android devices **/
	    browser.isMobile = function () {
	        return _isIOS() || _isAndroid();
	    };
	
	    browser.isIframe = function () {
	        try {
	            return window.self !== window.top;
	        } catch (e) {
	            return true;
	        }
	    };
	
	    /**
	     * If the browser has flash capabilities, return the flash version
	     */
	    browser.flashVersion = function () {
	        if (browser.isAndroid()) {
	            return 0;
	        }
	
	        var plugins = navigator.plugins;
	        var flash;
	
	        if (plugins) {
	            flash = plugins['Shockwave Flash'];
	            if (flash && flash.description) {
	                return parseFloat(flash.description.replace(/\D+(\d+\.?\d*).*/, '$1'));
	            }
	        }
	
	        if (typeof window.ActiveXObject !== 'undefined') {
	            try {
	                flash = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');
	                if (flash) {
	                    return parseFloat(flash.GetVariable('$version').split(' ')[1].replace(/\s*,\s*/, '.'));
	                }
	            } catch (e) {
	                return 0;
	            }
	
	            return flash;
	        }
	        return 0;
	    };
	
	    return browser;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 14 */
/*!*****************************!*\
  !*** ./src/js/utils/dom.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/strings */ 12), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/jqueryfuncs */ 15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (strings, _, jqueryfuncs) {
	
	    var dom = {};
	
	    // Given a string, convert to element and return
	    dom.createElement = function (html) {
	        var newElement = document.createElement('div');
	        newElement.innerHTML = html;
	        return newElement.firstChild;
	    };
	
	    // Used for styling dimensions in CSS
	    // Return the string unchanged if it's a percentage width; add 'px' otherwise
	    dom.styleDimension = function (dimension) {
	        return dimension + (dimension.toString().indexOf('%') > 0 ? '' : 'px');
	    };
	
	    var classNameArray = function classNameArray(element) {
	        return _.isString(element.className) ? element.className.split(' ') : [];
	    };
	
	    var setClassName = function setClassName(element, className) {
	        className = strings.trim(className);
	        if (element.className !== className) {
	            element.className = className;
	        }
	    };
	
	    dom.classList = function (element) {
	        if (element.classList) {
	            return element.classList;
	        }
	        /* ie9 does not support classList http://caniuse.com/#search=classList */
	        return classNameArray(element);
	    };
	
	    dom.hasClass = jqueryfuncs.hasClass;
	
	    dom.addClass = function (element, classes) {
	        // TODO:: use _.union on the two arrays
	
	        var originalClasses = classNameArray(element);
	        var addClasses = _.isArray(classes) ? classes : classes.split(' ');
	
	        _.each(addClasses, function (c) {
	            if (!_.contains(originalClasses, c)) {
	                originalClasses.push(c);
	            }
	        });
	
	        setClassName(element, originalClasses.join(' '));
	    };
	
	    dom.removeClass = function (element, c) {
	        var originalClasses = classNameArray(element);
	        var removeClasses = _.isArray(c) ? c : c.split(' ');
	
	        setClassName(element, _.difference(originalClasses, removeClasses).join(' '));
	    };
	
	    dom.replaceClass = function (element, pattern, replaceWith) {
	        var classes = element.className || '';
	        if (pattern.test(classes)) {
	            classes = classes.replace(pattern, replaceWith);
	        } else if (replaceWith) {
	            classes += ' ' + replaceWith;
	        }
	        setClassName(element, classes);
	    };
	
	    dom.toggleClass = function (element, c, toggleTo) {
	        var hasClass = dom.hasClass(element, c);
	        toggleTo = _.isBoolean(toggleTo) ? toggleTo : !hasClass;
	
	        // short circuit if nothing to do
	        if (toggleTo === hasClass) {
	            return;
	        }
	
	        if (toggleTo) {
	            dom.addClass(element, c);
	        } else {
	            dom.removeClass(element, c);
	        }
	    };
	
	    dom.emptyElement = function (element) {
	        while (element.firstChild) {
	            element.removeChild(element.firstChild);
	        }
	    };
	
	    dom.addStyleSheet = function (url) {
	        var link = document.createElement('link');
	        link.rel = 'stylesheet';
	        link.href = url;
	        document.getElementsByTagName('head')[0].appendChild(link);
	    };
	
	    dom.empty = function (element) {
	        if (!element) {
	            return;
	        }
	        while (element.childElementCount > 0) {
	            element.removeChild(element.children[0]);
	        }
	    };
	
	    dom.bounds = function (element) {
	        var bounds = {
	            left: 0,
	            right: 0,
	            width: 0,
	            height: 0,
	            top: 0,
	            bottom: 0
	        };
	
	        if (!element || !document.body.contains(element)) {
	            return bounds;
	        }
	
	        var rect = element.getBoundingClientRect();
	        var scrollOffsetY = window.pageYOffset;
	        var scrollOffsetX = window.pageXOffset;
	
	        if (!rect.width && !rect.height && !rect.left && !rect.top) {
	            // element is not visible / no layout
	            return bounds;
	        }
	
	        bounds.left = rect.left + scrollOffsetX;
	        bounds.right = rect.right + scrollOffsetX;
	        bounds.top = rect.top + scrollOffsetY;
	        bounds.bottom = rect.bottom + scrollOffsetY;
	        bounds.width = rect.right - rect.left;
	        bounds.height = rect.bottom - rect.top;
	
	        return bounds;
	    };
	
	    return dom;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 15 */
/*!*************************************!*\
  !*** ./src/js/utils/jqueryfuncs.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	// Code in this module uses code from jQuery
	// jQuery v1.11.2 | (c) 2005, 2014 jQuery Foundation, Inc. | Released under the MIT license | jquery.org/license
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return {
	        hasClass: function hasClass(element, searchClass) {
	            var className = ' ' + searchClass + ' ';
	
	            return element.nodeType === 1 && (' ' + element.className + ' ').replace(/[\t\r\n\f]/g, ' ').indexOf(className) >= 0;
	        }
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 16 */
/*!*****************************!*\
  !*** ./src/js/utils/css.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/strings */ 12), __webpack_require__(/*! simple-style-loader/addStyles */ 17)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Strings, styleLoader) {
	
	    var _css = function _css(selector, styles, playerId, important) {
	        playerId = playerId || 'all-players';
	        var cssText = '';
	        if ((typeof styles === 'undefined' ? 'undefined' : _typeof(styles)) === 'object') {
	            var el = document.createElement('div');
	            _style(el, styles);
	            var styleCSSText = el.style.cssText;
	            if (important && styleCSSText) {
	                styleCSSText = styleCSSText.replace(/;/g, ' !important;');
	            }
	            cssText = '{' + styleCSSText + '}';
	        } else if (typeof styles === 'string') {
	            cssText = styles;
	        }
	
	        if (cssText === '' || cssText === '{}') {
	            styleLoader.clear(playerId, selector);
	            return;
	        }
	
	        styleLoader.style([[selector, selector + cssText]], playerId);
	    };
	
	    var _style = function _style(elements, styles) {
	        if (elements === undefined || elements === null) {
	            return;
	        }
	        if (elements.length === undefined) {
	            elements = [elements];
	        }
	
	        var style;
	        var cssRules = {};
	        for (style in styles) {
	            if (Object.prototype.hasOwnProperty.call(styles, style)) {
	                cssRules[style] = _styleValue(style, styles[style]);
	            }
	        }
	
	        for (var i = 0; i < elements.length; i++) {
	            var element = elements[i];
	            var styleName;
	
	            if (element !== undefined && element !== null) {
	                for (style in cssRules) {
	                    if (Object.prototype.hasOwnProperty.call(cssRules, style)) {
	                        styleName = _styleAttributeName(style);
	                        if (element.style[styleName] !== cssRules[style]) {
	                            element.style[styleName] = cssRules[style];
	                        }
	                    }
	                }
	            }
	        }
	    };
	
	    function _styleAttributeName(name) {
	        name = name.split('-');
	        for (var i = 1; i < name.length; i++) {
	            name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
	        }
	        return name.join('');
	    }
	
	    function _styleValue(style, value) {
	        if (value === '' || value === undefined || value === null) {
	            return '';
	        }
	        // string
	        if (typeof value === 'string' && isNaN(value)) {
	            if (/png|gif|jpe?g/i.test(value) && value.indexOf('url') < 0) {
	                return 'url(' + value + ')';
	            }
	            return value;
	        }
	        // number
	        if (value === 0 || style === 'z-index' || style === 'opacity') {
	            return '' + value;
	        }
	        if (/color/i.test(style)) {
	            return '#' + Strings.pad(value.toString(16).replace(/^0x/i, ''), 6);
	        }
	        return Math.ceil(value) + 'px';
	    }
	
	    var transform = function transform(element, value) {
	        _style(element, {
	            transform: value,
	            webkitTransform: value,
	            msTransform: value,
	            mozTransform: value,
	            oTransform: value
	        });
	    };
	
	    var canvasColorContext;
	    var getRgba = function getRgba(color, opacity) {
	        var style = 'rgb';
	        var hasAlpha = opacity !== undefined && opacity !== 100;
	        if (hasAlpha) {
	            style += 'a';
	        }
	        if (!canvasColorContext) {
	            var canvas = document.createElement('canvas');
	            canvas.height = 1;
	            canvas.width = 1;
	            canvasColorContext = canvas.getContext('2d');
	        }
	        if (!color) {
	            color = '#000000';
	        } else if (!isNaN(parseInt(color, 16))) {
	            color = '#' + color;
	        }
	        canvasColorContext.clearRect(0, 0, 1, 1);
	        canvasColorContext.fillStyle = color;
	        canvasColorContext.fillRect(0, 0, 1, 1);
	        var data = canvasColorContext.getImageData(0, 0, 1, 1).data;
	        style += '(' + data[0] + ', ' + data[1] + ', ' + data[2];
	        if (hasAlpha) {
	            style += ', ' + opacity / 100;
	        }
	        return style + ')';
	    };
	
	    return {
	        css: _css,
	        style: _style,
	        clearCss: styleLoader.clear,
	        transform: transform,
	        hexToRgba: getRgba, // deprecate in favor of getRgba
	        getRgba: getRgba
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 17 */
/*!********************************************!*\
  !*** ./~/simple-style-loader/addStyles.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {/*
	 MIT License http://www.opensource.org/licenses/mit-license.php
	 Author Tobias Koppers @sokra
	 */
	
		var stylesInDom = {},
			playerStyleElements = {},
			memoize = function(fn) {
				var memo;
				return function () {
					if (typeof memo === "undefined") memo = fn.apply(this, arguments);
					return memo;
				};
			},
			getHeadElement = memoize(function () {
				return document.head || document.getElementsByTagName("head")[0];
			});
	
		module.exports = {
			style: style,
			clear: clear
		};
	
		function style (list, playerId) {
			addStylesToDom(playerId, listToStyles(list));
		}
	
		function clear (playerId, selector) {
			var playerStyles = stylesInDom[playerId];
			if (!playerStyles) {
				return;
			}
			if (selector) {
				// delete all rules for a specific selector
				var ruleObj = playerStyles[selector];
				if (ruleObj) {
					for (var h = 0; h < ruleObj.parts.length; h += 1) {
						ruleObj.parts[h]();
					}
				}
				return;
			}
			var styleKeys = Object.keys(playerStyles);
			for (var i = 0; i < styleKeys.length; i += 1) {
				var styleObj = playerStyles[styleKeys[i]];
				for (var j = 0; j < styleObj.parts.length; j += 1) {
					styleObj.parts[j]();
				}
			}
			delete stylesInDom[playerId];
		}
	
		function addStylesToDom(playerId, styles) {
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = (stylesInDom[playerId] || {})[item.id];
				if(domStyle) {
					for(var j = 0; j < domStyle.parts.length; j++) {
						domStyle.parts[j](item.parts[j]);
					}
					for(; j < item.parts.length; j++) {
						domStyle.parts.push(addStyle(playerId, item.parts[j]));
					}
				} else {
					var parts = [];
					for(var j = 0; j < item.parts.length; j++) {
						parts.push(addStyle(playerId, item.parts[j]));
					}
					stylesInDom[playerId] = stylesInDom[playerId] || {};
					stylesInDom[playerId][item.id] = {id: item.id, parts: parts};
				}
			}
		}
	
		function listToStyles(list) {
			var styles = [];
			var newStyles = {};
			for(var i = 0; i < list.length; i++) {
				var item = list[i];
				// The id isn't a css selector - it's just used internally
				var id = item[0];
				var css = item[1];
				var media = item[2];
				var part = {css: css, media: media};
				if(!newStyles[id])
					styles.push(newStyles[id] = {id: id, parts: [part]});
				else
					newStyles[id].parts.push(part);
			}
			return styles;
		}
	
		function insertStyleElement(styleElement) {
			getHeadElement().appendChild(styleElement);
		}
	
		function createStyleElement(playerId) {
			var styleElement = document.createElement("style");
			styleElement.type = "text/css";
			styleElement.setAttribute('data-jwplayer-id', playerId);
			insertStyleElement(styleElement);
			return styleElement;
		}
	
		function addStyle(playerId, obj) {
			var styleElement, update, remove;
			var singleton = playerStyleElements[playerId];
	
			if (!singleton) {
				singleton = playerStyleElements[playerId] = {
					element: createStyleElement(playerId),
					counter: 0
				};
			}
	
			var styleIndex = singleton.counter++;
			styleElement = singleton.element;
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	
			update(obj);
	
			return function updateStyle(newObj) {
				if(newObj) {
					if(newObj.css === obj.css && newObj.media === obj.media)
						return;
					update(obj = newObj);
				} else {
					remove();
				}
			};
		}
	
		var replaceText = (function () {
			var textStore = [];
	
			return function (index, replacement) {
				textStore[index] = replacement;
				return textStore.filter(Boolean).join('\n');
			};
		})();
	
		function applyToSingletonTag(styleElement, index, remove, obj) {
			var css = remove ? "" : obj.css;
			if (styleElement.styleSheet) {
				styleElement.styleSheet.cssText = replaceText(index, css);
			} else {
				var cssNode = document.createTextNode(css);
				var childNodes = styleElement.childNodes;
				var child = childNodes[index];
				if (child) {
					styleElement.replaceChild(cssNode, child);
				} else {
					styleElement.appendChild(cssNode);
				}
			}
		}
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/*!***********************************!*\
  !*** ./src/js/utils/id3Parser.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	    var id3Parser = {};
	    var friendlyNames = {
	        TIT2: 'title',
	        TT2: 'title',
	        WXXX: 'url',
	        TPE1: 'artist',
	        TP1: 'artist',
	        TALB: 'album',
	        TAL: 'album'
	    };
	
	    id3Parser.utf8ArrayToStr = function (array, startingIndex) {
	        // Based on code by Masanao Izumo <iz@onicos.co.jp>
	        // posted at http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
	
	        var out, i, len, c;
	        var char2, char3;
	
	        out = '';
	        len = array.length;
	        i = startingIndex || 0;
	        while (i < len) {
	            c = array[i++];
	            // If the character is 3 (END_OF_TEXT) or 0 (NULL) then skip it
	            if (c === 0x00 || c === 0x03) {
	                continue;
	            }
	            switch (c >> 4) {
	                case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
	                    // 0xxxxxxx
	                    out += String.fromCharCode(c);
	                    break;
	                case 12:case 13:
	                    // 110x xxxx   10xx xxxx
	                    char2 = array[i++];
	                    out += String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F);
	                    break;
	                case 14:
	                    // 1110 xxxx  10xx xxxx  10xx xxxx
	                    char2 = array[i++];
	                    char3 = array[i++];
	                    out += String.fromCharCode((c & 0x0F) << 12 | (char2 & 0x3F) << 6 | (char3 & 0x3F) << 0);
	                    break;
	            }
	        }
	
	        return out;
	    };
	
	    id3Parser.utf16BigEndianArrayToStr = function (array, startingIndex) {
	        var out, i, lastDoubleByte;
	
	        out = '';
	        lastDoubleByte = array.length - 1;
	        i = startingIndex || 0;
	        while (i < lastDoubleByte) {
	            if (array[i] === 254 && array[i + 1] === 255) {
	                // Byte order mark
	            } else {
	                out += String.fromCharCode((array[i] << 8) + array[i + 1]);
	            }
	            i += 2;
	        }
	        return out;
	    };
	
	    id3Parser.syncSafeInt = function (sizeArray) {
	        var size = id3Parser.arrayToInt(sizeArray);
	        return size & 0x0000007F | (size & 0x00007F00) >> 1 | (size & 0x007F0000) >> 2 | (size & 0x7F000000) >> 3;
	    };
	
	    id3Parser.arrayToInt = function (array) {
	        var sizeString = '0x';
	        for (var i = 0; i < array.length; i++) {
	            if (array[i] < 16) {
	                sizeString += '0';
	            }
	            sizeString += array[i].toString(16);
	        }
	        return parseInt(sizeString);
	    };
	
	    id3Parser.parseID3 = function (activeCues) {
	        return _.reduce(activeCues, function (data, cue) {
	            if (!('value' in cue)) {
	                // Cue is not in Safari's key/data format
	                if ('data' in cue && cue.data instanceof ArrayBuffer) {
	                    // EdgeHTML 13.10586 cue point format - contains raw data in an ArrayBuffer.
	
	                    var oldCue = cue;
	                    var array = new Uint8Array(oldCue.data);
	                    var arrayLength = array.length;
	
	                    cue = { value: { key: '', data: '' } };
	
	                    var i = 10;
	                    while (i < 14 && i < array.length) {
	                        if (array[i] === 0) {
	                            break;
	                        }
	                        cue.value.key += String.fromCharCode(array[i]);
	                        i++;
	                    }
	
	                    // If the first byte is 3 (END_OF_TEXT) or 0 (NULL) then skip it
	                    var startPos = 19;
	                    var firstByte = array[startPos];
	                    if (firstByte === 0x03 || firstByte === 0x00) {
	                        firstByte = array[++startPos];
	                        arrayLength--;
	                    }
	
	                    var infoDelimiterPosition = 0;
	                    // Find info/value pair delimiter if present.
	                    // If first byte shows theres utf 16 encoding, there is no info since info cannot be utf 16 encoded
	                    if (firstByte !== 0x01 && firstByte !== 0x02) {
	                        for (var j = startPos + 1; j < arrayLength; j++) {
	                            if (array[j] === 0x00) {
	                                infoDelimiterPosition = j - startPos;
	                                break;
	                            }
	                        }
	                    }
	
	                    if (infoDelimiterPosition > 0) {
	                        var info = id3Parser.utf8ArrayToStr(array.subarray(startPos, startPos += infoDelimiterPosition), 0);
	                        if (cue.value.key === 'PRIV') {
	                            if (info === 'com.apple.streaming.transportStreamTimestamp') {
	                                var pts_33_bit = id3Parser.syncSafeInt(array.subarray(startPos, startPos += 4)) & 0x00000001;
	                                var transportStreamTimestamp = id3Parser.syncSafeInt(array.subarray(startPos, startPos += 4));
	                                if (pts_33_bit) {
	                                    transportStreamTimestamp += 0x100000000;
	                                }
	                                cue.value.data = transportStreamTimestamp;
	                            } else {
	                                cue.value.data = id3Parser.utf8ArrayToStr(array, startPos + 1);
	                            }
	                            cue.value.info = info;
	                        } else {
	                            cue.value.info = info;
	                            cue.value.data = id3Parser.utf8ArrayToStr(array, startPos + 1);
	                        }
	                    } else {
	                        var encoding = array[startPos];
	                        if (encoding === 1 || encoding === 2) {
	                            cue.value.data = id3Parser.utf16BigEndianArrayToStr(array, startPos + 1);
	                        } else {
	                            cue.value.data = id3Parser.utf8ArrayToStr(array, startPos + 1);
	                        }
	                    }
	                }
	            }
	
	            // These friendly names mapping provides compatibility with our Flash implementation prior to 7.3
	            if (friendlyNames.hasOwnProperty(cue.value.key)) {
	                data[friendlyNames[cue.value.key]] = cue.value.data;
	            }
	            /* The meta event includes a metadata object with flattened cue key/data pairs
	             * If a cue also includes an info field, then create a collection of info/data pairs for the cue key
	             *   TLEN: 03:50                                        // key: "TLEN", data: "03:50"
	             *   WXXX: {"artworkURL":"http://domain.com/cover.jpg"} // key: "WXXX", info: "artworkURL" ...
	             */
	            if (cue.value.info) {
	                var collection = data[cue.value.key];
	                if (!_.isObject(collection)) {
	                    collection = {};
	                    data[cue.value.key] = collection;
	                }
	                collection[cue.value.info] = cue.value.data;
	            } else {
	                data[cue.value.key] = cue.value.data;
	            }
	            return data;
	        }, {});
	    };
	    return id3Parser;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 19 */
/*!*************************************!*\
  !*** ./src/js/utils/playerutils.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/constants */ 20), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/validator */ 11), __webpack_require__(/*! utils/parser */ 10), __webpack_require__(/*! version */ 21)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Constants, _, validator, parser, version) {
	    var playerUtils = {};
	
	    /** Gets the repository location **/
	    playerUtils.repo = _.memoize(function () {
	        if (true) {
	            return parser.getScriptPath('jwplayer.js');
	        }
	
	        var semver = version.split('+')[0];
	        var repo = Constants.repo + semver + '/';
	        if (validator.isHTTPS()) {
	            return repo.replace(/^http:/, 'https:');
	        }
	        return repo;
	    });
	
	    // Is the player at least a minimum required version?
	    playerUtils.versionCheck = function (target) {
	        var tParts = ('0' + target).split(/\W/);
	        var jParts = version.split(/\W/);
	        var tMajor = parseFloat(tParts[0]);
	        var jMajor = parseFloat(jParts[0]);
	        if (tMajor > jMajor) {
	            return false;
	        } else if (tMajor === jMajor) {
	            if (parseFloat('0' + tParts[1]) > parseFloat(jParts[1])) {
	                return false;
	            }
	        }
	        return true;
	    };
	
	    playerUtils.loadFrom = function () {
	        if (true) {
	            return parser.getScriptPath('jwplayer.js');
	        }
	        return playerUtils.repo();
	    };
	
	    return playerUtils;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 20 */
/*!***********************************!*\
  !*** ./src/js/utils/constants.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return {
	        repo: (''),
	        SkinsIncluded: ['seven'],
	        SkinsLoadable: ['beelden', 'bekle', 'five', 'glow', 'roundster', 'six', 'stormtrooper', 'vapor'],
	        dvrSeekLimit: -25
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 21 */
/*!***************************!*\
  !*** ./src/js/version.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    // This is replaced by compiler
	    return ('7.12.10+local.2017-11-07-16-23-36-354');
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 22 */
/*!*******************************!*\
  !*** ./src/js/utils/timer.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _clock = __webpack_require__(/*! utils/clock */ 23);
	
	/**
	 * QoE metrics returned by `jwplayer()._qoe.dump()`.
	 * {@link Api#qoe jwplayer().qoe():PlayerQoE} returns these for the player and the current playlist item.
	 * @typedef {object} TimerMetrics
	 * @property {object} counts - Lists event counts by event name
	 * @property {object} events - Lists last event timestamps (epoch ms) by event name
	 * @property {object} sums - Lists total event/state duration by event/state name
	 */
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	    /**
	     * The Timer used to measure player and playlist item QoE
	     * @class Timer
	     */
	    var Timer = function Timer() {
	        var startTimes = {};
	        var sum = {};
	        var counts = {};
	
	        var ticks = {};
	
	        /** @lends Timer */
	        return {
	            // Profile methods
	            /**
	             * Start timing a method. Increment {@link TimerMetrics} count.
	             * If the method was already started, but not finished, it's start will be reset.
	             * @memberOf Timer
	             * @instance
	             * @param {string} methodName - The method or player state name.
	             */
	            start: function start(methodName) {
	                startTimes[methodName] = (0, _clock.dateTime)();
	                counts[methodName] = counts[methodName] + 1 || 1;
	            },
	            /**
	             * Finish timing a method. The time since `start` is added to {@link TimerMetrics#sums} sums.
	             * @memberOf Timer
	             * @instance
	             * @param {string} methodName - The method or player state name.
	             */
	            end: function end(methodName) {
	                if (!startTimes[methodName]) {
	                    return;
	                }
	                var now = (0, _clock.dateTime)();
	                var e = now - startTimes[methodName];
	                delete startTimes[methodName];
	                sum[methodName] = sum[methodName] + e || e;
	            },
	            /**
	             * Output the timer metrics.
	             * @memberOf Timer
	             * @instance
	             * @returns {TimerMetrics}
	             */
	            dump: function dump() {
	                // Add running sum of latest method
	                // This lets `jwplayer().qoe().item.sums` return a tally of running playing/paused time
	                var runningSums = _.extend({}, sum);
	                for (var methodName in startTimes) {
	                    if (Object.prototype.hasOwnProperty.call(startTimes, methodName)) {
	                        var now = (0, _clock.dateTime)();
	                        var e = now - startTimes[methodName];
	                        runningSums[methodName] = runningSums[methodName] + e || e;
	                    }
	                }
	                return {
	                    counts: _.extend({}, counts),
	                    sums: runningSums,
	                    events: _.extend({}, ticks)
	                };
	            },
	
	            // Profile events
	            /**
	             * Add or update an event timestamp. The timestamp "tick" is added to {@link TimerMetrics#events} events.
	             * @memberOf Timer
	             * @instance
	             * @param {string} event - The event name.
	             */
	            tick: function tick(event) {
	                ticks[event] = (0, _clock.dateTime)();
	            },
	
	            /**
	             * Remove an event timestamp. The timestamp "tick" is removed from {@link TimerMetrics#events} events.
	             * @memberOf Timer
	             * @instance
	             * @param {string} event - The event name.
	             */
	            clear: function clear(event) {
	                delete ticks[event];
	            },
	
	            /**
	             * Get the difference between two events.
	             * @memberOf Timer
	             * @instance
	             * @param left - The first event name.
	             * @param right - The second event name.
	             * @returns {number|null}
	             */
	            between: function between(left, right) {
	                if (ticks[right] && ticks[left]) {
	                    return ticks[right] - ticks[left];
	                }
	                return null;
	            }
	        };
	    };
	
	    return Timer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 23 */
/*!*******************************!*\
  !*** ./src/js/utils/clock.js ***!
  \*******************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.now = now;
	exports.dateTime = dateTime;
	var Date = window.Date;
	var performance = window.performance || {
	    timing: {}
	};
	var startDate = performance.timing.navigationStart || new Date().getTime();
	
	if (!('now' in performance)) {
	    performance.now = function () {
	        return new Date().getTime() - startDate;
	    };
	}
	
	function now() {
	    return performance.now();
	}
	
	function dateTime() {
	    return startDate + performance.now();
	}

/***/ },
/* 24 */
/*!**********************************!*\
  !*** ./src/js/utils/trycatch.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    var tryCatch = function tryCatch(fn, ctx, args) {
	        // IE8 requires these not be undefined
	        ctx = ctx || this;
	        args = args || [];
	
	        // if in debug mode, let 'er blow!
	        var jwplayer = window.jwplayer;
	        if (jwplayer && jwplayer.debug) {
	            return fn.apply(ctx, args);
	        }
	
	        // else be careful
	        try {
	            return fn.apply(ctx, args);
	        } catch (e) {
	            return new JWError(fn.name, e);
	        }
	    };
	
	    var JWError = function JWError(name, error) {
	        this.name = name;
	        this.message = error.message || error.toString();
	        this.error = error;
	    };
	
	    return {
	        tryCatch: tryCatch,
	        Error: JWError
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 25 */
/*!*************************************!*\
  !*** ./src/js/utils/stream-type.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	    var streamTypeUtil = {};
	
	    // It's DVR if the duration is above the minDvrWindow, Live otherwise
	    streamTypeUtil.isDvr = function (duration, minDvrWindow) {
	        return Math.abs(duration) >= Math.max(minDvrWindow, 0);
	    };
	
	    // Determine the adaptive type - Live, DVR, or VOD
	    // Duration can be positive or negative, but minDvrWindow should always be positive
	    streamTypeUtil.streamType = function (duration, minDvrWindow) {
	        var _minDvrWindow = _.isUndefined(minDvrWindow) ? 120 : minDvrWindow;
	        var streamType = 'VOD';
	
	        if (duration === Infinity) {
	            // Live streams are always Infinity duration
	            streamType = 'LIVE';
	        } else if (duration < 0) {
	            streamType = streamTypeUtil.isDvr(duration, _minDvrWindow) ? 'DVR' : 'LIVE';
	        }
	
	        // Default option is VOD (i.e. positive or non-infinite)
	        return streamType;
	    };
	
	    return streamTypeUtil;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 26 */
/*!****************************************!*\
  !*** ./src/js/utils/quality-labels.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var _ = __webpack_require__(/*! utils/underscore */ 6);
	
	// Try and find a corresponding custom label. If there are no custom labels, create one using height, bandwidth, or both
	function generateLabel(level, qualityLabels, redundant) {
	    if (!level) {
	        return '';
	    }
	    // Flash uses bitrate instead of bandwidth
	    var bandwidth = level.bitrate || level.bandwidth;
	    // Flash, in some cases, will create its own label. Prefer it over creating a new label
	    return getCustomLabel(qualityLabels, bandwidth) || level.label || createLabel(level.height, bandwidth, redundant);
	}
	
	// Prefer creating a label with height with a fallback to bandwidth. Make a label using both if redundant
	function createLabel(height, bandwidth, redundant) {
	    if (!height && !bandwidth) {
	        return '';
	    }
	
	    var bandwidthString = toKbps(bandwidth) + ' kbps';
	    var label = bandwidthString;
	
	    if (height) {
	        label = height + 'p';
	        if (bandwidth && redundant) {
	            label += ' (' + bandwidthString + ')';
	        }
	    }
	
	    return label;
	}
	
	// Ensures that we're able to find a custom label. As long as there is at least 1 quality label and a defined
	// bandwidth, a quality label will always be found. Return null otherwise
	function getCustomLabel(qualityLabels, bandwidth) {
	    var label = null;
	    var bandwidths = _.keys(qualityLabels);
	
	    if (bandwidth && qualityLabels && bandwidths.length) {
	        var key = parseFloat(bandwidth);
	        if (!isNaN(key)) {
	            label = qualityLabels[findClosestBandwidth(bandwidths, toKbps(key))];
	        }
	    }
	
	    return label;
	}
	
	// Finds the bandwidth with the smallest difference from the target bandwidth
	function findClosestBandwidth(bandwidths, targetBandwidth) {
	    var closest = null;
	    var smallestDiff = Infinity;
	    var curDiff = void 0;
	
	    if (_.isArray(bandwidths)) {
	        _.forEach(bandwidths, function (cur) {
	            curDiff = Math.abs(cur - targetBandwidth);
	            if (curDiff < smallestDiff) {
	                closest = cur;
	                smallestDiff = curDiff;
	            }
	        });
	    }
	
	    return closest;
	}
	
	function toKbps(bandwidth) {
	    return Math.floor(bandwidth / 1000);
	}
	
	// Use an empty object as the context and populate it like a hash map
	function hasRedundantLevels(levels) {
	    if (!_.isArray(levels)) {
	        return false;
	    }
	    return _.some(levels, function (level) {
	        var key = level.height || level.bitrate || level.bandwidth;
	        var foundDuplicate = this[key];
	        this[key] = 1;
	        return foundDuplicate;
	    }, {});
	}
	
	exports.generateLabel = generateLabel;
	exports.createLabel = createLabel;
	exports.getCustomLabel = getCustomLabel;
	exports.findClosestBandwidth = findClosestBandwidth;
	exports.toKbps = toKbps;
	exports.hasRedundantLevels = hasRedundantLevels;

/***/ },
/* 27 */
/*!***********************************************!*\
  !*** ./src/js/controller/instream-adapter.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! controller/instream-html5 */ 28), __webpack_require__(/*! controller/instream-flash */ 58), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! events/states */ 31), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (InstreamHtml5, InstreamFlash, events, states, utils, Events, _) {
	
	    function chooseInstreamMethod(_model) {
	        var providerName = '';
	        var provider = _model.get('provider');
	        if (provider) {
	            providerName = provider.name;
	        }
	        if (providerName.indexOf('flash') >= 0) {
	            return InstreamFlash;
	        }
	
	        return InstreamHtml5;
	    }
	
	    var _defaultOptions = {
	        skipoffset: null,
	        tag: null
	    };
	
	    var InstreamAdapter = function InstreamAdapter(_controller, _model, _view) {
	        var InstreamMethod = chooseInstreamMethod(_model);
	        var _instream = new InstreamMethod(_controller, _model);
	
	        var _array;
	        var _arrayOptions;
	        var _arrayIndex = 0;
	        var _options = {};
	        var _oldProvider;
	        var _oldpos;
	        var _olditem;
	        var _this = this;
	
	        var _clickHandler = _.bind(function (evt) {
	            evt = evt || {};
	            evt.hasControls = !!_model.get('controls');
	
	            this.trigger(events.JWPLAYER_INSTREAM_CLICK, evt);
	
	            // toggle playback after click event
	            if (!_instream || !_instream._adModel) {
	                return;
	            }
	            if (_instream._adModel.get('state') === states.PAUSED) {
	                if (evt.hasControls) {
	                    _instream.instreamPlay();
	                }
	            } else {
	                _instream.instreamPause();
	            }
	        }, this);
	
	        var _doubleClickHandler = _.bind(function () {
	            if (!_instream || !_instream._adModel) {
	                return;
	            }
	            if (_instream._adModel.get('state') === states.PAUSED) {
	                if (_model.get('controls')) {
	                    _controller.setFullscreen();
	                    _controller.play();
	                }
	            }
	        }, this);
	
	        this.type = 'instream';
	
	        this.init = function (sharedVideoTag) {
	            // Keep track of the original player state
	            _oldProvider = _model.getVideo();
	            _oldpos = _model.get('position');
	            _olditem = _model.get('playlist')[_model.get('item')];
	            // Reset playback rate to 1 in case we reuse the video tag used to play back ad content
	            _oldProvider.setPlaybackRate(1);
	
	            _instream.on('all', _instreamForward, this);
	            _instream.on(events.JWPLAYER_MEDIA_TIME, _instreamTime, this);
	            _instream.on(events.JWPLAYER_MEDIA_COMPLETE, _instreamItemComplete, this);
	            _instream.init();
	
	            // Make sure the original player's provider stops broadcasting events (pseudo-lock...)
	            _controller.detachMedia();
	
	            _model.mediaModel.set('state', states.BUFFERING);
	
	            if (_controller.checkBeforePlay() || _oldpos === 0 && !_model.checkComplete()) {
	                // make sure video restarts after preroll
	                _oldpos = 0;
	                _model.set('preInstreamState', 'instream-preroll');
	            } else if (_oldProvider && _model.checkComplete() || _model.get('state') === states.COMPLETE) {
	                _model.set('preInstreamState', 'instream-postroll');
	            } else {
	                _model.set('preInstreamState', 'instream-midroll');
	            }
	
	            // If the player's currently playing, pause the video tag
	            var currState = _model.get('state');
	            if (!sharedVideoTag && (currState === states.PLAYING || currState === states.BUFFERING)) {
	                _oldProvider.pause();
	            }
	
	            // Show instream state instead of normal player state
	            _view.setupInstream(_instream._adModel);
	            _instream._adModel.set('state', states.BUFFERING);
	
	            // don't trigger api play/pause on display click
	            if (_view.clickHandler()) {
	                _view.clickHandler().setAlternateClickHandlers(utils.noop, null);
	            }
	
	            this.setText(_model.get('localization').loadingAd);
	            return this;
	        };
	
	        function _loadNextItem() {
	            // We want a play event for the next item, so we ensure the state != playing
	            _instream._adModel.set('state', 'buffering');
	
	            // destroy skip button
	            _model.set('skipButton', false);
	
	            _arrayIndex++;
	            var item = _array[_arrayIndex];
	            var options;
	            if (_arrayOptions) {
	                options = _arrayOptions[_arrayIndex];
	            }
	            _this.loadItem(item, options);
	        }
	
	        function _instreamForward(type, data) {
	            if (type === 'complete') {
	                return;
	            }
	            data = data || {};
	
	            if (_options.tag && !data.tag) {
	                data.tag = _options.tag;
	            }
	
	            this.trigger(type, data);
	
	            if (type === 'mediaError' || type === 'error') {
	                if (_array && _arrayIndex + 1 < _array.length) {
	                    _loadNextItem();
	                }
	            }
	        }
	
	        function _instreamTime(evt) {
	            _instream._adModel.set('duration', evt.duration);
	            _instream._adModel.set('position', evt.position);
	        }
	
	        function _instreamItemComplete(e) {
	            var data = {};
	            if (_options.tag) {
	                data.tag = _options.tag;
	            }
	            this.trigger(events.JWPLAYER_MEDIA_COMPLETE, data);
	            _instreamItemNext.call(this, e);
	        }
	
	        var _instreamItemNext = function _instreamItemNext(e) {
	            if (_array && _arrayIndex + 1 < _array.length) {
	                _loadNextItem();
	            } else {
	                // notify vast of breakEnd
	                this.trigger('adBreakEnd', {});
	                if (e.type === events.JWPLAYER_MEDIA_COMPLETE) {
	                    // Dispatch playlist complete event for ad pods
	                    this.trigger(events.JWPLAYER_PLAYLIST_COMPLETE, {});
	                }
	                this.destroy();
	            }
	        };
	
	        this.loadItem = function (item, options) {
	            if (utils.isAndroid(2.3)) {
	                this.trigger({
	                    type: events.JWPLAYER_ERROR,
	                    message: 'Error loading instream: Cannot play instream on Android 2.3'
	                });
	                return;
	            }
	            // Copy the playlist item passed in and make sure it's formatted as a proper playlist item
	            var playlist = item;
	            if (_.isArray(item)) {
	                _array = item;
	                _arrayOptions = options;
	                item = _array[_arrayIndex];
	                if (_arrayOptions) {
	                    options = _arrayOptions[_arrayIndex];
	                }
	            } else {
	                playlist = [item];
	            }
	
	            var providersManager = _model.getProviders();
	            var primary = InstreamMethod === InstreamFlash ? 'flash' : undefined;
	            var providersNeeded = providersManager.required(playlist, primary);
	
	            _model.set('hideAdsControls', false);
	            _instream._adModel.set('state', states.BUFFERING);
	            providersManager.load(providersNeeded).then(function () {
	                if (_instream === null) {
	                    return;
	                }
	                // Dispatch playlist item event for ad pods
	                _this.trigger(events.JWPLAYER_PLAYLIST_ITEM, {
	                    index: _arrayIndex,
	                    item: item
	                });
	
	                _options = _.extend({}, _defaultOptions, options);
	                _instream.load(item);
	
	                _this.addClickHandler();
	
	                var skipoffset = item.skipoffset || _options.skipoffset;
	                if (skipoffset) {
	                    _this.setupSkipButton(skipoffset, _options);
	                }
	            });
	        };
	
	        this.setupSkipButton = function (skipoffset, options, customNext) {
	            _model.set('skipButton', false);
	            if (customNext) {
	                _instreamItemNext = customNext;
	            }
	            _instream._adModel.set('skipMessage', options.skipMessage);
	            _instream._adModel.set('skipText', options.skipText);
	            _instream._adModel.set('skipOffset', skipoffset);
	            _model.set('skipButton', true);
	        };
	
	        this.applyProviderListeners = function (provider) {
	            _instream.applyProviderListeners(provider);
	
	            this.addClickHandler();
	        };
	
	        this.play = function () {
	            _instream.instreamPlay();
	        };
	
	        this.pause = function () {
	            _instream.instreamPause();
	        };
	
	        this.addClickHandler = function () {
	            // start listening for ad click
	            if (_view.clickHandler()) {
	                _view.clickHandler().setAlternateClickHandlers(_clickHandler, _doubleClickHandler);
	            }
	
	            _instream.on(events.JWPLAYER_MEDIA_META, this.metaHandler, this);
	        };
	
	        this.skipAd = function (evt) {
	            var skipAdType = events.JWPLAYER_AD_SKIPPED;
	            this.trigger(skipAdType, evt);
	            _instreamItemNext.call(this, {
	                type: skipAdType
	            });
	        };
	
	        /** Handle the JWPLAYER_MEDIA_META event **/
	        this.metaHandler = function (evt) {
	            // If we're getting video dimension metadata from the provider, allow the view to resize the media
	            if (evt.width && evt.height) {
	                _view.resizeMedia();
	            }
	        };
	
	        this.destroy = function () {
	            this.off();
	
	            _model.set('skipButton', false);
	
	            if (_instream) {
	                if (_view.clickHandler()) {
	                    _view.clickHandler().revertAlternateClickHandlers();
	                }
	
	                _model.off(null, null, _instream);
	                _instream.off(null, null, _this);
	                _instream.instreamDestroy();
	
	                // Must happen after instream.instreamDestroy()
	                _view.destroyInstream();
	
	                _instream = null;
	
	                // Re-attach the controller
	                _controller.attachMedia();
	
	                var oldMode = _model.get('preInstreamState');
	                switch (oldMode) {
	                    case 'instream-preroll':
	                    case 'instream-midroll':
	                        // On error, mediaModel has buffering states in mobile, but oldProvider's state is playing.
	                        // So, changing mediaModel's state to playing does not change provider state unless we do this
	                        if (utils.isMobile() && _model.mediaModel.get('state') === states.BUFFERING) {
	                            _oldProvider.setState(states.BUFFERING);
	                        }
	
	                        var item = _.extend({}, _olditem);
	                        item.starttime = _oldpos;
	                        _model.loadVideo(item);
	                        break;
	                    case 'instream-postroll':
	                    case 'instream-idle':
	                        _oldProvider.stop();
	                        break;
	                    default:
	                        break;
	                }
	            }
	        };
	
	        this.getState = function () {
	            if (_instream && _instream._adModel) {
	                return _instream._adModel.get('state');
	            }
	            // api expects false to know we aren't in instreamMode
	            return false;
	        };
	
	        this.setText = function (text) {
	            _view.setAltText(text ? text : '');
	        };
	
	        // This method is triggered by plugins which want to hide player controls
	        this.hide = function () {
	            _model.set('hideAdsControls', true);
	        };
	    };
	
	    _.extend(InstreamAdapter.prototype, Events);
	
	    return InstreamAdapter;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 28 */
/*!*********************************************!*\
  !*** ./src/js/controller/instream-html5.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! events/change-state-event */ 30), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! events/states */ 31), __webpack_require__(/*! controller/model */ 33)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Events, changeStateEvent, events, states, Model) {
	
	    var InstreamHtml5 = function InstreamHtml5(_controller, _model) {
	        var _adModel;
	        var _currentProvider;
	        var _this = _.extend(this, Events);
	
	        // Listen for player resize events
	        _controller.on(events.JWPLAYER_FULLSCREEN, function (data) {
	            this.trigger(events.JWPLAYER_FULLSCREEN, data);
	        }, _this);
	
	        /** ***************************************
	         *****  Public instream API methods  *****
	         *****************************************/
	
	        this.init = function () {
	            // Initialize the instream player's model copied from main player's model
	            _adModel = new Model().setup({
	                id: _model.get('id'),
	                volume: _model.get('volume'),
	                fullscreen: _model.get('fullscreen'),
	                mute: _model.get('mute') || _model.get('autostartMuted'),
	                instreamMode: true
	            });
	            _adModel.on('fullscreenchange', _nativeFullscreenHandler);
	
	            this._adModel = _adModel;
	        };
	
	        /** Load an instream item and initialize playback **/
	        _this.load = function (item) {
	
	            _adModel.set('item', 0);
	            _adModel.set('playlistItem', item);
	            // Make sure it chooses a provider
	            _adModel.setActiveItem(item);
	
	            // check provider after item change
	            _checkProvider();
	
	            // Match the main player's controls state
	            _adModel.off(events.JWPLAYER_ERROR);
	            _adModel.on(events.JWPLAYER_ERROR, function (data) {
	                this.trigger(events.JWPLAYER_ERROR, data);
	            }, _this);
	
	            // Load the instream item
	            _adModel.loadVideo(item);
	        };
	
	        _this.applyProviderListeners = function (provider) {
	            // check provider after item change
	            _checkProvider(provider);
	
	            if (!provider) {
	                return;
	            }
	
	            // Match the main player's controls state
	            provider.off(events.JWPLAYER_ERROR);
	            provider.on(events.JWPLAYER_ERROR, function (data) {
	                this.trigger(events.JWPLAYER_ERROR, data);
	            }, _this);
	            _model.on('change:volume', function (data, value) {
	                _currentProvider.volume(value);
	            }, _this);
	            _model.on('change:mute', function (data, value) {
	                _currentProvider.mute(value);
	            }, _this);
	            _model.on('change:autostartMuted', function (data, value) {
	                if (!value) {
	                    _currentProvider.mute(_model.get('mute'));
	                }
	            }, _this);
	        };
	
	        /** Stop the instream playback and revert the main player back to its original state **/
	        this.instreamDestroy = function () {
	            if (!_adModel) {
	                return;
	            }
	
	            _adModel.off();
	
	            // We don't want the instream provider to be attached to the video tag anymore
	            this.off();
	            if (_currentProvider) {
	                _currentProvider.detachMedia();
	                _currentProvider.off();
	                if (_adModel.getVideo()) {
	                    _currentProvider.destroy();
	                }
	            }
	
	            // Return the view to its normal state
	            _adModel = null;
	
	            // Remove all callbacks for 'this' for all events
	            _controller.off(null, null, this);
	            _controller = null;
	        };
	
	        /** Start instream playback **/
	        _this.instreamPlay = function () {
	            if (!_adModel.getVideo()) {
	                return;
	            }
	            _adModel.getVideo().play(true);
	        };
	
	        /** Pause instream playback **/
	        _this.instreamPause = function () {
	            if (!_adModel.getVideo()) {
	                return;
	            }
	            _adModel.getVideo().pause(true);
	        };
	
	        /** ***************************
	         ****** Private methods ******
	         *****************************/
	
	        function _checkProvider(pseudoProvider) {
	            var provider = pseudoProvider || _adModel.getVideo();
	
	            if (_currentProvider !== provider) {
	                _currentProvider = provider;
	
	                if (!provider) {
	                    return;
	                }
	
	                var isVpaidProvider = provider.type === 'vpaid';
	
	                provider.off();
	
	                provider.on('all', function (type, data) {
	                    if (isVpaidProvider && type === events.JWPLAYER_MEDIA_COMPLETE) {
	                        return;
	                    }
	                    this.trigger(type, _.extend({}, data, { type: type }));
	                }, _this);
	
	                provider.on(events.JWPLAYER_MEDIA_BUFFER_FULL, _bufferFullHandler);
	
	                provider.on(events.JWPLAYER_PLAYER_STATE, stateHandler);
	                provider.attachMedia();
	                provider.volume(_model.get('volume'));
	                provider.mute(_model.get('mute') || _model.get('autostartMuted'));
	
	                _adModel.on('change:state', changeStateEvent, _this);
	            }
	        }
	
	        function stateHandler(evt) {
	            switch (evt.newstate) {
	                case states.PLAYING:
	                case states.PAUSED:
	                    _adModel.set('state', evt.newstate);
	                    break;
	                default:
	                    break;
	            }
	        }
	
	        function _nativeFullscreenHandler(evt) {
	            _model.trigger(evt.type, evt);
	            _this.trigger(events.JWPLAYER_FULLSCREEN, {
	                fullscreen: evt.jwstate
	            });
	        }
	
	        /** Handle the JWPLAYER_MEDIA_BUFFER_FULL event **/
	        function _bufferFullHandler() {
	            _adModel.getVideo().play();
	        }
	
	        return _this;
	    };
	
	    return InstreamHtml5;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 29 */
/*!*****************************************!*\
  !*** ./src/js/utils/backbone.events.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	//     Backbone.js 1.1.2
	
	// Backbone.Events
	// ---------------
	
	// A module that can be mixed in to *any object* in order to provide it with
	// custom events. You may bind with `on` or remove with `off` callback
	// functions to an event; `trigger`-ing an event fires all callbacks in
	// succession.
	//
	//     var object = {};
	//     _.extend(object, Backbone.Events);
	//     object.on('expand', function(){ alert('expanded'); });
	//     object.trigger('expand');
	//
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	
	    var array = [];
	    // var push = array.push;
	    var slice = array.slice;
	    // var splice = array.splice;
	
	    var Events = {
	
	        // Bind an event to a `callback` function. Passing `"all"` will bind
	        // the callback to all events fired.
	        on: function on(name, callback, context) {
	            if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
	            this._events || (this._events = {});
	            var events = this._events[name] || (this._events[name] = []);
	            events.push({ callback: callback, context: context });
	            return this;
	        },
	
	        // Bind an event to only be triggered a single time. After the first time
	        // the callback is invoked, it will be removed.
	        once: function once(name, callback, context) {
	            if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
	            var self = this;
	            var once = _.once(function () {
	                self.off(name, once);
	                callback.apply(this, arguments);
	            });
	            once._callback = callback;
	            return this.on(name, once, context);
	        },
	
	        // Remove one or many callbacks. If `context` is null, removes all
	        // callbacks with that function. If `callback` is null, removes all
	        // callbacks for the event. If `name` is null, removes all bound
	        // callbacks for all events.
	        off: function off(name, callback, context) {
	            var retain, ev, events, names, i, l, j, k;
	            if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
	            if (!name && !callback && !context) {
	                this._events = void 0;
	                return this;
	            }
	            names = name ? [name] : _.keys(this._events);
	            for (i = 0, l = names.length; i < l; i++) {
	                name = names[i];
	                if (events = this._events[name]) {
	                    this._events[name] = retain = [];
	                    if (callback || context) {
	                        for (j = 0, k = events.length; j < k; j++) {
	                            ev = events[j];
	                            if (callback && callback !== ev.callback && callback !== ev.callback._callback || context && context !== ev.context) {
	                                retain.push(ev);
	                            }
	                        }
	                    }
	                    if (!retain.length) delete this._events[name];
	                }
	            }
	
	            return this;
	        },
	
	        // Trigger one or many events, firing all bound callbacks. Callbacks are
	        // passed the same arguments as `trigger` is, apart from the event name
	        // (unless you're listening on `"all"`, which will cause your callback to
	        // receive the true name of the event as the first argument).
	        trigger: function trigger(name) {
	            if (!this._events) return this;
	            var args = slice.call(arguments, 1);
	            if (!eventsApi(this, 'trigger', name, args)) return this;
	            var events = this._events[name];
	            var allEvents = this._events.all;
	            if (events) triggerEvents(events, args, this);
	            if (allEvents) triggerEvents(allEvents, arguments, this);
	            return this;
	        },
	        // This is a c/p of the above trigger method, swapping out triggerEvents for safeTriggerEvents
	        //  this will have worse performance but safely allows plugins to not wreck eachother
	        triggerSafe: function triggerSafe(name) {
	            if (!this._events) return this;
	            var args = slice.call(arguments, 1);
	            if (!eventsApi(this, 'trigger', name, args)) return this;
	            var events = this._events[name];
	            var allEvents = this._events.all;
	            if (events) safeTriggerEvents(events, args, this, name);
	            if (allEvents) safeTriggerEvents(allEvents, arguments, this, name);
	            return this;
	        }
	
	        /*
	         // Tell this object to stop listening to either specific events ... or
	         // to every object it's currently listening to.
	         stopListening: function(obj, name, callback) {
	         var listeningTo = this._listeningTo;
	         if (!listeningTo) return this;
	         var remove = !name && !callback;
	         if (!callback && typeof name === 'object') callback = this;
	         if (obj) (listeningTo = {})[obj._listenId] = obj;
	         for (var id in listeningTo) {
	         obj = listeningTo[id];
	         obj.off(name, callback, this);
	         if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
	         }
	         return this;
	         }
	         */
	
	    };
	
	    // Regular expression used to split event strings.
	    var eventSplitter = /\s+/;
	
	    // Implement fancy features of the Events API such as multiple event
	    // names `"change blur"` and jQuery-style event maps `{change: action}`
	    // in terms of the existing API.
	    var eventsApi = function eventsApi(obj, action, name, rest) {
	        if (!name) return true;
	
	        // Handle event maps.
	        if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
	            for (var key in name) {
	                obj[action].apply(obj, [key, name[key]].concat(rest));
	            }
	            return false;
	        }
	
	        // Handle space separated event names.
	        if (eventSplitter.test(name)) {
	            var names = name.split(eventSplitter);
	            for (var i = 0, l = names.length; i < l; i++) {
	                obj[action].apply(obj, [names[i]].concat(rest));
	            }
	            return false;
	        }
	
	        return true;
	    };
	
	    // A difficult-to-believe, but optimized internal dispatch function for
	    // triggering events. Tries to keep the usual cases speedy (most internal
	    // Backbone events have 3 arguments).
	    var triggerEvents = function triggerEvents(events, args, context) {
	        var ev,
	            i = -1,
	            l = events.length,
	            a1 = args[0],
	            a2 = args[1],
	            a3 = args[2];
	        switch (args.length) {
	            case 0:
	                while (++i < l) {
	                    (ev = events[i]).callback.call(ev.context || context);
	                }return;
	            case 1:
	                while (++i < l) {
	                    (ev = events[i]).callback.call(ev.context || context, a1);
	                }return;
	            case 2:
	                while (++i < l) {
	                    (ev = events[i]).callback.call(ev.context || context, a1, a2);
	                }return;
	            case 3:
	                while (++i < l) {
	                    (ev = events[i]).callback.call(ev.context || context, a1, a2, a3);
	                }return;
	            default:
	                while (++i < l) {
	                    (ev = events[i]).callback.apply(ev.context || context, args);
	                }return;
	        }
	    };
	
	    // This is a deconstruction of the above default while loop, with try/catch inserted
	    var safeTriggerEvents = function safeTriggerEvents(events, args, context, name) {
	        var ev,
	            i = -1,
	            l = events.length;
	        while (++i < l) {
	            try {
	                ev = events[i];
	                ev.callback.apply(ev.context || context, args);
	            } catch (e) {
	                console.log('Error in "' + name + '" event handler:', e);
	            }
	        }
	    };
	
	    /*
	     var listenMethods = {listenTo: 'on', listenToOnce: 'once'};
	      // Inversion-of-control versions of `on` and `once`. Tell *this* object to
	     // listen to an event in another object ... keeping track of what it's
	     // listening to.
	     _.each(listenMethods, function(implementation, method) {
	     Events[method] = function(obj, name, callback) {
	     var listeningTo = this._listeningTo || (this._listeningTo = {});
	     var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
	     listeningTo[id] = obj;
	     if (!callback && typeof name === 'object') callback = this;
	     obj[implementation](name, callback, this);
	     return this;
	     };
	     });
	     */
	
	    return Events;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 30 */
/*!*********************************************!*\
  !*** ./src/js/events/change-state-event.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! events/states */ 31)], __WEBPACK_AMD_DEFINE_RESULT__ = function (states) {
	    // The api should dispatch an idle event when the model's state changes to complete
	    // This is to avoid conflicts with the complete event and to maintain legacy event flow
	    function normalizeApiState(newstate) {
	        if (newstate === states.COMPLETE || newstate === states.ERROR) {
	            return states.IDLE;
	        }
	        return newstate;
	    }
	
	    return function ChangeStateEvent(model, newstate, oldstate) {
	        newstate = normalizeApiState(newstate);
	        oldstate = normalizeApiState(oldstate);
	        // do not dispatch idle a second time after complete
	        if (newstate !== oldstate) {
	            // buffering, playing and paused states become:
	            // buffer, play and pause events
	            var eventType = newstate.replace(/(?:ing|d)$/, '');
	            var evt = {
	                type: eventType,
	                newstate: newstate,
	                oldstate: oldstate,
	                reason: model.mediaModel.get('state')
	            };
	            // add reason for play/pause events
	            if (eventType === 'play') {
	                evt.playReason = model.get('playReason');
	            } else if (eventType === 'pause') {
	                evt.pauseReason = model.get('pauseReason');
	            }
	            this.trigger(eventType, evt);
	        }
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 31 */
/*!*********************************!*\
  !*** ./src/js/events/states.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return {
	        BUFFERING: 'buffering',
	        IDLE: 'idle',
	        COMPLETE: 'complete',
	        PAUSED: 'paused',
	        PLAYING: 'playing',
	        ERROR: 'error',
	
	        // These exist at the provider level, but are converted to BUFFERING at higher levels
	        LOADING: 'loading',
	        STALLED: 'stalled'
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 32 */
/*!*********************************!*\
  !*** ./src/js/events/events.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    var touchEvents = {
	        DRAG: 'drag',
	        DRAG_START: 'dragStart',
	        DRAG_END: 'dragEnd',
	        CLICK: 'click',
	        DOUBLE_CLICK: 'doubleClick',
	        TAP: 'tap',
	        DOUBLE_TAP: 'doubleTap',
	        OVER: 'over',
	        MOVE: 'move',
	        OUT: 'out'
	    };
	
	    var events = {
	        // Script Loaders
	        COMPLETE: 'complete',
	        ERROR: 'error',
	
	        // Ad events
	        JWPLAYER_AD_CLICK: 'adClick',
	        JWPLAYER_AD_COMPANIONS: 'adCompanions',
	        JWPLAYER_AD_COMPLETE: 'adComplete',
	        JWPLAYER_AD_ERROR: 'adError',
	        JWPLAYER_AD_IMPRESSION: 'adImpression',
	        JWPLAYER_AD_META: 'adMeta',
	        JWPLAYER_AD_PAUSE: 'adPause',
	        JWPLAYER_AD_PLAY: 'adPlay',
	        JWPLAYER_AD_SKIPPED: 'adSkipped',
	        JWPLAYER_AD_TIME: 'adTime',
	        JWPLAYER_CAST_AD_CHANGED: 'castAdChanged',
	
	        // Events
	        JWPLAYER_MEDIA_COMPLETE: 'complete',
	        JWPLAYER_READY: 'ready',
	        JWPLAYER_MEDIA_SEEK: 'seek',
	        JWPLAYER_MEDIA_BEFOREPLAY: 'beforePlay',
	        JWPLAYER_MEDIA_BEFORECOMPLETE: 'beforeComplete',
	        JWPLAYER_MEDIA_BUFFER_FULL: 'bufferFull',
	        JWPLAYER_DISPLAY_CLICK: 'displayClick',
	        JWPLAYER_PLAYLIST_COMPLETE: 'playlistComplete',
	        JWPLAYER_CAST_SESSION: 'cast',
	        JWPLAYER_MEDIA_ERROR: 'mediaError',
	        JWPLAYER_MEDIA_FIRST_FRAME: 'firstFrame',
	        JWPLAYER_MEDIA_PLAY_ATTEMPT: 'playAttempt',
	        JWPLAYER_MEDIA_LOADED: 'loaded',
	        JWPLAYER_MEDIA_SEEKED: 'seeked',
	
	        // Setup Events
	        JWPLAYER_SETUP_ERROR: 'setupError',
	
	        // Utility
	        JWPLAYER_ERROR: 'error',
	        JWPLAYER_PLAYER_STATE: 'state',
	        JWPLAYER_CAST_AVAILABLE: 'castAvailable',
	
	        // Model Changes
	        JWPLAYER_MEDIA_BUFFER: 'bufferChange',
	        JWPLAYER_MEDIA_TIME: 'time',
	        JWPLAYER_MEDIA_TYPE: 'mediaType',
	        JWPLAYER_MEDIA_VOLUME: 'volume',
	        JWPLAYER_MEDIA_MUTE: 'mute',
	        JWPLAYER_MEDIA_META: 'meta',
	        JWPLAYER_MEDIA_LEVELS: 'levels',
	        JWPLAYER_MEDIA_LEVEL_CHANGED: 'levelsChanged',
	        JWPLAYER_CONTROLS: 'controls',
	        JWPLAYER_FULLSCREEN: 'fullscreen',
	        JWPLAYER_RESIZE: 'resize',
	        JWPLAYER_PLAYLIST_ITEM: 'playlistItem',
	        JWPLAYER_PLAYLIST_LOADED: 'playlist',
	        JWPLAYER_AUDIO_TRACKS: 'audioTracks',
	        JWPLAYER_AUDIO_TRACK_CHANGED: 'audioTrackChanged',
	        JWPLAYER_PLAYBACK_RATE_CHANGED: 'playbackRateChanged',
	
	        // View Component Actions
	        JWPLAYER_LOGO_CLICK: 'logoClick',
	
	        // Model - Captions
	        JWPLAYER_CAPTIONS_LIST: 'captionsList',
	        JWPLAYER_CAPTIONS_CHANGED: 'captionsChanged',
	
	        // Provider Communication
	        JWPLAYER_PROVIDER_CHANGED: 'providerChanged',
	        JWPLAYER_PROVIDER_FIRST_FRAME: 'providerFirstFrame',
	
	        // UI Events
	        JWPLAYER_USER_ACTION: 'userAction',
	        JWPLAYER_PROVIDER_CLICK: 'providerClick',
	        JWPLAYER_VIEW_TAB_FOCUS: 'tabFocus',
	        JWPLAYER_CONTROLBAR_DRAGGING: 'scrubbing',
	        JWPLAYER_INSTREAM_CLICK: 'instreamClick',
	        JWPLAYER_BREAKPOINT: 'breakpoint'
	    };
	
	    events.touchEvents = touchEvents;
	
	    return events;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 33 */
/*!************************************!*\
  !*** ./src/js/controller/model.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! providers/providers */ 34), __webpack_require__(/*! controller/qoe */ 56), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/simplemodel */ 57), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! events/states */ 31)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, Providers, QOE, _, Events, SimpleModel, events, states) {
	
	    // Represents the state of the player
	    var Model = function Model() {
	        var _this = this;
	        var _providers;
	        var _provider;
	        var _beforecompleted = false;
	        var _attached = true;
	
	        this.mediaController = _.extend({}, Events);
	        this.mediaModel = new MediaModel();
	
	        QOE.model(this);
	
	        this.set('mediaModel', this.mediaModel);
	
	        this.setup = function (config) {
	
	            _.extend(this.attributes, config, {
	                // always start on first playlist item
	                item: 0,
	                itemMeta: {},
	                playlistItem: undefined,
	                // Initial state, upon setup
	                state: states.IDLE,
	                // Initially we don't assume Flash is needed
	                flashBlocked: false,
	                provider: undefined,
	                duration: 0,
	                position: 0,
	                buffer: 0
	            });
	
	            this.updateProviders();
	
	            return this;
	        };
	
	        this.getConfiguration = function () {
	            return _.omit(this.clone(), ['mediaModel']);
	        };
	
	        this.updateProviders = function () {
	            _providers = new Providers(this.getConfiguration());
	        };
	
	        function _videoEventHandler(type, data) {
	            var evt = _.extend({}, data, { type: type });
	            var mediaModel = this.mediaModel;
	            switch (type) {
	                case 'flashThrottle':
	                    var throttled = data.state !== 'resume';
	                    this.set('flashThrottle', throttled);
	                    this.set('flashBlocked', throttled);
	                    break;
	                case 'flashBlocked':
	                    this.set('flashBlocked', true);
	                    return;
	                case 'flashUnblocked':
	                    this.set('flashBlocked', false);
	                    return;
	                case 'volume':
	                    this.set(type, data[type]);
	                    return;
	                case 'mute':
	                    if (!this.get('autostartMuted')) {
	                        // Don't persist mute state with muted autostart
	                        this.set(type, data[type]);
	                    }
	                    return;
	                case 'ratechange':
	                    var rate = data.playbackRate;
	                    // Check if its a generally usable rate.  Shaka changes rate to 0 when pause or buffering.
	                    if (rate > 0) {
	                        this.set('playbackRate', rate);
	                    }
	                    return;
	                case events.JWPLAYER_MEDIA_TYPE:
	                    if (mediaModel.get('mediaType') !== data.mediaType) {
	                        mediaModel.set('mediaType', data.mediaType);
	                        this.mediaController.trigger(type, evt);
	                    }
	                    return;
	                case events.JWPLAYER_PLAYER_STATE:
	                    mediaModel.set('state', data.newstate);
	
	                    // This "return" is important because
	                    //  we are choosing to not propagate this event.
	                    //  Instead letting the master controller do so
	                    return;
	                case events.JWPLAYER_MEDIA_BUFFER:
	                    this.set('buffer', data.bufferPercent);
	                /* falls through */
	                case events.JWPLAYER_MEDIA_META:
	                    var duration = data.duration;
	                    if (_.isNumber(duration) && !_.isNaN(duration)) {
	                        mediaModel.set('duration', duration);
	                        this.set('duration', duration);
	                    }
	                    break;
	                case events.JWPLAYER_MEDIA_BUFFER_FULL:
	                    // media controller
	                    if (mediaModel.get('playAttempt')) {
	                        this.playVideo();
	                    } else {
	                        mediaModel.on('change:playAttempt', function () {
	                            this.playVideo();
	                        }, this);
	                    }
	                    this.setPlaybackRate(this.get('defaultPlaybackRate'));
	                    break;
	                case events.JWPLAYER_MEDIA_TIME:
	                    mediaModel.set('position', data.position);
	                    this.set('position', data.position);
	                    if (_.isNumber(data.duration)) {
	                        mediaModel.set('duration', data.duration);
	                        this.set('duration', data.duration);
	                    }
	                    break;
	                case events.JWPLAYER_PROVIDER_CHANGED:
	                    this.set('provider', _provider.getName());
	                    break;
	                case events.JWPLAYER_MEDIA_LEVELS:
	                    this.setQualityLevel(data.currentQuality, data.levels);
	                    mediaModel.set('levels', data.levels);
	                    break;
	                case events.JWPLAYER_MEDIA_LEVEL_CHANGED:
	                    this.setQualityLevel(data.currentQuality, data.levels);
	                    this.persistQualityLevel(data.currentQuality, data.levels);
	                    break;
	                case events.JWPLAYER_MEDIA_COMPLETE:
	                    _beforecompleted = true;
	                    this.mediaController.trigger(events.JWPLAYER_MEDIA_BEFORECOMPLETE, evt);
	                    if (_attached) {
	                        this.playbackComplete();
	                    }
	                    return;
	                case events.JWPLAYER_AUDIO_TRACKS:
	                    this.setCurrentAudioTrack(data.currentTrack, data.tracks);
	                    mediaModel.set('audioTracks', data.tracks);
	                    break;
	                case events.JWPLAYER_AUDIO_TRACK_CHANGED:
	                    this.setCurrentAudioTrack(data.currentTrack, data.tracks);
	                    break;
	                case 'subtitlesTrackChanged':
	                    this.persistVideoSubtitleTrack(data.currentTrack, data.tracks);
	                    break;
	                case 'visualQuality':
	                    var visualQuality = _.extend({}, data);
	                    mediaModel.set('visualQuality', visualQuality);
	                    break;
	                case 'autoplayFailed':
	                    this.set('autostartFailed', true);
	                    if (mediaModel.get('state') === states.PLAYING) {
	                        mediaModel.set('state', states.PAUSED);
	                    }
	                    break;
	                default:
	                    break;
	            }
	
	            this.mediaController.trigger(type, evt);
	        }
	
	        this.setQualityLevel = function (quality, levels) {
	            if (quality > -1 && levels.length > 1 && _provider.getName().name !== 'youtube') {
	                this.mediaModel.set('currentLevel', parseInt(quality));
	            }
	        };
	
	        this.persistQualityLevel = function (quality, levels) {
	            var currentLevel = levels[quality] || {};
	            var label = currentLevel.label;
	            this.set('qualityLabel', label);
	        };
	
	        this.setCurrentAudioTrack = function (currentTrack, tracks) {
	            if (currentTrack > -1 && tracks.length > 0 && currentTrack < tracks.length) {
	                this.mediaModel.set('currentAudioTrack', parseInt(currentTrack));
	            }
	        };
	
	        this.onMediaContainer = function () {
	            var container = this.get('mediaContainer');
	            _provider.setContainer(container);
	        };
	
	        this.changeVideoProvider = function (Provider) {
	            this.off('change:mediaContainer', this.onMediaContainer);
	
	            if (_provider) {
	                _provider.off(null, null, this);
	                if (_provider.getContainer()) {
	                    _provider.remove();
	                }
	                delete _provider.instreamMode;
	            }
	
	            if (!Provider) {
	                this.resetProvider();
	                this.set('provider', undefined);
	                return;
	            }
	
	            _provider = new Provider(_this.get('id'), _this.getConfiguration());
	
	            var container = this.get('mediaContainer');
	            if (container) {
	                _provider.setContainer(container);
	            } else {
	                this.once('change:mediaContainer', this.onMediaContainer);
	            }
	
	            if (_provider.getName().name.indexOf('flash') === -1) {
	                this.set('flashThrottle', undefined);
	                this.set('flashBlocked', false);
	            }
	
	            _provider.volume(_this.get('volume'));
	
	            // Mute the video if autostarting on mobile. Otherwise, honor the model's mute value
	            _provider.mute(this.autoStartOnMobile() || _this.get('mute'));
	
	            _provider.on('all', _videoEventHandler, this);
	
	            // Attempt setting the playback rate to be the user selected value
	            this.setPlaybackRate(this.get('defaultPlaybackRate'));
	
	            // Set playbackRate because provider support for playbackRate may have changed and not sent an update
	            this.set('playbackRate', _provider.getPlaybackRate());
	
	            if (this.get('instreamMode') === true) {
	                _provider.instreamMode = true;
	            }
	
	            this.set('renderCaptionsNatively', _provider.renderNatively);
	        };
	
	        this.checkComplete = function () {
	            return _beforecompleted;
	        };
	
	        this.detachMedia = function () {
	            _attached = false;
	            _provider.off('all', _videoEventHandler, this);
	            return _provider.detachMedia();
	        };
	
	        this.attachMedia = function () {
	            _attached = true;
	            _provider.off('all', _videoEventHandler, this);
	            _provider.on('all', _videoEventHandler, this);
	            if (_beforecompleted) {
	                this.playbackComplete();
	            }
	
	            _provider.attachMedia();
	
	            // Restore the playback rate to the provider in case it changed while detached and we reused a video tag.
	            this.setPlaybackRate(this.get('defaultPlaybackRate'));
	        };
	
	        this.playbackComplete = function () {
	            _beforecompleted = false;
	            _provider.setState(states.COMPLETE);
	            this.mediaController.trigger(events.JWPLAYER_MEDIA_COMPLETE, {});
	        };
	
	        this.destroy = function () {
	            this.off();
	            if (_provider) {
	                _provider.off(null, null, this);
	                _provider.destroy();
	            }
	        };
	
	        this.getVideo = function () {
	            return _provider;
	        };
	
	        this.setFullscreen = function (state) {
	            state = !!state;
	            if (state !== _this.get('fullscreen')) {
	                _this.set('fullscreen', state);
	            }
	        };
	
	        // Give the option for a provider to be forced
	        this.chooseProvider = function (source) {
	            // if _providers.choose is null, something went wrong in filtering
	            return _providers.choose(source).provider;
	        };
	
	        this.setItemIndex = function (index) {
	            var playlist = this.get('playlist');
	
	            // If looping past the end, or before the beginning
	            index = parseInt(index, 10) || 0;
	            index = (index + playlist.length) % playlist.length;
	
	            this.set('item', index);
	            this.set('playlistItem', playlist[index]);
	            this.setActiveItem(playlist[index]);
	        };
	
	        this.setActiveItem = function (item) {
	            // Item is actually changing
	            this.mediaModel.off();
	            this.mediaModel = new MediaModel();
	            this.set('itemMeta', {});
	            this.set('mediaModel', this.mediaModel);
	            this.set('position', item.starttime || 0);
	            this.set('minDvrWindow', item.minDvrWindow);
	            this.set('duration', item.duration && utils.seconds(item.duration) || 0);
	            this.setProvider(item);
	        };
	
	        this.setProvider = function (item) {
	            var source = item && item.sources && item.sources[0];
	            if (source === undefined) {
	                // source is undefined when resetting index with empty playlist
	                return;
	            }
	
	            var provider = this.chooseProvider(source);
	            // If we are changing video providers
	            if (!provider || !(_provider instanceof provider)) {
	                _this.changeVideoProvider(provider);
	            }
	
	            if (!_provider) {
	                return;
	            }
	
	            // this allows the providers to preload
	            if (_provider.init) {
	                _provider.init(item);
	            }
	
	            // Set the Provider after calling init because some Provider properties are only set afterwards
	            this.set('provider', _provider.getName());
	
	            // Listening for change:item won't suffice when loading the same index or file
	            // We also can't listen for change:mediaModel because it triggers whether or not
	            //  an item was actually loaded
	            this.trigger('itemReady', item);
	        };
	
	        this.getProviders = function () {
	            return _providers;
	        };
	
	        this.resetProvider = function () {
	            _provider = null;
	        };
	
	        this.setVolume = function (volume) {
	            volume = Math.round(volume);
	            this.set('volume', volume);
	            if (_provider) {
	                _provider.volume(volume);
	            }
	            var mute = volume === 0;
	            if (mute !== this.getMute()) {
	                this.setMute(mute);
	            }
	        };
	
	        this.getMute = function () {
	            return this.get('autostartMuted') || this.get('mute');
	        };
	
	        this.setMute = function (mute) {
	            if (!utils.exists(mute)) {
	                mute = !this.getMute();
	            }
	            this.set('mute', mute);
	            if (_provider) {
	                _provider.mute(mute);
	            }
	            if (!mute) {
	                var volume = Math.max(10, this.get('volume'));
	                this.set('autostartMuted', false);
	                this.setVolume(volume);
	            }
	        };
	
	        this.setStreamType = function (streamType) {
	            this.set('streamType', streamType);
	            if (streamType === 'LIVE') {
	                this.setPlaybackRate(1);
	            }
	        };
	
	        this.setPlaybackRate = function (playbackRate) {
	            if (!_attached || !_.isNumber(playbackRate)) {
	                return;
	            }
	
	            // Clamp the rate between 0.25x and 4x
	            playbackRate = utils.between(playbackRate, 0.25, 4);
	
	            if (this.get('streamType') === 'LIVE') {
	                playbackRate = 1;
	            }
	
	            this.set('defaultPlaybackRate', playbackRate);
	
	            if (_provider && _provider.setPlaybackRate) {
	                _provider.setPlaybackRate(playbackRate);
	            }
	        };
	
	        // The model is also the mediaController for now
	        this.loadVideo = function (item) {
	            if (!item) {
	                item = this.get('playlist')[this.get('item')];
	            }
	            this.set('position', item.starttime || 0);
	            this.set('duration', item.duration && utils.seconds(item.duration) || 0);
	            this.mediaModel.set('playAttempt', true);
	            this.mediaController.trigger(events.JWPLAYER_MEDIA_PLAY_ATTEMPT, { playReason: this.get('playReason') });
	
	            _provider.load(item);
	        };
	
	        this.stopVideo = function () {
	            if (_provider) {
	                _provider.stop();
	            }
	        };
	
	        this.playVideo = function () {
	            _provider.play();
	        };
	
	        this.persistCaptionsTrack = function () {
	            var track = this.get('captionsTrack');
	
	            if (track) {
	                // update preference if an option was selected
	                this.set('captionLabel', track.name);
	            } else {
	                this.set('captionLabel', 'Off');
	            }
	        };
	
	        this.setVideoSubtitleTrack = function (trackIndex, tracks) {
	            this.set('captionsIndex', trackIndex);
	            /*
	             * Tracks could have changed even if the index hasn't.
	             * Need to ensure track has data for captionsrenderer.
	             */
	            if (trackIndex && tracks && trackIndex <= tracks.length && tracks[trackIndex - 1].data) {
	                this.set('captionsTrack', tracks[trackIndex - 1]);
	            }
	
	            if (_provider && _provider.setSubtitlesTrack) {
	                _provider.setSubtitlesTrack(trackIndex);
	            }
	        };
	
	        this.persistVideoSubtitleTrack = function (trackIndex, tracks) {
	            this.setVideoSubtitleTrack(trackIndex, tracks);
	            this.persistCaptionsTrack();
	        };
	
	        function _autoStartSupportedIOS() {
	            if (!utils.isIOS()) {
	                return false;
	            }
	            // Autostart only supported in iOS 10 or higher - check if the version is 9 or less
	            return !(utils.isIOS(6) || utils.isIOS(7) || utils.isIOS(8) || utils.isIOS(9));
	        }
	
	        function platformCanAutostart() {
	            var autostartAdsIsEnabled = !_this.get('advertising') || _this.get('advertising').autoplayadsmuted;
	            var iosBrowserIsSupported = _autoStartSupportedIOS() && (utils.isSafari() || utils.isChrome() || utils.isFacebook());
	            var androidBrowserIsSupported = utils.isAndroid() && utils.isChrome();
	            var mobileBrowserIsSupported = iosBrowserIsSupported || androidBrowserIsSupported;
	            var isAndroidSdk = _this.get('sdkplatform') === 1;
	            return !_this.get('sdkplatform') && autostartAdsIsEnabled && mobileBrowserIsSupported || isAndroidSdk;
	        }
	
	        this.autoStartOnMobile = function () {
	            return this.get('autostart') && platformCanAutostart();
	        };
	
	        // Mobile players always wait to become viewable.
	        // Desktop players must have autostart set to viewable
	        this.setAutoStart = function (autoStart) {
	            if (!_.isUndefined(autoStart)) {
	                this.set('autostart', autoStart);
	            }
	
	            var autoStartOnMobile = this.autoStartOnMobile();
	            if (autoStartOnMobile) {
	                this.set('autostartMuted', true);
	            }
	            this.set('playOnViewable', autoStartOnMobile || this.get('autostart') === 'viewable');
	        };
	    };
	
	    // Represents the state of the provider/media element
	    var MediaModel = Model.MediaModel = function () {
	        this.set('state', states.IDLE);
	    };
	
	    _.extend(Model.prototype, SimpleModel);
	    _.extend(MediaModel.prototype, SimpleModel);
	
	    return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 34 */
/*!***************************************!*\
  !*** ./src/js/providers/providers.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! providers/default */ 35), __webpack_require__(/*! providers/providers-supported */ 36), __webpack_require__(/*! providers/providers-loaded */ 39), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/defaults */ 40)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Default, ProvidersSupported, ProvidersLoaded, _, defaults) {
	
	    function Providers(config) {
	        this.config = config || {};
	        this.providers = this.reorderProviders(this.config.primary);
	    }
	
	    Providers.loaders = {
	        html5: function html5(resolvePromise) {
	            __webpack_require__.e/* nsure */(1/*! provider.html5 */, function (require) {
	                var provider = __webpack_require__(/*! providers/html5 */ 41);
	                registerProvider(provider);
	                resolvePromise(provider);
	            });
	        },
	        flash: function flash(resolvePromise) {
	            __webpack_require__.e/* nsure */(3/*! provider.flash */, function (require) {
	                var provider = __webpack_require__(/*! providers/flash */ 52);
	                registerProvider(provider);
	                resolvePromise(provider);
	            });
	        },
	        youtube: function youtube(resolvePromise) {
	            __webpack_require__.e/* nsure */(4/*! provider.youtube */, function (require) {
	                var provider = __webpack_require__(/*! providers/youtube */ 54);
	                registerProvider(provider);
	                resolvePromise(provider);
	            });
	        }
	    };
	
	    var registerProvider = Providers.registerProvider = function (provider) {
	        var name = provider.getName().name;
	
	        // Only register the provider if it isn't registered already.  This is an issue on pages with multiple embeds.
	        if (ProvidersLoaded[name]) {
	            return;
	        }
	
	        // If there isn't a "supports" val for this guy
	        if (!_.find(ProvidersSupported, _.matches({ name: name }))) {
	            if (!_.isFunction(provider.supports)) {
	                throw new Error('Tried to register a provider with an invalid object');
	            }
	
	            // The most recent provider will be in the front of the array, and chosen first
	            ProvidersSupported.unshift({
	                name: name,
	                supports: provider.supports
	            });
	        }
	
	        // Fill in any missing properties with the defaults - looks at the prototype chain
	        defaults(provider.prototype, Default);
	
	        // After registration, it is loaded
	        ProvidersLoaded[name] = provider;
	    };
	
	    _.extend(Providers.prototype, {
	
	        load: function load(providersToLoad) {
	            return Promise.all(_.map(providersToLoad, function (provider) {
	                return new Promise(function (resolvePromise) {
	                    var providerLoaderMethod = Providers.loaders[provider.name];
	                    if (providerLoaderMethod) {
	                        providerLoaderMethod(resolvePromise);
	                    } else {
	                        resolvePromise();
	                    }
	                });
	            } /* unknown registered module */));
	        },
	
	        reorderProviders: function reorderProviders(primary) {
	            var providers = _.clone(ProvidersSupported);
	
	            if (primary === 'flash') {
	                var flashIdx = _.indexOf(providers, _.findWhere(providers, { name: 'flash' }));
	                var flashProvider = providers.splice(flashIdx, 1)[0];
	                var html5Idx = _.indexOf(providers, _.findWhere(providers, { name: 'html5' }));
	                providers.splice(html5Idx, 0, flashProvider);
	            }
	            return providers;
	        },
	
	        providerSupports: function providerSupports(provider, source) {
	            return provider.supports(source);
	        },
	
	        required: function required(playlist, primary) {
	            var _this = this;
	            var providers = this.reorderProviders(primary);
	
	            playlist = playlist.slice();
	            return _.compact(_.map(providers, function (provider) {
	                // remove items from copied playlist that can be played by provider
	                // remaining providers will be checked against any remaining items
	                // provider will be loaded if there are matches
	                var loadProvider = false;
	                for (var i = playlist.length; i--;) {
	                    var item = playlist[i];
	                    var supported = _this.providerSupports(provider, item.sources[0]);
	                    if (supported) {
	                        playlist.splice(i, 1);
	                    }
	                    loadProvider = loadProvider || supported;
	                }
	                if (loadProvider) {
	                    return provider;
	                }
	            }));
	        },
	
	        // Find the name of the first provider which can support the media source-type
	        choose: function choose(source) {
	            // prevent throw on missing source
	            source = _.isObject(source) ? source : {};
	
	            var count = this.providers.length;
	            for (var i = 0; i < count; i++) {
	                var provider = this.providers[i];
	                if (this.providerSupports(provider, source)) {
	                    // prefer earlier providers
	                    var priority = count - i - 1;
	
	                    return {
	                        priority: priority,
	                        name: provider.name,
	                        type: source.type,
	                        providerToCheck: provider,
	                        // If provider isn't loaded, this will be undefined
	                        provider: ProvidersLoaded[provider.name]
	                    };
	                }
	            }
	
	            return null;
	        }
	    });
	
	    return Providers;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 35 */
/*!*************************************!*\
  !*** ./src/js/providers/default.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! events/states */ 31), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, events, states, _) {
	
	    var noop = utils.noop;
	    var returnFalse = _.constant(false);
	
	    var DefaultProvider = {
	        // This function is required to determine if a provider can work on a given source
	        supports: returnFalse,
	
	        // Basic playback features
	        play: noop,
	        load: noop,
	        stop: noop,
	        volume: noop,
	        mute: noop,
	        seek: noop,
	        resize: noop,
	        remove: noop, // removes from page
	        destroy: noop, // frees memory
	
	        setVisibility: noop,
	        setFullscreen: returnFalse,
	        getFullscreen: noop,
	
	        // If setContainer has been set, this returns the element.
	        //  It's value is used to determine if we should remove the <video> element when setting a new provider.
	        getContainer: noop,
	
	        // Sets the parent element, causing provider to append <video> into it
	        setContainer: returnFalse,
	
	        getName: noop,
	        getQualityLevels: noop,
	        getCurrentQuality: noop,
	        setCurrentQuality: noop,
	
	        getAudioTracks: noop,
	        getCurrentAudioTrack: noop,
	        setCurrentAudioTrack: noop,
	
	        setPlaybackRate: noop,
	        getPlaybackRate: function getPlaybackRate() {
	            return 1;
	        },
	
	        // TODO :: The following are targets for removal after refactoring
	        checkComplete: noop,
	        setControls: noop,
	        attachMedia: noop,
	        detachMedia: noop,
	
	        setState: function setState(state) {
	            var oldState = this.state || states.IDLE;
	            this.state = state;
	
	            if (state === oldState) {
	                return;
	            }
	
	            this.trigger(events.JWPLAYER_PLAYER_STATE, {
	                newstate: state
	            });
	        },
	
	        sendMediaType: function sendMediaType(levels) {
	            var type = levels[0].type;
	            var isAudioFile = type === 'oga' || type === 'aac' || type === 'mp3' || type === 'mpeg' || type === 'vorbis';
	
	            this.trigger(events.JWPLAYER_MEDIA_TYPE, {
	                mediaType: isAudioFile ? 'audio' : 'video'
	            });
	        }
	    };
	
	    // Make available to other providers for extending
	    return DefaultProvider;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 36 */
/*!*************************************************!*\
  !*** ./src/js/providers/providers-supported.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! providers/html5-android-hls */ 37), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/video */ 38)], __WEBPACK_AMD_DEFINE_RESULT__ = function (getIsAndroidHLS, utils, _, video) {
	
	    var SupportsMatrix = [{
	        name: 'youtube',
	        supports: function supports(source) {
	            return utils.isYouTube(source.file, source.type);
	        }
	    }, {
	        name: 'html5',
	        supports: function supports(source) {
	            var MimeTypes = {
	                aac: 'audio/mp4',
	                mp4: 'video/mp4',
	                f4v: 'video/mp4',
	                m4v: 'video/mp4',
	                mov: 'video/mp4',
	                mp3: 'audio/mpeg',
	                mpeg: 'audio/mpeg',
	                ogv: 'video/ogg',
	                ogg: 'video/ogg',
	                oga: 'video/ogg',
	                vorbis: 'video/ogg',
	                webm: 'video/webm',
	                // The following are not expected to work in Chrome
	                f4a: 'video/aac',
	                m3u8: 'application/vnd.apple.mpegurl',
	                m3u: 'application/vnd.apple.mpegurl',
	                hls: 'application/vnd.apple.mpegurl'
	            };
	
	            var file = source.file;
	            var type = source.type;
	
	            var isAndroidHLS = getIsAndroidHLS(source);
	            if (isAndroidHLS !== null) {
	                return isAndroidHLS;
	            }
	
	            // Ensure RTMP files are not seen as videos
	            if (utils.isRtmp(file, type)) {
	                return false;
	            }
	
	            // Not OK to use HTML5 with no extension
	            if (!MimeTypes[type]) {
	                return false;
	            }
	
	            // Last, but not least, we ask the browser
	            // (But only if it's a video with an extension known to work in HTML5)
	            if (video.canPlayType) {
	                var result = video.canPlayType(MimeTypes[type]);
	                return !!result;
	            }
	            return false;
	        }
	    }, {
	        name: 'flash',
	        supports: function supports(source) {
	            var flashExtensions = {
	                flv: 'video',
	                f4v: 'video',
	                mov: 'video',
	                m4a: 'video',
	                m4v: 'video',
	                mp4: 'video',
	                aac: 'video',
	                f4a: 'video',
	                mp3: 'sound',
	                mpeg: 'sound',
	                smil: 'rtmp'
	            };
	            var PLAYABLE = _.keys(flashExtensions);
	            if (!utils.isFlashSupported()) {
	                return false;
	            }
	
	            var file = source.file;
	            var type = source.type;
	
	            if (utils.isRtmp(file, type)) {
	                return true;
	            }
	
	            return _.contains(PLAYABLE, type);
	        }
	    }];
	
	    return SupportsMatrix;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 37 */
/*!***********************************************!*\
  !*** ./src/js/providers/html5-android-hls.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/browser */ 13)], __WEBPACK_AMD_DEFINE_RESULT__ = function (browser) {
	
	    return function getIsAndroidHLS(source) {
	        if (source.type === 'hls') {
	            if (source.androidhls === false && browser.isAndroid()) {
	                return false;
	            }
	            // When androidhls is not set to false, allow HLS playback on Android 4.1 and up
	            var isAndroidNative = browser.isAndroidNative;
	            if (isAndroidNative(2) || isAndroidNative(3) || isAndroidNative('4.0')) {
	                return false;
	            } else if (browser.isAndroid() && !browser.isFF()) {
	                // skip canPlayType check
	                // canPlayType returns '' in native browser even though HLS will play
	                return true;
	            }
	        }
	        return null;
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 38 */
/*!*******************************!*\
  !*** ./src/js/utils/video.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return document.createElement('video');
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 39 */
/*!**********************************************!*\
  !*** ./src/js/providers/providers-loaded.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    // Any providers required here will be bundled in jwplayer.js embed
	    //  because they are commented out, html5 and flash js will be split into seperate files starting in 7.5.0
	    // 'providers/html5',
	    // 'providers/flash'
	], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	
	    return {
	        // html5: html5,
	        // flash: flash
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 40 */
/*!**********************************!*\
  !*** ./src/js/utils/defaults.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	    // Adds properties to the first object from the rest
	    // Does not add properties which exist anywhere in the object or it's prototype chain (no shadowing, no overriding)
	    return function Defaults(obj) {
	        _.each(Array.prototype.slice.call(arguments, 1), function (source) {
	            if (source) {
	                for (var prop in source) {
	                    if (!(prop in obj)) {
	                        obj[prop] = source[prop];
	                    }
	                }
	            }
	        });
	        return obj;
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */
/*!********************************************!*\
  !*** ./src/js/controller/tracks-loader.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! parsers/parsers */ 45), __webpack_require__(/*! parsers/captions/srt */ 46), __webpack_require__(/*! parsers/captions/dfxp */ 47), __webpack_require__(/*! parsers/captions/vttcue */ 48)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, utils, parsers, srt, dfxp, VTTCue) {
	    var tracksLoader = {};
	
	    tracksLoader.loadFile = function (track, successHandler, errorHandler) {
	        track.xhr = utils.ajax(track.file, function (xhr) {
	            xhrSuccess.call(tracksLoader, xhr, track, successHandler, errorHandler);
	        }, errorHandler);
	    };
	
	    tracksLoader.cancelXhr = function (tracks) {
	        _.each(tracks, function (track) {
	            var xhr = track.xhr;
	            if (xhr) {
	                xhr.onload = null;
	                xhr.onreadystatechange = null;
	                xhr.onerror = null;
	                if ('abort' in xhr) {
	                    xhr.abort();
	                }
	            }
	            delete track.xhr;
	        });
	    };
	
	    tracksLoader.convertToVTTCues = function (cues) {
	        // VTTCue is available natively or polyfilled where necessary
	        // TODO: if there's no window object, polyfill this
	        var vttCues = _.map(cues, function (cue) {
	            return new VTTCue(cue.begin, cue.end, cue.text);
	        });
	        return vttCues;
	    };
	
	    function xhrSuccess(xhr, track, successHandler, errorHandler) {
	        var xmlRoot = xhr.responseXML ? xhr.responseXML.firstChild : null;
	        var cues;
	        var vttCues;
	
	        // IE9 sets the firstChild element to the root <xml> tag
	        if (xmlRoot) {
	            if (parsers.localName(xmlRoot) === 'xml') {
	                xmlRoot = xmlRoot.nextSibling;
	            }
	            // Ignore all comments
	            while (xmlRoot.nodeType === xmlRoot.COMMENT_NODE) {
	                xmlRoot = xmlRoot.nextSibling;
	            }
	        }
	
	        try {
	            if (xmlRoot && parsers.localName(xmlRoot) === 'tt') {
	                // parse dfxp track
	                cues = dfxp(xhr.responseXML);
	                vttCues = this.convertToVTTCues(cues);
	                delete track.xhr;
	                successHandler(vttCues);
	            } else {
	                // parse VTT/SRT track
	                var responseText = xhr.responseText;
	
	                // TODO: parse SRT with using vttParser and deprecate srt module
	                if (responseText.indexOf('WEBVTT') >= 0) {
	                    // make VTTCues from VTT track
	                    parseCuesFromText(responseText, track, successHandler, errorHandler);
	                } else {
	                    // make VTTCues from SRT track
	                    cues = srt(responseText);
	                    vttCues = this.convertToVTTCues(cues);
	                    delete track.xhr;
	                    successHandler(vttCues);
	                }
	            }
	        } catch (error) {
	            delete track.xhr;
	            errorHandler(error);
	        }
	    }
	
	    function parseCuesFromText(text, track, successHandler, errorHandler) {
	        __webpack_require__.e/* nsure */(2/*! vttparser */, function (require) {
	            var VTTParser = __webpack_require__(/*! ../parsers/captions/vttparser */ 49);
	            var parser = new VTTParser(window);
	            var vttCues = [];
	            parser.oncue = function (cue) {
	                vttCues.push(cue);
	            };
	
	            parser.onflush = function () {
	                delete track.xhr;
	                successHandler(vttCues);
	            };
	
	            try {
	                // Parse calls onflush internally
	                parser.parse(text);
	            } catch (error) {
	                delete track.xhr;
	                errorHandler(error);
	            }
	        });
	    }
	
	    return tracksLoader;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 45 */
/*!***********************************!*\
  !*** ./src/js/parsers/parsers.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/strings */ 12)], __WEBPACK_AMD_DEFINE_RESULT__ = function (strings) {
	    return {
	        localName: function localName(node) {
	            var localName = '';
	            if (node) {
	                if (node.localName) {
	                    localName = node.localName;
	                } else if (node.baseName) {
	                    localName = node.baseName;
	                }
	            }
	            return localName;
	        },
	        textContent: function textContent(node) {
	            var textContent = '';
	
	            if (node) {
	                if (node.textContent) {
	                    textContent = strings.trim(node.textContent);
	                } else if (node.text) {
	                    textContent = strings.trim(node.text);
	                }
	            }
	
	            return textContent;
	        },
	        getChildNode: function getChildNode(parent, index) {
	            return parent.childNodes[index];
	        },
	        numChildren: function numChildren(parent) {
	            if (parent.childNodes) {
	                return parent.childNodes.length;
	            }
	            return 0;
	        }
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 46 */
/*!****************************************!*\
  !*** ./src/js/parsers/captions/srt.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/strings */ 12)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, strings) {
	    // Component that loads and parses an SRT file
	    var _seconds = utils.seconds;
	
	    return function Srt(data) {
	        // Trim whitespace and split the list by returns.
	        var _captions = [];
	        data = strings.trim(data);
	        var list = data.split('\r\n\r\n');
	        if (list.length === 1) {
	            list = data.split('\n\n');
	        }
	
	        for (var i = 0; i < list.length; i++) {
	            if (list[i] === 'WEBVTT') {
	                continue;
	            }
	            // Parse each entry
	            var entry = _entry(list[i]);
	            if (entry.text) {
	                _captions.push(entry);
	            }
	        }
	
	        return _captions;
	    };
	
	    /** Parse a single captions entry. **/
	    function _entry(data) {
	        var entry = {};
	        var array = data.split('\r\n');
	        if (array.length === 1) {
	            array = data.split('\n');
	        }
	        var idx = 1;
	        if (array[0].indexOf(' --> ') > 0) {
	            idx = 0;
	        }
	        if (array.length > idx + 1 && array[idx + 1]) {
	            // This line contains the start and end.
	            var line = array[idx];
	            var index = line.indexOf(' --> ');
	            if (index > 0) {
	                entry.begin = _seconds(line.substr(0, index));
	                entry.end = _seconds(line.substr(index + 5));
	                // Remaining lines contain the text
	                entry.text = array.slice(idx + 1).join('\r\n');
	            }
	        }
	        return entry;
	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 47 */
/*!*****************************************!*\
  !*** ./src/js/parsers/captions/dfxp.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/strings */ 12)], __WEBPACK_AMD_DEFINE_RESULT__ = function (strings) {
	    // Component that loads and parses an DFXP file
	    var _seconds = strings.seconds;
	
	    return function Dfxp(xmlDoc) {
	        validate(xmlDoc);
	        var _captions = [];
	        var paragraphs = xmlDoc.getElementsByTagName('p');
	        // Default frameRate is 30
	        var frameRate = 30;
	        var tt = xmlDoc.getElementsByTagName('tt');
	        if (tt && tt[0]) {
	            var parsedFrameRate = parseFloat(tt[0].getAttribute('ttp:frameRate'));
	            if (!isNaN(parsedFrameRate)) {
	                frameRate = parsedFrameRate;
	            }
	        }
	        validate(paragraphs);
	        if (!paragraphs.length) {
	            paragraphs = xmlDoc.getElementsByTagName('tt:p');
	            if (!paragraphs.length) {
	                paragraphs = xmlDoc.getElementsByTagName('tts:p');
	            }
	        }
	
	        for (var i = 0; i < paragraphs.length; i++) {
	            var p = paragraphs[i];
	
	            var breaks = p.getElementsByTagName('br');
	            for (var j = 0; j < breaks.length; j++) {
	                var b = breaks[j];
	                b.parentNode.replaceChild(xmlDoc.createTextNode('\r\n'), b);
	            }
	
	            var rawText = p.innerHTML || p.textContent || p.text || '';
	            var text = strings.trim(rawText).replace(/>\s+</g, '><').replace(/(<\/?)tts?:/g, '$1').replace(/<br.*?\/>/g, '\r\n');
	            if (text) {
	                var begin = p.getAttribute('begin');
	                var dur = p.getAttribute('dur');
	                var end = p.getAttribute('end');
	
	                var entry = {
	                    begin: _seconds(begin, frameRate),
	                    text: text
	                };
	                if (end) {
	                    entry.end = _seconds(end, frameRate);
	                } else if (dur) {
	                    entry.end = entry.begin + _seconds(dur, frameRate);
	                }
	                _captions.push(entry);
	            }
	        }
	        if (!_captions.length) {
	            parseError();
	        }
	        return _captions;
	    };
	
	    function validate(object) {
	        if (!object) {
	            parseError();
	        }
	    }
	
	    function parseError() {
	        throw new Error('Invalid DFXP file');
	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 48 */
/*!*******************************************!*\
  !*** ./src/js/parsers/captions/vttcue.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	/**
	 * Copyright 2013 vtt.js Contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	
	    if (window.VTTCue) {
	        return window.VTTCue;
	    }
	
	    var autoKeyword = 'auto';
	    var directionSetting = {
	        '': true,
	        lr: true,
	        rl: true
	    };
	    var alignSetting = {
	        start: true,
	        middle: true,
	        end: true,
	        left: true,
	        right: true
	    };
	
	    function findDirectionSetting(value) {
	        if (typeof value !== 'string') {
	            return false;
	        }
	        var dir = directionSetting[value.toLowerCase()];
	        return dir ? value.toLowerCase() : false;
	    }
	
	    function findAlignSetting(value) {
	        if (typeof value !== 'string') {
	            return false;
	        }
	        var align = alignSetting[value.toLowerCase()];
	        return align ? value.toLowerCase() : false;
	    }
	
	    function VTTCue(startTime, endTime, text) {
	        var cue = this;
	
	        /**
	         * Shim implementation specific properties. These properties are not in
	         * the spec.
	         */
	
	        // Lets us know when the VTTCue's data has changed in such a way that we need
	        // to recompute its display state. This lets us compute its display state
	        // lazily.
	        cue.hasBeenReset = false;
	
	        /**
	         * VTTCue and TextTrackCue properties
	         * http://dev.w3.org/html5/webvtt/#vttcue-interface
	         */
	
	        var _id = '';
	        var _pauseOnExit = false;
	        var _startTime = startTime;
	        var _endTime = endTime;
	        var _text = text;
	        var _region = null;
	        var _vertical = '';
	        var _snapToLines = true;
	        var _line = 'auto';
	        var _lineAlign = 'start';
	        var _position = 50;
	        var _positionAlign = 'middle';
	        var _size = 50;
	        var _align = 'middle';
	
	        Object.defineProperty(cue, 'id', {
	            enumerable: true,
	            get: function get() {
	                return _id;
	            },
	            set: function set(value) {
	                _id = '' + value;
	            }
	        });
	
	        Object.defineProperty(cue, 'pauseOnExit', {
	            enumerable: true,
	            get: function get() {
	                return _pauseOnExit;
	            },
	            set: function set(value) {
	                _pauseOnExit = !!value;
	            }
	        });
	
	        Object.defineProperty(cue, 'startTime', {
	            enumerable: true,
	            get: function get() {
	                return _startTime;
	            },
	            set: function set(value) {
	                if (typeof value !== 'number') {
	                    throw new TypeError('Start time must be set to a number.');
	                }
	                _startTime = value;
	                this.hasBeenReset = true;
	            }
	        });
	
	        Object.defineProperty(cue, 'endTime', {
	            enumerable: true,
	            get: function get() {
	                return _endTime;
	            },
	            set: function set(value) {
	                if (typeof value !== 'number') {
	                    throw new TypeError('End time must be set to a number.');
	                }
	                _endTime = value;
	                this.hasBeenReset = true;
	            }
	        });
	
	        Object.defineProperty(cue, 'text', {
	            enumerable: true,
	            get: function get() {
	                return _text;
	            },
	            set: function set(value) {
	                _text = '' + value;
	                this.hasBeenReset = true;
	            }
	        });
	
	        Object.defineProperty(cue, 'region', {
	            enumerable: true,
	            get: function get() {
	                return _region;
	            },
	            set: function set(value) {
	                _region = value;
	                this.hasBeenReset = true;
	            }
	        });
	
	        Object.defineProperty(cue, 'vertical', {
	            enumerable: true,
	            get: function get() {
	                return _vertical;
	            },
	            set: function set(value) {
	                var setting = findDirectionSetting(value);
	                // Have to check for false because the setting an be an empty string.
	                if (setting === false) {
	                    throw new SyntaxError('An invalid or illegal string was specified.');
	                }
	                _vertical = setting;
	                this.hasBeenReset = true;
	            }
	        });
	
	        Object.defineProperty(cue, 'snapToLines', {
	            enumerable: true,
	            get: function get() {
	                return _snapToLines;
	            },
	            set: function set(value) {
	                _snapToLines = !!value;
	                this.hasBeenReset = true;
	            }
	        });
	
	        Object.defineProperty(cue, 'line', {
	            enumerable: true,
	            get: function get() {
	                return _line;
	            },
	            set: function set(value) {
	                if (typeof value !== 'number' && value !== autoKeyword) {
	                    throw new SyntaxError('An invalid number or illegal string was specified.');
	                }
	                _line = value;
	                this.hasBeenReset = true;
	            }
	        });
	
	        Object.defineProperty(cue, 'lineAlign', {
	            enumerable: true,
	            get: function get() {
	                return _lineAlign;
	            },
	            set: function set(value) {
	                var setting = findAlignSetting(value);
	                if (!setting) {
	                    throw new SyntaxError('An invalid or illegal string was specified.');
	                }
	                _lineAlign = setting;
	                this.hasBeenReset = true;
	            }
	        });
	
	        Object.defineProperty(cue, 'position', {
	            enumerable: true,
	            get: function get() {
	                return _position;
	            },
	            set: function set(value) {
	                if (value < 0 || value > 100) {
	                    throw new Error('Position must be between 0 and 100.');
	                }
	                _position = value;
	                this.hasBeenReset = true;
	            }
	        });
	
	        Object.defineProperty(cue, 'positionAlign', {
	            enumerable: true,
	            get: function get() {
	                return _positionAlign;
	            },
	            set: function set(value) {
	                var setting = findAlignSetting(value);
	                if (!setting) {
	                    throw new SyntaxError('An invalid or illegal string was specified.');
	                }
	                _positionAlign = setting;
	                this.hasBeenReset = true;
	            }
	        });
	
	        Object.defineProperty(cue, 'size', {
	            enumerable: true,
	            get: function get() {
	                return _size;
	            },
	            set: function set(value) {
	                if (value < 0 || value > 100) {
	                    throw new Error('Size must be between 0 and 100.');
	                }
	                _size = value;
	                this.hasBeenReset = true;
	            }
	        });
	
	        Object.defineProperty(cue, 'align', {
	            enumerable: true,
	            get: function get() {
	                return _align;
	            },
	            set: function set(value) {
	                var setting = findAlignSetting(value);
	                if (!setting) {
	                    throw new SyntaxError('An invalid or illegal string was specified.');
	                }
	                _align = setting;
	                this.hasBeenReset = true;
	            }
	        });
	
	        /**
	         * Other <track> spec defined properties
	         */
	
	        // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html#text-track-cue-display-state
	        cue.displayState = undefined;
	    }
	
	    /**
	     * VTTCue methods
	     */
	
	    VTTCue.prototype.getCueAsHTML = function () {
	        // Assume WebVTT.convertCueToDOMTree is on the global.
	        var WebVTT = window.WebVTT;
	        return WebVTT.convertCueToDOMTree(window, this.text);
	    };
	
	    return VTTCue;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 49 */,
/* 50 */
/*!********************************************!*\
  !*** ./src/js/controller/tracks-helper.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return {
	        createId: function createId(track, tracksCount) {
	            var trackId;
	            var prefix = track.kind || 'cc';
	            if (track.default || track.defaulttrack) {
	                trackId = 'default';
	            } else {
	                trackId = track._id || track.file || prefix + tracksCount;
	            }
	            return trackId;
	        },
	        createLabel: function createLabel(track, unknownCount) {
	            var label = track.label || track.name || track.language;
	            if (!label) {
	                label = 'Unknown CC';
	                unknownCount += 1;
	                if (unknownCount > 1) {
	                    label += ' [' + unknownCount + ']';
	                }
	            }
	            return { label: label, unknownCount: unknownCount };
	        }
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 51 */,
/* 52 */,
/* 53 */
/*!**********************************!*\
  !*** ./src/js/utils/embedswf.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, Events, _) {
	
	    // Defaults
	    var BGCOLOR = '#000000';
	
	    function appendParam(object, name, value) {
	        var param = document.createElement('param');
	        param.setAttribute('name', name);
	        param.setAttribute('value', value);
	        object.appendChild(param);
	    }
	
	    function addGetter(obj, property, value) {
	        Object.defineProperty(obj, property, {
	            get: function get() {
	                return value;
	            }
	        });
	    }
	
	    function embed(swfUrl, container, id, wmode) {
	        var swf;
	        var queueCommands = true;
	
	        wmode = wmode || 'opaque';
	
	        if (utils.isMSIE()) {
	            // IE9 works best with outerHTML
	            var temp = document.createElement('div');
	            container.appendChild(temp);
	
	            temp.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + ' width="100%" height="100%" id="' + id + '" name="' + id + '" tabindex="0">' + '<param name="movie" value="' + swfUrl + '">' + '<param name="allowfullscreen" value="true">' + '<param name="allowscriptaccess" value="always">' + '<param name="wmode" value="' + wmode + '">' + '<param name="bgcolor" value="' + BGCOLOR + '">' + '<param name="menu" value="false">' + '</object>';
	
	            var objectElements = container.getElementsByTagName('object');
	            for (var i = objectElements.length; i--;) {
	                if (objectElements[i].id === id) {
	                    swf = objectElements[i];
	                }
	            }
	        } else {
	            swf = document.createElement('object');
	            swf.setAttribute('type', 'application/x-shockwave-flash');
	            swf.setAttribute('data', swfUrl);
	            swf.setAttribute('width', '100%');
	            swf.setAttribute('height', '100%');
	            swf.setAttribute('bgcolor', BGCOLOR);
	            swf.setAttribute('id', id);
	            swf.setAttribute('name', id);
	
	            appendParam(swf, 'allowfullscreen', 'true');
	            appendParam(swf, 'allowscriptaccess', 'always');
	            appendParam(swf, 'wmode', wmode);
	            appendParam(swf, 'menu', 'false');
	
	            container.appendChild(swf, container);
	        }
	
	        swf.className = 'jw-swf jw-reset';
	        swf.style.display = 'block';
	        swf.style.position = 'absolute';
	        swf.style.left = 0;
	        swf.style.right = 0;
	        swf.style.top = 0;
	        swf.style.bottom = 0;
	        if (utils.isIE() && 'PointerEvent' in window) {
	            swf.style.pointerEvents = 'none';
	        }
	
	        // flash can trigger events
	        var processEventsTimeout = -1;
	        addGetter(swf, 'on', Events.on);
	        addGetter(swf, 'once', Events.once);
	        addGetter(swf, '_eventQueue', []);
	        addGetter(swf, 'off', function () {
	            var args = Array.prototype.slice.call(arguments);
	            if (!args.length) {
	                swf._eventQueue.length = 0;
	                clearTimeout(processEventsTimeout);
	            }
	            return Events.off.apply(swf, args);
	        });
	        addGetter(swf, 'trigger', function (type, json) {
	            var eventQueue = swf._eventQueue;
	            eventQueue.push({ type: type, json: json });
	            if (processEventsTimeout > -1) {
	                return;
	            }
	            processEventsTimeout = setTimeout(function () {
	                var length = eventQueue.length;
	                processEventsTimeout = -1;
	                while (length--) {
	                    var event = eventQueue.shift();
	                    if (event.json) {
	                        var data = JSON.parse(decodeURIComponent(event.json));
	                        Events.trigger.call(swf, event.type, data);
	                    } else {
	                        Events.trigger.call(swf, event.type);
	                    }
	                }
	            });
	        });
	        addGetter(swf, '_events', {});
	
	        // javascript can trigger SwfEventRouter callbacks
	        addGetter(swf, 'triggerFlash', function (name) {
	            if (name === 'setupCommandQueue') {
	                queueCommands = false;
	            }
	
	            if (name !== 'setup' && queueCommands || !swf.__externalCall) {
	                var commandQueue = swf.__commandQueue;
	                // remove any earlier commands with the same name
	                for (var j = commandQueue.length; j--;) {
	                    if (commandQueue[j][0] === name) {
	                        commandQueue.splice(j, 1);
	                    }
	                }
	                commandQueue.push(Array.prototype.slice.call(arguments));
	                return swf;
	            }
	
	            var args = Array.prototype.slice.call(arguments, 1);
	            var status = utils.tryCatch(function () {
	                if (args.length) {
	                    // remove any nodes from arguments
	                    // cyclical structures cannot be converted to JSON
	                    for (var k = args.length; k--;) {
	                        if (_typeof(args[k]) === 'object') {
	                            _.each(args[k], deleteHTMLElement);
	                        }
	                    }
	                    var json = JSON.stringify(args);
	                    swf.__externalCall(name, json);
	                } else {
	                    swf.__externalCall(name);
	                }
	            });
	
	            if (status instanceof utils.Error) {
	                console.error(name, status);
	                if (name === 'setup') {
	                    status.name = 'Failed to setup flash';
	                    return status;
	                }
	            }
	            return swf;
	        });
	
	        // commands are queued when __externalCall is not available
	        addGetter(swf, '__commandQueue', []);
	
	        return swf;
	    }
	
	    function remove(swf) {
	        if (swf && swf.parentNode) {
	            swf.style.display = 'none';
	            swf.parentNode.removeChild(swf);
	            swf = null;
	        }
	    }
	
	    function deleteHTMLElement(value, prop, object) {
	        if (value instanceof window.HTMLElement) {
	            delete object[prop];
	        }
	    }
	
	    return {
	        embed: embed,
	        remove: remove
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 54 */,
/* 55 */
/*!**************************************!*\
  !*** ./src/js/utils/scriptloader.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! events/events */ 32), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (events, Events, _) {
	    var _loaders = {};
	
	    var STATUS = {
	        NEW: 0,
	        LOADING: 1,
	        ERROR: 2,
	        COMPLETE: 3
	    };
	
	    var scriptloader = function scriptloader(url, isStyle) {
	        var _this = _.extend(this, Events);
	        var _status = STATUS.NEW;
	
	        // legacy support
	        this.addEventListener = this.on;
	        this.removeEventListener = this.off;
	
	        function _sendError(evt) {
	            _status = STATUS.ERROR;
	            _this.trigger(events.ERROR, evt);
	        }
	
	        function _sendComplete(evt) {
	            _status = STATUS.COMPLETE;
	            _this.trigger(events.COMPLETE, evt);
	        }
	
	        this.makeStyleLink = function (styleUrl) {
	            var link = document.createElement('link');
	            link.type = 'text/css';
	            link.rel = 'stylesheet';
	            link.href = styleUrl;
	            return link;
	        };
	        this.makeScriptTag = function (scriptUrl) {
	            var scriptTag = document.createElement('script');
	            scriptTag.src = scriptUrl;
	            return scriptTag;
	        };
	
	        this.makeTag = isStyle ? this.makeStyleLink : this.makeScriptTag;
	
	        this.load = function () {
	            // Only execute on the first run
	            if (_status !== STATUS.NEW) {
	                return;
	            }
	
	            // If we already have a scriptloader loading the same script, don't create a new one;
	            var sameLoader = _loaders[url];
	            if (sameLoader) {
	                _status = sameLoader.getStatus();
	                if (_status < 2) {
	                    // dispatch to this instances listeners when the first loader gets updates
	                    sameLoader.on(events.ERROR, _sendError);
	                    sameLoader.on(events.COMPLETE, _sendComplete);
	                    return;
	                }
	                // already errored or loaded... keep going?
	            }
	
	            var head = document.getElementsByTagName('head')[0] || document.documentElement;
	            var scriptTag = this.makeTag(url);
	
	            var done = false;
	            scriptTag.onload = scriptTag.onreadystatechange = function (evt) {
	                if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
	                    done = true;
	                    _sendComplete(evt);
	
	                    // Handle memory leak in IE
	                    scriptTag.onload = scriptTag.onreadystatechange = null;
	                    if (head && scriptTag.parentNode && !isStyle) {
	                        head.removeChild(scriptTag);
	                    }
	                }
	            };
	            scriptTag.onerror = _sendError;
	
	            head.insertBefore(scriptTag, head.firstChild);
	
	            _status = STATUS.LOADING;
	            _loaders[url] = this;
	        };
	
	        this.getStatus = function () {
	            return _status;
	        };
	    };
	
	    scriptloader.loaderstatus = STATUS;
	
	    return scriptloader;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 56 */
/*!**********************************!*\
  !*** ./src/js/controller/qoe.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/timer */ 22), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Timer, _) {
	
	    // Copied from events.js until we can export individual constants with ES6
	    var JWPLAYER_PLAYLIST_ITEM = 'playlistItem';
	    var JWPLAYER_MEDIA_PLAY_ATTEMPT = 'playAttempt';
	    var JWPLAYER_PROVIDER_FIRST_FRAME = 'providerFirstFrame';
	    var JWPLAYER_MEDIA_FIRST_FRAME = 'firstFrame';
	    var JWPLAYER_MEDIA_TIME = 'time';
	
	    var TAB_HIDDEN = 'tabHidden';
	    var TAB_VISIBLE = 'tabVisible';
	
	    // This is to provide a first frame event even when
	    //  a provider does not give us one.
	    var onTimeIncreasesGenerator = function onTimeIncreasesGenerator(callback) {
	        var lastVal = 0;
	        return function (evt) {
	            var pos = evt.position;
	            if (pos > lastVal) {
	                callback();
	            }
	            // sometimes the number will wrap around (ie 100 down to 0)
	            //  so always update
	            lastVal = pos;
	        };
	    };
	
	    function unbindFirstFrameEvents(model) {
	        model.mediaController.off(JWPLAYER_MEDIA_PLAY_ATTEMPT, model._onPlayAttempt);
	        model.mediaController.off(JWPLAYER_PROVIDER_FIRST_FRAME, model._triggerFirstFrame);
	        model.mediaController.off(JWPLAYER_MEDIA_TIME, model._onTime);
	        model.off('change:activeTab', model._onTabVisible);
	    }
	
	    function trackFirstFrame(model) {
	        if (model._onTabVisible) {
	            unbindFirstFrameEvents(model);
	        }
	
	        // When it occurs, send the event, and unbind all listeners
	        model._triggerFirstFrame = _.once(function () {
	            var qoeItem = model._qoeItem;
	            qoeItem.tick(JWPLAYER_MEDIA_FIRST_FRAME);
	
	            var time = qoeItem.getFirstFrame();
	            model.mediaController.trigger(JWPLAYER_MEDIA_FIRST_FRAME, { loadTime: time });
	            unbindFirstFrameEvents(model);
	        });
	
	        model._onTime = onTimeIncreasesGenerator(model._triggerFirstFrame);
	
	        model._onPlayAttempt = function () {
	            model._qoeItem.tick(JWPLAYER_MEDIA_PLAY_ATTEMPT);
	        };
	
	        // track visibility change
	        model._onTabVisible = function (modelChanged, activeTab) {
	            if (activeTab) {
	                model._qoeItem.tick(TAB_VISIBLE);
	            } else {
	                model._qoeItem.tick(TAB_HIDDEN);
	            }
	        };
	
	        model.on('change:activeTab', model._onTabVisible);
	        model.mediaController.on(JWPLAYER_MEDIA_PLAY_ATTEMPT, model._onPlayAttempt);
	        model.mediaController.once(JWPLAYER_PROVIDER_FIRST_FRAME, model._triggerFirstFrame);
	        model.mediaController.on(JWPLAYER_MEDIA_TIME, model._onTime);
	    }
	
	    function initModel(initialModel) {
	        function onMediaModel(model, mediaModel, oldMediaModel) {
	            // finish previous item
	            if (model._qoeItem && oldMediaModel) {
	                model._qoeItem.end(oldMediaModel.get('state'));
	            }
	            // reset item level qoe
	            model._qoeItem = new Timer();
	            model._qoeItem.getFirstFrame = function () {
	                var time = this.between(JWPLAYER_MEDIA_PLAY_ATTEMPT, JWPLAYER_MEDIA_FIRST_FRAME);
	                // If time between the tab becoming visible and first frame is valid
	                // and less than the time since play attempt, play was not attempted until the tab became visible
	                var timeActive = this.between(TAB_VISIBLE, JWPLAYER_MEDIA_FIRST_FRAME);
	                if (timeActive > 0 && timeActive < time) {
	                    return timeActive;
	                }
	                return time;
	            };
	            model._qoeItem.tick(JWPLAYER_PLAYLIST_ITEM);
	            model._qoeItem.start(mediaModel.get('state'));
	
	            trackFirstFrame(model);
	
	            mediaModel.on('change:state', function (changeMediaModel, newstate, oldstate) {
	                model._qoeItem.end(oldstate);
	                model._qoeItem.start(newstate);
	            });
	        }
	
	        initialModel.on('change:mediaModel', onMediaModel);
	    }
	
	    return {
	        model: initModel
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 57 */
/*!*************************************!*\
  !*** ./src/js/utils/simplemodel.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/backbone.events */ 29)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Events) {
	    return _.extend({
	        get: function get(attr) {
	            this.attributes = this.attributes || {};
	            return this.attributes[attr];
	        },
	        set: function set(attr, val) {
	            this.attributes = this.attributes || {};
	
	            if (this.attributes[attr] === val) {
	                return;
	            }
	            var oldVal = this.attributes[attr];
	            this.attributes[attr] = val;
	            this.trigger('change:' + attr, this, val, oldVal);
	        },
	        clone: function clone() {
	            return _.clone(this.attributes);
	        },
	        change: function change(name, callback, context) {
	            var _this = this;
	
	            name.split(' ').forEach(function (handlerName) {
	                // Register a change handler and immediately invoke the callback with the current value
	                var eventName = 'change:' + handlerName;
	                var currentVal = _this.get(handlerName);
	
	                _this.on(eventName, callback, context);
	                callback.call(context, _this, currentVal, currentVal);
	            });
	
	            return this;
	        }
	    }, Events);
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 58 */
/*!*********************************************!*\
  !*** ./src/js/controller/instream-flash.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! controller/model */ 33), __webpack_require__(/*! events/change-state-event */ 30), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! events/states */ 31), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Events, Model, changeStateEvent, events, states, utils, _) {
	
	    var InstreamFlash = function InstreamFlash(_controller, _model) {
	        this.model = _model;
	
	        this._adModel = new Model().setup({
	            id: _model.get('id'),
	            volume: _model.get('volume'),
	            fullscreen: _model.get('fullscreen'),
	            mute: _model.get('mute')
	        });
	
	        this._adModel.on('change:state', changeStateEvent, this);
	
	        var container = _controller.getContainer();
	        this.swf = container.querySelector('object');
	    };
	
	    InstreamFlash.prototype = _.extend({
	
	        init: function init() {
	            // Pause playback when throttled, and only resume is paused here
	            if (utils.isChrome()) {
	                var _throttleTimeout = -1;
	                var _throttlePaused = false;
	                this.swf.on('throttle', function (e) {
	                    clearTimeout(_throttleTimeout);
	
	                    if (e.state === 'resume') {
	                        if (_throttlePaused) {
	                            _throttlePaused = false;
	                            this.instreamPlay();
	                        }
	                    } else {
	                        var _this = this;
	                        _throttleTimeout = setTimeout(function () {
	                            if (_this._adModel.get('state') === states.PLAYING) {
	                                _throttlePaused = true;
	                                _this.instreamPause();
	                            }
	                        }, 250);
	                    }
	                }, this);
	            }
	
	            this.swf.on('instream:state', this.stateHandler, this).on('instream:time', function (evt) {
	                this._adModel.set('position', evt.position);
	                this._adModel.set('duration', evt.duration);
	                this.trigger(events.JWPLAYER_MEDIA_TIME, evt);
	            }, this).on('instream:complete', function (evt) {
	                this.trigger(events.JWPLAYER_MEDIA_COMPLETE, evt);
	            }, this).on('instream:error', function (evt) {
	                this.trigger(events.JWPLAYER_MEDIA_ERROR, evt);
	            }, this);
	
	            this.swf.triggerFlash('instream:init');
	
	            this.applyProviderListeners = function (provider) {
	                if (!provider) {
	                    return;
	                }
	                this.model.on('change:volume', function (data, value) {
	                    provider.volume(value);
	                }, this);
	                this.model.on('change:mute', function (data, value) {
	                    provider.mute(value);
	                }, this);
	
	                provider.volume(this.model.get('volume'));
	                provider.mute(this.model.get('mute'));
	
	                // update admodel state when set from googima
	                provider.off();
	                provider.on(events.JWPLAYER_PLAYER_STATE, this.stateHandler, this);
	
	                // trigger time evemt when sent from freewheel
	                provider.on(events.JWPLAYER_MEDIA_TIME, function (data) {
	                    this.trigger(events.JWPLAYER_MEDIA_TIME, data);
	                }, this);
	            };
	        },
	
	        stateHandler: function stateHandler(evt) {
	            switch (evt.newstate) {
	                case states.PLAYING:
	                case states.PAUSED:
	                    this._adModel.set('state', evt.newstate);
	                    break;
	                default:
	                    break;
	            }
	        },
	
	        instreamDestroy: function instreamDestroy() {
	            if (!this._adModel) {
	                return;
	            }
	
	            this.off();
	
	            this.swf.off(null, null, this);
	            this.swf.triggerFlash('instream:destroy');
	            this.swf = null;
	
	            this._adModel.off();
	            this._adModel = null;
	
	            this.model = null;
	        },
	
	        load: function load(item) {
	            // Show the instream layer
	            this.swf.triggerFlash('instream:load', item);
	        },
	
	        instreamPlay: function instreamPlay() {
	            this.swf.triggerFlash('instream:play');
	        },
	
	        instreamPause: function instreamPause() {
	            this.swf.triggerFlash('instream:pause');
	        }
	
	    }, Events);
	
	    return InstreamFlash;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 59 */
/*!************************************!*\
  !*** ./src/js/controller/Setup.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! controller/setup-steps */ 60), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! events/events */ 32)], __WEBPACK_AMD_DEFINE_RESULT__ = function (SetupSteps, Events, _, events) {
	    var Setup = function Setup(_api, _model, _view, _setPlaylist) {
	        var _this = this;
	        var _setupFailureTimeout;
	        var _queue = SetupSteps.getQueue();
	        var _errorTimeoutSeconds = 30;
	
	        this.start = function () {
	            _setupFailureTimeout = setTimeout(_setupTimeoutHandler, _errorTimeoutSeconds * 1000);
	            _nextTask();
	        };
	
	        this.destroy = function () {
	            clearTimeout(_setupFailureTimeout);
	            this.off();
	            _queue.length = 0;
	            _api = null;
	            _model = null;
	            _view = null;
	        };
	
	        function _setupTimeoutHandler() {
	            _error('Setup Timeout Error', 'Setup took longer than ' + _errorTimeoutSeconds + ' seconds to complete.');
	        }
	
	        function _nextTask() {
	            for (var taskName in _queue) {
	                if (Object.prototype.hasOwnProperty.call(_queue, taskName)) {
	                    var c = _queue[taskName];
	                    if (!c.complete && !c.running && _api && _allComplete(c.depends)) {
	                        c.running = true;
	                        callTask(c);
	                    }
	                }
	            }
	        }
	
	        function callTask(task) {
	            var resolve = function resolve(resolveState) {
	                resolveState = resolveState || {};
	                _taskComplete(task, resolveState);
	            };
	
	            task.method(resolve, _model, _api, _view, _setPlaylist);
	        }
	
	        function _allComplete(dependencies) {
	            // return true if empty array,
	            //  or if each object has an attribute 'complete' which is true
	            return _.all(dependencies, function (name) {
	                return _queue[name].complete;
	            });
	        }
	
	        function _taskComplete(task, resolveState) {
	            if (resolveState.type === 'error') {
	                _error(resolveState.msg, resolveState.reason);
	            } else if (resolveState.type === 'complete') {
	                clearTimeout(_setupFailureTimeout);
	                _this.trigger(events.JWPLAYER_READY);
	            } else {
	                task.complete = true;
	                _nextTask();
	            }
	        }
	
	        function _error(message, reason) {
	            clearTimeout(_setupFailureTimeout);
	            _this.trigger(events.JWPLAYER_SETUP_ERROR, {
	                message: message + ': ' + reason
	            });
	            _this.destroy();
	        }
	    };
	
	    Setup.prototype = Events;
	
	    return Setup;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 60 */
/*!******************************************!*\
  !*** ./src/js/controller/setup-steps.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! plugins/plugins */ 61), __webpack_require__(/*! playlist/loader */ 66), __webpack_require__(/*! utils/scriptloader */ 55), __webpack_require__(/*! utils/embedswf */ 53), __webpack_require__(/*! utils/constants */ 20), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! controller/controls-loader */ 73)], __WEBPACK_AMD_DEFINE_RESULT__ = function (plugins, PlaylistLoader, ScriptLoader, EmbedSwf, Constants, _, utils, events, ControlsLoader) {
	
	    var _pluginLoader;
	    var _playlistLoader;
	
	    function getQueue() {
	        var Components = {
	            LOAD_PROMISE_POLYFILL: {
	                method: _loadPromisePolyfill,
	                depends: []
	            },
	            LOAD_BASE64_POLYFILL: {
	                method: _loadBase64Polyfill,
	                depends: []
	            },
	            LOAD_PLUGINS: {
	                method: _loadPlugins,
	                // Plugins require JavaScript Promises
	                depends: ['LOAD_PROMISE_POLYFILL']
	            },
	            LOAD_XO_POLYFILL: {
	                method: _loadIntersectionObserverPolyfill,
	                depends: []
	            },
	            LOAD_SKIN: {
	                method: _loadSkin,
	                depends: []
	            },
	            LOAD_PLAYLIST: {
	                method: _loadPlaylist,
	                depends: []
	            },
	            LOAD_CONTROLS: {
	                method: _loadControls,
	                depends: ['LOAD_PROMISE_POLYFILL']
	            },
	            SETUP_VIEW: {
	                method: _setupView,
	                depends: ['LOAD_SKIN', 'LOAD_XO_POLYFILL', 'LOAD_PROMISE_POLYFILL']
	            },
	            INIT_PLUGINS: {
	                method: _initPlugins,
	                depends: ['LOAD_PLUGINS',
	                // Plugins require jw-overlays to setup
	                'SETUP_VIEW']
	            },
	            CHECK_FLASH: {
	                method: _checkFlash,
	                depends: ['SETUP_VIEW']
	            },
	            FILTER_PLAYLIST: {
	                method: _filterPlaylist,
	                depends: ['LOAD_PLAYLIST', 'CHECK_FLASH']
	            },
	            SET_ITEM: {
	                method: _setPlaylistItem,
	                depends: ['INIT_PLUGINS', 'FILTER_PLAYLIST']
	            },
	            DEFERRED: {
	                method: _deferred,
	                depends: []
	            },
	            SEND_READY: {
	                method: _sendReady,
	                depends: ['LOAD_CONTROLS', 'SET_ITEM', 'DEFERRED']
	            }
	        };
	
	        return Components;
	    }
	
	    function _deferred(resolve) {
	        setTimeout(resolve, 0);
	    }
	
	    function _loadPromisePolyfill(resolve) {
	        if (!window.Promise) {
	            __webpack_require__.e/* nsure */(6/*! polyfills.promise */, function (require) {
	                __webpack_require__(/*! polyfills/promise */ 108);
	                resolve();
	            });
	        } else {
	            resolve();
	        }
	    }
	
	    function _loadBase64Polyfill(resolve) {
	        if (!window.btoa || !window.atob) {
	            __webpack_require__.e/* nsure */(7/*! polyfills.base64 */, function (require) {
	                __webpack_require__(/*! polyfills/base64 */ 109);
	                resolve();
	            });
	        } else {
	            resolve();
	        }
	    }
	
	    function _loadIntersectionObserverPolyfill(resolve) {
	        if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
	            resolve();
	        } else {
	            __webpack_require__.e/* nsure */(8/*! polyfills.intersection-observer */, function (require) {
	                __webpack_require__(/*! intersection-observer */ 110);
	                resolve();
	            });
	        }
	    }
	
	    function _loadPlugins(resolve, _model) {
	        window.jwplayerPluginJsonp = plugins.registerPlugin;
	        _pluginLoader = plugins.loadPlugins(_model.get('id'), _model.get('plugins'));
	        _pluginLoader.on(events.COMPLETE, resolve);
	        _pluginLoader.on(events.ERROR, _.partial(_pluginsError, resolve));
	        _pluginLoader.load();
	    }
	
	    function _initPlugins(resolve, _model, _api) {
	        delete window.jwplayerPluginJsonp;
	        _pluginLoader.setupPlugins(_api, _model);
	        resolve();
	    }
	
	    function _pluginsError(resolve, evt) {
	        error(resolve, 'Could not load plugin', evt.message);
	    }
	
	    function _loadPlaylist(resolve, _model) {
	        var playlist = _model.get('playlist');
	        if (_.isString(playlist)) {
	            _playlistLoader = new PlaylistLoader();
	            _playlistLoader.on(events.JWPLAYER_PLAYLIST_LOADED, function (data) {
	                _model.attributes.feedData = data;
	                _model.attributes.playlist = data.playlist;
	                resolve();
	            });
	            _playlistLoader.on(events.JWPLAYER_ERROR, _.partial(_playlistError, resolve));
	            _playlistLoader.load(playlist);
	        } else {
	            resolve();
	        }
	    }
	
	    function _checkFlash(resolve, _model, _api, _view) {
	        var primaryFlash = _model.get('primary') === 'flash';
	        var flashVersion = utils.flashVersion();
	        if (primaryFlash && flashVersion) {
	            var embedTimeout;
	            var done = function done() {
	                if (embedTimeout === -1) {
	                    return;
	                }
	                clearTimeout(embedTimeout);
	                embedTimeout = -1;
	                setTimeout(function () {
	                    EmbedSwf.remove(mediaContainer.querySelector('#' + flashHealthCheckId));
	                    resolve();
	                }, 0);
	            };
	            var failed = function failed() {
	                _model.set('primary', undefined);
	                _model.updateProviders();
	                done();
	            };
	            var viewContainer = _view.element();
	            var mediaContainer = viewContainer.querySelector('.jw-media');
	            if (!viewContainer.parentElement) {
	                // Cannot perform test when player container has no parent
	                failed();
	            }
	            var flashHealthCheckId = '' + _model.get('id') + '-' + Math.random().toString(16).substr(2);
	            var flashHealthCheckSwf = _model.get('flashloader');
	            Object.defineProperty(EmbedSwf.embed(flashHealthCheckSwf, mediaContainer, flashHealthCheckId, null), 'embedCallback', {
	                get: function get() {
	                    return done;
	                }
	            });
	            // If "flash.loader.swf" does not fire embedCallback in time, unset primary "flash" config option
	            embedTimeout = setTimeout(failed, 3000);
	        } else {
	            resolve();
	        }
	    }
	
	    function _filterPlaylist(resolve, _model, _api, _view, _setPlaylist) {
	        // Performs filtering
	        var success = _setPlaylist(_model.get('playlist'), _model.get('feedData'));
	
	        if (success) {
	            resolve();
	        } else {
	            _playlistError(resolve);
	        }
	    }
	
	    function _playlistError(resolve, evt) {
	        if (evt && evt.message) {
	            error(resolve, 'Error loading playlist', evt.message);
	        } else {
	            error(resolve, 'Error loading player', 'No playable sources found');
	        }
	    }
	
	    function skinToLoad(skin, base) {
	        var skinPath;
	
	        if (_.contains(Constants.SkinsLoadable, skin)) {
	            skinPath = base + 'skins/' + skin + '.css';
	        }
	
	        return skinPath;
	    }
	
	    function isSkinLoaded(skinPath) {
	        var ss = document.styleSheets;
	        for (var i = 0, max = ss.length; i < max; i++) {
	            if (ss[i].href === skinPath) {
	                return true;
	            }
	        }
	        return false;
	    }
	
	    function _loadSkin(resolve, _model) {
	        var skinName = _model.get('skin');
	        var skinUrl = _model.get('skinUrl');
	
	        // If skin is built into player, there is nothing to load
	        if (_.contains(Constants.SkinsIncluded, skinName)) {
	            resolve();
	            return;
	        }
	
	        if (!skinUrl) {
	            // if a user doesn't specify a url, we assume it comes from our CDN or config.base
	            skinUrl = skinToLoad(skinName, _model.get('base'));
	        }
	
	        if (_.isString(skinUrl) && !isSkinLoaded(skinUrl)) {
	            _model.set('skin-loading', true);
	
	            var isStylesheet = true;
	            var loader = new ScriptLoader(skinUrl, isStylesheet);
	
	            loader.addEventListener(events.COMPLETE, function () {
	                _model.set('skin-loading', false);
	            });
	            loader.addEventListener(events.ERROR, function () {
	                _model.set('skin', 'seven'); // fall back to seven skin
	                _model.set('skin-loading', false);
	            });
	
	            loader.load();
	        }
	
	        // Control elements are hidden by the loading flag until it is ready
	        resolve();
	    }
	
	    function _setupView(resolve, _model, _api, _view) {
	        _model.setAutoStart();
	        _view.setup();
	        resolve();
	    }
	
	    function _setPlaylistItem(resolve, _model) {
	        _model.once('itemReady', resolve);
	        _model.setItemIndex(_model.get('item'));
	    }
	
	    function _sendReady(resolve) {
	        resolve({
	            type: 'complete'
	        });
	    }
	
	    function _loadControls(resolve, _model, _api, _view) {
	        if (!_model.get('controls')) {
	            resolve();
	            return;
	        }
	
	        ControlsLoader.load().then(function (Controls) {
	            _view.setControlsModule(Controls);
	            resolve();
	        }).catch(function (reason) {
	            error(resolve, 'Failed to load controls', reason);
	        });
	    }
	
	    function error(resolve, msg, reason) {
	        resolve({
	            type: 'error',
	            msg: msg,
	            reason: reason
	        });
	    }
	
	    return {
	        getQueue: getQueue,
	        error: error
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 61 */
/*!***********************************!*\
  !*** ./src/js/plugins/plugins.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! plugins/loader */ 62), __webpack_require__(/*! plugins/model */ 64), __webpack_require__(/*! plugins/plugin */ 65), __webpack_require__(/*! plugins/utils */ 63)], __WEBPACK_AMD_DEFINE_RESULT__ = function (PluginsLoader, PluginsModel, Plugin, pluginsUtils) {
	
	    var _plugins = {};
	    var _pluginLoaders = {};
	
	    var loadPlugins = function loadPlugins(id, config) {
	        _pluginLoaders[id] = new PluginsLoader(new PluginsModel(_plugins), config);
	        return _pluginLoaders[id];
	    };
	
	    var registerPlugin = function registerPlugin(id, target, arg1, arg2) {
	        var pluginId = pluginsUtils.getPluginName(id);
	        if (!_plugins[pluginId]) {
	            _plugins[pluginId] = new Plugin(id);
	        }
	        _plugins[pluginId].registerPlugin(id, target, arg1, arg2);
	    };
	
	    return {
	        loadPlugins: loadPlugins,
	        registerPlugin: registerPlugin
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 62 */
/*!**********************************!*\
  !*** ./src/js/plugins/loader.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! plugins/utils */ 63), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/scriptloader */ 55)], __WEBPACK_AMD_DEFINE_RESULT__ = function (pluginsUtils, utils, events, Events, _, scriptloader) {
	
	    function _addToPlayerGenerator(_api, pluginInstance, div) {
	        return function () {
	            var overlaysElement = _api.getContainer().getElementsByClassName('jw-overlays')[0];
	
	            // This should probably be an error
	            if (!overlaysElement) {
	                return;
	            }
	
	            div.left = overlaysElement.style.left;
	            div.top = overlaysElement.style.top;
	            overlaysElement.appendChild(div);
	
	            pluginInstance.displayArea = overlaysElement;
	        };
	    }
	
	    function _pluginResizeGenerator(pluginInstance) {
	        function resize() {
	            var displayarea = pluginInstance.displayArea;
	            if (displayarea) {
	                pluginInstance.resize(displayarea.clientWidth, displayarea.clientHeight);
	            }
	        }
	        return function () {
	            resize();
	            // Sometimes a mobile device may trigger resize before the new sizes are finalized
	            setTimeout(resize, 400);
	        };
	    }
	
	    var PluginLoader = function PluginLoader(model, _config) {
	        var _this = _.extend(this, Events);
	        var _status = scriptloader.loaderstatus.NEW;
	        var _iscomplete = false;
	        var _pluginCount = _.size(_config);
	        var _pluginLoaded;
	        var _destroyed = false;
	
	        /*
	         * Plugins can be loaded by multiple players on the page, but all of them use
	         * the same plugin model singleton. This creates a race condition because
	         * multiple players are creating and triggering loads, which could complete
	         * at any time. We could have some really complicated logic that deals with
	         * this by checking the status when it's created and / or having the loader
	         * redispatch its current status on load(). Rather than do this, we just check
	         * for completion after all of the plugins have been created. If all plugins
	         * have been loaded by the time checkComplete is called, then the loader is
	         * done and we fire the complete event. If there are new loads, they will
	         * arrive later, retriggering the completeness check and triggering a complete
	         * to fire, if necessary.
	         */
	        function _complete() {
	            if (!_iscomplete) {
	                _iscomplete = true;
	                _status = scriptloader.loaderstatus.COMPLETE;
	                _this.trigger(events.COMPLETE);
	            }
	        }
	
	        // This is not entirely efficient, but it's simple
	        function _checkComplete() {
	            // Since we do not remove event listeners on pluginObj when destroying
	            if (_destroyed) {
	                return;
	            }
	            if (!_config || _.keys(_config).length === 0) {
	                _complete();
	            }
	            if (!_iscomplete) {
	                var plugins = model.getPlugins();
	                _pluginLoaded = _.after(_pluginCount, _complete);
	                _.each(_config, function (value, plugin) {
	                    var pluginName = pluginsUtils.getPluginName(plugin);
	                    var pluginObj = plugins[pluginName];
	                    var js = pluginObj.getJS();
	                    var target = pluginObj.getTarget();
	                    var status = pluginObj.getStatus();
	
	                    if (status === scriptloader.loaderstatus.LOADING || status === scriptloader.loaderstatus.NEW) {
	                        return;
	                    } else if (js && !utils.versionCheck(target)) {
	                        _this.trigger(events.ERROR, {
	                            message: 'Incompatible player version'
	                        });
	                    }
	                    _pluginLoaded();
	                });
	            }
	        }
	
	        function _pluginError(e) {
	            // Since we do not remove event listeners on pluginObj when destroying
	            if (_destroyed) {
	                return;
	            }
	            var message = 'File not found';
	            if (e.url) {
	                utils.log(message, e.url);
	            }
	            this.off();
	            this.trigger(events.ERROR, {
	                message: message
	            });
	            _checkComplete();
	        }
	
	        this.setupPlugins = function (api, playerModel) {
	            var flashPlugins = [];
	            var plugins = model.getPlugins();
	
	            var pluginsConfig = playerModel.get('plugins');
	            _.each(pluginsConfig, function (config, plugin) {
	                var pluginName = pluginsUtils.getPluginName(plugin);
	                var pluginObj = plugins[pluginName];
	                var flashPath = pluginObj.getFlashPath();
	                var jsPlugin = pluginObj.getJS();
	                var pluginURL = pluginObj.getURL();
	
	                if (flashPath) {
	                    var flashPluginConfig = _.extend({
	                        name: pluginName,
	                        swf: flashPath,
	                        pluginmode: pluginObj.getPluginmode()
	                    }, config);
	                    flashPlugins.push(flashPluginConfig);
	                }
	
	                var status = utils.tryCatch(function () {
	                    if (jsPlugin) {
	                        var pluginConfig = pluginsConfig[pluginURL];
	
	                        if (!pluginConfig) {
	                            utils.log('JW Plugin already loaded', pluginName, pluginURL);
	                            return;
	                        }
	
	                        var div = document.createElement('div');
	                        div.id = api.id + '_' + pluginName;
	                        div.className = 'jw-plugin jw-reset';
	
	                        var pluginOptions = _.extend({}, pluginConfig);
	                        var pluginInstance = pluginObj.getNewInstance(api, pluginOptions, div);
	
	                        pluginInstance.addToPlayer = _addToPlayerGenerator(api, pluginInstance, div);
	                        pluginInstance.resizeHandler = _pluginResizeGenerator(pluginInstance);
	
	                        api.addPlugin(pluginName, pluginInstance, div);
	                    }
	                });
	
	                if (status instanceof utils.Error) {
	                    utils.log('ERROR: Failed to load ' + pluginName + '.');
	                }
	            });
	
	            playerModel.set('flashPlugins', flashPlugins);
	        };
	
	        this.load = function () {
	            // Must be a hash map
	            if (utils.exists(_config) && utils.typeOf(_config) !== 'object') {
	                _checkComplete();
	                return;
	            }
	
	            _status = scriptloader.loaderstatus.LOADING;
	
	            /** First pass to create the plugins and add listeners **/
	            _.each(_config, function (value, pluginUrl) {
	                if (utils.exists(pluginUrl)) {
	                    var pluginObj = model.addPlugin(pluginUrl);
	                    pluginObj.on(events.COMPLETE, _checkComplete);
	                    pluginObj.on(events.ERROR, _pluginError);
	                }
	            });
	
	            var plugins = model.getPlugins();
	
	            /** Second pass to actually load the plugins **/
	            _.each(plugins, function (pluginObj) {
	                // Plugin object ensures that it's only loaded once
	                pluginObj.load();
	            });
	
	            // Make sure we're not hanging around waiting for plugins that already finished loading
	            _checkComplete();
	        };
	
	        this.destroy = function () {
	            _destroyed = true;
	            this.off();
	        };
	
	        this.getStatus = function () {
	            return _status;
	        };
	    };
	
	    return PluginLoader;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 63 */
/*!*********************************!*\
  !*** ./src/js/plugins/utils.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/strings */ 12)], __WEBPACK_AMD_DEFINE_RESULT__ = function (strings) {
	
	    var utils = {};
	
	    /**
	     * Types of plugin paths
	     */
	    var _pluginPathType = utils.pluginPathType = {
	        ABSOLUTE: 0,
	        RELATIVE: 1,
	        CDN: 2
	    };
	
	    utils.getPluginPathType = function (path) {
	        if (typeof path !== 'string') {
	            return;
	        }
	        path = path.split('?')[0];
	        var protocol = path.indexOf('://');
	        if (protocol > 0) {
	            return _pluginPathType.ABSOLUTE;
	        }
	        var folder = path.indexOf('/');
	        var extension = strings.extension(path);
	        if (protocol < 0 && folder < 0 && (!extension || !isNaN(extension))) {
	            return _pluginPathType.CDN;
	        }
	        return _pluginPathType.RELATIVE;
	    };
	
	    /**
	     * Extracts a plugin name from a string
	     */
	    utils.getPluginName = function (pluginName) {
	        /** Regex locates the characters after the last slash, until it encounters a dash. **/
	        return pluginName.replace(/^(.*\/)?([^-]*)-?.*\.(swf|js)$/, '$2');
	    };
	
	    /**
	     * Extracts a plugin version from a string
	     */
	    utils.getPluginVersion = function (pluginName) {
	        return pluginName.replace(/[^-]*-?([^\.]*).*$/, '$1');
	    };
	
	    return utils;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 64 */
/*!*********************************!*\
  !*** ./src/js/plugins/model.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! plugins/utils */ 63), __webpack_require__(/*! plugins/plugin */ 65)], __WEBPACK_AMD_DEFINE_RESULT__ = function (pluginsUtils, Plugin) {
	
	    var PluginModel = function PluginModel(plugins) {
	        this.addPlugin = function (url) {
	            var pluginName = pluginsUtils.getPluginName(url);
	            if (!plugins[pluginName]) {
	                plugins[pluginName] = new Plugin(url);
	            }
	            return plugins[pluginName];
	        };
	
	        this.getPlugins = function () {
	            return plugins;
	        };
	    };
	
	    return PluginModel;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 65 */
/*!**********************************!*\
  !*** ./src/js/plugins/plugin.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! plugins/utils */ 63), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/scriptloader */ 55), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, pluginsUtils, events, Events, Scriptloader, _) {
	
	    var pluginmodes = {
	        FLASH: 0,
	        JAVASCRIPT: 1,
	        HYBRID: 2
	    };
	
	    var Plugin = function Plugin(url) {
	        var _this = _.extend(this, Events);
	        var _status = Scriptloader.loaderstatus.NEW;
	        var _flashPath;
	        var _js;
	        var _target;
	        var _completeTimeout;
	
	        function getJSPath() {
	            switch (pluginsUtils.getPluginPathType(url)) {
	                case pluginsUtils.pluginPathType.ABSOLUTE:
	                    return url;
	                case pluginsUtils.pluginPathType.RELATIVE:
	                    return utils.getAbsolutePath(url, window.location.href);
	                default:
	                    break;
	            }
	        }
	
	        function completeHandler() {
	            _.defer(function () {
	                _status = Scriptloader.loaderstatus.COMPLETE;
	                _this.trigger(events.COMPLETE);
	            });
	        }
	
	        function errorHandler() {
	            _status = Scriptloader.loaderstatus.ERROR;
	            _this.trigger(events.ERROR, { url: url });
	        }
	
	        this.load = function () {
	            if (_status !== Scriptloader.loaderstatus.NEW) {
	                return;
	            }
	            if (url.lastIndexOf('.swf') > 0) {
	                _flashPath = url;
	                _status = Scriptloader.loaderstatus.COMPLETE;
	                _this.trigger(events.COMPLETE);
	                return;
	            }
	            if (pluginsUtils.getPluginPathType(url) === pluginsUtils.pluginPathType.CDN) {
	                _status = Scriptloader.loaderstatus.COMPLETE;
	                _this.trigger(events.COMPLETE);
	                return;
	            }
	            _status = Scriptloader.loaderstatus.LOADING;
	            var _loader = new Scriptloader(getJSPath());
	            // Complete doesn't matter - we're waiting for registerPlugin
	            _loader.on(events.COMPLETE, completeHandler);
	            _loader.on(events.ERROR, errorHandler);
	            _loader.load();
	        };
	
	        this.registerPlugin = function (id, target, arg1, arg2) {
	            if (_completeTimeout) {
	                clearTimeout(_completeTimeout);
	                _completeTimeout = undefined;
	            }
	            _target = target;
	            if (arg1 && arg2) {
	                _flashPath = arg2;
	                _js = arg1;
	            } else if (typeof arg1 === 'string') {
	                _flashPath = arg1;
	            } else if (typeof arg1 === 'function') {
	                _js = arg1;
	            } else if (!arg1 && !arg2) {
	                _flashPath = id;
	            }
	            _status = Scriptloader.loaderstatus.COMPLETE;
	            _this.trigger(events.COMPLETE);
	        };
	
	        this.getStatus = function () {
	            return _status;
	        };
	
	        this.getPluginName = function () {
	            return pluginsUtils.getPluginName(url);
	        };
	
	        this.getFlashPath = function () {
	            if (_flashPath) {
	                switch (pluginsUtils.getPluginPathType(_flashPath)) {
	                    case pluginsUtils.pluginPathType.ABSOLUTE:
	                        return _flashPath;
	                    case pluginsUtils.pluginPathType.RELATIVE:
	                        if (url.lastIndexOf('.swf') > 0) {
	                            return utils.getAbsolutePath(_flashPath, window.location.href);
	                        }
	                        return utils.getAbsolutePath(_flashPath, getJSPath());
	                    default:
	                        break;
	                }
	            }
	            return null;
	        };
	
	        this.getJS = function () {
	            return _js;
	        };
	
	        this.getTarget = function () {
	            return _target;
	        };
	
	        this.getPluginmode = function () {
	            if ((typeof _flashPath === 'undefined' ? 'undefined' : _typeof(_flashPath)) !== undefined && (typeof _js === 'undefined' ? 'undefined' : _typeof(_js)) !== undefined) {
	                return pluginmodes.HYBRID;
	            } else if ((typeof _flashPath === 'undefined' ? 'undefined' : _typeof(_flashPath)) !== undefined) {
	                return pluginmodes.FLASH;
	            } else if ((typeof _js === 'undefined' ? 'undefined' : _typeof(_js)) !== undefined) {
	                return pluginmodes.JAVASCRIPT;
	            }
	        };
	
	        this.getNewInstance = function (api, config, div) {
	            return new _js(api, config, div);
	        };
	
	        this.getURL = function () {
	            return url;
	        };
	    };
	
	    return Plugin;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 66 */
/*!***********************************!*\
  !*** ./src/js/playlist/loader.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! parsers/parsers */ 45), __webpack_require__(/*! parsers/rssparser */ 67), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (parsers, rssParser, utils, events, Events, _) {
	
	    var PlaylistLoader = function PlaylistLoader() {
	        var _this = _.extend(this, Events);
	
	        this.load = function (playlistfile) {
	            utils.ajax(playlistfile, _playlistLoaded, _playlistLoadError);
	        };
	
	        this.destroy = function () {
	            this.off();
	        };
	
	        function _playlistLoaded(loadedEvent) {
	            var status = utils.tryCatch(function () {
	                var childNodes = loadedEvent.responseXML ? loadedEvent.responseXML.childNodes : null;
	                var rss = '';
	                var jsonObj;
	                if (childNodes) {
	                    for (var i = 0; i < childNodes.length; i++) {
	                        rss = childNodes[i];
	                        // 8: Node.COMMENT_NODE (IE8 doesn't have the Node.COMMENT_NODE constant)
	                        if (rss.nodeType !== 8) {
	                            break;
	                        }
	                    }
	                    if (parsers.localName(rss) === 'xml') {
	                        rss = rss.nextSibling;
	                    }
	                    if (parsers.localName(rss) === 'rss') {
	                        var rssPlaylist = rssParser.parse(rss);
	                        jsonObj = _.extend({ playlist: rssPlaylist }, rssPlaylist.feedData);
	                    }
	                }
	
	                // If the response is not valid RSS, check if it is JSON
	                if (!jsonObj) {
	                    try {
	                        var pl = JSON.parse(loadedEvent.responseText);
	                        // If the response is not a JSON array, try to read playlist of the response
	                        if (_.isArray(pl)) {
	                            jsonObj = { playlist: pl };
	                        } else if (_.isArray(pl.playlist)) {
	                            jsonObj = pl;
	                        } else {
	                            throw Error;
	                        }
	                    } catch (e) {
	                        _playlistError('Not a valid RSS/JSON feed');
	                        return;
	                    }
	                }
	
	                _this.trigger(events.JWPLAYER_PLAYLIST_LOADED, jsonObj);
	            });
	
	            if (status instanceof utils.Error) {
	                _playlistError();
	            }
	        }
	
	        function _playlistLoadError(err) {
	            _playlistError('Playlist load error: ' + err);
	        }
	
	        function _playlistError(msg) {
	            _this.trigger(events.JWPLAYER_ERROR, {
	                message: msg ? msg : 'Error loading file'
	            });
	        }
	    };
	
	    return PlaylistLoader;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 67 */
/*!*************************************!*\
  !*** ./src/js/parsers/rssparser.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	/**
	 * Parse an RSS feed and translate it to a playlist.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/strings */ 12), __webpack_require__(/*! parsers/parsers */ 45), __webpack_require__(/*! parsers/jwparser */ 68), __webpack_require__(/*! parsers/mediaparser */ 69), __webpack_require__(/*! playlist/item */ 70)], __WEBPACK_AMD_DEFINE_RESULT__ = function (strings, parsers, parseEntry, mediaParser, PlaylistItem) {
	    var _textContent = parsers.textContent;
	    var _getChildNode = parsers.getChildNode;
	    var _numChildren = parsers.numChildren;
	    var _localName = parsers.localName;
	    var rssparser = {};
	
	    // Parse an RSS playlist for feed items.
	    rssparser.parse = function (dat) {
	        var arr = [];
	        arr.feedData = {};
	        for (var i = 0; i < _numChildren(dat); i++) {
	            var node = _getChildNode(dat, i);
	            var localName = _localName(node).toLowerCase();
	
	            if (localName === 'channel') {
	                for (var j = 0; j < _numChildren(node); j++) {
	                    var subNode = _getChildNode(node, j);
	                    var nodeName = _localName(subNode).toLowerCase();
	                    if (nodeName === 'item') {
	                        arr.push(_parseItem(subNode));
	                    } else if (nodeName) {
	                        arr.feedData[nodeName] = _textContent(subNode);
	                    }
	                }
	            }
	        }
	        return arr;
	    };
	
	    // Translate RSS item to playlist item.
	    function _parseItem(obj) {
	        var itm = {};
	        for (var i = 0; i < obj.childNodes.length; i++) {
	            var node = obj.childNodes[i];
	            var localName = _localName(node);
	            if (!localName) {
	                continue;
	            }
	            switch (localName.toLowerCase()) {
	                case 'enclosure':
	                    itm.file = strings.xmlAttribute(node, 'url');
	                    break;
	                case 'title':
	                    itm.title = _textContent(node);
	                    break;
	                case 'guid':
	                    itm.mediaid = _textContent(node);
	                    break;
	                case 'pubdate':
	                    itm.date = _textContent(node);
	                    break;
	                case 'description':
	                    itm.description = _textContent(node);
	                    break;
	                case 'link':
	                    itm.link = _textContent(node);
	                    break;
	                case 'category':
	                    if (itm.tags) {
	                        itm.tags += _textContent(node);
	                    } else {
	                        itm.tags = _textContent(node);
	                    }
	                    break;
	                default:
	                    break;
	            }
	        }
	        itm = mediaParser(obj, itm);
	        itm = parseEntry(obj, itm);
	
	        return new PlaylistItem(itm);
	    }
	
	    return rssparser;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 68 */
/*!************************************!*\
  !*** ./src/js/parsers/jwparser.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	/**
	 * Parse a feed item for JWPlayer content.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! parsers/parsers */ 45), __webpack_require__(/*! utils/strings */ 12), __webpack_require__(/*! utils/helpers */ 8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (parsers, strings, utils) {
	    // Parse a feed entry for JWPlayer content
	    var PREFIX = 'jwplayer';
	    var parseEntry = function parseEntry(obj, itm) {
	        var sources = [];
	        var tracks = [];
	        var _xmlAttribute = strings.xmlAttribute;
	        var def = 'default';
	        var label = 'label';
	        var file = 'file';
	        var type = 'type';
	
	        for (var i = 0; i < obj.childNodes.length; i++) {
	            var node = obj.childNodes[i];
	            if (node.prefix === PREFIX) {
	                var _localName = parsers.localName(node);
	                if (_localName === 'source') {
	                    delete itm.sources;
	                    sources.push({
	                        file: _xmlAttribute(node, file),
	                        'default': _xmlAttribute(node, def),
	                        label: _xmlAttribute(node, label),
	                        type: _xmlAttribute(node, type)
	                    });
	                } else if (_localName === 'track') {
	                    delete itm.tracks;
	                    tracks.push({
	                        file: _xmlAttribute(node, file),
	                        'default': _xmlAttribute(node, def),
	                        kind: _xmlAttribute(node, 'kind'),
	                        label: _xmlAttribute(node, label)
	                    });
	                } else {
	                    itm[_localName] = utils.serialize(parsers.textContent(node));
	                    if (_localName === 'file' && itm.sources) {
	                        // jwplayer namespace file should override existing source
	                        // (probably set in MediaParser)
	                        delete itm.sources;
	                    }
	                }
	            }
	            if (!itm[file]) {
	                itm[file] = itm.link;
	            }
	        }
	
	        if (sources.length) {
	            itm.sources = [];
	            for (i = 0; i < sources.length; i++) {
	                if (sources[i].file.length > 0) {
	                    sources[i][def] = sources[i][def] === 'true' ? true : false;
	                    if (!sources[i].label.length) {
	                        delete sources[i].label;
	                    }
	                    itm.sources.push(sources[i]);
	                }
	            }
	        }
	
	        if (tracks.length) {
	            itm.tracks = [];
	            for (i = 0; i < tracks.length; i++) {
	                if (tracks[i].file.length > 0) {
	                    tracks[i][def] = tracks[i][def] === 'true' ? true : false;
	                    tracks[i].kind = !tracks[i].kind.length ? 'captions' : tracks[i].kind;
	                    if (!tracks[i].label.length) {
	                        delete tracks[i].label;
	                    }
	                    itm.tracks.push(tracks[i]);
	                }
	            }
	        }
	        return itm;
	    };
	
	    return parseEntry;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 69 */
/*!***************************************!*\
  !*** ./src/js/parsers/mediaparser.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	/**
	 * Parse a MRSS group into a playlistitem (used in RSS and ATOM).
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! parsers/parsers */ 45), __webpack_require__(/*! utils/strings */ 12), __webpack_require__(/*! utils/helpers */ 8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (parsers, strings, utils) {
	
	    var _xmlAttribute = strings.xmlAttribute;
	    var _localName = parsers.localName;
	    var _textContent = parsers.textContent;
	    var _numChildren = parsers.numChildren;
	
	    // Prefix for the MRSS namespace
	    var PREFIX = 'media';
	
	    // Parse a feeditem for Yahoo MediaRSS extensions
	    // The 'content' and 'group' elements can nest other MediaRSS elements.
	    var mediaparser = function mediaparser(obj, itm) {
	
	        var node;
	        var i;
	        var tracks = 'tracks';
	        var captions = [];
	
	        function getLabel(code) {
	            var LANGS = {
	                zh: 'Chinese',
	                nl: 'Dutch',
	                en: 'English',
	                fr: 'French',
	                de: 'German',
	                it: 'Italian',
	                ja: 'Japanese',
	                pt: 'Portuguese',
	                ru: 'Russian',
	                es: 'Spanish'
	            };
	
	            if (LANGS[code]) {
	                return LANGS[code];
	            }
	            return code;
	        }
	        for (i = 0; i < _numChildren(obj); i++) {
	            node = obj.childNodes[i];
	            if (node.prefix === PREFIX) {
	                if (!_localName(node)) {
	                    continue;
	                }
	                switch (_localName(node).toLowerCase()) {
	                    case 'content':
	                        if (_xmlAttribute(node, 'duration')) {
	                            itm.duration = utils.seconds(_xmlAttribute(node, 'duration'));
	                        }
	                        if (_xmlAttribute(node, 'url')) {
	                            if (!itm.sources) {
	                                itm.sources = [];
	                            }
	                            var sources = {
	                                file: _xmlAttribute(node, 'url'),
	                                type: _xmlAttribute(node, 'type'),
	                                width: _xmlAttribute(node, 'width'),
	                                label: _xmlAttribute(node, 'label')
	                            };
	
	                            var mediaTypes = findMediaTypes(node);
	                            if (mediaTypes.length) {
	                                sources.mediaTypes = mediaTypes;
	                            }
	
	                            itm.sources.push(sources);
	                        }
	                        if (_numChildren(node) > 0) {
	                            itm = mediaparser(node, itm);
	                        }
	                        break;
	                    case 'title':
	                        itm.title = _textContent(node);
	                        break;
	                    case 'description':
	                        itm.description = _textContent(node);
	                        break;
	                    case 'guid':
	                        itm.mediaid = _textContent(node);
	                        break;
	                    case 'thumbnail':
	                        if (!itm.image) {
	                            itm.image = _xmlAttribute(node, 'url');
	                        }
	                        break;
	                    case 'group':
	                        mediaparser(node, itm);
	                        break;
	                    case 'subtitle':
	                        var entry = {};
	                        entry.file = _xmlAttribute(node, 'url');
	                        entry.kind = 'captions';
	                        if (_xmlAttribute(node, 'lang').length > 0) {
	                            entry.label = getLabel(_xmlAttribute(node, 'lang'));
	                        }
	                        captions.push(entry);
	                        break;
	                    default:
	                        break;
	                }
	            }
	        }
	
	        if (!itm.hasOwnProperty(tracks)) {
	            itm[tracks] = [];
	        }
	
	        for (i = 0; i < captions.length; i++) {
	            itm[tracks].push(captions[i]);
	        }
	        return itm;
	    };
	
	    function findMediaTypes(contentNode) {
	        var mediaTypes = [];
	
	        for (var i = 0; i < _numChildren(contentNode); i++) {
	            var node = contentNode.childNodes[i];
	            if (node.prefix === 'jwplayer' && _localName(node).toLowerCase() === 'mediatypes') {
	                mediaTypes.push(_textContent(node));
	            }
	        }
	
	        return mediaTypes;
	    }
	
	    return mediaparser;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 70 */
/*!*********************************!*\
  !*** ./src/js/playlist/item.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! playlist/source */ 71), __webpack_require__(/*! playlist/track */ 72)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Source, Track) {
	    var Defaults = {
	        sources: [],
	        tracks: [],
	        minDvrWindow: 120
	    };
	
	    return function Item(config) {
	        config = config || {};
	        if (!_.isArray(config.tracks)) {
	            delete config.tracks;
	        }
	
	        var _playlistItem = _.extend({}, Defaults, config);
	
	        if (_.isObject(_playlistItem.sources) && !_.isArray(_playlistItem.sources)) {
	            _playlistItem.sources = [Source(_playlistItem.sources)];
	        }
	
	        if (!_.isArray(_playlistItem.sources) || _playlistItem.sources.length === 0) {
	            if (config.levels) {
	                _playlistItem.sources = config.levels;
	            } else {
	                _playlistItem.sources = [Source(config)];
	            }
	        }
	
	        /** Each source should be a named object **/
	        for (var i = 0; i < _playlistItem.sources.length; i++) {
	            var s = _playlistItem.sources[i];
	            if (!s) {
	                continue;
	            }
	
	            var def = s.default;
	            if (def) {
	                s.default = def.toString() === 'true';
	            } else {
	                s.default = false;
	            }
	
	            // If the source doesn't have a label, number it
	            if (!_playlistItem.sources[i].label) {
	                _playlistItem.sources[i].label = i.toString();
	            }
	
	            _playlistItem.sources[i] = Source(_playlistItem.sources[i]);
	        }
	
	        _playlistItem.sources = _.compact(_playlistItem.sources);
	
	        if (!_.isArray(_playlistItem.tracks)) {
	            _playlistItem.tracks = [];
	        }
	
	        if (_.isArray(_playlistItem.captions)) {
	            _playlistItem.tracks = _playlistItem.tracks.concat(_playlistItem.captions);
	            delete _playlistItem.captions;
	        }
	
	        _playlistItem.tracks = _.compact(_.map(_playlistItem.tracks, Track));
	
	        return _playlistItem;
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 71 */
/*!***********************************!*\
  !*** ./src/js/playlist/source.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/strings */ 12), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, strings, _) {
	    var Defaults = {
	        'default': false
	    };
	
	    return function Source(config) {
	        // file is the only hard requirement
	        if (!config || !config.file) {
	            return;
	        }
	
	        var _source = _.extend({}, Defaults, config);
	
	        // normalize for odd strings
	        _source.file = strings.trim('' + _source.file);
	
	        // regex to check if mimetype is given
	        var mimetypeRegEx = /^[^\/]+\/(?:x-)?([^\/]+)$/;
	
	        if (mimetypeRegEx.test(_source.type)) {
	            // if type is given as a mimetype
	            _source.mimeType = _source.type;
	            _source.type = _source.type.replace(mimetypeRegEx, '$1');
	        }
	
	        // check if the source is youtube or rtmp
	        if (utils.isYouTube(_source.file)) {
	            _source.type = 'youtube';
	        } else if (utils.isRtmp(_source.file)) {
	            _source.type = 'rtmp';
	        } else if (!_source.type) {
	            _source.type = strings.extension(_source.file);
	        }
	
	        if (!_source.type) {
	            return;
	        }
	
	        // normalize types
	        switch (_source.type) {
	            case 'm3u8':
	            case 'vnd.apple.mpegurl':
	                _source.type = 'hls';
	                break;
	            case 'dash+xml':
	                _source.type = 'dash';
	                break;
	            case 'smil':
	                _source.type = 'rtmp';
	                break;
	            // Although m4a is a container format, it is most often used for aac files
	            // http://en.wikipedia.org/w/index.php?title=MPEG-4_Part_14
	            case 'm4a':
	                _source.type = 'aac';
	                break;
	            default:
	                break;
	        }
	
	        // remove empty strings
	        _.each(_source, function (val, key) {
	            if (val === '') {
	                delete _source[key];
	            }
	        });
	
	        return _source;
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 72 */
/*!**********************************!*\
  !*** ./src/js/playlist/track.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	    var defaults = {
	        kind: 'captions',
	        'default': false
	    };
	
	    return function Track(config) {
	        // File is the only required attr
	        if (!config || !config.file) {
	            return;
	        }
	
	        return _.extend({}, defaults, config);
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 73 */
/*!**********************************************!*\
  !*** ./src/js/controller/controls-loader.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    var controlsPromise = null;
	
	    function load() {
	        if (!controlsPromise) {
	            controlsPromise = new Promise(function (resolve) {
	                __webpack_require__.e/* nsure */(5/*! jwplayer.controls */, function (require) {
	                    var controls = __webpack_require__(/*! view/controls/controls */ 74);
	                    resolve(controls);
	                });
	            });
	        }
	        return controlsPromise;
	    }
	
	    return {
	        load: load
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */
/*!****************************!*\
  !*** ./src/js/utils/ui.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/helpers */ 8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Events, events, _, utils) {
	    var JW_TOUCH_EVENTS = events.touchEvents;
	    var _supportsPointerEvents = 'PointerEvent' in window;
	    var _supportsTouchEvents = 'ontouchstart' in window;
	    var _useMouseEvents = !_supportsPointerEvents && !(_supportsTouchEvents && utils.isMobile());
	    var _isOSXFirefox = utils.isFF() && utils.isOSX();
	
	    function getCoord(e, c) {
	        return (/touch/.test(e.type) ? (e.originalEvent || e).changedTouches[0]['page' + c] : e['page' + c]
	        );
	    }
	
	    function isRightClick(evt) {
	        var e = evt || window.event;
	
	        if (!(evt instanceof MouseEvent)) {
	            return false;
	        }
	
	        if ('which' in e) {
	            // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
	            return e.which === 3;
	        } else if ('button' in e) {
	            // IE and Opera
	            return e.button === 2;
	        }
	
	        return false;
	    }
	
	    function normalizeUIEvent(type, srcEvent, target) {
	        var source;
	
	        if (srcEvent instanceof MouseEvent || !srcEvent.touches && !srcEvent.changedTouches) {
	            source = srcEvent;
	        } else if (srcEvent.touches && srcEvent.touches.length) {
	            source = srcEvent.touches[0];
	        } else {
	            source = srcEvent.changedTouches[0];
	        }
	
	        return {
	            type: type,
	            sourceEvent: srcEvent,
	            target: srcEvent.target,
	            currentTarget: target,
	            pageX: source.pageX,
	            pageY: source.pageY
	        };
	    }
	
	    // Preventdefault to prevent click events
	    function preventDefault(evt) {
	        // Because sendEvent from utils.eventdispatcher clones evt objects instead of passing them
	        //  we cannot call evt.preventDefault() on them
	        if (!(evt instanceof MouseEvent) && !(evt instanceof window.TouchEvent)) {
	            return;
	        }
	        if (evt.preventManipulation) {
	            evt.preventManipulation();
	        }
	        // prevent scrolling
	        if (evt.preventDefault) {
	            evt.preventDefault();
	        }
	    }
	
	    var UI = function UI(elem, options) {
	        var _elem = elem;
	        var _hasMoved = false;
	        var _startX = 0;
	        var _startY = 0;
	        var _lastClickTime = 0;
	        var _doubleClickDelay = 300;
	        var _touchListenerTarget;
	        var _pointerId;
	
	        options = options || {};
	
	        // If its not mobile, add mouse listener.  Add touch listeners so touch devices that aren't Android or iOS
	        // (windows phones) still get listeners just in case they want to use them.
	        if (_supportsPointerEvents) {
	            elem.addEventListener('pointerdown', interactStartHandler);
	            if (options.useHover) {
	                elem.addEventListener('pointerover', overHandler);
	                elem.addEventListener('pointerout', outHandler);
	            }
	            if (options.useMove) {
	                elem.addEventListener('pointermove', moveHandler);
	            }
	        } else {
	            if (_useMouseEvents) {
	                elem.addEventListener('mousedown', interactStartHandler);
	                if (options.useHover) {
	                    elem.addEventListener('mouseover', overHandler);
	                    elem.addEventListener('mouseout', outHandler);
	                }
	                if (options.useMove) {
	                    elem.addEventListener('mousemove', moveHandler);
	                }
	            }
	
	            // Always add this, in case we don't properly identify the device as mobile
	            elem.addEventListener('touchstart', interactStartHandler);
	        }
	
	        // overHandler and outHandler not assigned in touch situations
	        function overHandler(evt) {
	            if (evt.pointerType !== 'touch') {
	                triggerEvent(JW_TOUCH_EVENTS.OVER, evt);
	            }
	        }
	
	        function moveHandler(evt) {
	            if (evt.pointerType !== 'touch') {
	                triggerEvent(JW_TOUCH_EVENTS.MOVE, evt);
	            }
	        }
	
	        function outHandler(evt) {
	            // elementFromPoint to handle an issue where setPointerCapture is causing a pointerout event
	            if (_useMouseEvents || _supportsPointerEvents && evt.pointerType !== 'touch' && !elem.contains(document.elementFromPoint(evt.x, evt.y))) {
	                triggerEvent(JW_TOUCH_EVENTS.OUT, evt);
	            }
	        }
	
	        function setEventListener(element, eventName, callback) {
	            element.removeEventListener(eventName, callback);
	            element.addEventListener(eventName, callback);
	        }
	
	        function interactStartHandler(evt) {
	            _touchListenerTarget = evt.target;
	            _startX = getCoord(evt, 'X');
	            _startY = getCoord(evt, 'Y');
	
	            if (!isRightClick(evt)) {
	
	                if (evt.type === 'pointerdown' && evt.isPrimary) {
	                    if (options.preventScrolling) {
	                        _pointerId = evt.pointerId;
	                        elem.setPointerCapture(_pointerId);
	                    }
	                    setEventListener(elem, 'pointermove', interactDragHandler);
	                    setEventListener(elem, 'pointercancel', interactEndHandler);
	
	                    // Listen for mouseup after mouse pointer down because pointerup doesn't fire on swf objects
	                    if (evt.pointerType === 'mouse' && _touchListenerTarget.nodeName === 'OBJECT') {
	                        setEventListener(document, 'mouseup', interactEndHandler);
	                    } else {
	                        setEventListener(elem, 'pointerup', interactEndHandler);
	                    }
	                } else if (evt.type === 'mousedown') {
	                    setEventListener(document, 'mousemove', interactDragHandler);
	
	                    // Handle clicks in OSX Firefox over Flash 'object'
	                    if (_isOSXFirefox && evt.target.nodeName.toLowerCase() === 'object') {
	                        setEventListener(elem, 'click', interactEndHandler);
	                    } else {
	                        setEventListener(document, 'mouseup', interactEndHandler);
	                    }
	                } else if (evt.type === 'touchstart') {
	                    setEventListener(_touchListenerTarget, 'touchmove', interactDragHandler);
	                    setEventListener(_touchListenerTarget, 'touchcancel', interactEndHandler);
	                    setEventListener(_touchListenerTarget, 'touchend', interactEndHandler);
	                }
	
	                // Prevent scrolling the screen dragging while dragging on mobile.
	                if (options.preventScrolling) {
	                    preventDefault(evt);
	                }
	            }
	        }
	
	        function interactDragHandler(evt) {
	            var movementThreshhold = 6;
	
	            if (_hasMoved) {
	                triggerEvent(JW_TOUCH_EVENTS.DRAG, evt);
	            } else {
	                var endX = getCoord(evt, 'X');
	                var endY = getCoord(evt, 'Y');
	                var moveX = endX - _startX;
	                var moveY = endY - _startY;
	                if (moveX * moveX + moveY * moveY > movementThreshhold * movementThreshhold) {
	                    triggerEvent(JW_TOUCH_EVENTS.DRAG_START, evt);
	                    _hasMoved = true;
	                    triggerEvent(JW_TOUCH_EVENTS.DRAG, evt);
	                }
	            }
	
	            // Prevent scrolling the screen dragging while dragging on mobile.
	            if (options.preventScrolling) {
	                preventDefault(evt);
	            }
	        }
	
	        function interactEndHandler(evt) {
	            var isPointerEvent = evt.type === 'pointerup' || evt.type === 'pointercancel';
	            if (isPointerEvent && options.preventScrolling) {
	                elem.releasePointerCapture(_pointerId);
	            }
	            elem.removeEventListener('pointermove', interactDragHandler);
	            elem.removeEventListener('pointercancel', interactEndHandler);
	            elem.removeEventListener('pointerup', interactEndHandler);
	            document.removeEventListener('mousemove', interactDragHandler);
	            document.removeEventListener('mouseup', interactEndHandler);
	            if (_touchListenerTarget) {
	                _touchListenerTarget.removeEventListener('touchmove', interactDragHandler);
	                _touchListenerTarget.removeEventListener('touchcancel', interactEndHandler);
	                _touchListenerTarget.removeEventListener('touchend', interactEndHandler);
	            }
	
	            if (_hasMoved) {
	                triggerEvent(JW_TOUCH_EVENTS.DRAG_END, evt);
	            } else if ((!options.directSelect || evt.target === elem) && evt.type.indexOf('cancel') === -1) {
	                if (evt.type === 'mouseup' || evt.type === 'click' || isPointerEvent && evt.pointerType === 'mouse') {
	                    triggerEvent(JW_TOUCH_EVENTS.CLICK, evt);
	                } else {
	                    triggerEvent(JW_TOUCH_EVENTS.TAP, evt);
	                    if (evt.type === 'touchend') {
	                        // preventDefault to not dispatch the 300ms delayed click after a tap
	                        preventDefault(evt);
	                    }
	                }
	            }
	
	            _touchListenerTarget = null;
	            _hasMoved = false;
	        }
	
	        var self = this;
	        function triggerEvent(type, srcEvent) {
	            var evt;
	            if (options.enableDoubleTap && (type === JW_TOUCH_EVENTS.CLICK || type === JW_TOUCH_EVENTS.TAP)) {
	                if (_.now() - _lastClickTime < _doubleClickDelay) {
	                    var doubleType = type === JW_TOUCH_EVENTS.CLICK ? JW_TOUCH_EVENTS.DOUBLE_CLICK : JW_TOUCH_EVENTS.DOUBLE_TAP;
	                    evt = normalizeUIEvent(doubleType, srcEvent, _elem);
	                    self.trigger(doubleType, evt);
	                    _lastClickTime = 0;
	                } else {
	                    _lastClickTime = _.now();
	                }
	            }
	            evt = normalizeUIEvent(type, srcEvent, _elem);
	            self.trigger(type, evt);
	        }
	
	        this.triggerEvent = triggerEvent;
	
	        this.destroy = function () {
	            this.off();
	            elem.removeEventListener('touchstart', interactStartHandler);
	            elem.removeEventListener('mousedown', interactStartHandler);
	
	            if (_touchListenerTarget) {
	                _touchListenerTarget.removeEventListener('touchmove', interactDragHandler);
	                _touchListenerTarget.removeEventListener('touchcancel', interactEndHandler);
	                _touchListenerTarget.removeEventListener('touchend', interactEndHandler);
	                _touchListenerTarget = null;
	            }
	
	            if (_supportsPointerEvents) {
	                if (options.preventScrolling) {
	                    elem.releasePointerCapture(_pointerId);
	                }
	                elem.removeEventListener('pointerover', overHandler);
	                elem.removeEventListener('pointerdown', interactStartHandler);
	                elem.removeEventListener('pointermove', interactDragHandler);
	                elem.removeEventListener('pointermove', moveHandler);
	                elem.removeEventListener('pointercancel', interactEndHandler);
	                elem.removeEventListener('pointerout', outHandler);
	                elem.removeEventListener('pointerup', interactEndHandler);
	            }
	
	            elem.removeEventListener('click', interactEndHandler);
	            elem.removeEventListener('mouseover', overHandler);
	            elem.removeEventListener('mousemove', moveHandler);
	            elem.removeEventListener('mouseout', outHandler);
	            document.removeEventListener('mousemove', interactDragHandler);
	            document.removeEventListener('mouseup', interactEndHandler);
	        };
	
	        return this;
	    };
	
	    // Expose what the source of the event is so that we can ensure it's handled correctly.
	    // This returns only 'touch' or 'mouse'.  'pen' will be treated as a mouse.
	    UI.getPointerType = function (evt) {
	        if (_supportsPointerEvents && evt instanceof window.PointerEvent) {
	            return evt.pointerType === 'touch' ? 'touch' : 'mouse';
	        } else if (_supportsTouchEvents && evt instanceof window.TouchEvent) {
	            return 'touch';
	        }
	
	        return 'mouse';
	    };
	
	    _.extend(UI.prototype, Events);
	
	    return UI;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */
/*!**************************************!*\
  !*** ./~/css-loader/lib/css-base.js ***!
  \**************************************/
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */
/*!***************************************!*\
  !*** ./src/js/controller/captions.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! controller/tracks-loader */ 44), __webpack_require__(/*! controller/tracks-helper */ 50)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, tracksLoader, tracksHelper) {
	    /** Displays closed captions or subtitles on top of the video. **/
	    var Captions = function Captions(_model) {
	        // Reset and load external captions on playlist item
	        _model.on('change:playlistItem', _itemHandler, this);
	
	        // Listen for captions menu index changes from the view
	        _model.on('change:captionsIndex', _captionsIndexHandler, this);
	
	        // Listen for item ready to determine which provider is in use
	        _model.on('itemReady', _itemReadyHandler, this);
	
	        // Listen for provider subtitle tracks
	        //   ignoring provider "subtitlesTrackChanged" since index should be managed here
	        _model.mediaController.on('subtitlesTracks', _subtitlesTracksHandler, this);
	
	        function _subtitlesTracksHandler(e) {
	            if (!e.tracks.length) {
	                return;
	            }
	
	            var tracks = e.tracks || [];
	            for (var i = 0; i < tracks.length; i++) {
	                _addTrack(tracks[i]);
	            }
	
	            // To avoid duplicate tracks in the menu when we reuse an _id, regenerate the tracks array
	            _tracks = Object.keys(_tracksById).map(function (id) {
	                return _tracksById[id];
	            });
	
	            var captionsMenu = _captionsMenu();
	            _selectDefaultIndex();
	            this.setCaptionsList(captionsMenu);
	        }
	
	        var _tracks = [];
	        var _tracksById = {};
	        var _unknownCount = 0;
	
	        /** Listen to playlist item updates. **/
	        function _itemHandler() {
	            _tracks = [];
	            _tracksById = {};
	            _unknownCount = 0;
	        }
	
	        function _itemReadyHandler(item) {
	            // Clean up in case we're replaying
	            _itemHandler(_model, item);
	
	            var tracks = item.tracks;
	            var len = tracks && tracks.length;
	
	            // Sideload tracks when not rendering natively
	            if (!_model.get('renderCaptionsNatively') && len) {
	                var i;
	                var track;
	
	                for (i = 0; i < len; i++) {
	                    track = tracks[i];
	                    if (_kindSupported(track.kind) && !_tracksById[track._id]) {
	                        _addTrack(track);
	                        tracksLoader.loadFile(track, _addVTTCuesToTrack.bind(null, track), _errorHandler);
	                    }
	                }
	            }
	
	            var captionsMenu = _captionsMenu();
	            _selectDefaultIndex();
	            this.setCaptionsList(captionsMenu);
	        }
	
	        function _kindSupported(kind) {
	            return kind === 'subtitles' || kind === 'captions';
	        }
	
	        function _addVTTCuesToTrack(track, vttCues) {
	            track.data = vttCues;
	        }
	
	        function _errorHandler(error) {
	            utils.log('CAPTIONS(' + error + ')');
	        }
	
	        function _captionsIndexHandler(model, captionsMenuIndex) {
	            var track = null;
	            if (captionsMenuIndex !== 0) {
	                track = _tracks[captionsMenuIndex - 1];
	            }
	            model.set('captionsTrack', track);
	        }
	
	        function _addTrack(track) {
	            track.data = track.data || [];
	            track.name = track.label || track.name || track.language;
	            track._id = tracksHelper.createId(track, _tracks.length);
	
	            if (!track.name) {
	                var labelInfo = tracksHelper.createLabel(track, _unknownCount);
	                track.name = labelInfo.label;
	                _unknownCount = labelInfo.unknownCount;
	            }
	
	            // During the same playlist we may reu and readd tracks with the same _id; allow the new track to replace the old
	            _tracksById[track._id] = track;
	            _tracks.push(track);
	        }
	
	        function _captionsMenu() {
	            var list = [{
	                id: 'off',
	                label: 'Off'
	            }];
	            for (var i = 0; i < _tracks.length; i++) {
	                list.push({
	                    id: _tracks[i]._id,
	                    label: _tracks[i].name || 'Unknown CC'
	                });
	            }
	            return list;
	        }
	
	        function _selectDefaultIndex() {
	            var captionsMenuIndex = 0;
	            var label = _model.get('captionLabel');
	
	            // Because there is no explicit track for "Off"
	            //  it is the implied zeroth track
	            if (label === 'Off') {
	                _model.set('captionsIndex', 0);
	                return;
	            }
	
	            for (var i = 0; i < _tracks.length; i++) {
	                var track = _tracks[i];
	                if (label && label === track.name) {
	                    captionsMenuIndex = i + 1;
	                    break;
	                } else if (track.default || track.defaulttrack || track._id === 'default') {
	                    captionsMenuIndex = i + 1;
	                } else if (track.autoselect) {
	                    // TODO: auto select track by comparing track.language to system lang
	                }
	            }
	            // set the index without the side effect of storing the Off label in _selectCaptions
	            _setCurrentIndex(captionsMenuIndex);
	        }
	
	        function _setCurrentIndex(index) {
	            if (_tracks.length) {
	                _model.setVideoSubtitleTrack(index, _tracks);
	            } else {
	                _model.set('captionsIndex', index);
	            }
	        }
	
	        this.getCurrentIndex = function () {
	            return _model.get('captionsIndex');
	        };
	
	        this.getCaptionsList = function () {
	            return _model.get('captionsList');
	        };
	
	        this.setCaptionsList = function (captionsMenu) {
	            _model.set('captionsList', captionsMenu);
	        };
	    };
	
	    return Captions;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 112 */
/*!**************************************!*\
  !*** ./src/js/controller/storage.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/helpers */ 8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, utils) {
	    var storage = {
	        removeItem: utils.noop
	    };
	
	    try {
	        storage = window.localStorage;
	    } catch (e) {/* ignore */}
	
	    function jwPrefix(str) {
	        return 'jwplayer.' + str;
	    }
	
	    function getAllItems() {
	        return _.reduce(this.persistItems, function (memo, key) {
	            var val = storage[jwPrefix(key)];
	            if (val) {
	                memo[key] = utils.serialize(val);
	            }
	            return memo;
	        }, {});
	    }
	
	    function setItem(name, value) {
	        try {
	            storage[jwPrefix(name)] = value;
	        } catch (e) {
	            // ignore QuotaExceededError unless debugging
	            var jwplayer = window.jwplayer;
	            if (jwplayer && jwplayer.debug) {
	                console.error(e);
	            }
	        }
	    }
	
	    function clear() {
	        _.each(this.persistItems, function (val) {
	            storage.removeItem(jwPrefix(val));
	        });
	    }
	
	    function Storage() {
	        this.persistItems = ['volume', 'mute', 'captionLabel', 'qualityLabel'];
	    }
	
	    function track(model) {
	        _.each(this.persistItems, function (item) {
	            model.on('change:' + item, function (changeModel, value) {
	                setItem(item, value);
	            });
	        });
	    }
	
	    _.extend(Storage.prototype, {
	        getAllItems: getAllItems,
	        track: track,
	        clear: clear
	    });
	
	    return Storage;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 113 */
/*!*************************************!*\
  !*** ./src/js/playlist/playlist.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! playlist/item */ 70), __webpack_require__(/*! playlist/source */ 71), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! providers/providers */ 34)], __WEBPACK_AMD_DEFINE_RESULT__ = function (PlaylistItem, Source, _, Providers) {
	
	    var Playlist = function Playlist(playlist) {
	        // Can be either an array of items or a single item.
	        playlist = _.isArray(playlist) ? playlist : [playlist];
	
	        return _.compact(_.map(playlist, PlaylistItem));
	    };
	
	    /** Go through the playlist and choose a single playable type to play; remove sources of a different type **/
	    Playlist.filterPlaylist = function (playlist, model, feedData) {
	        var list = [];
	        var providers = model.getProviders();
	        var preload = model.get('preload');
	        var itemFeedData = _.extend({}, feedData);
	        delete itemFeedData.playlist;
	
	        _.each(playlist, function (item) {
	            item = _.extend({}, item);
	
	            item.allSources = _formatSources(item, model);
	
	            item.sources = _filterSources(item.allSources, providers);
	
	            if (!item.sources.length) {
	                return;
	            }
	
	            // include selected file in item for backwards compatibility
	            item.file = item.sources[0].file;
	
	            // set preload for the item, if it is defined
	            if (preload) {
	                item.preload = item.preload || preload;
	            }
	
	            if (feedData) {
	                item.feedData = itemFeedData;
	            }
	
	            list.push(item);
	        });
	
	        return list;
	    };
	
	    var _formatSources = function _formatSources(item, model) {
	        var sources = item.sources;
	        var androidhls = model.get('androidhls');
	        var itemDrm = item.drm || model.get('drm');
	        var preload = item.preload || model.get('preload');
	        var withCredentials = _fallbackIfUndefined(item.withCredentials, model.get('withCredentials'));
	        var hlsjsdefault = model.get('hlsjsdefault');
	
	        return _.compact(_.map(sources, function (originalSource) {
	            if (!_.isObject(originalSource)) {
	                return null;
	            }
	            if (androidhls !== undefined && androidhls !== null) {
	                originalSource.androidhls = androidhls;
	            }
	
	            if (originalSource.drm || itemDrm) {
	                originalSource.drm = originalSource.drm || itemDrm;
	            }
	
	            if (originalSource.preload || preload) {
	                originalSource.preload = originalSource.preload || preload;
	            }
	
	            // withCredentials is assigned in ascending priority order, source > playlist > model
	            // a false value that is a higher priority than true must result in a false withCredentials value
	            // we don't want undefined if all levels have withCredentials as undefined
	            var cascadedWithCredentials = _fallbackIfUndefined(originalSource.withCredentials, withCredentials);
	            if (!_.isUndefined(cascadedWithCredentials)) {
	                originalSource.withCredentials = cascadedWithCredentials;
	            }
	
	            if (hlsjsdefault) {
	                originalSource.hlsjsdefault = hlsjsdefault;
	            }
	
	            return Source(originalSource);
	        }));
	    };
	
	    // A playlist item may have multiple different sources, but we want to stick with one.
	    var _filterSources = function _filterSources(sources, providers) {
	        // legacy plugin support
	        if (!providers || !providers.choose) {
	            providers = new Providers({ primary: providers ? 'flash' : null });
	        }
	
	        var chosenProviderAndType = _chooseProviderAndType(sources, providers);
	        if (!chosenProviderAndType) {
	            return [];
	        }
	        var provider = chosenProviderAndType.provider;
	        var bestType = chosenProviderAndType.type;
	        return _.filter(sources, function (source) {
	            return source.type === bestType && providers.providerSupports(provider, source);
	        });
	    };
	
	    //  Choose from the sources a type which matches our most preferred provider
	    function _chooseProviderAndType(sources, providers) {
	        for (var i = 0; i < sources.length; i++) {
	            var source = sources[i];
	            var chosenProvider = providers.choose(source);
	            if (chosenProvider) {
	                return { type: source.type, provider: chosenProvider.providerToCheck };
	            }
	        }
	
	        return null;
	    }
	
	    function _fallbackIfUndefined(value, fallback) {
	        return _.isUndefined(value) ? fallback : value;
	    }
	
	    return Playlist;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 114 */
/*!*****************************!*\
  !*** ./src/js/view/view.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _player = __webpack_require__(/*! templates/player */ 115);
	
	var _player2 = _interopRequireDefault(_player);
	
	var _audioMode = __webpack_require__(/*! view/utils/audio-mode */ 116);
	
	var _viewsManager = __webpack_require__(/*! view/utils/views-manager */ 117);
	
	var _viewsManager2 = _interopRequireDefault(_viewsManager);
	
	var _visibility = __webpack_require__(/*! view/utils/visibility */ 120);
	
	var _visibility2 = _interopRequireDefault(_visibility);
	
	var _activeTab = __webpack_require__(/*! utils/active-tab */ 118);
	
	var _activeTab2 = _interopRequireDefault(_activeTab);
	
	var _requestAnimationFrame = __webpack_require__(/*! utils/request-animation-frame */ 119);
	
	var _breakpoint2 = __webpack_require__(/*! view/utils/breakpoint */ 121);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ControlsModule = void 0;
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! events/events */ 32), __webpack_require__(/*! events/states */ 31), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! view/utils/request-fullscreen-helper */ 122), __webpack_require__(/*! view/utils/flag-no-focus */ 123), __webpack_require__(/*! view/utils/clickhandler */ 124), __webpack_require__(/*! view/captionsrenderer */ 125), __webpack_require__(/*! view/logo */ 127), __webpack_require__(/*! view/preview */ 129), __webpack_require__(/*! view/title */ 130), __webpack_require__(/*! controller/controls-loader */ 73)], __WEBPACK_AMD_DEFINE_RESULT__ = function (events, states, Events, utils, _, requestFullscreenHelper, flagNoFocus, ClickHandler, CaptionsRenderer, Logo, Preview, Title, ControlsLoader) {
	
	    var _styles = utils.style;
	    var _bounds = utils.bounds;
	    var _isMobile = utils.isMobile();
	    var _isIE = utils.isIE();
	
	    var stylesInjected = false;
	
	    function View(_api, _model) {
	        var _this = _.extend(this, Events, {
	            isSetup: false,
	            api: _api,
	            model: _model
	        });
	
	        // init/reset view model properties
	        _.extend(_model.attributes, {
	            containerWidth: undefined,
	            containerHeight: undefined,
	            mediaContainer: undefined,
	            fullscreen: false,
	            inDom: undefined,
	            iFrame: undefined,
	            activeTab: undefined,
	            intersectionRatio: undefined,
	            visibility: undefined,
	            viewable: undefined,
	            viewSetup: false,
	            audioMode: undefined,
	            touchMode: undefined,
	            altText: '',
	            cues: undefined,
	            castClicked: false,
	            scrubbing: false,
	            logoWidth: 0
	        });
	
	        var _playerElement = utils.createElement((0, _player2.default)(_model.get('id'), _model.get('localization').player));
	        var _videoLayer = _playerElement.querySelector('.jw-media');
	
	        var _preview = new Preview(_model);
	        var _title = new Title(_model);
	        var _captionsRenderer = new CaptionsRenderer(_model);
	
	        var _logo = void 0;
	
	        var _playerState = void 0;
	
	        var _lastWidth = void 0;
	        var _lastHeight = void 0;
	
	        var _instreamModel = void 0;
	
	        var _resizeMediaTimeout = -1;
	        var _resizeContainerRequestId = -1;
	
	        var displayClickHandler = void 0;
	        var fullscreenHelpers = void 0;
	        var focusHelper = void 0;
	
	        var _breakpoint = null;
	        var _controls = void 0;
	
	        function reasonInteraction() {
	            return { reason: 'interaction' };
	        }
	
	        this.updateBounds = function () {
	            (0, _requestAnimationFrame.cancelAnimationFrame)(_resizeContainerRequestId);
	            var inDOM = document.body.contains(_playerElement);
	            var bounds = _bounds(_playerElement);
	            var containerWidth = Math.round(bounds.width);
	            var containerHeight = Math.round(bounds.height);
	
	            // If the container is the same size as before, return early
	            if (containerWidth === _lastWidth && containerHeight === _lastHeight) {
	                // Listen for player to be added to DOM
	                if (!_lastWidth || !_lastHeight) {
	                    _responsiveListener();
	                }
	                _model.set('inDom', inDOM);
	                return;
	            }
	            // If we have bad values for either dimension, return early
	            if (!containerWidth || !containerHeight) {
	                // If we haven't established player size, try again
	                if (!_lastWidth || !_lastHeight) {
	                    _responsiveListener();
	                }
	            }
	
	            // Don't update container dimensions to 0, 0 when not in DOM
	            if (containerWidth || containerHeight || inDOM) {
	                _model.set('containerWidth', containerWidth);
	                _model.set('containerHeight', containerHeight);
	            }
	            _model.set('inDom', inDOM);
	
	            if (inDOM) {
	                _viewsManager2.default.observe(_playerElement);
	            }
	        };
	
	        this.updateStyles = function () {
	            var containerWidth = _model.get('containerWidth');
	            var containerHeight = _model.get('containerHeight');
	
	            if (_model.get('controls')) {
	                updateContainerStyles(containerWidth, containerHeight);
	            }
	
	            if (_controls) {
	                _controls.resize(containerWidth, containerHeight);
	            }
	
	            _resizeMedia(containerWidth, containerHeight);
	            _captionsRenderer.resize();
	        };
	
	        this.checkResized = function () {
	            var containerWidth = _model.get('containerWidth');
	            var containerHeight = _model.get('containerHeight');
	            if (containerWidth !== _lastWidth || containerHeight !== _lastHeight) {
	                _lastWidth = containerWidth;
	                _lastHeight = containerHeight;
	                _this.trigger(events.JWPLAYER_RESIZE, {
	                    width: containerWidth,
	                    height: containerHeight
	                });
	                var breakpoint = (0, _breakpoint2.getBreakpoint)(containerWidth);
	                if (_breakpoint !== breakpoint) {
	                    _breakpoint = breakpoint;
	                    _this.trigger(events.JWPLAYER_BREAKPOINT, {
	                        breakpoint: _breakpoint
	                    });
	                }
	            }
	        };
	
	        function _responsiveListener() {
	            (0, _requestAnimationFrame.cancelAnimationFrame)(_resizeContainerRequestId);
	            _resizeContainerRequestId = (0, _requestAnimationFrame.requestAnimationFrame)(_responsiveUpdate);
	        }
	
	        function _responsiveUpdate() {
	            if (!_this.isSetup) {
	                return;
	            }
	            _this.updateBounds();
	            _this.updateStyles();
	            _this.checkResized();
	        }
	
	        function updateContainerStyles(width, height) {
	            var audioMode = (0, _audioMode.isAudioMode)(_model);
	            // Set timeslider flags
	            if (_.isNumber(width) && _.isNumber(height)) {
	                var breakpoint = (0, _breakpoint2.getBreakpoint)(width);
	                (0, _breakpoint2.setBreakpoint)(_playerElement, breakpoint);
	
	                var smallPlayer = breakpoint < 2;
	                var timeSliderAboveConfig = _model.get('timeSliderAbove');
	                var timeSliderAbove = !audioMode && timeSliderAboveConfig !== false && (timeSliderAboveConfig || smallPlayer);
	                utils.toggleClass(_playerElement, 'jw-flag-small-player', smallPlayer);
	                utils.toggleClass(_playerElement, 'jw-flag-time-slider-above', timeSliderAbove);
	                utils.toggleClass(_playerElement, 'jw-orientation-portrait', height > width);
	            }
	            utils.toggleClass(_playerElement, 'jw-flag-audio-player', audioMode);
	            _model.set('audioMode', audioMode);
	        }
	
	        // Set global colors, used by related plugin
	        // If a color is undefined simple-style-loader won't add their styles to the dom
	        function insertGlobalColorClasses(activeColor, inactiveColor, playerId) {
	            if (activeColor) {
	                var activeColorSet = {
	                    color: activeColor,
	                    borderColor: activeColor,
	                    stroke: activeColor
	                };
	                utils.css('#' + playerId + ' .jw-color-active', activeColorSet, playerId);
	                utils.css('#' + playerId + ' .jw-color-active-hover:hover', activeColorSet, playerId);
	            }
	            if (inactiveColor) {
	                var inactiveColorSet = {
	                    color: inactiveColor,
	                    borderColor: inactiveColor,
	                    stroke: inactiveColor
	                };
	                utils.css('#' + playerId + ' .jw-color-inactive', inactiveColorSet, playerId);
	                utils.css('#' + playerId + ' .jw-color-inactive-hover:hover', inactiveColorSet, playerId);
	            }
	        }
	
	        this.handleColorOverrides = function () {
	            var id = _model.get('id');
	
	            function addStyle(elements, attr, value, extendParent) {
	                /* if extendParent is true, bundle the first selector of
	                 element string to the player element instead of defining it as a
	                 child of the player element (default). i.e. #player.sel-1 .sel-2 vs. #player .sel-1 .sel-2 */
	                elements = utils.prefix(elements, '#' + id + (extendParent ? '' : ' '));
	
	                var o = {};
	                o[attr] = value;
	                utils.css(elements.join(', '), o, id);
	            }
	
	            // We can assume that the user will define both an active and inactive color because otherwise it doesn't look good
	            var activeColor = _model.get('skinColorActive');
	            var inactiveColor = _model.get('skinColorInactive');
	            var backgroundColor = _model.get('skinColorBackground');
	
	            // These will use standard style names for CSS since they are added directly to a style sheet
	            // Using background instead of background-color so we don't have to clear gradients with background-image
	            if (activeColor) {
	                // Apply active color
	                addStyle([
	                // Toggle and menu button active colors
	                '.jw-button-color.jw-toggle', '.jw-button-color:hover', '.jw-button-color.jw-toggle.jw-off:hover', '.jw-option:not(.jw-active-option):hover', '.jw-nextup-header'], 'color', activeColor);
	                addStyle([
	                // menu active option
	                '.jw-option.jw-active-option',
	                // slider fill color
	                '.jw-progress'], 'background', 'none ' + activeColor);
	            }
	
	            if (inactiveColor) {
	                // Apply inactive color
	                addStyle([
	                // text color of many ui elements
	                '.jw-text',
	                // menu option text
	                '.jw-option',
	                // controlbar button colors
	                '.jw-button-color',
	                // toggle button
	                '.jw-toggle.jw-off', '.jw-skip .jw-skip-icon', '.jw-nextup-body'], 'color', inactiveColor);
	                addStyle([
	                // slider children
	                '.jw-cue', '.jw-knob', '.jw-active-option', '.jw-nextup-header'], 'background', 'none ' + inactiveColor);
	            }
	
	            if (backgroundColor) {
	                // Apply background color
	                addStyle([
	                // general background color
	                '.jw-background-color'], 'background', 'none ' + backgroundColor);
	
	                if (_model.get('timeSliderAbove') !== false) {
	                    var backgroundColorGradient = 'transparent linear-gradient(180deg, ' + utils.getRgba(backgroundColor, 0) + ' 0%, ' + utils.getRgba(backgroundColor, 0.25) + ' 30%, ' + utils.getRgba(backgroundColor, 0.4) + ' 70%, ' + utils.getRgba(backgroundColor, 0.5) + ') 100%';
	
	                    addStyle([
	                    // for small player, set the control bar gradient to the config background color
	                    '.jw-flag-time-slider-above .jw-background-color.jw-controlbar'], 'background', backgroundColorGradient, true);
	                }
	
	                // remove the config background on time slider
	                addStyle(['.jw-flag-time-slider-above .jw-background-color.jw-slider-time'], 'background', 'transparent', true);
	            }
	
	            insertGlobalColorClasses(activeColor, inactiveColor, id);
	        };
	
	        this.setup = function () {
	            var _this2 = this;
	
	            _preview.setup(_playerElement.querySelector('.jw-preview'));
	            _title.setup(_playerElement.querySelector('.jw-title'));
	
	            _logo = new Logo(_model);
	            _logo.setup();
	            _logo.setContainer(_playerElement);
	            _logo.on(events.JWPLAYER_LOGO_CLICK, _logoClickHandler);
	
	            // captions rendering
	            _captionsRenderer.setup(_playerElement.id, _model.get('captions'));
	
	            // captions should be place behind controls, and not hidden when controls are hidden
	            _playerElement.insertBefore(_captionsRenderer.element(), _title.element());
	
	            // Display Click and Double Click Handling
	            displayClickHandler = clickHandlerHelper(_api, _model, _videoLayer);
	
	            focusHelper = flagNoFocus(_playerElement);
	            fullscreenHelpers = requestFullscreenHelper(_playerElement, document, _fullscreenChangeHandler);
	
	            _playerElement.addEventListener('focus', onFocus);
	
	            _model.on('change:errorEvent', _errorHandler);
	            _model.on('change:hideAdsControls', function (model, val) {
	                utils.toggleClass(_playerElement, 'jw-flag-ads-hide-controls', val);
	            });
	            _model.on('change:scrubbing', function (model, val) {
	                utils.toggleClass(_playerElement, 'jw-flag-dragging', val);
	            });
	            // Native fullscreen (coming through from the provider)
	            _model.mediaController.on('fullscreenchange', _fullscreenChangeHandler);
	
	            _model.change('mediaModel', function (model, mediaModel) {
	                mediaModel.change('mediaType', _onMediaTypeChange, _this2);
	                mediaModel.on('change:visualQuality', function () {
	                    _resizeMedia();
	                }, _this2);
	            });
	            _model.change('skin', onSkinChange, this);
	            _model.change('stretching', onStretchChange);
	            _model.change('flashBlocked', onFlashBlockedChange);
	
	            var width = _model.get('width');
	            var height = _model.get('height');
	            _resizePlayer(width, height);
	            _model.change('aspectratio', onAspectRatioChange);
	            if (_model.get('controls')) {
	                updateContainerStyles(width, height);
	            } else {
	                utils.addClass(_playerElement, 'jw-flag-controls-hidden');
	            }
	
	            if (!stylesInjected) {
	                stylesInjected = true;
	                __webpack_require__(/*! css/jwplayer.less */ 131);
	            }
	            if (_isIE) {
	                utils.addClass(_playerElement, 'jw-ie');
	            }
	            // Hide control elements until skin is loaded
	            if (_model.get('skin-loading') === true) {
	                utils.addClass(_playerElement, 'jw-flag-skin-loading');
	                _model.once('change:skin-loading', function () {
	                    utils.removeClass(_playerElement, 'jw-flag-skin-loading');
	                });
	            }
	            this.handleColorOverrides();
	
	            // adds video tag to video layer
	            _model.set('mediaContainer', _videoLayer);
	            _model.set('iFrame', utils.isIframe());
	            _model.set('activeTab', (0, _activeTab2.default)());
	            _model.set('touchMode', _isMobile && (typeof height === 'string' || height >= _audioMode.CONTROLBAR_ONLY_HEIGHT));
	
	            _viewsManager2.default.add(this);
	
	            this.isSetup = true;
	            _model.set('viewSetup', true);
	            _model.set('inDom', document.body.contains(_playerElement));
	        };
	
	        function updateVisibility() {
	            _model.set('visibility', (0, _visibility2.default)(_model, _playerElement, _bounds));
	        }
	
	        this.init = function () {
	            this.updateBounds();
	
	            _model.on('change:fullscreen', _fullscreen);
	            _model.on('change:activeTab', updateVisibility);
	            _model.on('change:fullscreen', updateVisibility);
	            _model.on('change:intersectionRatio', updateVisibility);
	            _model.on('change:visibility', redraw);
	
	            updateVisibility();
	
	            // Always draw first player for icons to load
	            if (_viewsManager2.default.size() === 1 && !_model.get('visibility')) {
	                redraw(_model, 1, 0);
	            }
	
	            _model.change('state', _stateHandler);
	            _model.change('controls', changeControls);
	            // Set the title attribute of the video tag to display background media information on mobile devices
	            if (_isMobile) {
	                setMediaTitleAttribute(_model.get('playlistItem'));
	                _model.on('itemReady', setMediaTitleAttribute);
	            }
	
	            // Triggering 'resize' resulting in player 'ready'
	            _lastWidth = _lastHeight = null;
	            this.checkResized();
	        };
	
	        function changeControls(model, enable) {
	            if (enable) {
	                if (!ControlsModule) {
	                    ControlsLoader.load().then(function (Controls) {
	                        ControlsModule = Controls;
	                        addControls();
	                    }).catch(function (reason) {
	                        _this.trigger('error', {
	                            message: 'Controls failed to load',
	                            reason: reason
	                        });
	                    });
	                } else {
	                    addControls();
	                }
	            } else {
	                _this.removeControls();
	            }
	        }
	
	        function addControls() {
	            var controls = new ControlsModule(document, _this.element());
	            _this.addControls(controls);
	        }
	
	        function setMediaTitleAttribute(item) {
	            var videotag = _videoLayer.querySelector('video, audio');
	            // Youtube, chromecast and flash providers do no support video tags
	            if (!videotag) {
	                return;
	            }
	
	            // Writing a string to innerHTML completely decodes multiple-encoded strings
	            var dummyDiv = document.createElement('div');
	            dummyDiv.innerHTML = item.title || '';
	            videotag.setAttribute('title', dummyDiv.textContent);
	        }
	
	        function redraw(model, visibility, lastVisibility) {
	            if (visibility && !lastVisibility) {
	                _stateHandler(_instreamModel || model);
	                _this.updateStyles();
	            }
	        }
	
	        function clickHandlerHelper(api, model, videoLayer) {
	            var clickHandler = new ClickHandler(model, videoLayer, { useHover: true });
	            clickHandler.on({
	                click: function click() {
	                    _this.trigger(events.JWPLAYER_DISPLAY_CLICK);
	                    if (_model.get('controls')) {
	                        api.play(reasonInteraction());
	                    }
	                },
	                tap: function tap() {
	                    _this.trigger(events.JWPLAYER_DISPLAY_CLICK);
	                    var state = model.get('state');
	                    var controls = _model.get('controls');
	
	                    if (controls && (state === states.IDLE || state === states.COMPLETE || _instreamModel && _instreamModel.get('state') === states.PAUSED)) {
	                        api.play(reasonInteraction());
	                    }
	                    if (controls && state === states.PAUSED) {
	                        // Toggle visibility of the controls when tapping the media
	                        // Do not add mobile toggle "jw-flag-controls-hidden" in these cases
	                        if (_instreamModel || model.get('castActive') || model.mediaModel && model.mediaModel.get('mediaType') === 'audio') {
	                            return;
	                        }
	                        utils.toggleClass(_playerElement, 'jw-flag-controls-hidden');
	                        _captionsRenderer.renderCues(true);
	                    } else if (_controls) {
	                        if (!_controls.showing) {
	                            _controls.userActive();
	                        } else {
	                            _controls.userInactive();
	                        }
	                    }
	                },
	                doubleClick: function doubleClick() {
	                    return _controls && api.setFullscreen();
	                },
	                move: function move() {
	                    return _controls && _controls.userActive();
	                },
	                over: function over() {
	                    return _controls && _controls.userActive();
	                }
	            });
	            return clickHandler;
	        }
	
	        function onSkinChange(model, newSkin) {
	            utils.replaceClass(_playerElement, /jw-skin-\S+/, newSkin ? 'jw-skin-' + newSkin : '');
	        }
	
	        function onStretchChange(model, newVal) {
	            utils.replaceClass(_playerElement, /jw-stretch-\S+/, 'jw-stretch-' + newVal);
	        }
	
	        function onAspectRatioChange(model, aspectratio) {
	            utils.toggleClass(_playerElement, 'jw-flag-aspect-mode', !!aspectratio);
	            var aspectRatioContainer = _playerElement.querySelector('.jw-aspect');
	            _styles(aspectRatioContainer, {
	                paddingTop: aspectratio || null
	            });
	        }
	
	        function onFlashBlockedChange(model, isBlocked) {
	            utils.toggleClass(_playerElement, 'jw-flag-flash-blocked', isBlocked);
	        }
	
	        function _logoClickHandler(evt) {
	            if (!evt.link) {
	                // _togglePlay();
	                if (_model.get('controls')) {
	                    _api.play(reasonInteraction());
	                }
	            } else {
	                _api.pause(true, reasonInteraction());
	                _api.setFullscreen(false);
	                window.open(evt.link, evt.linktarget);
	            }
	        }
	
	        var _onChangeControls = function _onChangeControls(model, bool) {
	            if (bool) {
	                // ignore model that triggered this event and use current state model
	                _stateHandler(_instreamModel || _model);
	            }
	        };
	
	        this.addControls = function (controls) {
	            _controls = controls;
	
	            utils.removeClass(_playerElement, 'jw-flag-controls-hidden');
	
	            _model.change('streamType', _setLiveMode, this);
	
	            controls.enable(_api, _model);
	            controls.addActiveListeners(_logo.element());
	
	            var logoContainer = controls.logoContainer();
	            if (logoContainer) {
	                _logo.setContainer(logoContainer);
	            }
	
	            // refresh breakpoint and timeslider classes
	            if (_lastHeight) {
	                updateContainerStyles(_lastWidth, _lastHeight);
	                controls.resize(_lastWidth, _lastHeight);
	                _captionsRenderer.renderCues(true);
	            }
	
	            controls.on('userActive userInactive', function () {
	                if (_playerState === states.PLAYING || _playerState === states.BUFFERING) {
	                    _captionsRenderer.renderCues(true);
	                }
	            });
	
	            controls.on('all', _this.trigger, _this);
	
	            var overlaysElement = _playerElement.querySelector('.jw-overlays');
	            overlaysElement.addEventListener('mousemove', _userActivityCallback);
	        };
	
	        this.removeControls = function () {
	            _logo.setContainer(_playerElement);
	
	            if (_controls) {
	                _controls.removeActiveListeners(_logo.element());
	                _controls.disable();
	                _controls = null;
	            }
	
	            var overlay = document.querySelector('.jw-overlays');
	            if (overlay) {
	                overlay.removeEventListener('mousemove', _userActivityCallback);
	            }
	
	            utils.addClass(_playerElement, 'jw-flag-controls-hidden');
	        };
	
	        // Perform the switch to fullscreen
	        var _fullscreen = function _fullscreen(model, state) {
	
	            // If it supports DOM fullscreen
	            var provider = _model.getVideo();
	
	            // Unmute the video so volume can be adjusted with native controls in fullscreen
	            if (state && _controls && _model.get('autostartMuted')) {
	                _controls.unmuteAutoplay(_api, _model);
	            }
	
	            if (fullscreenHelpers.supportsDomFullscreen()) {
	                if (state) {
	                    fullscreenHelpers.requestFullscreen();
	                } else {
	                    fullscreenHelpers.exitFullscreen();
	                }
	                _toggleDOMFullscreen(_playerElement, state);
	            } else if (_isIE) {
	                _toggleDOMFullscreen(_playerElement, state);
	            } else {
	                // else use native fullscreen
	                if (_instreamModel && _instreamModel.getVideo()) {
	                    _instreamModel.getVideo().setFullscreen(state);
	                }
	                provider.setFullscreen(state);
	            }
	            // pass fullscreen state to Flash provider
	            // provider.getName() is the same as _api.getProvider() or _model.get('provider')
	            if (provider && provider.getName().name.indexOf('flash') === 0) {
	                provider.setFullscreen(state);
	            }
	        };
	
	        function _resizePlayer(playerWidth, playerHeight, resetAspectMode) {
	            var widthSet = utils.exists(playerWidth);
	            var heightSet = utils.exists(playerHeight);
	            var playerStyle = {
	                width: playerWidth
	            };
	
	            // when jwResize is called remove aspectMode and force layout
	            if (heightSet && resetAspectMode) {
	                _model.set('aspectratio', null);
	            }
	            if (!_model.get('aspectratio')) {
	                playerStyle.height = playerHeight;
	            }
	
	            if (widthSet && heightSet) {
	                _model.set('width', playerWidth);
	                _model.set('height', playerHeight);
	            }
	
	            _styles(_playerElement, playerStyle);
	        }
	
	        function _resizeMedia(containerWidth, containerHeight) {
	            if (!containerWidth || isNaN(1 * containerWidth)) {
	                containerWidth = _model.get('containerWidth');
	                if (!containerWidth) {
	                    return;
	                }
	            }
	            if (!containerHeight || isNaN(1 * containerHeight)) {
	                containerHeight = _model.get('containerHeight');
	                if (!containerHeight) {
	                    return;
	                }
	            }
	
	            if (_preview) {
	                _preview.resize(containerWidth, containerHeight, _model.get('stretching'));
	            }
	
	            var provider = _model.getVideo();
	            if (!provider) {
	                return;
	            }
	            var transformScale = provider.resize(containerWidth, containerHeight, _model.get('stretching'));
	
	            // poll resizing if video is transformed
	            if (transformScale) {
	                clearTimeout(_resizeMediaTimeout);
	                _resizeMediaTimeout = setTimeout(_resizeMedia, 250);
	            }
	        }
	
	        this.resize = function (playerWidth, playerHeight) {
	            var resetAspectMode = true;
	            _resizePlayer(playerWidth, playerHeight, resetAspectMode);
	            _responsiveUpdate();
	        };
	        this.resizeMedia = _resizeMedia;
	
	        /**
	         * Return whether or not we're in native fullscreen
	         */
	        function _isNativeFullscreen() {
	            if (fullscreenHelpers.supportsDomFullscreen()) {
	                var fsElement = fullscreenHelpers.fullscreenElement();
	                return !!(fsElement && fsElement.id === _model.get('id'));
	            }
	            // if player element view fullscreen not available, return video fullscreen state
	            return _instreamModel ? _instreamModel.getVideo().getFullScreen() : _model.getVideo().getFullScreen();
	        }
	
	        function _fullscreenChangeHandler(event) {
	            var modelState = _model.get('fullscreen');
	            var newState = event.jwstate !== undefined ? event.jwstate : _isNativeFullscreen();
	
	            // If fullscreen was triggered by something other than the player
	            //  then we want to sync up our internal state
	            if (modelState !== newState) {
	                _model.set('fullscreen', newState);
	            }
	
	            _responsiveListener();
	            clearTimeout(_resizeMediaTimeout);
	            _resizeMediaTimeout = setTimeout(_resizeMedia, 200);
	        }
	
	        function _toggleDOMFullscreen(playerElement, fullscreenState) {
	            utils.toggleClass(playerElement, 'jw-flag-fullscreen', fullscreenState);
	            _styles(document.body, { overflowY: fullscreenState ? 'hidden' : '' });
	
	            if (fullscreenState && _controls) {
	                // When going into fullscreen, we want the control bar to fade after a few seconds
	                _controls.userActive();
	            }
	
	            _resizeMedia();
	            _responsiveListener();
	        }
	
	        function _userActivityCallback() /* event */{
	            _controls.userActive();
	        }
	
	        function _onMediaTypeChange(model, val) {
	            var isAudioFile = val === 'audio';
	            var provider = _model.getVideo();
	            var isFlash = provider && provider.getName().name.indexOf('flash') === 0;
	
	            utils.toggleClass(_playerElement, 'jw-flag-media-audio', isAudioFile);
	
	            if (isAudioFile && !isFlash) {
	                // Put the preview element before the media element in order to display browser captions
	                _playerElement.insertBefore(_preview.el, _videoLayer);
	            } else {
	                // Put the preview element before the captions element to display captions with the captions renderer
	                _playerElement.insertBefore(_preview.el, _captionsRenderer.element());
	            }
	        }
	
	        function _setLiveMode(model, streamType) {
	            if (!_instreamModel) {
	                var live = streamType === 'LIVE';
	                utils.toggleClass(_playerElement, 'jw-flag-live', live);
	                _this.setAltText(live ? model.get('localization').liveBroadcast : '');
	            }
	        }
	
	        function _errorHandler(model, evt) {
	            if (!evt) {
	                _title.playlistItem(model, model.get('playlistItem'));
	                return;
	            }
	            if (evt.name) {
	                _title.updateText(evt.name, evt.message);
	            } else {
	                _title.updateText(evt.message, '');
	            }
	        }
	
	        function _stateHandler(model) {
	            if (!_model.get('viewSetup')) {
	                return;
	            }
	
	            _playerState = model.get('state');
	
	            var instreamState = null;
	            if (_instreamModel) {
	                instreamState = _playerState;
	            }
	            if (_controls) {
	                _controls.instreamState = instreamState;
	            }
	
	            _stateUpdate(_playerState);
	        }
	
	        function _stateUpdate(state) {
	            if (_model.get('controls') && state !== states.PAUSED && utils.hasClass(_playerElement, 'jw-flag-controls-hidden')) {
	                utils.removeClass(_playerElement, 'jw-flag-controls-hidden');
	            }
	            utils.replaceClass(_playerElement, /jw-state-\S+/, 'jw-state-' + state);
	
	            // Update captions renderer
	            switch (state) {
	                case states.IDLE:
	                case states.ERROR:
	                case states.COMPLETE:
	                    _captionsRenderer.hide();
	                    break;
	                default:
	                    _captionsRenderer.show();
	                    if (state === states.PAUSED && _controls && !_controls.showing) {
	                        _captionsRenderer.renderCues(true);
	                    }
	                    break;
	            }
	        }
	
	        function onFocus() {
	            // On tab-focus, show the control bar for a few seconds
	            if (_controls && !_instreamModel && !_isMobile) {
	                _controls.userActive();
	            }
	        }
	
	        this.setupInstream = function (instreamModel) {
	            this.instreamModel = _instreamModel = instreamModel;
	            _instreamModel.on('change:controls', _onChangeControls, this);
	            _instreamModel.on('change:state', _stateHandler, this);
	
	            utils.addClass(_playerElement, 'jw-flag-ads');
	
	            // Call Controls.userActivity to display the UI temporarily for the start of the ad
	            if (_controls) {
	                _controls.userActive();
	            }
	        };
	
	        this.setAltText = function (text) {
	            _model.set('altText', text);
	        };
	
	        this.destroyInstream = function () {
	            if (_instreamModel) {
	                _instreamModel.off(null, null, this);
	                _instreamModel = null;
	            }
	            this.setAltText('');
	            utils.removeClass(_playerElement, ['jw-flag-ads', 'jw-flag-ads-hide-controls']);
	            _model.set('hideAdsControls', false);
	            if (_model.getVideo) {
	                var provider = _model.getVideo();
	                provider.setContainer(_videoLayer);
	            }
	            _setLiveMode(_model, _model.get('streamType'));
	            // reset display click handler
	            displayClickHandler.revertAlternateClickHandlers();
	        };
	
	        this.addCues = function (cues) {
	            _model.set('cues', cues);
	        };
	
	        this.clickHandler = function () {
	            return displayClickHandler;
	        };
	
	        this.getContainer = this.element = function () {
	            return _playerElement;
	        };
	
	        this.controlsContainer = function () {
	            if (_controls) {
	                return _controls.element();
	            }
	            return null;
	        };
	
	        this.getSafeRegion = function (includeCB) {
	            var bounds = {
	                x: 0,
	                y: 0,
	                width: _lastWidth || 0,
	                height: _lastHeight || 0
	            };
	
	            if (_controls) {
	                // Subtract controlbar from the bottom when using one
	                includeCB = includeCB || !utils.exists(includeCB);
	                if (includeCB) {
	                    bounds.height -= _controls.controlbarHeight();
	                }
	            }
	
	            return bounds;
	        };
	
	        this.setCaptions = function (captionsStyle) {
	            _captionsRenderer.clear();
	            _captionsRenderer.setup(_model.get('id'), captionsStyle);
	            _captionsRenderer.resize();
	        };
	
	        this.destroy = function () {
	            _viewsManager2.default.unobserve(_playerElement);
	            _viewsManager2.default.remove(this);
	            this.isSetup = false;
	            this.off();
	            (0, _requestAnimationFrame.cancelAnimationFrame)(_resizeContainerRequestId);
	            clearTimeout(_resizeMediaTimeout);
	            _playerElement.removeEventListener('focus', onFocus);
	            if (focusHelper) {
	                focusHelper.destroy();
	                focusHelper = null;
	            }
	            if (fullscreenHelpers) {
	                fullscreenHelpers.destroy();
	                fullscreenHelpers = null;
	            }
	            if (_model.mediaController) {
	                _model.mediaController.off('fullscreenchange', _fullscreenChangeHandler);
	            }
	            if (_controls) {
	                _controls.disable();
	            }
	
	            if (_instreamModel) {
	                this.destroyInstream();
	            }
	            if (displayClickHandler) {
	                displayClickHandler.destroy();
	                displayClickHandler = null;
	            }
	            if (_logo) {
	                _logo.destroy();
	                _logo = null;
	            }
	            utils.clearCss(_model.get('id'));
	        };
	    }
	
	    View.prototype.setControlsModule = function (Controls) {
	        ControlsModule = Controls;
	    };
	
	    return View;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 115 */
/*!*********************************!*\
  !*** ./src/templates/player.js ***!
  \*********************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (id) {
	    var ariaLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	    return '<div id="' + id + '" class="jwplayer jw-reset jw-state-setup" tabindex="0" aria-label="' + ariaLabel + '">' + '<div class="jw-aspect jw-reset"></div>' + '<div class="jw-media jw-reset"></div>' + '<div class="jw-preview jw-reset"></div>' + '<div class="jw-title jw-reset">' + '<div class="jw-title-primary jw-reset"></div>' + '<div class="jw-title-secondary jw-reset"></div>' + '</div>' + '<div class="jw-overlays jw-reset"></div>' + '</div>';
	};

/***/ },
/* 116 */
/*!*****************************************!*\
  !*** ./src/js/view/utils/audio-mode.js ***!
  \*****************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var CONTROLBAR_ONLY_HEIGHT = exports.CONTROLBAR_ONLY_HEIGHT = 44;
	
	var isAudioMode = exports.isAudioMode = function isAudioMode(model) {
	    var playerHeight = model.get('height');
	    if (model.get('aspectratio')) {
	        return false;
	    }
	    if (typeof playerHeight === 'string' && playerHeight.indexOf('%') > -1) {
	        return false;
	    }
	
	    // Coerce into Number (don't parse out CSS units)
	    var verticalPixels = playerHeight * 1 || NaN;
	    verticalPixels = !isNaN(verticalPixels) ? verticalPixels : model.get('containerHeight');
	    if (!verticalPixels) {
	        return false;
	    }
	
	    return verticalPixels && verticalPixels <= CONTROLBAR_ONLY_HEIGHT;
	};

/***/ },
/* 117 */
/*!********************************************!*\
  !*** ./src/js/view/utils/views-manager.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _activeTab = __webpack_require__(/*! utils/active-tab */ 118);
	
	var _activeTab2 = _interopRequireDefault(_activeTab);
	
	var _requestAnimationFrame = __webpack_require__(/*! utils/request-animation-frame */ 119);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var views = [];
	
	var intersectionObserver = void 0;
	var responsiveRepaintRequestId = -1;
	
	function lazyInitIntersectionObserver() {
	    var IntersectionObserver = window.IntersectionObserver;
	    if (window.IntersectionObserver && !intersectionObserver) {
	        // Fire the callback every time 25% of the player comes in/out of view
	        intersectionObserver = new IntersectionObserver(function (entries) {
	            if (entries && entries.length) {
	                for (var i = entries.length; i--;) {
	                    var entry = entries[i];
	                    for (var j = views.length; j--;) {
	                        var view = views[j];
	                        if (entry.target === view.getContainer()) {
	                            view.model.set('intersectionRatio', entry.intersectionRatio);
	                            break;
	                        }
	                    }
	                }
	            }
	        }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
	    }
	}
	
	function scheduleResponsiveRedraw() {
	    (0, _requestAnimationFrame.cancelAnimationFrame)(responsiveRepaintRequestId);
	    responsiveRepaintRequestId = (0, _requestAnimationFrame.requestAnimationFrame)(function responsiveRepaint() {
	        views.forEach(function (view) {
	            view.updateBounds();
	        });
	        views.forEach(function (view) {
	            if (view.model.get('visibility')) {
	                view.updateStyles();
	            }
	        });
	        views.forEach(function (view) {
	            view.checkResized();
	        });
	    });
	}
	
	function onVisibilityChange() {
	    views.forEach(function (view) {
	        view.model.set('activeTab', (0, _activeTab2.default)());
	    });
	}
	
	document.addEventListener('visibilitychange', onVisibilityChange);
	document.addEventListener('webkitvisibilitychange', onVisibilityChange);
	window.addEventListener('resize', scheduleResponsiveRedraw);
	window.addEventListener('orientationchange', scheduleResponsiveRedraw);
	
	window.addEventListener('beforeunload', function () {
	    document.removeEventListener('visibilitychange', onVisibilityChange);
	    document.removeEventListener('webkitvisibilitychange', onVisibilityChange);
	    window.removeEventListener('resize', scheduleResponsiveRedraw);
	    window.removeEventListener('orientationchange', scheduleResponsiveRedraw);
	});
	
	exports.default = {
	    add: function add(view) {
	        views.push(view);
	    },
	    remove: function remove(view) {
	        var index = views.indexOf(view);
	        if (index !== -1) {
	            views.splice(index, 1);
	        }
	    },
	    size: function size() {
	        return views.length;
	    },
	    observe: function observe(container) {
	        lazyInitIntersectionObserver();
	        try {
	            intersectionObserver.unobserve(container);
	        } catch (e) {/* catch Exception thrown by Edge 15 browser */}
	        intersectionObserver.observe(container);
	    },
	    unobserve: function unobserve(container) {
	        if (intersectionObserver) {
	            intersectionObserver.unobserve(container);
	        }
	    }
	};

/***/ },
/* 118 */
/*!************************************!*\
  !*** ./src/js/utils/active-tab.js ***!
  \************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function () {
	    if ('hidden' in document) {
	        return function () {
	            return !document.hidden;
	        };
	    }
	    if ('webkitHidden' in document) {
	        return function () {
	            return !document.webkitHidden;
	        };
	    }
	    // document.hidden not supported
	    return function () {
	        return true;
	    };
	}();

/***/ },
/* 119 */
/*!*************************************************!*\
  !*** ./src/js/utils/request-animation-frame.js ***!
  \*************************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var requestAnimationFrame = exports.requestAnimationFrame = window.requestAnimationFrame || function (callback) {
	    return setTimeout(callback, 17);
	};
	
	var cancelAnimationFrame = exports.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

/***/ },
/* 120 */
/*!*****************************************!*\
  !*** ./src/js/view/utils/visibility.js ***!
  \*****************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = getVisibility;
	function getVisibility(model, element, bounds) {
	    // Set visibility to 1 if we're in fullscreen
	    if (model.get('fullscreen')) {
	        return 1;
	    }
	
	    // Set visibility to 0 if we're not in the active tab
	    if (!model.get('activeTab')) {
	        return 0;
	    }
	    // Otherwise, set it to the intersection ratio reported from the intersection observer
	    var intersectionRatio = model.get('intersectionRatio');
	
	    if (intersectionRatio === undefined) {
	        // Get intersectionRatio through brute force
	        intersectionRatio = computeVisibility(element, bounds);
	    }
	
	    return intersectionRatio;
	}
	
	function computeVisibility(target, bounds) {
	    var html = document.documentElement;
	    var body = document.body;
	    var rootRect = {
	        top: 0,
	        left: 0,
	        right: html.clientWidth || body.clientWidth,
	        width: html.clientWidth || body.clientWidth,
	        bottom: html.clientHeight || body.clientHeight,
	        height: html.clientHeight || body.clientHeight
	    };
	
	    if (!body.contains(target)) {
	        return 0;
	    }
	    var targetRect = target.getBoundingClientRect();
	
	    var intersectionRect = targetRect;
	    var parent = target.parentNode;
	    var atRoot = false;
	
	    while (!atRoot) {
	        var parentRect = null;
	        if (!parent || parent.nodeType !== 1) {
	            atRoot = true;
	            parentRect = rootRect;
	        } else if (window.getComputedStyle(parent).overflow !== 'visible') {
	            parentRect = bounds(parent);
	        }
	        if (parentRect) {
	            intersectionRect = computeRectIntersection(parentRect, intersectionRect);
	            if (!intersectionRect) {
	                return 0;
	            }
	        }
	        parent = parent.parentNode;
	    }
	    var targetArea = targetRect.width * targetRect.height;
	    var intersectionArea = intersectionRect.width * intersectionRect.height;
	    return targetArea ? intersectionArea / targetArea : 0;
	}
	
	function computeRectIntersection(rect1, rect2) {
	    var top = Math.max(rect1.top, rect2.top);
	    var bottom = Math.min(rect1.bottom, rect2.bottom);
	    var left = Math.max(rect1.left, rect2.left);
	    var right = Math.min(rect1.right, rect2.right);
	    var width = right - left;
	    var height = bottom - top;
	    return width >= 0 && height >= 0 && {
	        top: top,
	        bottom: bottom,
	        left: left,
	        right: right,
	        width: width,
	        height: height
	    };
	}

/***/ },
/* 121 */
/*!*****************************************!*\
  !*** ./src/js/view/utils/breakpoint.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getBreakpoint = getBreakpoint;
	exports.setBreakpoint = setBreakpoint;
	var domUtils = __webpack_require__(/*! utils/dom */ 14);
	
	function getBreakpoint(width) {
	    var breakpoint = 0;
	
	    if (width >= 1280) {
	        breakpoint = 7;
	    } else if (width >= 960) {
	        breakpoint = 6;
	    } else if (width >= 800) {
	        breakpoint = 5;
	    } else if (width >= 640) {
	        breakpoint = 4;
	    } else if (width >= 540) {
	        breakpoint = 3;
	    } else if (width >= 420) {
	        breakpoint = 2;
	    } else if (width >= 320) {
	        breakpoint = 1;
	    }
	
	    return breakpoint;
	}
	
	function setBreakpoint(playerElement, breakpointNumber) {
	    var breakpointClass = 'jw-breakpoint-' + breakpointNumber;
	    domUtils.replaceClass(playerElement, /jw-breakpoint-\d+/, breakpointClass);
	}

/***/ },
/* 122 */
/*!********************************************************!*\
  !*** ./src/js/view/utils/request-fullscreen-helper.js ***!
  \********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	
	    var DOCUMENT_FULLSCREEN_EVENTS = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
	
	    return function (elementContext, documentContext, changeCallback) {
	        var _requestFullscreen = elementContext.requestFullscreen || elementContext.webkitRequestFullscreen || elementContext.webkitRequestFullScreen || elementContext.mozRequestFullScreen || elementContext.msRequestFullscreen;
	
	        var _exitFullscreen = documentContext.exitFullscreen || documentContext.webkitExitFullscreen || documentContext.webkitCancelFullScreen || documentContext.mozCancelFullScreen || documentContext.msExitFullscreen;
	
	        var _supportsDomFullscreen = !!(_requestFullscreen && _exitFullscreen);
	
	        for (var i = DOCUMENT_FULLSCREEN_EVENTS.length; i--;) {
	            documentContext.addEventListener(DOCUMENT_FULLSCREEN_EVENTS[i], changeCallback);
	        }
	
	        return {
	            events: DOCUMENT_FULLSCREEN_EVENTS,
	            supportsDomFullscreen: function supportsDomFullscreen() {
	                return _supportsDomFullscreen;
	            },
	            requestFullscreen: function requestFullscreen() {
	                _requestFullscreen.apply(elementContext);
	            },
	            exitFullscreen: function exitFullscreen() {
	                _exitFullscreen.apply(documentContext);
	            },
	            fullscreenElement: function fullscreenElement() {
	                return documentContext.fullscreenElement || documentContext.webkitCurrentFullScreenElement || documentContext.mozFullScreenElement || documentContext.msFullscreenElement;
	            },
	            destroy: function destroy() {
	                for (i = DOCUMENT_FULLSCREEN_EVENTS.length; i--;) {
	                    documentContext.removeEventListener(DOCUMENT_FULLSCREEN_EVENTS[i], changeCallback);
	                }
	            }
	        };
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 123 */
/*!********************************************!*\
  !*** ./src/js/view/utils/flag-no-focus.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/dom */ 14)], __WEBPACK_AMD_DEFINE_RESULT__ = function (dom) {
	
	    return function (elementContext) {
	        var _focusFromClick = false;
	
	        var onBlur = function onBlur() {
	            _focusFromClick = false;
	            dom.removeClass(elementContext, 'jw-no-focus');
	        };
	
	        var onMouseDown = function onMouseDown() {
	            _focusFromClick = true;
	            dom.addClass(elementContext, 'jw-no-focus');
	        };
	
	        var onFocus = function onFocus() {
	            if (!_focusFromClick) {
	                onBlur();
	            }
	        };
	
	        elementContext.addEventListener('focus', onFocus);
	        elementContext.addEventListener('blur', onBlur);
	        elementContext.addEventListener('mousedown', onMouseDown);
	
	        return {
	            destroy: function destroy() {
	                elementContext.removeEventListener('focus', onFocus);
	                elementContext.removeEventListener('blur', onBlur);
	                elementContext.removeEventListener('mousedown', onMouseDown);
	            }
	        };
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 124 */
/*!*******************************************!*\
  !*** ./src/js/view/utils/clickhandler.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/ui */ 78), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (UI, events, Events, _) {
	
	    return function () {
	        function ClickHandler(model, element, options) {
	            _classCallCheck(this, ClickHandler);
	
	            _.extend(this, Events);
	
	            this.revertAlternateClickHandlers();
	            this.domElement = element;
	            this.model = model;
	
	            var defaultOptions = { enableDoubleTap: true, useMove: true };
	            this.ui = new UI(element, _.extend(defaultOptions, options)).on({
	                'click tap': this.clickHandler,
	                'doubleClick doubleTap': function doubleClickDoubleTap() {
	                    if (this.alternateDoubleClickHandler) {
	                        this.alternateDoubleClickHandler();
	                        return;
	                    }
	                    this.trigger('doubleClick');
	                },
	                move: function move() {
	                    this.trigger('move');
	                },
	                over: function over() {
	                    this.trigger('over');
	                },
	                out: function out() {
	                    this.trigger('out');
	                }
	            }, this);
	        }
	
	        _createClass(ClickHandler, [{
	            key: 'destroy',
	            value: function destroy() {
	                if (this.ui) {
	                    this.ui.destroy();
	                    this.ui = this.domElement = this.model = null;
	                    this.revertAlternateClickHandlers();
	                }
	            }
	        }, {
	            key: 'clickHandler',
	            value: function clickHandler(evt) {
	                if (this.model.get('flashBlocked')) {
	                    return;
	                }
	                if (this.alternateClickHandler) {
	                    this.alternateClickHandler(evt);
	                    return;
	                }
	                this.trigger(evt.type === events.touchEvents.CLICK ? 'click' : 'tap');
	            }
	        }, {
	            key: 'element',
	            value: function element() {
	                return this.domElement;
	            }
	        }, {
	            key: 'setAlternateClickHandlers',
	            value: function setAlternateClickHandlers(clickHandler, doubleClickHandler) {
	                this.alternateClickHandler = clickHandler;
	                this.alternateDoubleClickHandler = doubleClickHandler || null;
	            }
	        }, {
	            key: 'revertAlternateClickHandlers',
	            value: function revertAlternateClickHandlers() {
	                this.alternateClickHandler = null;
	                this.alternateDoubleClickHandler = null;
	            }
	        }]);
	
	        return ClickHandler;
	    }();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 125 */
/*!*****************************************!*\
  !*** ./src/js/view/captionsrenderer.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/css */ 16), __webpack_require__(/*! utils/dom */ 14), __webpack_require__(/*! events/states */ 31), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (utils, cssUtils, dom, states, _) {
	    /** Component that renders the actual captions on screen. **/
	    var CaptionsRenderer;
	    var _style = cssUtils.style;
	
	    var _defaults = {
	        back: true,
	        backgroundOpacity: 50,
	        edgeStyle: null,
	        fontSize: 14,
	        fontOpacity: 100,
	        fontScale: 0.05, // Default captions font size = 1/20th of the video's height
	        preprocessor: _.identity,
	        windowOpacity: 0
	    };
	
	    CaptionsRenderer = function CaptionsRenderer(_model) {
	
	        var _options = {};
	        var _captionsTrack;
	        var _currentCues;
	        var _timeEvent;
	        var _display;
	        var _captionsWindow;
	        var _textContainer;
	        var _WebVTT;
	        var _fontScale;
	        var _windowStyle;
	
	        _display = document.createElement('div');
	        _display.className = 'jw-captions jw-reset';
	
	        this.show = function () {
	            dom.addClass(_display, 'jw-captions-enabled');
	        };
	
	        this.hide = function () {
	            dom.removeClass(_display, 'jw-captions-enabled');
	        };
	
	        // Assign list of captions to the renderer
	        this.populate = function (captions) {
	            if (_model.get('renderCaptionsNatively')) {
	                return;
	            }
	
	            _currentCues = [];
	            _captionsTrack = captions;
	            if (!captions) {
	                _currentCues = [];
	                this.renderCues();
	                return;
	            }
	            this.selectCues(captions, _timeEvent);
	        };
	
	        this.resize = function () {
	            _setFontSize();
	            this.renderCues(true);
	        };
	
	        this.renderCues = function (updateBoxPosition) {
	            updateBoxPosition = !!updateBoxPosition;
	            if (_WebVTT) {
	                _WebVTT.processCues(window, _currentCues, _display, updateBoxPosition);
	            }
	        };
	
	        this.selectCues = function (track, timeEvent) {
	            var cues;
	            var pos;
	
	            if (!track || !track.data || !timeEvent) {
	                return;
	            }
	
	            pos = this.getAlignmentPosition(track, timeEvent);
	            if (pos === false) {
	                return;
	            }
	
	            cues = this.getCurrentCues(track.data, pos);
	
	            this.updateCurrentCues(cues);
	            this.renderCues(true);
	        };
	
	        this.getCurrentCues = function (allCues, pos) {
	            return _.filter(allCues, function (cue) {
	                return pos >= cue.startTime && (!cue.endTime || pos <= cue.endTime);
	            });
	        };
	
	        this.updateCurrentCues = function (cues) {
	            // Render with vtt.js if there are cues, clear if there are none
	            if (!cues.length) {
	                _currentCues = [];
	            } else if (_.difference(cues, _currentCues).length) {
	                dom.addClass(_captionsWindow, 'jw-captions-window-active');
	                _currentCues = cues;
	            }
	
	            return _currentCues;
	        };
	
	        this.getAlignmentPosition = function (track, timeEvent) {
	            var source = track.source;
	            var metadata = timeEvent.metadata;
	
	            // subtitles with "source" time must be synced with "metadata[source]"
	            if (source) {
	                if (metadata && _.isNumber(metadata[source])) {
	                    return metadata[source];
	                }
	                return;
	            } else if (timeEvent.duration < 0) {
	                // When the duration is negative (DVR mode), make alignmentPosition positive to align captions
	                return timeEvent.position - timeEvent.duration;
	            }
	
	            // Default to syncing with current position
	            return timeEvent.position;
	        };
	
	        this.clear = function () {
	            utils.empty(_display);
	        };
	
	        /** Constructor for the renderer. **/
	        this.setup = function (playerElementId, options) {
	            _captionsWindow = document.createElement('div');
	            _textContainer = document.createElement('span');
	            _captionsWindow.className = 'jw-captions-window jw-reset';
	            _textContainer.className = 'jw-captions-text jw-reset';
	
	            _options = _.extend({}, _defaults, options);
	
	            _fontScale = _defaults.fontScale;
	            _setFontScale(_options.fontSize);
	
	            var windowColor = _options.windowColor;
	            var windowOpacity = _options.windowOpacity;
	            var edgeStyle = _options.edgeStyle;
	            _windowStyle = {};
	            var textStyle = {};
	
	            _addTextStyle(textStyle, _options);
	
	            if (windowColor || windowOpacity !== _defaults.windowOpacity) {
	                _windowStyle.backgroundColor = cssUtils.hexToRgba(windowColor || '#000000', windowOpacity);
	            }
	
	            _addEdgeStyle(edgeStyle, textStyle, _options.fontOpacity);
	
	            if (!_options.back && edgeStyle === null) {
	                _addEdgeStyle('uniform', textStyle);
	            }
	
	            _style(_captionsWindow, _windowStyle);
	            _style(_textContainer, textStyle);
	            _setupCaptionStyles(playerElementId, textStyle);
	
	            _captionsWindow.appendChild(_textContainer);
	            _display.appendChild(_captionsWindow);
	
	            this.populate(_model.get('captionsTrack'));
	            _model.set('captions', _options);
	        };
	
	        this.element = function () {
	            return _display;
	        };
	
	        function _setFontScale() {
	            if (!_.isFinite(_options.fontSize)) {
	                return;
	            }
	
	            var height = _model.get('containerHeight');
	
	            if (!height) {
	                _model.once('change:containerHeight', _setFontScale);
	                return;
	            }
	
	            // Adjust scale based on font size relative to the default
	            _fontScale = _defaults.fontScale * _options.fontSize / _defaults.fontSize;
	        }
	
	        function _setFontSize() {
	            var height = _model.get('containerHeight');
	
	            if (!height) {
	                return;
	            }
	
	            var fontSize = Math.round(height * _fontScale);
	
	            if (_model.get('renderCaptionsNatively')) {
	                _setShadowDOMFontSize(_model.get('id'), fontSize);
	            } else {
	                _style(_display, {
	                    fontSize: fontSize + 'px'
	                });
	            }
	        }
	
	        function _setupCaptionStyles(playerId, textStyle) {
	            _setFontSize();
	            _styleNativeCaptions(playerId, textStyle);
	            _stylePlayerCaptions(playerId, textStyle);
	        }
	
	        function _stylePlayerCaptions(playerId, textStyle) {
	            // VTT.js DOM window and text styles
	            cssUtils.css('#' + playerId + ' .jw-text-track-display', _windowStyle, playerId);
	            cssUtils.css('#' + playerId + ' .jw-text-track-cue', textStyle, playerId);
	        }
	
	        function _styleNativeCaptions(playerId, textStyle) {
	            if (utils.isSafari()) {
	                // Only Safari uses a separate element for styling text background
	                cssUtils.css('#' + playerId + ' .jw-video::-webkit-media-text-track-display-backdrop', {
	                    backgroundColor: textStyle.backgroundColor
	                }, playerId, true);
	            }
	
	            cssUtils.css('#' + playerId + ' .jw-video::-webkit-media-text-track-display', _windowStyle, playerId, true);
	            cssUtils.css('#' + playerId + ' .jw-video::cue', textStyle, playerId, true);
	        }
	
	        function _setShadowDOMFontSize(playerId, fontSize) {
	            // Set Shadow DOM font size (needs to be important to override browser's in line style)
	            _windowStyle.fontSize = fontSize + 'px';
	            cssUtils.css('#' + playerId + ' .jw-video::-webkit-media-text-track-display', _windowStyle, playerId, true);
	        }
	
	        function _addTextStyle(textStyle, options) {
	            var color = options.color;
	            var fontOpacity = options.fontOpacity;
	            if (color || fontOpacity !== _defaults.fontOpacity) {
	                textStyle.color = cssUtils.hexToRgba(color || '#ffffff', fontOpacity);
	            }
	
	            if (options.back) {
	                var bgColor = options.backgroundColor;
	                var bgOpacity = options.backgroundOpacity;
	                if (bgColor !== _defaults.backgroundColor || bgOpacity !== _defaults.backgroundOpacity) {
	                    textStyle.backgroundColor = cssUtils.hexToRgba(bgColor, bgOpacity);
	                }
	            } else {
	                textStyle.background = 'transparent';
	            }
	
	            if (options.fontFamily) {
	                textStyle.fontFamily = options.fontFamily;
	            }
	
	            if (options.fontStyle) {
	                textStyle.fontStyle = options.fontStyle;
	            }
	
	            if (options.fontWeight) {
	                textStyle.fontWeight = options.fontWeight;
	            }
	
	            if (options.textDecoration) {
	                textStyle.textDecoration = options.textDecoration;
	            }
	        }
	
	        function _addEdgeStyle(option, style, fontOpacity) {
	            var color = cssUtils.hexToRgba('#000000', fontOpacity);
	            if (option === 'dropshadow') {
	                // small drop shadow
	                style.textShadow = '0 2px 1px ' + color;
	            } else if (option === 'raised') {
	                // larger drop shadow
	                style.textShadow = '0 0 5px ' + color + ', 0 1px 5px ' + color + ', 0 2px 5px ' + color;
	            } else if (option === 'depressed') {
	                // top down shadow
	                style.textShadow = '0 -2px 1px ' + color;
	            } else if (option === 'uniform') {
	                // outline
	                style.textShadow = '-2px 0 1px ' + color + ',2px 0 1px ' + color + ',0 -2px 1px ' + color + ',0 2px 1px ' + color + ',-1px 1px 1px ' + color + ',1px 1px 1px ' + color + ',1px -1px 1px ' + color + ',1px 1px 1px ' + color;
	            }
	        }
	
	        function _timeChange(e) {
	            if (_model.get('renderCaptionsNatively')) {
	                return;
	            }
	
	            _timeEvent = e;
	            this.selectCues(_captionsTrack, _timeEvent);
	        }
	
	        function _itemReadyHandler() {
	            // don't load the polyfill or do unnecessary work if rendering natively
	            if (!_model.get('renderCaptionsNatively')) {
	                __webpack_require__.e/* nsure */(9/*! polyfills.vttrenderer */, function (require) {
	                    __webpack_require__(/*! polyfills/vtt */ 126);
	                    _WebVTT = window.WebVTT;
	                });
	            }
	        }
	
	        _model.on('change:playlistItem', function () {
	            _timeEvent = null;
	            _currentCues = [];
	        }, this);
	
	        _model.on('change:captionsTrack', function (model, captionsTrack) {
	            this.populate(captionsTrack);
	        }, this);
	
	        _model.mediaController.on('seek', function () {
	            _currentCues = [];
	        }, this);
	
	        _model.mediaController.on('time seek', _timeChange, this);
	
	        _model.mediaController.on('subtitlesTrackData', function () {
	            // update captions after a provider's subtitle track changes
	            this.selectCues(_captionsTrack, _timeEvent);
	        }, this);
	
	        _model.on('itemReady', _itemReadyHandler, this);
	    };
	
	    return CaptionsRenderer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 126 */,
/* 127 */
/*!*****************************!*\
  !*** ./src/js/view/logo.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _logo2 = __webpack_require__(/*! templates/logo */ 128);
	
	var _logo3 = _interopRequireDefault(_logo2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/ui */ 78), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/backbone.events */ 29)], __WEBPACK_AMD_DEFINE_RESULT__ = function (UI, utils, events, _, Events) {
	    var _styles = utils.style;
	
	    var LogoDefaults = {
	        linktarget: '_blank',
	        margin: 8,
	        hide: false,
	        position: 'top-right'
	    };
	
	    return function Logo(_model) {
	        _.extend(this, Events);
	
	        var _logo;
	        var _settings;
	        var _img = new Image();
	
	        this.setup = function () {
	            _settings = _.extend({}, LogoDefaults, _model.get('logo'));
	            if (!_settings.file) {
	                return;
	            }
	
	            _settings.position = _settings.position || LogoDefaults.position;
	            _settings.hide = _settings.hide.toString() === 'true';
	
	            if (!_logo) {
	                _logo = utils.createElement((0, _logo3.default)(_settings.position, _settings.hide));
	            }
	
	            _model.set('logo', _settings);
	
	            _model.change('dock', accommodateDock);
	            _model.on('change:controls', accommodateDock);
	
	            // apply styles onload when image width and height are known
	            _img.onload = function () {
	                // update logo style
	                var style = {
	                    backgroundImage: 'url("' + this.src + '")',
	                    width: this.width,
	                    height: this.height
	                };
	                if (_settings.margin !== LogoDefaults.margin) {
	                    var positions = /(\w+)-(\w+)/.exec(_settings.position);
	                    if (positions.length === 3) {
	                        style['margin-' + positions[1]] = _settings.margin;
	                        style['margin-' + positions[2]] = _settings.margin;
	                    }
	                }
	                _styles(_logo, style);
	
	                // update title
	                _model.set('logoWidth', style.width);
	            };
	
	            _img.src = _settings.file;
	
	            var logoInteractHandler = new UI(_logo);
	            logoInteractHandler.on('click tap', function (evt) {
	                if (utils.exists(evt) && evt.stopPropagation) {
	                    evt.stopPropagation();
	                }
	
	                this.trigger(events.JWPLAYER_LOGO_CLICK, {
	                    link: _settings.link,
	                    linktarget: _settings.linktarget
	                });
	            }, this);
	        };
	
	        this.setContainer = function (container) {
	            if (_logo) {
	                var dock = container.querySelector('.jw-dock');
	
	                // Dock must be a child of this container, to insert the logo before it when "controls" is true.
	                if (dock && dock.parentNode === container) {
	                    container.insertBefore(_logo, dock);
	                } else {
	                    container.appendChild(_logo);
	                }
	            }
	        };
	
	        this.element = function () {
	            return _logo;
	        };
	
	        this.position = function () {
	            return _settings.position;
	        };
	
	        this.destroy = function () {
	            _model.off('change:dock', accommodateDock);
	            _model.off('change:controls', accommodateDock);
	            _img.onload = null;
	        };
	
	        function accommodateDock() {
	            // When positioned in the top right, the logo needs to be shifted down to accommodate dock buttons
	            var dockButtons = _model.get('dock');
	            var belowDock = !!(dockButtons && dockButtons.length && _settings.position === 'top-right' && _model.get('controls'));
	            utils.toggleClass(_logo, 'jw-below', belowDock);
	        }
	
	        return this;
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 128 */
/*!*******************************!*\
  !*** ./src/templates/logo.js ***!
  \*******************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (position, hide) {
	    var jwhide = hide ? ' jw-hide' : '';
	    return '<div class="jw-logo jw-logo-' + position + jwhide + ' jw-reset"></div>';
	};

/***/ },
/* 129 */
/*!********************************!*\
  !*** ./src/js/view/preview.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/helpers */ 8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, utils) {
	    var Preview = function Preview(_model) {
	        this.model = _model;
	
	        _model.on('change:playlistItem', onPlaylistItem, this);
	        _model.on('change:mediaModel', onMediaModel, this);
	    };
	
	    function onMediaModel(model, mediaModel) {
	        mediaModel.off('change:mediaType', null, this);
	        mediaModel.on('change:mediaType', function (mediaTypeChangeModel, mediaType) {
	            if (mediaType === 'audio') {
	                this.setImage(model.get('playlistItem').image);
	            }
	        }, this);
	    }
	
	    function onPlaylistItem(model, playlistItem) {
	        var delayPosterLoad = model.get('autostart') && !utils.isMobile() || model.get('item') > 0;
	
	        if (delayPosterLoad) {
	            this.setImage(null);
	            model.off('change:state', null, this);
	            model.on('change:state', function (stateChangeModel, state) {
	                if (state === 'complete' || state === 'idle' || state === 'error') {
	                    this.setImage(playlistItem.image);
	                    this.resize(null, null, stateChangeModel.get('stretching'));
	                }
	            }, this);
	            return;
	        }
	
	        this.setImage(playlistItem.image);
	    }
	
	    _.extend(Preview.prototype, {
	        setup: function setup(element) {
	            this.el = element;
	            var playlistItem = this.model.get('playlistItem');
	            if (playlistItem) {
	                this.setImage(playlistItem.image);
	            }
	        },
	        setImage: function setImage(img) {
	            // Remove onload function from previous image
	            var image = this.image;
	            if (image) {
	                image.onload = null;
	                this.image = null;
	            }
	            this.model.off('change:state', null, this);
	            var backgroundImage = '';
	            if (_.isString(img)) {
	                backgroundImage = 'url("' + img + '")';
	                image = this.image = new Image();
	                image.src = img;
	            }
	            utils.style(this.el, {
	                backgroundImage: backgroundImage
	            });
	        },
	        resize: function resize(width, height, stretching) {
	            if (stretching === 'uniform') {
	                if (width) {
	                    this.playerAspectRatio = width / height;
	                }
	                if (!this.playerAspectRatio) {
	                    return;
	                }
	                // snap image to edges when the difference in aspect ratio is less than 9%
	                var image = this.image;
	                var backgroundSize = null;
	                if (image) {
	                    if (image.width === 0) {
	                        var _this = this;
	                        image.onload = function () {
	                            _this.resize(width, height, stretching);
	                        };
	                        return;
	                    }
	                    var imageAspectRatio = image.width / image.height;
	                    if (Math.abs(this.playerAspectRatio - imageAspectRatio) < 0.09) {
	                        backgroundSize = 'cover';
	                    }
	                }
	                utils.style(this.el, {
	                    backgroundSize: backgroundSize
	                });
	            }
	        },
	        element: function element() {
	            return this.el;
	        }
	    });
	
	    return Preview;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 130 */
/*!******************************!*\
  !*** ./src/js/view/title.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/helpers */ 8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, utils) {
	
	    var Title = function Title(_model) {
	        this.model = _model;
	
	        this.model.on('change:playlistItem', this.playlistItem, this);
	    };
	
	    _.extend(Title.prototype, {
	        // This is normally shown/hidden by states
	        //   these are only used for when no title exists
	        hide: function hide() {
	            this.el.style.display = 'none';
	        },
	        show: function show() {
	            this.el.style.display = '';
	        },
	
	        setup: function setup(titleEl) {
	            this.el = titleEl;
	
	            // Perform the DOM search only once
	            var arr = this.el.getElementsByTagName('div');
	            this.title = arr[0];
	            this.description = arr[1];
	
	            if (this.model.get('playlistItem')) {
	                this.playlistItem(this.model, this.model.get('playlistItem'));
	            }
	
	            this.model.on('change:logoWidth', this.update, this);
	            this.model.on('change:dock', this.update, this);
	        },
	
	        update: function update(model) {
	            var titleStyle = {
	                paddingLeft: 0,
	                paddingRight: 0
	            };
	            var controls = model.get('controls');
	            var dockButtons = model.get('dock');
	            var logo = model.get('logo');
	            if (logo) {
	                // Only use Numeric or pixel ("Npx") margin values
	                var margin = 1 * ('' + logo.margin).replace('px', '');
	                var padding = model.get('logoWidth') + (isNaN(margin) ? 0 : margin);
	                if (logo.position === 'top-left') {
	                    titleStyle.paddingLeft = padding;
	                } else if (logo.position === 'top-right') {
	                    titleStyle.paddingRight = padding;
	                }
	            }
	            if (controls && dockButtons && dockButtons.length) {
	                var dockWidthGuess = 56 * dockButtons.length;
	                titleStyle.paddingRight = Math.max(titleStyle.paddingRight, dockWidthGuess);
	            }
	            utils.style(this.el, titleStyle);
	        },
	
	        playlistItem: function playlistItem(model, item) {
	            if (model.get('displaytitle') || model.get('displaydescription')) {
	                var title = '';
	                var description = '';
	
	                if (item.title && model.get('displaytitle')) {
	                    title = item.title;
	                }
	                if (item.description && model.get('displaydescription')) {
	                    description = item.description;
	                }
	
	                this.updateText(title, description);
	            } else {
	                this.hide();
	            }
	        },
	
	        updateText: function updateText(title, description) {
	            this.title.innerHTML = title;
	            this.description.innerHTML = description;
	
	            if (this.title.firstChild || this.description.firstChild) {
	                this.show();
	            } else {
	                this.hide();
	            }
	        },
	
	        element: function element() {
	            return this.el;
	        }
	    });
	
	    return Title;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 131 */
/*!*******************************!*\
  !*** ./src/css/jwplayer.less ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !../../~/css-loader!../../~/postcss-loader!../../~/less-loader/dist?compress!./jwplayer.less */ 132);
	if(typeof content === 'string') content = [['all-players', content, '']];
	// add the styles to the DOM
	__webpack_require__(/*! ../../~/simple-style-loader/addStyles.js */ 17).style(content,'all-players');
	if(content.locals) module.exports = content.locals;

/***/ },
/* 132 */
/*!***********************************************************************************************!*\
  !*** ./~/css-loader!./~/postcss-loader!./~/less-loader/dist?compress!./src/css/jwplayer.less ***!
  \***********************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 105)();
	// imports
	
	
	// module
	exports.push([module.id, ".jw-reset{color:inherit;background-color:transparent;padding:0;margin:0;float:none;font-family:Arial,Helvetica,sans-serif;font-size:1em;line-height:1em;list-style:none;text-align:left;text-transform:none;vertical-align:baseline;border:0;direction:ltr;font-variant:inherit;font-stretch:inherit;-webkit-tap-highlight-color:rgba(255,255,255,0)}.jw-background-color{background:rgba(33,33,33,0.8)}.jw-text{color:#cecece}.jw-knob{color:#cecece;background-color:#fff}.jw-button-color{color:#cecece;fill:#cecece}:not(.jw-flag-touch) .jw-button-color:hover,.jw-button-color:focus{outline:none;color:#fff;fill:#fff}.jw-toggle{color:#fff}.jw-toggle.jw-off{color:#cecece}.jw-toggle.jw-off:focus{color:#fff}.jw-toggle:focus{outline:none}:not(.jw-flag-touch) .jw-toggle.jw-off:hover{color:#fff}.jw-display-icon-container{margin:0 .25em}.jw-display-icon-container .jw-icon{color:#cecece}.jw-rail{background:rgba(255,255,255,0.2)}.jw-buffer{background:rgba(255,255,255,0.3)}.jw-progress{background:#fff}.jw-slider-horizontal{height:.3em}.jw-slider-horizontal .jw-rail,.jw-slider-horizontal .jw-buffer,.jw-slider-horizontal .jw-progress{height:.3em}.jw-slider-horizontal .jw-knob{margin-left:-0.3em}.jw-slider-vertical .jw-knob{margin-bottom:-0.3em}.jw-slider-vertical .jw-slider-container,.jw-slider-vertical .jw-rail,.jw-slider-vertical .jw-progress{width:.3em}.jw-menu,.jw-time-tip,.jw-volume-tip{border:0}.jw-menu,.jw-time-tip{padding:.5em}.jw-volume-tip{padding:1em}.jw-skip{padding:.5em}.jw-skip .jw-skiptext,.jw-skip .jw-skip-icon{color:#cecece}.jw-skip.jw-skippable:hover .jw-skip-icon,.jw-skip.jw-skippable:hover .jw-text{color:#fff}.jw-time-tip .jw-text,.jw-dock-button .jw-text{color:#cecece}.jw-dock-button{background:rgba(33,33,33,0.8)}:not(.jw-flag-touch) .jw-dock-button:hover{background:#212121}.jw-icon-cast button{--connected-color:#fff;--disconnected-color:#cecece}.jw-icon-cast button:focus{--connected-color:#fff;--disconnected-color:#fff}.jw-icon-cast button.jw-off{--connected-color:#cecece}.jw-icon-cast:hover button{--connected-color:#fff;--disconnected-color:#fff}.jw-nextup-container{bottom:2.5em;padding:5px .5em}.jw-nextup{border-radius:0}.jw-nextup-header{background:rgba(33,33,33,0.8);color:#fff}.jw-nextup-body{background:rgba(0,0,0,0.8);color:#fff}.jw-nextup-thumbnail-visible+.jw-nextup-title:after{background:-webkit-linear-gradient(top, rgba(0,0,0,0) 0, #000 100%);background:linear-gradient(-180deg, rgba(0,0,0,0) 0, #000 100%)}.jw-nextup-close{color:#cecece}.jw-nextup-close:active{color:#fff}.jw-nextup-close:hover{color:#fff}.jwplayer:not(.jw-flag-touch):not(.jw-error):not(.jw-state-error):not(.jw-state-buffering) .jw-media:hover~.jw-controls .jw-display-icon-display{background-color:#212121}.jwplayer:not(.jw-flag-touch):not(.jw-error):not(.jw-state-error):not(.jw-state-buffering) .jw-display-icon-container:hover{background-color:#212121}.jwplayer:not(.jw-flag-touch):not(.jw-error):not(.jw-state-error):not(.jw-state-buffering) .jw-display-icon-container:hover .jw-icon{color:#fff}.jw-color-active{color:#fff;stroke:#fff;border-color:#fff}:not(.jw-flag-touch) .jw-color-active-hover:hover{color:#fff;stroke:#fff;border-color:#fff}.jw-color-inactive{color:#cecece;stroke:#cecece;border-color:#cecece}:not(.jw-flag-touch) .jw-color-inactive-hover:hover{color:#cecece;stroke:#cecece;border-color:#cecece}.jw-option{color:#cecece}.jw-option.jw-active-option{color:#fff;background-color:rgba(255,255,255,0.1)}:not(.jw-flag-touch) .jw-option:hover{color:#fff}.jwplayer{width:100%;font-size:16px;position:relative;display:block;min-height:0;overflow:hidden;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;background-color:#000;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.jwplayer *{box-sizing:inherit}.jwplayer.jw-flag-aspect-mode{height:auto !important}.jwplayer.jw-flag-aspect-mode .jw-aspect{display:block}.jwplayer .jw-aspect{display:none}.jwplayer.jw-no-focus:focus,.jwplayer .jw-swf{outline:none}.jwplayer.jw-ie:focus{outline:#585858 dotted 1px}.jw-media,.jw-preview{position:absolute;width:100%;height:100%;top:0;left:0;bottom:0;right:0}.jw-media{overflow:hidden;cursor:pointer}.jw-plugin{position:absolute;bottom:2.5em}.jw-plugin .jw-banner{max-width:100%;opacity:0;cursor:pointer;position:absolute;margin:auto auto 0;left:0;right:0;bottom:0;display:block}.jw-preview,.jw-captions,.jw-title{pointer-events:none}.jw-media,.jw-logo{pointer-events:all}.jwplayer video{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;margin:auto;background:transparent}.jwplayer video::-webkit-media-controls-start-playback-button{display:none}.jwplayer.jw-stretch-uniform video{-o-object-fit:contain;object-fit:contain}.jwplayer.jw-stretch-none video{-o-object-fit:none;object-fit:none}.jwplayer.jw-stretch-fill video{-o-object-fit:cover;object-fit:cover}.jwplayer.jw-stretch-exactfit video{-o-object-fit:fill;object-fit:fill}.jw-preview{position:absolute;display:none;opacity:1;visibility:visible;width:100%;height:100%;background:#000 no-repeat 50% 50%}.jwplayer .jw-preview,.jw-error .jw-preview{background-size:contain}.jw-stretch-none .jw-preview{background-size:auto auto}.jw-stretch-fill .jw-preview{background-size:cover}.jw-stretch-exactfit .jw-preview{background-size:100% 100%}.jw-title{display:none;position:absolute;top:0;width:100%;font-size:.875em;height:8em;background:-webkit-linear-gradient(top, #000 0, #000 18%, rgba(0,0,0,0) 100%);background:linear-gradient(to bottom, #000 0, #000 18%, rgba(0,0,0,0) 100%)}.jw-title-primary,.jw-title-secondary{padding:.75em 1.5em;min-height:2.5em;width:100%;color:#fff;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.jw-title-primary{font-weight:bold}.jw-title-secondary{margin-top:-0.5em}.jw-flag-small-player .jw-title{background:-webkit-linear-gradient(top, rgba(51,51,51,0.75), rgba(51,51,51,0));background:linear-gradient(180deg, rgba(51,51,51,0.75), rgba(51,51,51,0));height:auto;padding:16px 0}.jw-flag-small-player .jw-title-primary,.jw-flag-small-player .jw-title-secondary{min-height:inherit;padding:0 16px}.jw-flag-small-player .jw-title-secondary{display:none;margin-top:5px}.jw-captions{position:absolute;width:100%;height:100%;text-align:center;display:none;max-height:calc(100% - 40px);letter-spacing:normal;word-spacing:normal;text-transform:none;text-indent:0;text-decoration:none;pointer-events:none;overflow:hidden;top:0}.jw-captions.jw-captions-enabled{display:block}.jw-captions-window{display:none;padding:.25em;border-radius:.25em}.jw-captions-window.jw-captions-window-active{display:inline-block}.jw-captions-text{display:inline-block;color:#fff;background-color:#000;word-wrap:normal;word-break:normal;white-space:pre-line;font-style:normal;font-weight:normal;text-align:center;text-decoration:none}.jw-text-track-display{font-size:inherit;line-height:1.5}.jw-text-track-cue{background-color:rgba(0,0,0,0.5);color:#fff;padding:.1em .3em}.jwplayer video::-webkit-media-controls{-webkit-box-pack:start;-webkit-justify-content:flex-start;justify-content:flex-start}.jwplayer video::-webkit-media-text-track-container{max-height:calc(100% - 40px);line-height:normal}.jwplayer video::-webkit-media-text-track-display{min-width:-webkit-min-content}.jwplayer video::cue{background-color:rgba(0,0,0,0.5)}.jwplayer video::-webkit-media-controls-panel-container{display:none}.jw-logo{position:absolute;margin:.75em;cursor:pointer;pointer-events:all;background-repeat:no-repeat;background-size:contain;top:auto;right:auto;left:auto;bottom:auto}.jw-flag-audio-player .jw-logo{display:none}.jw-logo-top-right{top:0;right:0}.jw-logo-top-right.jw-below{top:3.5em}.jw-logo-top-left{top:0;left:0}.jw-logo-bottom-left{bottom:0;left:0}.jw-logo-bottom-right{bottom:0;right:0}.jw-state-setup{background-color:transparent}.jw-state-setup .jw-logo{visibility:hidden}body .jw-error .jw-title,body .jwplayer.jw-state-error .jw-title{display:block}body .jw-error .jw-title .jw-title-primary,body .jwplayer.jw-state-error .jw-title .jw-title-primary{white-space:normal}body .jw-error .jw-title .jw-title-secondary,body .jwplayer.jw-state-error .jw-title .jw-title-secondary{display:block}body .jw-error{font-size:16px;background-color:#000;color:#fff;width:100%;height:100%;display:table;opacity:1;position:relative}body .jwplayer.jw-state-error .jw-title,body .jw-error .jw-title,.jw-state-idle .jw-title,.jwplayer.jw-state-complete:not(.jw-flag-casting):not(.jw-flag-audio-player) .jw-title{display:block}body .jwplayer.jw-state-error .jw-preview,body .jw-error .jw-preview,.jw-state-idle .jw-preview,.jwplayer.jw-state-complete:not(.jw-flag-casting):not(.jw-flag-audio-player) .jw-preview{display:block}.jw-state-idle .jw-captions,.jwplayer.jw-state-complete .jw-captions,body .jwplayer.jw-state-error .jw-captions{display:none}.jw-state-idle video::-webkit-media-text-track-container,.jwplayer.jw-state-complete video::-webkit-media-text-track-container,body .jwplayer.jw-state-error video::-webkit-media-text-track-container{display:none}.jwplayer.jw-flag-skin-loading .jw-media,.jwplayer.jw-flag-skin-loading .jw-preview,.jwplayer.jw-flag-skin-loading .jw-captions,.jwplayer.jw-flag-skin-loading .jw-controls,.jwplayer.jw-flag-skin-loading .jw-title,.jwplayer.jw-flag-skin-loading .jw-rightclick{display:none}.jwplayer.jw-flag-fullscreen{width:100% !important;height:100% !important;top:0;right:0;bottom:0;left:0;z-index:1000;margin:0;position:fixed}body .jwplayer.jw-flag-flash-blocked .jw-title{display:block}.jwplayer.jw-flag-controls-hidden .jw-captions{max-height:none}.jwplayer.jw-flag-controls-hidden video::-webkit-media-text-track-container{max-height:none}.jwplayer.jw-flag-controls-hidden .jw-media{cursor:default}.jw-flag-audio-player:not(.jw-flag-flash-blocked) .jw-media{visibility:hidden}.jw-flag-audio-player .jw-title{background:none}.jw-flag-audio-player object{min-height:45px}", ""]);
	
	// exports


/***/ },
/* 133 */
/*!******************************!*\
  !*** ./src/js/view/error.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _error = __webpack_require__(/*! templates/error */ 134);
	
	var _error2 = _interopRequireDefault(_error);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    function make(id, skin, title, body) {
	        return (0, _error2.default)(id, skin, title, body);
	    }
	
	    return make;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 134 */
/*!********************************!*\
  !*** ./src/templates/error.js ***!
  \********************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (id) {
	    var skin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	    var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	    var body = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
	
	    return '<div id="' + id + '" class="jw-skin-' + skin + ' jw-error jw-reset">' + '<div class="jw-title jw-reset">' + ('<div class="jw-title-primary jw-reset">' + title + '</div>') + ('<div class="jw-title-secondary jw-reset">' + body + '</div>') + '</div>' + '<div class="jw-display-container jw-reset">' + '<div class="jw-display-icon-container jw-background-color jw-reset">' + '<div class="jw-icon jw-icon-display jw-reset" aria-hidden="true"></div>' + '</div>' + '</div>' + '</div>';
	};

/***/ },
/* 135 */
/*!************************************************!*\
  !*** ./src/js/controller/events-middleware.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! events/events */ 32)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Events) {
	    return function middleware(model, type, currentState) {
	        var newState = currentState;
	
	        switch (type) {
	            case Events.JWPLAYER_MEDIA_TIME:
	            case 'beforePlay':
	            case 'pause':
	            case 'play':
	            case 'ready':
	                {
	                    var viewable = model.get('viewable');
	                    // Don't add viewable to events if we don't know we're viewable
	                    if (!_.isUndefined(viewable)) {
	                        // Emit viewable as 0 or 1
	                        newState = _.extend({}, currentState, { viewable: viewable });
	                    }
	                    break;
	                }
	            default:
	                {
	                    break;
	                }
	        }
	
	        return newState;
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 136 */
/*!***********************************!*\
  !*** ./src/js/api/api-actions.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! plugins/plugins */ 61), __webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (plugins, _) {
	    return function ApiActions(_api, _controller) {
	        // Commented out methods are those which are not direct passthroughs
	        //   instead these have custom logic inside api.js
	        //   Ultimately they should be moved into this file
	        var passthroughs = [
	        // 'setup',
	        // 'remove',
	        // 'load',
	        // 'play',
	        // 'pause',
	        // 'playlistNext',
	        // 'playlistPrev',
	        // 'playlistItem',
	        // 'seek',
	
	        'skipAd', 'stop', 'resize', 'addButton', 'removeButton', 'registerPlugin', 'attachMedia', 'next'];
	
	        _.each(passthroughs, function (func) {
	            _api[func] = function () {
	                _controller[func].apply(_controller, arguments);
	                return _api;
	            };
	        });
	
	        _api.registerPlugin = plugins.registerPlugin;
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 137 */
/*!************************************!*\
  !*** ./src/js/api/api-mutators.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	    return function ApiMutators(_api, _controller) {
	
	        var modelGetters = ['buffer', 'controls', 'position', 'duration', 'fullscreen', 'volume', 'item', // this was playlistindex
	        'stretching', 'playbackRate', 'playlist', 'captions', 'viewable'];
	
	        // given a name "buffer", it adds to jwplayer api a function named getBuffer
	        _.each(modelGetters, function (attr) {
	            var format = attr.slice(0, 1).toUpperCase() + attr.slice(1);
	
	            _api['get' + format] = function () {
	                return _controller._model.get(attr);
	            };
	        });
	
	        var passthroughs = ['getAudioTracks', 'getCaptionsList', 'getWidth', 'getHeight', 'getCurrentAudioTrack', 'setCurrentAudioTrack', 'getCurrentCaptions', 'setCurrentCaptions', 'getCurrentQuality', 'setCurrentQuality', 'getQualityLevels', 'getVisualQuality', 'getConfig', 'getState', 'getSafeRegion', 'isBeforeComplete', 'isBeforePlay', 'getProvider', 'detachMedia'
	
	        // These are implemented in api.js, but should be here
	        // 'getItemMeta',
	        // 'getMeta',
	        // 'getPlaylistItem',
	        // 'getContainer',
	        // 'playlistItem',
	        ];
	
	        var passthroughsChain = [
	        // Sisters of the model getters
	        'setConfig', 'setControls', 'setFullscreen', 'setVolume', 'setMute', 'setPlaybackRate', 'setCues', 'setCaptions'];
	
	        // getters
	        _.each(passthroughs, function (func) {
	            _api[func] = function () {
	                if (_controller[func]) {
	                    return _controller[func].apply(_controller, arguments);
	                }
	                return null;
	            };
	        });
	        // setters (chainable)
	        _.each(passthroughsChain, function (func) {
	            _api[func] = function () {
	                _controller[func].apply(_controller, arguments);
	                return _api;
	            };
	        });
	
	        // This is here because it binds to the methods declared above
	        _api.getPlaylistIndex = _api.getItem;
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 138 */
/*!*******************************************!*\
  !*** ./src/js/api/callbacks-deprecate.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! events/events */ 32)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, events) {
	    return function init(_api) {
	        var _eventMapping = {
	            onBufferChange: events.JWPLAYER_MEDIA_BUFFER,
	            onBufferFull: events.JWPLAYER_MEDIA_BUFFER_FULL,
	            onError: events.JWPLAYER_ERROR,
	            onSetupError: events.JWPLAYER_SETUP_ERROR,
	            onFullscreen: events.JWPLAYER_FULLSCREEN,
	            onMeta: events.JWPLAYER_MEDIA_META,
	            onMute: events.JWPLAYER_MEDIA_MUTE,
	            onPlaylist: events.JWPLAYER_PLAYLIST_LOADED,
	            onPlaylistItem: events.JWPLAYER_PLAYLIST_ITEM,
	            onPlaylistComplete: events.JWPLAYER_PLAYLIST_COMPLETE,
	            onReady: events.JWPLAYER_READY,
	            onResize: events.JWPLAYER_RESIZE,
	            onComplete: events.JWPLAYER_MEDIA_COMPLETE,
	            onSeek: events.JWPLAYER_MEDIA_SEEK,
	            onTime: events.JWPLAYER_MEDIA_TIME,
	            onVolume: events.JWPLAYER_MEDIA_VOLUME,
	            onBeforePlay: events.JWPLAYER_MEDIA_BEFOREPLAY,
	            onBeforeComplete: events.JWPLAYER_MEDIA_BEFORECOMPLETE,
	            onDisplayClick: events.JWPLAYER_DISPLAY_CLICK,
	            onControls: events.JWPLAYER_CONTROLS,
	            onQualityLevels: events.JWPLAYER_MEDIA_LEVELS,
	            onQualityChange: events.JWPLAYER_MEDIA_LEVEL_CHANGED,
	            onCaptionsList: events.JWPLAYER_CAPTIONS_LIST,
	            onCaptionsChange: events.JWPLAYER_CAPTIONS_CHANGED,
	            onAdError: events.JWPLAYER_AD_ERROR,
	            onAdClick: events.JWPLAYER_AD_CLICK,
	            onAdImpression: events.JWPLAYER_AD_IMPRESSION,
	            onAdTime: events.JWPLAYER_AD_TIME,
	            onAdComplete: events.JWPLAYER_AD_COMPLETE,
	            onAdCompanions: events.JWPLAYER_AD_COMPANIONS,
	            onAdSkipped: events.JWPLAYER_AD_SKIPPED,
	            onAdPlay: events.JWPLAYER_AD_PLAY,
	            onAdPause: events.JWPLAYER_AD_PAUSE,
	            onAdMeta: events.JWPLAYER_AD_META,
	            onCast: events.JWPLAYER_CAST_SESSION,
	            onAudioTrackChange: events.JWPLAYER_AUDIO_TRACK_CHANGED,
	            onAudioTracks: events.JWPLAYER_AUDIO_TRACKS
	        };
	
	        var _stateMapping = {
	            onBuffer: 'buffer',
	            onPause: 'pause',
	            onPlay: 'play',
	            onIdle: 'idle'
	        };
	
	        // Add state callbacks
	        _.each(_stateMapping, function (value, name) {
	            _api[name] = _.partial(_api.on, value, _);
	        });
	
	        // Add event callbacks
	        _.each(_eventMapping, function (value, name) {
	            _api[name] = _.partial(_api.on, value, _);
	        });
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ])
});
;
//# sourceMappingURL=jwplayer.a8bf8f3cb1a82cfe5f6e.map