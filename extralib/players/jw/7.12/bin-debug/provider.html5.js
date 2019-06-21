webpackJsonpjwplayer([1],{

/***/ 41:
/*!***********************************!*\
  !*** ./src/js/providers/html5.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _dataNormalizer = __webpack_require__(/*! providers/data-normalizer */ 42);
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! providers/html5-android-hls */ 37), __webpack_require__(/*! utils/css */ 16), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! utils/dom */ 14), __webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! events/events */ 32), __webpack_require__(/*! events/states */ 31), __webpack_require__(/*! providers/default */ 35), __webpack_require__(/*! utils/backbone.events */ 29), __webpack_require__(/*! providers/tracks-mixin */ 43), __webpack_require__(/*! utils/time-ranges */ 51)], __WEBPACK_AMD_DEFINE_RESULT__ = function (getIsAndroidHLS, cssUtils, utils, dom, _, events, states, DefaultProvider, Events, Tracks, timeRangesUtil) {
	
	    var clearTimeout = window.clearTimeout;
	    var STALL_DELAY = 256;
	    var MIN_DVR_DURATION = 120;
	    var _isIE = utils.isIE();
	    var _isIE9 = utils.isIE(9);
	    var _isMobile = utils.isMobile();
	    var _isFirefox = utils.isFF();
	    var _isAndroid = utils.isAndroidNative();
	    var _isIOS7 = utils.isIOS(7);
	    var _isIOS8 = utils.isIOS(8);
	    var _name = 'html5';
	
	    function _setupListeners(eventsHash, videoTag) {
	        utils.foreach(eventsHash, function (evt, evtCallback) {
	            videoTag.addEventListener(evt, evtCallback, false);
	        });
	    }
	
	    function _removeListeners(eventsHash, videoTag) {
	        utils.foreach(eventsHash, function (evt, evtCallback) {
	            videoTag.removeEventListener(evt, evtCallback, false);
	        });
	    }
	
	    function VideoProvider(_playerId, _playerConfig) {
	        // Current media state
	        this.state = states.IDLE;
	
	        // Are we buffering due to seek, or due to playback?
	        this.seeking = false;
	
	        _.extend(this, Events, Tracks);
	
	        this.renderNatively = renderNatively(_playerConfig.renderCaptionsNatively);
	
	        // Always render natively in iOS, Safari and Edge, where HLS is supported.
	        // Otherwise, use native rendering when set in the config for browsers that have adequate support.
	        // FF and IE are excluded due to styling/positioning drawbacks.
	        function renderNatively(configRenderNatively) {
	            if (utils.isIOS() || utils.isSafari() || utils.isEdge()) {
	                return true;
	            }
	            return configRenderNatively && utils.isChrome();
	        }
	
	        var _this = this;
	        var _mediaEvents = {
	            click: _clickHandler,
	            durationchange: _durationChangeHandler,
	            ended: _endedHandler,
	            error: _errorHandler,
	            loadstart: _onLoadStart,
	            loadeddata: _onLoadedData, // we have video tracks (text, audio, metadata)
	            loadedmetadata: _loadedMetadataHandler, // we have video dimensions
	            canplay: _canPlayHandler,
	            play: _loading,
	            playing: _playingHandler,
	            progress: _progressHandler,
	            pause: _pauseHandler,
	            seeking: _seekingHandler,
	            seeked: _seekedHandler,
	            timeupdate: _timeUpdateHandler,
	            ratechange: _playbackRateHandler,
	            volumechange: _volumeChangeHandler,
	            webkitbeginfullscreen: _fullscreenBeginHandler,
	            webkitendfullscreen: _fullscreenEndHandler
	        };
	        var _container;
	        var _duration;
	        var _position;
	        var _canSeek = false;
	        var _bufferFull;
	        var _delayedSeek = 0;
	        var _seekOffset = null;
	        var _playbackTimeout = -1;
	        var _buffered = -1;
	        var _levels;
	        var _currentQuality = -1;
	        var _isAndroidHLS = null;
	        var _isSDK = !!_playerConfig.sdkplatform;
	        var _fullscreenState = false;
	        var _beforeResumeHandler = utils.noop;
	        var _audioTracks = null;
	        var _currentAudioTrackIndex = -1;
	        var _visualQuality = { level: {} };
	
	        var _staleStreamDuration = 3 * 10 * 1000;
	        var _staleStreamTimeout = null;
	        var _lastEndOfBuffer = null;
	        var _stale = false;
	        var _edgeOfLiveStream = false;
	
	        // Find video tag, or create it if it doesn't exist.  View may not be built yet.
	        var element = document.getElementById(_playerId);
	        var _videotag = element ? element.querySelector('video, audio') : undefined;
	
	        function _setAttribute(name, value) {
	            _videotag.setAttribute(name, value || '');
	        }
	
	        if (!_videotag) {
	            _videotag = document.createElement('video');
	            _videotag.load();
	
	            if (_isMobile) {
	                _setAttribute('jw-gesture-required');
	            }
	        }
	
	        _videotag.className = 'jw-video jw-reset';
	
	        this.isSDK = _isSDK;
	        this.video = _videotag;
	        this.supportsPlaybackRate = true;
	
	        _setupListeners(_mediaEvents, _videotag);
	
	        _setAttribute('disableRemotePlayback', '');
	        _setAttribute('webkit-playsinline');
	        _setAttribute('playsinline');
	
	        // Enable tracks support for HLS videos
	        function _onLoadedData() {
	            _setAudioTracks(_videotag.audioTracks);
	            _this.setTextTracks(_videotag.textTracks);
	            _setAttribute('jw-loaded', 'data');
	        }
	
	        function _onLoadStart() {
	            _setAttribute('jw-loaded', 'started');
	        }
	
	        function _clickHandler(evt) {
	            _this.trigger('click', evt);
	        }
	
	        function _durationChangeHandler() {
	            if (_isAndroidHLS) {
	                return;
	            }
	            _updateDuration(_getDuration());
	            _setBuffered(_getBuffer(), _position, _duration);
	        }
	
	        function _progressHandler() {
	            _setBuffered(_getBuffer(), _position, _duration);
	        }
	
	        function _timeUpdateHandler() {
	            clearTimeout(_playbackTimeout);
	
	            _canSeek = true;
	            if (_this.state === states.STALLED) {
	                _this.setState(states.PLAYING);
	            } else if (_this.state === states.PLAYING) {
	                _playbackTimeout = setTimeout(_checkPlaybackStalled, STALL_DELAY);
	            }
	            // When video has not yet started playing for androidHLS, we cannot get the correct duration
	            if (_isAndroidHLS && _videotag.duration === Infinity && _videotag.currentTime === 0) {
	                return;
	            }
	            _updateDuration(_getDuration());
	            _setPosition(_videotag.currentTime);
	            // buffer ranges change during playback, not just on file progress
	            _setBuffered(_getBuffer(), _position, _duration);
	
	            // send time events when playing
	            if (_this.state === states.PLAYING) {
	                _this.trigger(events.JWPLAYER_MEDIA_TIME, {
	                    position: _position,
	                    duration: _duration
	                });
	
	                _checkVisualQuality();
	            }
	        }
	
	        function _playbackRateHandler() {
	            _this.trigger('ratechange', { playbackRate: _videotag.playbackRate });
	        }
	
	        function _checkVisualQuality() {
	            var level = _visualQuality.level;
	            if (level.width !== _videotag.videoWidth || level.height !== _videotag.videoHeight) {
	                level.width = _videotag.videoWidth;
	                level.height = _videotag.videoHeight;
	                _setMediaType();
	                if (!level.width || !level.height || _currentQuality === -1) {
	                    return;
	                }
	                _visualQuality.reason = _visualQuality.reason || 'auto';
	                _visualQuality.mode = _levels[_currentQuality].type === 'hls' ? 'auto' : 'manual';
	                _visualQuality.bitrate = 0;
	                level.index = _currentQuality;
	                level.label = _levels[_currentQuality].label;
	                _this.trigger('visualQuality', _visualQuality);
	                _visualQuality.reason = '';
	            }
	        }
	
	        function _setBuffered(buffered, currentTime, duration) {
	            if (duration !== 0 && (buffered !== _buffered || duration !== _duration)) {
	                _buffered = buffered;
	                _this.trigger(events.JWPLAYER_MEDIA_BUFFER, {
	                    bufferPercent: buffered * 100,
	                    position: currentTime,
	                    duration: duration
	                });
	            }
	
	            checkStaleStream();
	        }
	
	        function _setPosition(currentTime) {
	            if (_duration < 0) {
	                currentTime = -(_getSeekableEnd() - currentTime);
	            }
	            _position = currentTime;
	        }
	
	        function _getDuration() {
	            var duration = _videotag.duration;
	            var end = _getSeekableEnd();
	            if (duration === Infinity && end) {
	                var seekableDuration = end - _getSeekableStart();
	                if (seekableDuration !== Infinity && seekableDuration > MIN_DVR_DURATION) {
	                    // Player interprets negative duration as DVR
	                    duration = -seekableDuration;
	                }
	            }
	            return duration;
	        }
	
	        function _updateDuration(duration) {
	            _duration = duration;
	            // Don't seek when _delayedSeek is set to -1 in _completeLoad
	            if (_delayedSeek && _delayedSeek !== -1 && duration && duration !== Infinity) {
	                _this.seek(_delayedSeek);
	            }
	        }
	
	        function _sendMetaEvent() {
	            var duration = _getDuration();
	            if (_isAndroidHLS && duration === Infinity) {
	                duration = 0;
	            }
	            _this.trigger(events.JWPLAYER_MEDIA_META, {
	                duration: duration,
	                height: _videotag.videoHeight,
	                width: _videotag.videoWidth
	            });
	            _updateDuration(duration);
	        }
	
	        function _canPlayHandler() {
	            _canSeek = true;
	            if (!_isAndroidHLS) {
	                _setMediaType();
	            }
	            if (_isIE9) {
	                // In IE9, set tracks here since they are not ready
	                // on load
	                _this.setTextTracks(_this._textTracks);
	            }
	            _sendBufferFull();
	        }
	
	        function _loadedMetadataHandler() {
	            _setAttribute('jw-loaded', 'meta');
	            _sendMetaEvent();
	        }
	
	        function _sendBufferFull() {
	            // Wait until the canplay event on iOS to send the bufferFull event
	            if (!_bufferFull) {
	                _bufferFull = true;
	                _this.trigger(events.JWPLAYER_MEDIA_BUFFER_FULL);
	            }
	        }
	
	        function _playingHandler() {
	            _this.setState(states.PLAYING);
	            if (!_videotag.hasAttribute('jw-played')) {
	                _setAttribute('jw-played', '');
	            }
	            if (_videotag.hasAttribute('jw-gesture-required')) {
	                _videotag.removeAttribute('jw-gesture-required');
	            }
	            _this.trigger(events.JWPLAYER_PROVIDER_FIRST_FRAME, {});
	        }
	
	        function _pauseHandler() {
	            clearTimeouts();
	
	            // Sometimes the browser will fire "complete" and then a "pause" event
	            if (_this.state === states.COMPLETE) {
	                return;
	            }
	
	            // If "pause" fires before "complete" or before we've started playback, we still don't want to propagate it
	            if (!_videotag.hasAttribute('jw-played') || _videotag.currentTime === _videotag.duration) {
	                return;
	            }
	
	            _this.setState(states.PAUSED);
	        }
	
	        function _stalledHandler() {
	            // Android HLS doesnt update its times correctly so it always falls in here.  Do not allow it to stall.
	            if (_isAndroidHLS) {
	                return;
	            }
	
	            if (_videotag.paused || _videotag.ended) {
	                return;
	            }
	
	            // A stall after loading/error, should just stay loading/error
	            if (_this.state === states.LOADING || _this.state === states.ERROR) {
	                return;
	            }
	
	            // During seek we stay in paused state
	            if (_this.seeking) {
	                return;
	            }
	
	            // Workaround for iOS not completing after midroll with HLS streams
	            if (utils.isIOS() && _videotag.duration - _videotag.currentTime <= 0.1) {
	                _endedHandler();
	                return;
	            }
	
	            if (atEdgeOfLiveStream()) {
	                _edgeOfLiveStream = true;
	                if (checkStreamEnded()) {
	                    return;
	                }
	            }
	
	            _this.setState(states.STALLED);
	        }
	
	        function _errorHandler() {
	            _this.trigger(events.JWPLAYER_MEDIA_ERROR, {
	                message: 'Error loading media: File could not be played'
	            });
	        }
	
	        function _getPublicLevels(levels) {
	            var publicLevels;
	            if (utils.typeOf(levels) === 'array' && levels.length > 0) {
	                publicLevels = _.map(levels, function (level, i) {
	                    return {
	                        label: level.label || i
	                    };
	                });
	            }
	            return publicLevels;
	        }
	
	        function _setLevels(levels) {
	            _levels = levels;
	            _currentQuality = _pickInitialQuality(levels);
	            var publicLevels = _getPublicLevels(levels);
	            if (publicLevels) {
	                // _trigger?
	                _this.trigger(events.JWPLAYER_MEDIA_LEVELS, {
	                    levels: publicLevels,
	                    currentQuality: _currentQuality
	                });
	            }
	        }
	
	        function _pickInitialQuality(levels) {
	            var currentQuality = Math.max(0, _currentQuality);
	            var label = _playerConfig.qualityLabel;
	            if (levels) {
	                for (var i = 0; i < levels.length; i++) {
	                    if (levels[i].default) {
	                        currentQuality = i;
	                    }
	                    if (label && levels[i].label === label) {
	                        return i;
	                    }
	                }
	            }
	            _visualQuality.reason = 'initial choice';
	            _visualQuality.level = {};
	            return currentQuality;
	        }
	
	        function _play() {
	            var promise = _videotag.play();
	            if (promise && promise.catch) {
	                promise.catch(function (err) {
	                    if (_videotag.paused) {
	                        // Send a time update to update ads UI
	                        // `isDurationChange` prevents this from propigating an "adTime" event
	                        _this.trigger(events.JWPLAYER_MEDIA_TIME, {
	                            position: _position,
	                            duration: _duration,
	                            isDurationChange: true
	                        });
	                        _this.setState(states.PAUSED);
	                    }
	                    // User gesture required to start playback
	                    if (err.name === 'NotAllowedError') {
	                        console.warn(err);
	                        if (_videotag.hasAttribute('jw-gesture-required')) {
	                            _this.trigger('autoplayFailed');
	                        }
	                    }
	                });
	            } else if (_videotag.hasAttribute('jw-gesture-required')) {
	                // Autoplay isn't supported in older versions of Safari (<10) and Chrome (<53)
	                _this.trigger('autoplayFailed');
	            }
	        }
	
	        function _completeLoad(startTime, duration) {
	            _delayedSeek = 0;
	            clearTimeouts();
	
	            var previousSource = _videotag.src;
	            var sourceElement = document.createElement('source');
	            sourceElement.src = _levels[_currentQuality].file;
	            var sourceChanged = previousSource !== sourceElement.src;
	
	            var loadedSrc = _videotag.getAttribute('jw-loaded');
	
	            if (sourceChanged || loadedSrc === 'none' || loadedSrc === 'started') {
	                _duration = duration;
	                _setVideotagSource(_levels[_currentQuality]);
	                _this.setupSideloadedTracks(_this._itemTracks);
	                if (previousSource && sourceChanged) {
	                    _videotag.load();
	                }
	            } else {
	                // Load event is from the same video as before
	                if (startTime === 0 && _videotag.currentTime > 0) {
	                    // restart video without dispatching seek event
	                    _delayedSeek = -1;
	                    _this.seek(startTime);
	                }
	            }
	
	            _position = _videotag.currentTime;
	
	            if (startTime > 0) {
	                _this.seek(startTime);
	            }
	
	            _play();
	        }
	
	        function _setVideotagSource(source) {
	            _audioTracks = null;
	            _currentAudioTrackIndex = -1;
	            if (!_visualQuality.reason) {
	                _visualQuality.reason = 'initial choice';
	                _visualQuality.level = {};
	            }
	            _canSeek = false;
	            _bufferFull = false;
	            _isAndroidHLS = getIsAndroidHLS(source);
	            if (_isAndroidHLS) {
	                // Playback rate is broken on Android HLS
	                _this.supportsPlaybackRate = false;
	            }
	            if (source.preload && source.preload !== 'none' && source.preload !== _videotag.getAttribute('preload')) {
	                _setAttribute('preload', source.preload);
	            }
	
	            var sourceElement = document.createElement('source');
	            sourceElement.src = source.file;
	            var sourceChanged = _videotag.src !== sourceElement.src;
	            if (sourceChanged) {
	                _setAttribute('jw-loaded', 'none');
	                _videotag.src = source.file;
	            }
	        }
	
	        function _clearVideotagSource() {
	            if (_videotag) {
	                _this.disableTextTrack();
	                _videotag.removeAttribute('preload');
	                _videotag.removeAttribute('src');
	                _videotag.removeAttribute('jw-loaded');
	                _videotag.removeAttribute('jw-played');
	                _videotag.pause();
	                dom.emptyElement(_videotag);
	                cssUtils.style(_videotag, {
	                    objectFit: ''
	                });
	                _currentQuality = -1;
	            }
	        }
	
	        function _getSeekableStart() {
	            var index = _videotag.seekable ? _videotag.seekable.length : 0;
	            var start = Infinity;
	
	            while (index--) {
	                start = Math.min(start, _videotag.seekable.start(index));
	            }
	            return start;
	        }
	
	        function _getSeekableEnd() {
	            var index = _videotag.seekable ? _videotag.seekable.length : 0;
	            var end = 0;
	
	            while (index--) {
	                end = Math.max(end, _videotag.seekable.end(index));
	            }
	            return end;
	        }
	
	        function _loading() {
	            _this.setState(states.LOADING);
	        }
	
	        this.stop = function () {
	            clearTimeouts();
	            _clearVideotagSource();
	            this.clearTracks();
	            // IE/Edge continue to play a video after changing video.src and calling video.load()
	            // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5383483/ (not fixed in Edge 14)
	            if (utils.isIE()) {
	                _videotag.pause();
	            }
	            this.setState(states.IDLE);
	        };
	
	        this.destroy = function () {
	            _beforeResumeHandler = utils.noop;
	            _removeListeners(_mediaEvents, _videotag);
	            this.removeTracksListener(_videotag.audioTracks, 'change', _audioTrackChangeHandler);
	            this.removeTracksListener(_videotag.textTracks, 'change', _this.textTrackChangeHandler);
	            this.remove();
	            this.off();
	        };
	
	        this.init = function (item) {
	            _levels = item.sources;
	            _currentQuality = _pickInitialQuality(item.sources);
	            // the loadeddata event determines the mediaType for HLS sources
	            if (item.sources.length && item.sources[0].type !== 'hls') {
	                this.sendMediaType(item.sources);
	            }
	
	            _position = item.starttime || 0;
	            _duration = item.duration || 0;
	            _visualQuality.reason = '';
	
	            var source = _levels[_currentQuality];
	            if (source.preload !== 'none') {
	                _setVideotagSource(source);
	            }
	
	            this.setupSideloadedTracks(item.tracks);
	        };
	
	        this.load = function (item) {
	            _setLevels(item.sources);
	
	            if (item.sources.length && item.sources[0].type !== 'hls') {
	                this.sendMediaType(item.sources);
	            }
	            if (!_isMobile || _videotag.hasAttribute('jw-played')) {
	                // don't change state on mobile before user initiates playback
	                _loading();
	            }
	            _completeLoad(item.starttime || 0, item.duration || 0);
	        };
	
	        this.play = function () {
	            if (_this.seeking) {
	                _loading();
	                _this.once(events.JWPLAYER_MEDIA_SEEKED, _this.play);
	                return;
	            }
	            _beforeResumeHandler();
	            _play();
	        };
	
	        this.pause = function () {
	            clearTimeouts();
	            _videotag.pause();
	            _beforeResumeHandler = function _beforeResumeHandler() {
	                var unpausing = _videotag.paused && _videotag.currentTime;
	                if (unpausing && _videotag.duration === Infinity) {
	                    var end = _getSeekableEnd();
	                    var seekableDuration = end - _getSeekableStart();
	                    var isLiveNotDvr = seekableDuration < MIN_DVR_DURATION;
	                    var behindLiveEdge = end - _videotag.currentTime;
	                    if (isLiveNotDvr && end && (behindLiveEdge > 15 || behindLiveEdge < 0)) {
	                        // resume playback at edge of live stream
	                        _seekOffset = Math.max(end - 10, end - seekableDuration);
	                        _setPosition(_videotag.currentTime);
	                        _videotag.currentTime = _seekOffset;
	                    }
	                }
	            };
	            this.setState(states.PAUSED);
	        };
	
	        this.seek = function (seekPos) {
	            if (seekPos < 0) {
	                seekPos += _getSeekableStart() + _getSeekableEnd();
	            }
	
	            if (!_canSeek) {
	                _canSeek = !!_getSeekableEnd();
	            }
	            if (_canSeek) {
	                _delayedSeek = 0;
	                // setting currentTime can throw an invalid DOM state exception if the video is not ready
	                try {
	                    _this.seeking = true;
	                    _seekOffset = seekPos;
	                    _setPosition(_videotag.currentTime);
	                    _videotag.currentTime = seekPos;
	                } catch (e) {
	                    _this.seeking = false;
	                    _delayedSeek = seekPos;
	                }
	            } else {
	                _delayedSeek = seekPos;
	                // Firefox isn't firing canplay event when in a paused state
	                // https://bugzilla.mozilla.org/show_bug.cgi?id=1194624
	                if (_isFirefox && _videotag.paused) {
	                    _play();
	                }
	            }
	        };
	
	        function _seekingHandler() {
	            var offset = _seekOffset !== null ? _seekOffset : _videotag.currentTime;
	            _seekOffset = null;
	            _delayedSeek = 0;
	            _this.seeking = true;
	            _this.trigger(events.JWPLAYER_MEDIA_SEEK, {
	                position: _position,
	                offset: offset
	            });
	        }
	
	        function _seekedHandler() {
	            _this.seeking = false;
	            _this.trigger(events.JWPLAYER_MEDIA_SEEKED);
	        }
	
	        this.volume = function (vol) {
	            // volume must be 0.0 - 1.0
	            vol = utils.between(vol / 100, 0, 1);
	
	            _videotag.volume = vol;
	        };
	
	        function _volumeChangeHandler() {
	            _this.trigger('volume', {
	                volume: Math.round(_videotag.volume * 100)
	            });
	            _this.trigger('mute', {
	                mute: _videotag.muted
	            });
	        }
	
	        this.mute = function (state) {
	            _videotag.muted = !!state;
	        };
	
	        function _checkPlaybackStalled() {
	            // Browsers, including latest chrome, do not always report Stalled events in a timely fashion
	            if (_videotag.currentTime === _position) {
	                _stalledHandler();
	            } else {
	                _edgeOfLiveStream = false;
	            }
	        }
	
	        function _getBuffer() {
	            var buffered = _videotag.buffered;
	            var duration = _videotag.duration;
	            if (!buffered || buffered.length === 0 || duration <= 0 || duration === Infinity) {
	                return 0;
	            }
	            return utils.between(buffered.end(buffered.length - 1) / duration, 0, 1);
	        }
	
	        function _endedHandler() {
	            if (_this.state !== states.IDLE && _this.state !== states.COMPLETE) {
	                clearTimeouts();
	                _currentQuality = -1;
	
	                _this.trigger(events.JWPLAYER_MEDIA_COMPLETE);
	            }
	        }
	
	        function _fullscreenBeginHandler(e) {
	            _fullscreenState = true;
	            _sendFullscreen(e);
	            // show controls on begin fullscreen so that they are disabled properly at end
	            if (utils.isIOS()) {
	                _videotag.controls = false;
	            }
	        }
	
	        function _audioTrackChangeHandler() {
	            var _selectedAudioTrackIndex = -1;
	            for (var i = 0; i < _videotag.audioTracks.length; i++) {
	                if (_videotag.audioTracks[i].enabled) {
	                    _selectedAudioTrackIndex = i;
	                    break;
	                }
	            }
	            _setCurrentAudioTrack(_selectedAudioTrackIndex);
	        }
	
	        function _fullscreenEndHandler(e) {
	            _fullscreenState = false;
	            _sendFullscreen(e);
	            if (utils.isIOS()) {
	                _videotag.controls = false;
	            }
	        }
	
	        function _sendFullscreen(e) {
	            _this.trigger('fullscreenchange', {
	                target: e.target,
	                jwstate: _fullscreenState
	            });
	        }
	
	        /**
	         * Return the video tag and stop listening to events
	         */
	        this.detachMedia = function () {
	            clearTimeouts();
	            _removeListeners(_mediaEvents, _videotag);
	            // Stop listening to track changes so disabling the current track doesn't update the model
	            this.removeTracksListener(_videotag.textTracks, 'change', this.textTrackChangeHandler);
	            // Prevent tracks from showing during ad playback
	            this.disableTextTrack();
	            return _videotag;
	        };
	
	        /**
	         * Begin listening to events again
	         */
	        this.attachMedia = function () {
	            _setupListeners(_mediaEvents, _videotag);
	            _canSeek = false;
	
	            // If we were mid-seek when detached, we want to allow it to resume
	            this.seeking = false;
	
	            // In case the video tag was modified while we shared it
	            _videotag.loop = false;
	
	            // If there was a showing track, re-enable it
	            this.enableTextTrack();
	            if (this.renderNatively) {
	                this.setTextTracks(this.video.textTracks);
	            }
	            this.addTracksListener(_videotag.textTracks, 'change', this.textTrackChangeHandler);
	        };
	
	        this.setContainer = function (containerElement) {
	            _container = containerElement;
	            containerElement.insertBefore(_videotag, containerElement.firstChild);
	        };
	
	        this.getContainer = function () {
	            return _container;
	        };
	
	        this.remove = function () {
	            // stop video silently
	            _clearVideotagSource();
	            clearTimeouts();
	
	            // remove
	            if (_container === _videotag.parentNode) {
	                _container.removeChild(_videotag);
	            }
	        };
	
	        this.setVisibility = function (state) {
	            state = !!state;
	            if (state || _isAndroid) {
	                // Changing visibility to hidden on Android < 4.2 causes
	                // the pause event to be fired. This causes audio files to
	                // become unplayable. Hence the video tag is always kept
	                // visible on Android devices.
	                cssUtils.style(_container, {
	                    visibility: 'visible',
	                    opacity: 1
	                });
	            } else {
	                cssUtils.style(_container, {
	                    visibility: '',
	                    opacity: 0
	                });
	            }
	        };
	
	        this.resize = function (width, height, stretching) {
	            if (!width || !height || !_videotag.videoWidth || !_videotag.videoHeight) {
	                return false;
	            }
	            var style = {
	                objectFit: '',
	                width: '',
	                height: ''
	            };
	            if (stretching === 'uniform') {
	                // snap video to edges when the difference in aspect ratio is less than 9%
	                var playerAspectRatio = width / height;
	                var videoAspectRatio = _videotag.videoWidth / _videotag.videoHeight;
	                if (Math.abs(playerAspectRatio - videoAspectRatio) < 0.09) {
	                    style.objectFit = 'fill';
	                    stretching = 'exactfit';
	                }
	            }
	            // Prior to iOS 9, object-fit worked poorly
	            // object-fit is not implemented in IE or Android Browser in 4.4 and lower
	            // http://caniuse.com/#feat=object-fit
	            // feature detection may work for IE but not for browsers where object-fit works for images only
	            var fitVideoUsingTransforms = _isIE || _isIOS7 || _isIOS8 || _isAndroid && !_isFirefox;
	            if (fitVideoUsingTransforms) {
	                // Use transforms to center and scale video in container
	                var x = -Math.floor(_videotag.videoWidth / 2 + 1);
	                var y = -Math.floor(_videotag.videoHeight / 2 + 1);
	                var scaleX = Math.ceil(width * 100 / _videotag.videoWidth) / 100;
	                var scaleY = Math.ceil(height * 100 / _videotag.videoHeight) / 100;
	                if (stretching === 'none') {
	                    scaleX = scaleY = 1;
	                } else if (stretching === 'fill') {
	                    scaleX = scaleY = Math.max(scaleX, scaleY);
	                } else if (stretching === 'uniform') {
	                    scaleX = scaleY = Math.min(scaleX, scaleY);
	                }
	                style.width = _videotag.videoWidth;
	                style.height = _videotag.videoHeight;
	                style.top = style.left = '50%';
	                style.margin = 0;
	                cssUtils.transform(_videotag, 'translate(' + x + 'px, ' + y + 'px) scale(' + scaleX.toFixed(2) + ', ' + scaleY.toFixed(2) + ')');
	            }
	            cssUtils.style(_videotag, style);
	            return false;
	        };
	
	        this.setFullscreen = function (state) {
	            state = !!state;
	
	            // This implementation is for iOS and Android WebKit only
	            // This won't get called if the player container can go fullscreen
	            if (state) {
	                var status = utils.tryCatch(function () {
	                    var enterFullscreen = _videotag.webkitEnterFullscreen || _videotag.webkitEnterFullScreen;
	                    if (enterFullscreen) {
	                        enterFullscreen.apply(_videotag);
	                    }
	                });
	
	                if (status instanceof utils.Error) {
	                    // object can't go fullscreen
	                    return false;
	                }
	                return _this.getFullScreen();
	            }
	
	            var exitFullscreen = _videotag.webkitExitFullscreen || _videotag.webkitExitFullScreen;
	            if (exitFullscreen) {
	                exitFullscreen.apply(_videotag);
	            }
	
	            return state;
	        };
	
	        _this.getFullScreen = function () {
	            return _fullscreenState || !!_videotag.webkitDisplayingFullscreen;
	        };
	
	        this.setCurrentQuality = function (quality) {
	            if (_currentQuality === quality) {
	                return;
	            }
	            if (quality >= 0) {
	                if (_levels && _levels.length > quality) {
	                    _currentQuality = quality;
	                    _visualQuality.reason = 'api';
	                    _visualQuality.level = {};
	                    this.trigger(events.JWPLAYER_MEDIA_LEVEL_CHANGED, {
	                        currentQuality: quality,
	                        levels: _getPublicLevels(_levels)
	                    });
	
	                    // The playerConfig is not updated automatically, because it is a clone
	                    // from when the provider was first initialized
	                    _playerConfig.qualityLabel = _levels[quality].label;
	
	                    var time = _videotag.currentTime || 0;
	                    var duration = _videotag.duration || 0;
	                    if (duration <= 0) {
	                        duration = _duration;
	                    }
	                    _loading();
	                    _completeLoad(time, duration);
	                }
	            }
	        };
	
	        this.setPlaybackRate = function (playbackRate) {
	            // Set defaultPlaybackRate so that we do not send ratechange events when setting src
	            _videotag.playbackRate = _videotag.defaultPlaybackRate = playbackRate;
	        };
	
	        this.getPlaybackRate = function () {
	            return _videotag.playbackRate;
	        };
	
	        this.getCurrentQuality = function () {
	            return _currentQuality;
	        };
	
	        this.getQualityLevels = function () {
	            return _.map(_levels, function (level) {
	                return (0, _dataNormalizer.qualityLevel)(level);
	            });
	        };
	
	        this.getName = function () {
	            return { name: _name };
	        };
	        this.setCurrentAudioTrack = _setCurrentAudioTrack;
	
	        this.getAudioTracks = _getAudioTracks;
	
	        this.getCurrentAudioTrack = _getCurrentAudioTrack;
	
	        function _setAudioTracks(tracks) {
	            _audioTracks = null;
	            if (!tracks) {
	                return;
	            }
	            if (tracks.length) {
	                for (var i = 0; i < tracks.length; i++) {
	                    if (tracks[i].enabled) {
	                        _currentAudioTrackIndex = i;
	                        break;
	                    }
	                }
	                if (_currentAudioTrackIndex === -1) {
	                    _currentAudioTrackIndex = 0;
	                    tracks[_currentAudioTrackIndex].enabled = true;
	                }
	                _audioTracks = _.map(tracks, function (track) {
	                    var _track = {
	                        name: track.label || track.language,
	                        language: track.language
	                    };
	                    return _track;
	                });
	            }
	            _this.addTracksListener(tracks, 'change', _audioTrackChangeHandler);
	            if (_audioTracks) {
	                _this.trigger('audioTracks', { currentTrack: _currentAudioTrackIndex, tracks: _audioTracks });
	            }
	        }
	
	        function _setCurrentAudioTrack(index) {
	            if (_videotag && _videotag.audioTracks && _audioTracks && index > -1 && index < _videotag.audioTracks.length && index !== _currentAudioTrackIndex) {
	                _videotag.audioTracks[_currentAudioTrackIndex].enabled = false;
	                _currentAudioTrackIndex = index;
	                _videotag.audioTracks[_currentAudioTrackIndex].enabled = true;
	                _this.trigger('audioTrackChanged', { currentTrack: _currentAudioTrackIndex,
	                    tracks: _audioTracks });
	            }
	        }
	
	        function _getAudioTracks() {
	            return _audioTracks || [];
	        }
	
	        function _getCurrentAudioTrack() {
	            return _currentAudioTrackIndex;
	        }
	
	        function _setMediaType() {
	            // Send mediaType when format is HLS. Other types are handled earlier by default.js.
	            if (_levels[0].type === 'hls') {
	                var mediaType = 'video';
	                if (_videotag.videoHeight === 0) {
	                    mediaType = 'audio';
	                }
	                _this.trigger('mediaType', { mediaType: mediaType });
	            }
	        }
	
	        // If we're live and the buffer end has remained the same for some time, mark the stream as stale and check if the stream is over
	        function checkStaleStream() {
	            var endOfBuffer = timeRangesUtil.endOfRange(_videotag.buffered);
	            var live = _videotag.duration === Infinity;
	
	            if (live && _lastEndOfBuffer === endOfBuffer) {
	                if (!_staleStreamTimeout) {
	                    _staleStreamTimeout = setTimeout(function () {
	                        _stale = true;
	                        checkStreamEnded();
	                    }, _staleStreamDuration);
	                }
	            } else {
	                clearTimeout(_staleStreamTimeout);
	                _staleStreamTimeout = null;
	                _stale = false;
	            }
	
	            _lastEndOfBuffer = endOfBuffer;
	        }
	
	        function checkStreamEnded() {
	            if (_stale && _edgeOfLiveStream) {
	                _this.trigger(events.JWPLAYER_MEDIA_ERROR, {
	                    message: 'The live stream is either down or has ended'
	                });
	                return true;
	            }
	
	            return false;
	        }
	
	        function atEdgeOfLiveStream() {
	            if (_videotag.duration !== Infinity) {
	                return false;
	            }
	
	            // currentTime doesn't always get to the end of the buffered range
	            var timeFudge = 2;
	            return timeRangesUtil.endOfRange(_videotag.buffered) - _videotag.currentTime <= timeFudge;
	        }
	
	        function clearTimeouts() {
	            clearTimeout(_playbackTimeout);
	            clearTimeout(_staleStreamTimeout);
	            _staleStreamTimeout = null;
	        }
	    }
	
	    // Register provider
	    var F = function F() {};
	    F.prototype = DefaultProvider;
	    VideoProvider.prototype = new F();
	
	    VideoProvider.getName = function () {
	        return { name: 'html5' };
	    };
	
	    return VideoProvider;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },

