import instances from 'api/players';
import { showView } from 'api/core-shim';
import setConfig from 'api/set-config';
import setPlaylist from 'api/set-playlist';
import ApiQueueDecorator from 'api/api-queue';
import PlaylistLoader from 'playlist/loader';
import Playlist from 'playlist/playlist';
import InstreamAdapter from 'controller/instream-adapter';
import Captions from 'controller/captions';
import Model from 'controller/model';
import View from 'view/view';
import changeStateEvent from 'events/change-state-event';
import eventsMiddleware from 'controller/events-middleware';
import Events from 'utils/backbone.events';
import { OS } from 'environment/environment';
import { streamType } from 'providers/utils/stream-type';
import Promise, { resolved } from 'polyfills/promise';
import cancelable from 'utils/cancelable';
import _ from 'utils/underscore';
import { PLAYER_STATE, STATE_BUFFERING, STATE_IDLE, STATE_COMPLETE, STATE_PAUSED, STATE_PLAYING, STATE_ERROR, STATE_LOADING,
    STATE_STALLED, MEDIA_BEFOREPLAY, PLAYLIST_LOADED, ERROR, PLAYLIST_COMPLETE, CAPTIONS_CHANGED, READY,
    MEDIA_ERROR, MEDIA_COMPLETE, CAST_SESSION, FULLSCREEN, PLAYLIST_ITEM, MEDIA_VOLUME, MEDIA_MUTE, PLAYBACK_RATE_CHANGED,
    CAPTIONS_LIST, CONTROLS, RESIZE } from 'events/events';

// The model stores a different state than the provider
function normalizeState(newstate) {
    if (newstate === STATE_LOADING || newstate === STATE_STALLED) {
        return STATE_BUFFERING;
    }
    return newstate;
}

const Controller = function() {};

