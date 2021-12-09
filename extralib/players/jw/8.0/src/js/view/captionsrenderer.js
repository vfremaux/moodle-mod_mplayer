import { Browser } from 'environment/environment';
import { chunkLoadErrorHandler } from '../api/core-loader';
import Events from 'utils/backbone.events';
import { ERROR } from 'events/events';
import { css, style, getRgba } from 'utils/css';
import { addClass, removeClass, empty } from 'utils/dom';
import _ from 'utils/underscore';

/** Component that renders the actual captions on screen. **/

let _WebVTT;

const _defaults = {
    back: true,
    backgroundOpacity: 50,
    edgeStyle: null,
    fontSize: 14,
    fontOpacity: 100,
    fontScale: 0.05, // Default captions font size = 1/20th of the video's height
    preprocessor: _.identity,
    windowOpacity: 0
};

const CaptionsRenderer = function (_model) {

    let _options;
    let _captionsTrack;
    let _currentCues;
    let _timeEvent;
    let _display;
    let _captionsWindow;
    let _textContainer;
    let _fontScale;
    let _windowStyle;

    _display = document.createElement('div');
    _display.className = 'jw-captions jw-reset';

    this.show = function () {
        addClass(_display, 'jw-captions-enabled');
    };

    this.hide = function () {
        removeClass(_display, 'jw-captions-enabled');
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
        if (!track || !track.data || !timeEvent) {
            return;
        }

        const pos = this.getAlignmentPosition(track, timeEvent);
        if (pos === false) {
            return;
        }

        const cues = this.getCurrentCues(track.data, pos);

        this.updateCurrentCues(cues);
        this.renderCues(true);
    };

    this.getCurrentCues = function (allCues, pos) {
        return _.filter(allCues, function (cue) {
            return pos >= (cue.startTime) && (!cue.endTime || pos <= cue.endTime);
        });
    };

    this.updateCurrentCues = function (cues) {
        // Render with vtt.js if there are cues, clear if there are none
        if (!cues.length) {
            _currentCues = [];
        } else if (_.difference(cues, _currentCues).length) {
            addClass(_captionsWindow, 'jw-captions-window-active');
            _currentCues = cues;
        }

        return _currentCues;
    };

    this.getAlignmentPosition = function (track, timeEvent) {
        const source = track.source;
        const metadata = timeEvent.metadata;

        // subtitles with "source" time must be synced with "metadata[source]"
        if (source) {
            if (metadata && _.isNumber(metadata[source])) {
                return metadata[source];
            }
            return;
        } else if (timeEvent.duration < 0) {
            // When the duration is negative (DVR mode), need to make alignmentPosition positive for captions to work
            return timeEvent.position - timeEvent.duration;
        }

        // Default to syncing with current position
        return timeEvent.position;
    };

    this.clear = function () {
        empty(_display);
    };

    /** Constructor for the renderer. **/
    this.setup = function (playerElementId, options) {
        _captionsWindow = document.createElement('div');
        _textContainer = document.createElement('span');
        _captionsWindow.className = 'jw-captions-window jw-reset';
        _textContainer.className = 'jw-captions-text jw-reset';

        _options = Object.assign({}, _defaults, options);

        _fontScale = _defaults.fontScale;
        _setFontScale(_options.fontSize);

        const windowColor = _options.windowColor;
        const windowOpacity = _options.windowOpacity;
        const edgeStyle = _options.edgeStyle;
        _windowStyle = {};
        const textStyle = {};

        _addTextStyle(textStyle, _options);

        if (windowColor || windowOpacity !== _defaults.windowOpacity) {
            _windowStyle.backgroundColor = getRgba(windowColor || '#000000', windowOpacity);
        }

        _addEdgeStyle(edgeStyle, textStyle, _options.fontOpacity);

        if (!_options.back && edgeStyle === null) {
            _addEdgeStyle('uniform', textStyle);
        }

        style(_captionsWindow, _windowStyle);
        style(_textContainer, textStyle);
        _setupCaptionStyles(playerElementId, textStyle);

        _captionsWindow.appendChild(_textContainer);
        _display.appendChild(_captionsWindow);

        this.populate(_model.get('captionsTrack'));
        _model.set('captions', _options);
    };

    this.element = function () {
        return _display;
    };

    this.destroy = function() {
        this.off();
        _model.off(null, null, this);
    };

    function _setFontScale() {
        if (!_.isFinite(_options.fontSize)) {
            return;
        }

        const height = _model.get('containerHeight');

        if (!height) {
            _model.once('change:containerHeight', _setFontScale, this);
            return;
        }

        // Adjust scale based on font size relative to the default
        _fontScale = _defaults.fontScale * _options.fontSize / _defaults.fontSize;
    }

    function _setFontSize() {
        const height = _model.get('containerHeight');

        if (!height) {
            return;
        }

        const fontSize = Math.round(height * _fontScale);

        if (_model.get('renderCaptionsNatively')) {
            _setShadowDOMFontSize(_model.get('id'), fontSize);
        } else {
            style(_display, {
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
        css('#' + playerId + ' .jw-text-track-display', _windowStyle, playerId);
        css('#' + playerId + ' .jw-text-track-cue', textStyle, playerId);
    }

    function _styleNativeCaptions(playerId, textStyle) {
        if (Browser.safari) {
            // Only Safari uses a separate element for styling text background
            css('#' + playerId + ' .jw-video::-webkit-media-text-track-display-backdrop', {
                backgroundColor: textStyle.backgroundColor
            }, playerId, true);
        }

        css('#' + playerId + ' .jw-video::-webkit-media-text-track-display', _windowStyle, playerId, true);
        css('#' + playerId + ' .jw-video::cue', textStyle, playerId, true);
    }

    function _setShadowDOMFontSize(playerId, fontSize) {
        // Set Shadow DOM font size (needs to be important to override browser's in line style)
        _windowStyle.fontSize = fontSize + 'px';
        css('#' + playerId + ' .jw-video::-webkit-media-text-track-display', _windowStyle, playerId, true);
    }

    function _addTextStyle(textStyle, options) {
        const color = options.color;
        const fontOpacity = options.fontOpacity;
        if (color || fontOpacity !== _defaults.fontOpacity) {
            textStyle.color = getRgba(color || '#ffffff', fontOpacity);
        }

        if (options.back) {
            const bgColor = options.backgroundColor;
            const bgOpacity = options.backgroundOpacity;
            if (bgColor !== _defaults.backgroundColor || bgOpacity !== _defaults.backgroundOpacity) {
                textStyle.backgroundColor = getRgba(bgColor, bgOpacity);
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

    function _addEdgeStyle(option, styles, fontOpacity) {
        const color = getRgba('#000000', fontOpacity);
        if (option === 'dropshadow') { // small drop shadow
            styles.textShadow = '0 2px 1px ' + color;
        } else if (option === 'raised') { // larger drop shadow
            styles.textShadow = '0 0 5px ' + color + ', 0 1px 5px ' + color + ', 0 2px 5px ' + color;
        } else if (option === 'depressed') { // top down shadow
            styles.textShadow = '0 -2px 1px ' + color;
        } else if (option === 'uniform') { // outline
            styles.textShadow = '-2px 0 1px ' + color + ',2px 0 1px ' + color +
                ',0 -2px 1px ' + color + ',0 2px 1px ' + color + ',-1px 1px 1px ' +
                color + ',1px 1px 1px ' + color + ',1px -1px 1px ' + color +
                ',1px 1px 1px ' + color;
        }
    }

    function _timeChange(e) {
        if (_model.get('renderCaptionsNatively')) {
            return;
        }

        _timeEvent = e;
        this.selectCues(_captionsTrack, _timeEvent);
    }

    function _captionsListHandler(model, captionsList) {
        if (captionsList.length === 1) {
            // captionsList only contains 'off'
            return;
        }

        // don't load the polyfill or do unnecessary work if rendering natively
        if (!model.get('renderCaptionsNatively') && !_WebVTT) {
            loadWebVttPolyfill().catch((error) => {
                this.trigger(ERROR, {
                    message: 'Captions renderer failed to load',
                    reason: error
                });
            });
            model.off('change:captionsList', _captionsListHandler, this);
        }
    }

    function loadWebVttPolyfill() {
        return require.ensure(['polyfills/webvtt'], function (require) {
            _WebVTT = require('polyfills/webvtt').default;
        }, chunkLoadErrorHandler, 'polyfills.webvtt');
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

    _model.on('change:captionsList', _captionsListHandler, this);
};

Object.assign(CaptionsRenderer.prototype, Events);

export default CaptionsRenderer;