/***/ 42:
/*!*********************************************!*\
  !*** ./src/js/providers/data-normalizer.js ***!
  \*********************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.qualityLevel = qualityLevel;
	function qualityLevel(level) {
	    return {
	        bitrate: level.bitrate,
	        label: level.label,
	        width: level.width,
	        height: level.height
	    };
	}

/***/ },

/***/ 43:
/*!******************************************!*\
  !*** ./src/js/providers/tracks-mixin.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! utils/underscore */ 6), __webpack_require__(/*! utils/id3Parser */ 18), __webpack_require__(/*! utils/helpers */ 8), __webpack_require__(/*! controller/tracks-loader */ 44), __webpack_require__(/*! controller/tracks-helper */ 50)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, ID3Parser, utils, tracksLoader, tracksHelper) {
	    /**
	     * Used across all providers for loading tracks and handling browser track-related events
	     */
	    var Tracks = {
	        _itemTracks: null,
	        _textTracks: null,
	        _tracksById: null,
	        _cuesByTrackId: null,
	        _cachedVTTCues: null,
	        _metaCuesByTextTime: null,
	        _currentTextTrackIndex: -1,
	        _unknownCount: 0,
	        _activeCuePosition: null,
	        _initTextTracks: _initTextTracks,
	        addTracksListener: addTracksListener,
	        clearTracks: clearTracks,
	        clearCueData: clearCueData,
	        disableTextTrack: disableTextTrack,
	        enableTextTrack: enableTextTrack,
	        getSubtitlesTrack: getSubtitlesTrack,
	        removeTracksListener: removeTracksListener,
	        addTextTracks: addTextTracks,
	        setTextTracks: setTextTracks,
	        setupSideloadedTracks: setupSideloadedTracks,
	        setSubtitlesTrack: setSubtitlesTrack,
	        textTrackChangeHandler: null,
	        addTrackHandler: null,
	        addCuesToTrack: addCuesToTrack,
	        addCaptionsCue: addCaptionsCue,
	        addVTTCue: addVTTCue,
	        addVTTCuesToTrack: addVTTCuesToTrack,
	        renderNatively: false
	    };
	
	    function setTextTracks(tracks) {
	        this._currentTextTrackIndex = -1;
	        if (!tracks) {
	            return;
	        }
	
	        if (!this._textTracks) {
	            this._initTextTracks();
	        } else {
	            // Remove the 608 captions track that was mutated by the browser
	            this._textTracks = _.reject(this._textTracks, function (track) {
	                if (this.renderNatively && track._id === 'nativecaptions') {
	                    delete this._tracksById[track._id];
	                    return true;
	                }
	            }, this);
	
	            // Remove the ID3 track from the cache
	            delete this._tracksById.nativemetadata;
	        }
	
	        // filter for 'subtitles' or 'captions' tracks
	        if (tracks.length) {
	            var i = 0;
	            var len = tracks.length;
	
	            for (i; i < len; i++) {
	                var track = tracks[i];
	                if (!track._id) {
	                    if (track.kind === 'captions' || track.kind === 'metadata') {
	                        track._id = 'native' + track.kind;
	                        if (!track.label && track.kind === 'captions') {
	                            // track label is read only in Safari
	                            // 'captions' tracks without a label need a name in order for the cc menu to work
	                            var labelInfo = tracksHelper.createLabel(track, this._unknownCount);
	                            track.name = labelInfo.label;
	                            this._unknownCount = labelInfo.unknownCount;
	                        }
	                    } else {
	                        track._id = tracksHelper.createId(track, this._textTracks.length);
	                    }
	                    if (this._tracksById[track._id]) {
	                        // tracks without unique ids must not be marked as "inuse"
	                        continue;
	                    }
	                    track.inuse = true;
	                }
	                if (!track.inuse || this._tracksById[track._id]) {
	                    continue;
	                }
	                // setup TextTrack
	                if (track.kind === 'metadata') {
	                    // track mode needs to be "hidden", not "showing", so that cues don't display as captions in Firefox
	                    track.mode = 'hidden';
	                    track.oncuechange = _cueChangeHandler.bind(this);
	                    this._tracksById[track._id] = track;
	                } else if (_kindSupported(track.kind)) {
	                    var mode = track.mode;
	                    var cue;
	
	                    // By setting the track mode to 'hidden', we can determine if the track has cues
	                    track.mode = 'hidden';
	
	                    if (!track.cues.length && track.embedded) {
	                        // There's no method to remove tracks added via: video.addTextTrack.
	                        // This ensures the 608 captions track isn't added to the CC menu until it has cues
	                        continue;
	                    }
	
	                    track.mode = mode;
	
	                    // Parsed cues may not have been added to this track yet
	                    if (this._cuesByTrackId[track._id] && !this._cuesByTrackId[track._id].loaded) {
	                        var cues = this._cuesByTrackId[track._id].cues;
	                        while (cue = cues.shift()) {
	                            _addCueToTrack(this.renderNatively, track, cue);
	                        }
	                        track.mode = mode;
	                        this._cuesByTrackId[track._id].loaded = true;
	                    }
	
	                    _addTrackToList.call(this, track);
	                }
	            }
	        }
	
	        if (this.renderNatively) {
	            // Only bind and set this.textTrackChangeHandler once so that removeEventListener works
	            this.textTrackChangeHandler = this.textTrackChangeHandler || textTrackChangeHandler.bind(this);
	            this.addTracksListener(this.video.textTracks, 'change', this.textTrackChangeHandler);
	
	            if (utils.isEdge() || utils.isFF() || utils.isSafari()) {
	                // Listen for TextTracks added to the videotag after the onloadeddata event in Edge and Firefox
	                this.addTrackHandler = this.addTrackHandler || addTrackHandler.bind(this);
	                this.addTracksListener(this.video.textTracks, 'addtrack', this.addTrackHandler);
	            }
	        }
	
	        if (this._textTracks.length) {
	            this.trigger('subtitlesTracks', { tracks: this._textTracks });
	        }
	    }
	
	    function setupSideloadedTracks(itemTracks) {
	        // Add tracks if we're starting playback or resuming after a midroll
	
	        if (!this.renderNatively) {
	            return;
	        }
	        // Determine if the tracks are the same and the embedded + sideloaded count = # of tracks in the controlbar
	        var alreadyLoaded = itemTracks === this._itemTracks;
	        if (!alreadyLoaded) {
	            tracksLoader.cancelXhr(this._itemTracks);
	        }
	        this._itemTracks = itemTracks;
	        if (!itemTracks) {
	            return;
	        }
	
	        if (!alreadyLoaded) {
	            this.disableTextTrack();
	            _clearSideloadedTextTracks.call(this);
	            this.addTextTracks(itemTracks);
	        }
	    }
	
	    function getSubtitlesTrack() {
	        return this._currentTextTrackIndex;
	    }
	
	    function setSubtitlesTrack(menuIndex) {
	        if (!this.renderNatively) {
	            if (this.setCurrentSubtitleTrack) {
	                this.setCurrentSubtitleTrack(menuIndex - 1);
	            }
	            return;
	        }
	
	        if (!this._textTracks) {
	            return;
	        }
	
	        // 0 = 'Off'
	        if (menuIndex === 0) {
	            _.each(this._textTracks, function (track) {
	                track.mode = track.embedded ? 'hidden' : 'disabled';
	            });
	        }
	
	        // Track index is 1 less than controlbar index to account for 'Off' = 0.
	        // Prevent unnecessary track change events
	        if (this._currentTextTrackIndex === menuIndex - 1) {
	            return;
	        }
	
	        // Turn off current track
	        this.disableTextTrack();
	
	        // Set the provider's index to the model's index, then show the selected track if it exists
	        this._currentTextTrackIndex = menuIndex - 1;
	
	        if (this._textTracks[this._currentTextTrackIndex]) {
	            this._textTracks[this._currentTextTrackIndex].mode = 'showing';
	        }
	
	        // Update the model index since the track change may have come from a browser event
	        this.trigger('subtitlesTrackChanged', {
	            currentTrack: this._currentTextTrackIndex + 1,
	            tracks: this._textTracks
	        });
	    }
	
	    function addCaptionsCue(cueData) {
	        if (!cueData.text || !cueData.begin || !cueData.end) {
	            return;
	        }
	        var trackId = cueData.trackid.toString();
	        var track = this._tracksById && this._tracksById[trackId];
	        if (!track) {
	            track = {
	                kind: 'captions',
	                _id: trackId,
	                data: []
	            };
	            this.addTextTracks([track]);
	            this.trigger('subtitlesTracks', { tracks: this._textTracks });
	        }
	
	        var cueId;
	
	        if (cueData.useDTS) {
	            // There may not be any 608 captions when the track is first created
	            // Need to set the source so position is determined from metadata
	            if (!track.source) {
	                track.source = cueData.source || 'mpegts';
	            }
	        }
	        cueId = cueData.begin + '_' + cueData.text;
	
	        var cue = this._metaCuesByTextTime[cueId];
	        if (!cue) {
	            cue = {
	                begin: cueData.begin,
	                end: cueData.end,
	                text: cueData.text
	            };
	            this._metaCuesByTextTime[cueId] = cue;
	            var vttCue = tracksLoader.convertToVTTCues([cue])[0];
	            track.data.push(vttCue);
	        }
	    }
	
	    function addVTTCue(cueData) {
	        if (!this._tracksById) {
	            this._initTextTracks();
	        }
	
	        var trackId = cueData.track ? cueData.track : 'native' + cueData.type;
	        var track = this._tracksById[trackId];
	        var label = cueData.type === 'captions' ? 'Unknown CC' : 'ID3 Metadata';
	        var vttCue = cueData.cue;
	
	        if (!track) {
	            var itemTrack = {
	                kind: cueData.type,
	                _id: trackId,
	                label: label,
	                embedded: true
	            };
	
	            track = _createTrack.call(this, itemTrack);
	
	            if (this.renderNatively || track.kind === 'metadata') {
	                this.setTextTracks(this.video.textTracks);
	            } else {
	                addTextTracks.call(this, [track]);
	            }
	        }
	        if (_cacheVTTCue.call(this, track, vttCue)) {
	            if (this.renderNatively || track.kind === 'metadata') {
	                _addCueToTrack(this.renderNatively, track, vttCue);
	            } else {
	                track.data.push(vttCue);
	            }
	        }
	    }
	
	    function addCuesToTrack(cueData) {
	        // convert cues coming from the flash provider into VTTCues, then append them to track
	        var track = this._tracksById[cueData.name];
	        if (!track) {
	            return;
	        }
	
	        track.source = cueData.source;
	        var cues = cueData.captions || [];
	        var cuesToConvert = [];
	        var sort = false;
	
	        for (var i = 0; i < cues.length; i++) {
	            var cue = cues[i];
	            var cueId = cueData.name + '_' + cue.begin + '_' + cue.end;
	            if (!this._metaCuesByTextTime[cueId]) {
	                this._metaCuesByTextTime[cueId] = cue;
	                cuesToConvert.push(cue);
	                sort = true;
	            }
	        }
	        if (sort) {
	            cuesToConvert.sort(function (a, b) {
	                return a.begin - b.begin;
	            });
	        }
	        var vttCues = tracksLoader.convertToVTTCues(cuesToConvert);
	        Array.prototype.push.apply(track.data, vttCues);
	    }
	
	    function addTracksListener(tracks, eventType, handler) {
	        if (!tracks) {
	            return;
	        }
	        // Always remove existing listener
	        removeTracksListener(tracks, eventType, handler);
	
	        if (this.instreamMode) {
	            return;
	        }
	
	        if (tracks.addEventListener) {
	            tracks.addEventListener(eventType, handler);
	        } else {
	            tracks['on' + eventType] = handler;
	        }
	    }
	
	    function removeTracksListener(tracks, eventType, handler) {
	        if (!tracks) {
	            return;
	        }
	        if (tracks.removeEventListener) {
	            tracks.removeEventListener(eventType, handler);
	        } else {
	            tracks['on' + eventType] = null;
	        }
	    }
	
	    function clearTracks() {
	        tracksLoader.cancelXhr(this._itemTracks);
	        var metadataTrack = this._tracksById && this._tracksById.nativemetadata;
	        if (this.renderNatively || metadataTrack) {
	            _removeCues(this.renderNatively, this.video.textTracks);
	            if (metadataTrack) {
	                metadataTrack.oncuechange = null;
	            }
	        }
	
	        this._itemTracks = null;
	        this._textTracks = null;
	        this._tracksById = null;
	        this._cuesByTrackId = null;
	        this._metaCuesByTextTime = null;
	        this._unknownCount = 0;
	        this._activeCuePosition = null;
	        if (this.renderNatively) {
	            // Removing listener first to ensure that removing cues does not trigger it unnecessarily
	            this.removeTracksListener(this.video.textTracks, 'change', this.textTrackChangeHandler);
	            _removeCues(this.renderNatively, this.video.textTracks);
	        }
	    }
	
	    // Clear track cues to prevent duplicates
	    function clearCueData(trackId) {
	        if (this._cachedVTTCues[trackId]) {
	            this._cachedVTTCues[trackId] = {};
	            this._tracksById[trackId].data = [];
	        }
	    }
	
	    function disableTextTrack() {
	        if (this._textTracks) {
	            var track = this._textTracks[this._currentTextTrackIndex];
	            if (track) {
	                // FF does not remove the active cue from the dom when the track is hidden, so we must disable it
	                track.mode = 'disabled';
	                if (track.embedded || track._id === 'nativecaptions') {
	                    track.mode = 'hidden';
	                }
	            }
	        }
	    }
	
	    function enableTextTrack() {
	        if (this._textTracks) {
	            var track = this._textTracks[this._currentTextTrackIndex];
	            if (track) {
	                track.mode = 'showing';
	            }
	        }
	    }
	
	    function textTrackChangeHandler() {
	        var textTracks = this.video.textTracks;
	        var inUseTracks = _.filter(textTracks, function (track) {
	            return (track.inuse || !track._id) && _kindSupported(track.kind);
	        });
	        if (!this._textTracks || _tracksModified.call(this, inUseTracks)) {
	            this.setTextTracks(textTracks);
	            return;
	        }
	        // If a caption/subtitle track is showing, find its index
	        var selectedTextTrackIndex = -1;
	        for (var i = 0; i < this._textTracks.length; i++) {
	            if (this._textTracks[i].mode === 'showing') {
	                selectedTextTrackIndex = i;
	                break;
	            }
	        }
	
	        // Notifying the model when the index changes keeps the current index in sync in iOS Fullscreen mode
	        if (selectedTextTrackIndex !== this._currentTextTrackIndex) {
	            this.setSubtitlesTrack(selectedTextTrackIndex + 1);
	        }
	    }
	
	    // Used in MS Edge to get tracks from the videotag as they're added
	    function addTrackHandler() {
	        this.setTextTracks(this.video.textTracks);
	    }
	
	    function addTextTracks(tracksArray) {
	        if (!tracksArray) {
	            return;
	        }
	
	        if (!this._textTracks) {
	            this._initTextTracks();
	        }
	
	        for (var i = 0; i < tracksArray.length; i++) {
	            var itemTrack = tracksArray[i];
	            // only add valid and supported kinds https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
	            if (itemTrack.kind && !_kindSupported(itemTrack.kind)) {
	                continue;
	            }
	            var textTrackAny = _createTrack.call(this, itemTrack);
	            _addTrackToList.call(this, textTrackAny);
	            if (itemTrack.file) {
	                itemTrack.data = [];
	                tracksLoader.loadFile(itemTrack, this.addVTTCuesToTrack.bind(this, textTrackAny), _errorHandler);
	            }
	        }
	
	        if (this._textTracks && this._textTracks.length) {
	            this.trigger('subtitlesTracks', { tracks: this._textTracks });
	        }
	    }
	
	    function addVTTCuesToTrack(track, vttCues) {
	        if (!this.renderNatively) {
	            return;
	        }
	
	        var textTrack = this._tracksById[track._id];
	        // the track may not be on the video tag yet
	        if (!textTrack) {
	
	            if (!this._cuesByTrackId) {
	                this._cuesByTrackId = {};
	            }
	            this._cuesByTrackId[track._id] = { cues: vttCues, loaded: false };
	            return;
	        }
	        // Cues already added
	        if (this._cuesByTrackId[track._id] && this._cuesByTrackId[track._id].loaded) {
	            return;
	        }
	
	        var cue;
	        this._cuesByTrackId[track._id] = { cues: vttCues, loaded: true };
	
	        while (cue = vttCues.shift()) {
	            _addCueToTrack(this.renderNatively, textTrack, cue);
	        }
	    }
	
	    // ////////////////////
	    // //// PRIVATE METHODS
	    // ////////////////////
	
	    function _addCueToTrack(renderNatively, track, vttCue) {
	        if (!(utils.isIE() && renderNatively) || !window.TextTrackCue) {
	            track.addCue(vttCue);
	            return;
	        }
	        // There's no support for the VTTCue interface in IE/Edge.
	        // We need to convert VTTCue to TextTrackCue before adding them to the TextTrack
	        // This unfortunately removes positioning properties from the cues
	        var textTrackCue = new window.TextTrackCue(vttCue.startTime, vttCue.endTime, vttCue.text);
	        track.addCue(textTrackCue);
	    }
	
	    function _removeCues(renderNatively, tracks) {
	        if (tracks && tracks.length) {
	            _.each(tracks, function (track) {
	                // Let IE & Edge handle cleanup of non-sideloaded text tracks for native rendering
	                if (utils.isIE() && renderNatively && /^(native|subtitle|cc)/.test(track._id)) {
	                    return;
	                }
	
	                // Cues are inaccessible if the track is disabled. While hidden,
	                // we can remove cues while the track is in a non-visible state
	                // Set to disabled before hidden to ensure active cues disappear
	                track.mode = 'disabled';
	                track.mode = 'hidden';
	                for (var i = track.cues.length; i--;) {
	                    track.removeCue(track.cues[i]);
	                }
	                if (!track.embedded) {
	                    track.mode = 'disabled';
	                }
	                track.inuse = false;
	            });
	        }
	    }
	
	    function _kindSupported(kind) {
	        return kind === 'subtitles' || kind === 'captions';
	    }
	
	    function _initTextTracks() {
	        this._textTracks = [];
	        this._tracksById = {};
	        this._metaCuesByTextTime = {};
	        this._cuesByTrackId = {};
	        this._cachedVTTCues = {};
	        this._unknownCount = 0;
	    }
	
	    function _createTrack(itemTrack) {
	        var track;
	        var labelInfo = tracksHelper.createLabel(itemTrack, this._unknownCount);
	        var label = labelInfo.label;
	        this._unknownCount = labelInfo.unknownCount;
	
	        if (this.renderNatively || itemTrack.kind === 'metadata') {
	            var tracks = this.video.textTracks;
	            // TextTrack label is read only, so we'll need to create a new track if we don't
	            // already have one with the same label
	            track = _.findWhere(tracks, { label: label });
	
	            if (track) {
	                track.kind = itemTrack.kind;
	                track.language = itemTrack.language || '';
	            } else {
	                track = this.video.addTextTrack(itemTrack.kind, label, itemTrack.language || '');
	            }
	
	            track.default = itemTrack.default;
	            track.mode = 'disabled';
	            track.inuse = true;
	        } else {
	            track = itemTrack;
	            track.data = track.data || [];
	        }
	
	        if (!track._id) {
	            track._id = tracksHelper.createId(itemTrack, this._textTracks.length);
	        }
	
	        return track;
	    }
	
	    function _addTrackToList(track) {
	        this._textTracks.push(track);
	        this._tracksById[track._id] = track;
	    }
	
	    function _clearSideloadedTextTracks() {
	        // Clear VTT textTracks
	        if (!this._textTracks) {
	            return;
	        }
	        var nonSideloadedTracks = _.filter(this._textTracks, function (track) {
	            return track.embedded || track.groupid === 'subs';
	        });
	        this._initTextTracks();
	        _.each(nonSideloadedTracks, function (track) {
	            this._tracksById[track._id] = track;
	        });
	        this._textTracks = nonSideloadedTracks;
	    }
	
	    function _cueChangeHandler(e) {
	        var activeCues = e.currentTarget.activeCues;
	        if (!activeCues || !activeCues.length) {
	            return;
	        }
	
	        // Get the most recent start time. Cues are sorted by start time in ascending order by the browser
	        var startTime = activeCues[activeCues.length - 1].startTime;
	        // Prevent duplicate meta events for the same list of cues since the cue change handler fires once
	        // for each activeCue in Safari
	        if (this._activeCuePosition === startTime) {
	            return;
	        }
	        var dataCues = [];
	
	        _.each(activeCues, function (cue) {
	            if (cue.startTime < startTime) {
	                return;
	            }
	            if (cue.data || cue.value) {
	                dataCues.push(cue);
	            } else if (cue.text) {
	                this.trigger('meta', {
	                    metadataTime: startTime,
	                    metadata: JSON.parse(cue.text)
	                });
	            }
	        }, this);
	
	        if (dataCues.length) {
	            var id3Data = ID3Parser.parseID3(dataCues);
	            this.trigger('meta', {
	                metadataTime: startTime,
	                metadata: id3Data
	            });
	        }
	        this._activeCuePosition = startTime;
	    }
	
	    function _cacheVTTCue(track, vttCue) {
	        var trackKind = track.kind;
	        if (!this._cachedVTTCues[track._id]) {
	            this._cachedVTTCues[track._id] = {};
	        }
	        var cachedCues = this._cachedVTTCues[track._id];
	        var cacheKeyTime;
	
	        switch (trackKind) {
	            case 'captions':
	            case 'subtitles':
	                // VTTCues should have unique start and end times, even in cases where there are multiple
	                // active cues. This is safer than ensuring text is unique, which may be violated on seek.
	                // Captions within .05s of each other are treated as unique to account for
	                // quality switches where start/end times are slightly different.
	                cacheKeyTime = Math.floor(vttCue.startTime * 20);
	                var cacheLine = '_' + vttCue.line;
	                var cacheValue = Math.floor(vttCue.endTime * 20);
	                var cueExists = cachedCues[cacheKeyTime + cacheLine] || cachedCues[cacheKeyTime + 1 + cacheLine] || cachedCues[cacheKeyTime - 1 + cacheLine];
	
	                if (cueExists && Math.abs(cueExists - cacheValue) <= 1) {
	                    return false;
	                }
	
	                cachedCues[cacheKeyTime + cacheLine] = cacheValue;
	                return true;
	            case 'metadata':
	                var text = vttCue.data ? new Uint8Array(vttCue.data).join('') : vttCue.text;
	                cacheKeyTime = vttCue.startTime + text;
	                if (cachedCues[cacheKeyTime]) {
	                    return false;
	                }
	
	                cachedCues[cacheKeyTime] = vttCue.endTime;
	                return true;
	            default:
	                return false;
	        }
	    }
	
	    function _tracksModified(inUseTracks) {
	        // Need to add new textTracks coming from the video tag
	        if (inUseTracks.length > this._textTracks.length) {
	            return true;
	        }
	
	        // Tracks may have changed in Safari after an ad
	        for (var i = 0; i < inUseTracks.length; i++) {
	            var track = inUseTracks[i];
	            if (!track._id || !this._tracksById[track._id]) {
	                return true;
	            }
	        }
	
	        return false;
	    }
	
	    function _errorHandler(error) {
	        utils.log('CAPTIONS(' + error + ')');
	    }
	
	    return Tracks;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },

/***/ 51:
/*!*************************************!*\
  !*** ./src/js/utils/time-ranges.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    function endOfRange(timeRanges) {
	        if (!timeRanges || !timeRanges.length) {
	            return 0;
	        }
	
	        return timeRanges.end(timeRanges.length - 1);
	    }
	
	    return {
	        endOfRange: endOfRange
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }

});
//# sourceMappingURL=provider.html5.a8bf8f3cb1a82cfe5f6e.map