Object.assign(Controller.prototype, {
    setup(config, _api, originalContainer, eventListeners, commandQueue) {
        const _this = this;
        const _model = _this._model = new Model();

        let _view;
        let _captions;
        let _preplay = false;
        let _actionOnAttach;
        let _stopPlaylist = false;
        let _interruptPlay;
        let checkAutoStartCancelable = cancelable(_checkAutoStart);
        let updatePlaylistCancelable = cancelable(function() {});

        _this.originalContainer = _this.currentContainer = originalContainer;
        _this._events = eventListeners;

        const _eventQueuedUntilReady = [];

        _model.setup(config);
        _view = this._view = new View(_api, _model);
        _view.on('all', _triggerAfterReady, _this);

        _model.mediaController.on('all', _triggerAfterReady, _this);
        _model.mediaController.on(MEDIA_COMPLETE, () => {
            // Insert a small delay here so that other complete handlers can execute
            resolved.then(_completeHandler);
        });
        _model.mediaController.on(MEDIA_ERROR, _this.triggerError, _this);
        _model.on(ERROR, _this.triggerError, _this);

        // If we attempt to load flash, assume it is blocked if we don't hear back within a second
        _model.on('change:flashBlocked', function(model, isBlocked) {
            if (!isBlocked) {
                this._model.set('errorEvent', undefined);
                return;
            }
            // flashThrottle indicates whether this is a throttled event or plugin blocked event
            const throttled = !!model.get('flashThrottle');
            const errorEvent = {
                message: throttled ? 'Click to run Flash' : 'Flash plugin failed to load'
            };
            // Only dispatch an error for Flash blocked, not throttled events
            if (!throttled) {
                this.trigger(ERROR, errorEvent);
            }
            this._model.set('errorEvent', errorEvent);
        }, this);

        _model.on('change:state', changeStateEvent, this);

        _model.on('change:duration', function(model, duration) {
            const minDvrWindow = model.get('minDvrWindow');
            const type = streamType(duration, minDvrWindow);
            model.setStreamType(type);
        });

        _model.on('change:castState', function(model, evt) {
            _this.trigger(CAST_SESSION, evt);
        });
        _model.on('change:fullscreen', function(model, bool) {
            _this.trigger(FULLSCREEN, {
                fullscreen: bool
            });
            if (bool) {
                // Stop autoplay behavior when the player enters fullscreen
                model.set('playOnViewable', false);
            }
        });
        _model.on('change:volume', function(model, vol) {
            _this.trigger(MEDIA_VOLUME, {
                volume: vol
            });
        });
        _model.on('change:mute', function(model, mute) {
            _this.trigger(MEDIA_MUTE, {
                mute: mute
            });
        });

        _model.on('change:playbackRate', function(model, rate) {
            _this.trigger(PLAYBACK_RATE_CHANGED, {
                playbackRate: rate,
                position: model.get('position')
            });
        });

        _model.on('change:scrubbing', function(model, state) {
            if (state) {
                _pause();
            } else {
                _play({ reason: 'interaction' });
            }
        });

        // For onCaptionsList and onCaptionsChange
        _model.on('change:captionsList', function(model, captionsList) {
            _this.triggerAfterReady(CAPTIONS_LIST, {
                tracks: captionsList,
                track: _model.get('captionsIndex') || 0
            });
        });

        _model.on('change:mediaModel', function(model) {
            model.set('errorEvent', undefined);
            model.mediaModel.change(PLAYER_STATE, function(mediaModel, state) {
                if (!model.get('errorEvent')) {
                    model.set(PLAYER_STATE, normalizeState(state));
                }
            });
        });

        // Ensure captionsList event is raised after playlistItem
        _captions = new Captions(_model);
        _captions.on('all', _triggerAfterReady);

        function _video() {
            return _model.getVideo();
        }

        function _triggerAfterReady(type, e) {
            _this.triggerAfterReady(type, e);
        }

        function triggerControls(model, enable) {
            _this.trigger(CONTROLS, {
                controls: enable
            });
        }

        _model.on('change:viewSetup', function(model, viewSetup) {
            if (viewSetup) {
                showView(this, _view.element());
            }
        }, this);

        this.playerReady = function() {
            const related = _api.getPlugin('related');
            if (related) {
                related.on('nextUp', (nextUp) => {
                    _model.set('nextUp', nextUp);
                });
            }

            // Fire 'ready' once the view has resized so that player width and height are available
            // (requires the container to be in the DOM)
            _view.once(RESIZE, _playerReadyNotify);

            _view.init();
        };

        function _playerReadyNotify() {
            _model.change('visibility', _updateViewable);
            _model.on('change:controls', triggerControls);

            // Tell the api that we are loaded
            _this.trigger(READY, {
                // this will be updated by Api
                setupTime: 0
            });

            _model.change('playlist', function(model, playlist) {
                if (playlist.length) {
                    const eventData = {
                        playlist: playlist
                    };
                    const feedData = _model.get('feedData');
                    if (feedData) {
                        const eventFeedData = Object.assign({}, feedData);
                        delete eventFeedData.playlist;
                        eventData.feedData = eventFeedData;
                    }
                    _this.trigger(PLAYLIST_LOADED, eventData);
                }
            });

            _model.change('playlistItem', function(model, playlistItem) {
                if (playlistItem) {
                    _this.trigger(PLAYLIST_ITEM, {
                        index: _model.get('item'),
                        item: playlistItem
                    });
                }
            });

            // Stop queueing certain events
            _this.triggerAfterReady = _this.trigger;

            // Send queued events
            for (let i = 0; i < _eventQueuedUntilReady.length; i++) {
                const event = _eventQueuedUntilReady[i];
                _preplay = (event.type === MEDIA_BEFOREPLAY);
                _this.trigger(event.type, event.args);
                _preplay = false;
            }

            _model.change('viewable', viewableChange);
            _model.change('viewable', _checkPlayOnViewable);
            _model.once('change:autostartFailed change:autostartMuted change:mute', function(model) {
                model.off('change:viewable', _checkPlayOnViewable);
            });

            // Run _checkAutoStart() last
            // 'viewable' changes can result in preload() being called on the initial provider instance
            _checkAutoStart();
        }

        function _updateViewable(model, visibility) {
            if (!_.isUndefined(visibility)) {
                _model.set('viewable', Math.round(visibility));
            }
        }

        function _checkAutoStart() {
            if (!apiQueue) {
                // this player has been destroyed
                return;
            }
            if (!OS.mobile && _model.get('autostart') === true) {
                // Autostart immediately if we're not mobile and not waiting for the player to become viewable first
                _autoStart();
            }
            apiQueue.flush();
        }

        function viewableChange(model, viewable) {
            _this.trigger('viewable', {
                viewable: viewable
            });


            // Only attempt to preload if this is the first player on the page or viewable
            if (instances[0] === _api || viewable === 1) {
                model.preloadVideo();
            }
        }

        function _checkPlayOnViewable(model, viewable) {
            if (model.get('playOnViewable')) {
                if (viewable) {
                    _autoStart();
                } else if (OS.mobile) {
                    _this.pause({ reason: 'autostart' });
                }
            }
        }

        this.triggerAfterReady = function(type, args) {
            _eventQueuedUntilReady.push({
                type: type,
                args: args
            });
        };

        function _load(item, feedData) {

            _this.trigger('destroyPlugin', {});
            _stop(true);

            checkAutoStartCancelable.cancel();
            checkAutoStartCancelable = cancelable(_checkAutoStart);
            updatePlaylistCancelable.cancel();

            _primeMediaElementForPlayback();

            let loadPromise;

            switch (typeof item) {
                case 'string': {
                    const loadPlaylistPromise = _loadPlaylist(item).catch(error => {
                        _this.triggerError({
                            message: `Error loading playlist: ${error.message}`
                        });
                    });
                    updatePlaylistCancelable = cancelable((data) => {
                        if (data) {
                            return _updatePlaylist(data.playlist, data);
                        }
                    });
                    loadPromise = loadPlaylistPromise.then(updatePlaylistCancelable.async);
                    break;
                }
                case 'object':
                    loadPromise = _updatePlaylist(item, feedData);
                    break;
                case 'number':
                    loadPromise = _setItem(item);
                    break;
                default:
                    return;
            }
            loadPromise.catch(error => {
                _this.triggerError({
                    message: `Playlist error: ${error.message}`
                });
            });

            loadPromise.then(checkAutoStartCancelable.async).catch(function() {});
        }

        function _updatePlaylist(data, feedData) {
            const playlist = Playlist(data);
            try {
                setPlaylist(_model, playlist, feedData);
            } catch (error) {
                _model.set('item', 0);
                _model.set('playlistItem', null);
                return Promise.reject(error);
            }
            return _setItem(0);
        }

        function _loadPlaylist(toLoad) {
            return new Promise((resolve, reject) => {
                const loader = new PlaylistLoader();
                loader.on(PLAYLIST_LOADED, function(data) {
                    resolve(data);
                });
                loader.on(ERROR, function(error) {
                    _model.set('feedData', {
                        error: error
                    });
                    reject(error);
                }, this);
                loader.load(toLoad);
            });
        }

        function _getAdState() {
            return _this._instreamAdapter && _this._instreamAdapter.getState();
        }

        function _getState() {
            const adState = _getAdState();
            if (_.isString(adState)) {
                return adState;
            }
            return _model.get('state');
        }

        function _play(meta) {
            checkAutoStartCancelable.cancel();

            if (_model.get('state') === STATE_ERROR) {
                return resolved;
            }

            const playReason = _getReason(meta);
            _model.set('playReason', playReason);

            const adState = _getAdState();
            if (_.isString(adState)) {
                // this will resume the ad. _api.playAd would load a new ad
                _api.pauseAd(false);
                return resolved;
            }

            if (_model.get('state') === STATE_COMPLETE) {
                _stop(true);
                _setItem(0);
            }

            if (!_preplay) {
                _preplay = true;
                _this.triggerAfterReady(MEDIA_BEFOREPLAY, { playReason: playReason });
                _preplay = false;
                if (_interruptPlay) {
                    _interruptPlay = false;
                    _actionOnAttach = null;
                    _primeMediaElementForPlayback();
                    return resolved;
                }
            }

            return _model.playVideo(playReason);
        }

        function _getReason(meta) {
            if (meta && meta.reason) {
                return meta.reason;
            }
            if (_inInteraction(window.event)) {
                return 'interaction';
            }
            return 'external';
        }

        function _inInteraction(event) {
            return event && /^(?:mouse|pointer|touch|gesture|click|key)/.test(event.type);
        }

        function _primeMediaElementForPlayback() {
            // If we're in a user-gesture event call load() on video to allow async playback
            if (_inInteraction(window.event)) {
                const mediaElement = _model.get('mediaElement');
                if (!mediaElement.src) {
                    mediaElement.load();
                }
            }
        }

        function _autoStart() {
            const state = _model.get('state');
            if (state === STATE_IDLE || state === STATE_PAUSED) {
                _play({ reason: 'autostart' }).catch(() => {
                    if (!_this._instreamAdapter) {
                        _model.set('autostartFailed', true);
                    }
                    _actionOnAttach = null;
                });
            }
        }

        function _stop(internal) {
            checkAutoStartCancelable.cancel();
            apiQueue.empty();

            const adState = _getAdState();
            if (_.isString(adState)) {
                return;
            }

            const fromApi = !internal;

            _actionOnAttach = null;

            if (fromApi) {
                _stopPlaylist = true;
            }

            if (_preplay) {
                _interruptPlay = true;
            }

            _model.set('errorEvent', undefined);

            const provider = _model.getVideo();
            _model.stopVideo();
            if (!provider) {
                _model.set('state', STATE_IDLE);
            }
        }

        function _pause(meta) {
            _actionOnAttach = null;
            checkAutoStartCancelable.cancel();

            const pauseReason = _getReason(meta);
            _model.set('pauseReason', pauseReason);
            // Stop autoplay behavior if the video is paused by the user or an api call
            if (pauseReason === 'interaction' || pauseReason === 'external') {
                _model.set('playOnViewable', false);
            }

            const adState = _getAdState();
            if (_.isString(adState)) {
                _api.pauseAd(true);
                return;
            }

            switch (_model.get('state')) {
                case STATE_ERROR:
                    return;
                case STATE_PLAYING:
                case STATE_BUFFERING: {

                    _video().pause();
                    break;
                }
                default:
                    if (_preplay) {
                        _interruptPlay = true;
                    }
            }
        }

        function _isIdle() {
            const state = _model.get('state');
            return (state === STATE_IDLE || state === STATE_COMPLETE || state === STATE_ERROR);
        }

        function _seek(pos, meta) {
            if (_model.get('state') === STATE_ERROR) {
                return;
            }
            if (!_model.get('scrubbing') && _model.get('state') !== STATE_PLAYING) {
                _play(meta);
            }
            _video().seek(pos);
        }

        function _item(index, meta) {
            _stop(true);
            _setItem(index);
            _play(meta);
        }

        function _setItem(index) {
            return _model.setItemIndex(index);
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

            const idx = _model.get('item');
            if (idx === _model.get('playlist').length - 1) {
                // If it's the last item in the playlist
                if (_model.get('repeat')) {
                    _next({ reason: 'repeat' });
                } else {
                    // Exit fullscreen on IOS so that our overlays show to the user
                    if (OS.iOS) {
                        _setFullscreen(false);
                    }
                    // Autoplay/pause no longer needed since there's no more media to play
                    // This prevents media from replaying when a completed video scrolls into view
                    _model.set('playOnViewable', false);
                    _model.set('state', STATE_COMPLETE);
                    _this.trigger(PLAYLIST_COMPLETE, {});
                }
                return;
            }

            // It wasn't the last item in the playlist,
            //  so go to the next one and trigger an autoadvance event
            const related = _api.getPlugin('related');
            triggerAdvanceEvent(related, 'nextAutoAdvance');
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
            const qualityLevels = _getQualityLevels();
            if (qualityLevels) {
                const levelIndex = _getCurrentQuality();
                const level = qualityLevels[levelIndex];
                if (level) {
                    return {
                        level: Object.assign({
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

            _this.trigger(CAPTIONS_CHANGED, {
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
            if (_preplay) {
                _interruptPlay = true;
            }
            return _model.detachMedia();
        }

        function _attachMedia() {
            // Called after instream ends
            _model.attachMedia();

            if (typeof _actionOnAttach === 'function') {
                _actionOnAttach();
            }
        }

        function _setFullscreen(state) {
            if (!_.isBoolean(state)) {
                state = !_model.get('fullscreen');
            }

            _model.set('fullscreen', state);
            if (_this._instreamAdapter && _this._instreamAdapter._adModel) {
                _this._instreamAdapter._adModel.set('fullscreen', state);
            }
        }

        function _nextUp() {
            const related = _api.getPlugin('related');
            triggerAdvanceEvent(related, 'nextClick', () => related.next());
        }

        function triggerAdvanceEvent(related, evt, cb) {
            if (!related) {
                return;
            }
            const nextUp = _model.get('nextUp');
            if (nextUp) {
                _this.trigger(evt, {
                    mode: nextUp.mode,
                    ui: 'nextup',
                    target: nextUp,
                    itemsShown: [ nextUp ],
                    feedData: nextUp.feedData,
                });
            }
            if (typeof cb === 'function') {
                cb();
            }
        }

        /** Controller API / public methods **/
        this.load = _load;
        this.play = _play;
        this.pause = _pause;
        this.seek = _seek;
        this.stop = _stop;
        this.playlistItem = _item;
        this.playlistNext = _next;
        this.playlistPrev = _prev;
        this.setCurrentCaptions = _setCurrentCaptions;
        this.setCurrentQuality = _setCurrentQuality;
        this.setFullscreen = _setFullscreen;
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
        this.next = _nextUp;
        this.setConfig = (newConfig) => setConfig(_this, newConfig);

        // Model passthroughs
        this.setVolume = _model.setVolume.bind(_model);
        this.setMute = _model.setMute.bind(_model);
        this.setPlaybackRate = _model.setPlaybackRate.bind(_model);
        this.getProvider = function() {
            return _model.get('provider');
        };
        this.getWidth = function() {
            return _model.get('containerWidth');
        };
        this.getHeight = function() {
            return _model.get('containerHeight');
        };
        this.getItemQoe = function() {
            return _model._qoeItem;
        };
        this.isBeforeComplete = function () {
            return _model.checkComplete();
        };
        this.addButton = function(img, tooltip, callback, id, btnClass) {
            let customButtons = _model.get('customButtons') || [];
            let added = false;
            const newButton = {
                img: img,
                tooltip: tooltip,
                callback: callback,
                id: id,
                btnClass: btnClass
            };

            customButtons = customButtons.reduce(function(buttons, button) {
                if (button.id === newButton.id) {
                    added = true;
                    buttons.push(newButton);
                } else {
                    buttons.push(button);
                }
                return buttons;
            }, []);

            if (!added) {
                customButtons.unshift(newButton);
            }

            _model.set('customButtons', customButtons);
        };
        this.removeButton = function(id) {
            const customButtons = _.filter(
                _model.get('customButtons'),
                (button) => button.id !== id
            );

            _model.set('customButtons', customButtons);
        };
        // Delegate trigger so we can run a middleware function before any event is bubbled through the API
        this.trigger = function (type, args) {
            const data = eventsMiddleware(_model, type, args);
            return Events.trigger.call(this, type, data);
        };

        // View passthroughs
        this.resize = _view.resize;
        this.getSafeRegion = _view.getSafeRegion;
        this.setCues = _view.addCues;
        this.setCaptions = _view.setCaptions;

        this.checkBeforePlay = function() {
            return _preplay;
        };

        this.setControls = function (mode) {
            if (!_.isBoolean(mode)) {
                mode = !_model.get('controls');
            }
            _model.set('controls', mode);

            const provider = _model.getVideo();
            if (provider) {
                provider.setControls(mode);
            }
        };

        this.playerDestroy = function () {
            this.trigger('destroyPlugin', {});
            this.off();
            this.stop();
            showView(this, this.originalContainer);
            if (_view) {
                _view.destroy();
            }
            if (_model) {
                _model.destroy();
            }
            if (apiQueue) {
                apiQueue.destroy();
            }
            if (_captions) {
                _captions.destroy();
                _captions = null;
            }
            this.instreamDestroy();
        };

        this.isBeforePlay = this.checkBeforePlay;

        this.createInstream = function() {
            this.instreamDestroy();
            this._instreamAdapter = new InstreamAdapter(this, _model, _view);
            return this._instreamAdapter;
        };

        this.skipAd = function() {
            if (this._instreamAdapter) {
                this._instreamAdapter.skipAd();
            }
        };

        this.instreamDestroy = function() {
            if (_this._instreamAdapter) {
                _this._instreamAdapter.destroy();
                _this._instreamAdapter = null;
            }
        };

        // Setup ApiQueueDecorator after instance methods have been assigned
        const apiQueue = new ApiQueueDecorator(this, [
            'play',
            'pause',
            'seek',
            'setCurrentAudioTrack',
            'setCurrentCaptions',
            'setCurrentQuality',
            'setFullscreen',
        ], () => !_model.getVideo());
        // Add commands from CoreLoader to queue
        apiQueue.queue.push.apply(apiQueue.queue, commandQueue);

        _view.setup();
    },
    get(property) {
        return this._model.get(property);
    },
    getContainer() {
        return this.currentContainer || this.originalContainer;
    },
    getMute() {
        return this._model.getMute();
    },
    triggerError(evt) {
        this._model.set('errorEvent', evt);
        this._model.set('state', STATE_ERROR);
        this._model.once('change:state', function() {
            this._model.set('errorEvent', undefined);
        }, this);

        this.trigger(ERROR, evt);
    }
});

export default Controller;
