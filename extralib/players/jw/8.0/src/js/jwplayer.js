import { loadFrom } from './utils/playerutils';
import instances from './api/players';
import GlobalApi from 'api/global-api';
import { version } from './version';
import Api from 'api/api';
import ApiSettings from 'api/api-settings';

/* global __webpack_public_path__:true*/
/* eslint camelcase: 0 */
__webpack_public_path__ = loadFrom();

/**
 * Return an instance of {@link Api the JW Player API} matching an element on the page or an existing player.
 * @global
 * @param {string|number|HTMLElement} [query] - This can be an element id, player index or DOM element.
 * When left out, this method attempts to return the first available player.
 * @returns {Api|object} - Returns a player instance if one matches the provided query.
 * Otherwise, returns an object containing the `registerPlugin` method.
 */
const jwplayer = function(query) {
    let player;
    let domElement;

    // prioritize getting a player over querying an element
    if (!query) {
        player = instances[0];
    } else if (typeof query === 'string') {
        player = playerById(query);
        if (!player) {
            domElement = document.getElementById(query);
        }
    } else if (typeof query === 'number') {
        player = instances[query];
    } else if (query.nodeType) {
        domElement = query;
        player = playerById(domElement.id);
    }
    // found player
    if (player) {
        return player;
    }
    // create player
    if (domElement) {
        const api = new Api(domElement);
        instances.push(api);
        return api;
    }
    // invalid query
    return {
        registerPlugin: GlobalApi.registerPlugin
    };
};

function playerById(id) {
    for (let p = 0; p < instances.length; p++) {
        if (instances[p].id === id) {
            return instances[p];
        }
    }
    return null;
}

Object.defineProperties(jwplayer, {
    api: {
        get() {
            return GlobalApi;
        },
        set() {}
    },
    version: {
        get() {
            return version;
        },
        set() {}
    },
    debug: {
        get() {
            return ApiSettings.debug;
        },
        set(value) {
            ApiSettings.debug = !!value;
        }
    }
});

export default jwplayer;
