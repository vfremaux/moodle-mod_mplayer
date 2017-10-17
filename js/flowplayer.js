/**
 * Class encaps of the flowplayer configuration.
 */
// jshint unused:false, undef:false

var ClassBuilder = function(methods) {
    var klass = function() {
        this.initialize.apply(this, arguments);
    };

    for (var property in methods) {
        klass.prototype[property] = methods[property];
    }

    if (!klass.prototype.initialize) {
        klass.prototype.initialize = function(){};
    }

    return klass;
};

var Source = new ClassBuilder( {
    initialize: function(type, src) {
        this.type = type;
        this.src = src;
    }
});

var Clip = new ClassBuilder( {
    initialize: function() {
        this.sources = [];
        this.subtitles = [];
        this.cuepoints = [];
    },

    set: function(prop, value) {
        this[prop] = value;
    },

    addSource: function(source) {
        this.sources[this.sources.length] = source;
    },

    addSubtitle: function(subtitle) {
        this.subtitles[this.subtitles.length] = subtitle;
    },

    addCuepoint: function(cuepoint) {
        this.cuepoints[this.cuepoints.length] = cuepoint;
    },
});

var Cue = new ClassBuilder( {
    initialize: function(time, url, cueout, cuetype, mandatory, playerid) {
        this.time = time;
        this.url = url;
        this.cueout = cueout;
        this.type = cuetype;
        this.mandatory = mandatory;
        this.playerid = playerid;
    }
});

var Subtitle = new ClassBuilder( {
    initialize: function(kind, src, srclang, label, defaultvalue) {
        if (defaultvalue) {
            this["default"] = true;
        }
        this.src = src;
        this.kind = kind;
        this.srclang = srclang;
        this.label = label;
    }
});
var FlowplayerConfig = new ClassBuilder( {

    /*
     * Note extra members are called with _ prefix. those
     * attributes are outside flowplayer structure needs.
     */
    initialize: function() {
        this._is_rendered = false;
        this.clip = new Clip();
        this.rtmp = false;
        this._completion = true;
        this.fullscreen = false;
        this.splash = false;
        this.poster = false;
        this.playlist = [];
        this.advance = true;
        this.loop = false;
        this.nativesubtitles = false;
        this.generate_cuepoints = true;
        this.embed = false;
        this.ratio = '16/9';
        this._mplayerid = 0;
    },

    set: function(prop, value, vix) {
        if (!vix) {
            this[prop] = value;
        } else {
            this.playlist[vix].set(prop, value);
        }
    },

    setClip: function(clip) {
        this.clip = clip;
    },

    addClip: function(clip) {
        this.playlist[this.playlist.length] = clip;
    },

    setCue: function(time, url, cueout, cuetype, mandatory) {
        this.clip.addCuepoint(new Cue(time, url, cueout, cuetype, mandatory, this._mplayerid));
    },

    addCue: function(vix, time, url, cueout, cuetype, mandatory) {
        this.playlist[vix].addCuepoint(new Cue(time, url, cueout, cuetype, mandatory, this._mplayerid));
    },

    setSource: function(source) {
        this.clip.addSource(source);
        this.playlist[0] = new Clip();
        this.playlist[0].addSource(source);
    },

    addSource: function(vix, source) {
        this.playlist[vix].addSource(source);
    },

    setSubtitle: function(kind, src, srclang, label, defaultvalue) {
        this.clip.addSubtitle(new Subtitle(kind, src, srclang, label, defaultvalue));
    },

    addSubtitle: function(vix, kind, src, srclang, label, defaultvalue) {
        this.playlist[vix].addSubtitle(new Subtitle(kind, src, srclang, label, defaultvalue));
    },

    /*
     * Renders a flow player that is : installs the player in container and register
     * all what is bound to this instance.
     */
    render: function(id) {
        // Select the above element as player container.
        var container = document.getElementById("flp" + id);

        // Install flowplayer into selected container.
        flowplayer(container, this);
        api = flowplayer("#flp" + id);
        this._is_renderer = true;
        this._fp = container;
        this._mplayerid = id;
        api.conf._mplayerid = id; // Confirm in installed instance.

        if (this._completion) {
            api.on("progress", send_video_progress);
            api.on("finish", fire_video_finished);
            api.on("start", setup_video_start);
            api.on("cuepoint", function(e, api, cue) {
                cuepoint_process(e, api, cue);
            });
            api.on("ready", function(e, v1, v2) {
                if (v1.video.index > 0) {
                    v1.loadSubtitles(0);
                }
            });
            /*
            clip.bind("start", start_video_progress);
            clip.bind("stop", stop_video_progress);
            clip.bind("pause", pause_video_progress);
            clip.bind("resume", resume_video_progress);
            */
        }
    }
});