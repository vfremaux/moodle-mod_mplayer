import Events from 'utils/backbone.events';
import UI from 'utils/ui';

export default class PlayDisplayIcon {
    constructor(_model, api, element) {
        Object.assign(this, Events);

        const localization = _model.get('localization');
        const iconDisplay = element.getElementsByClassName('jw-icon-display')[0];
        element.style.cursor = 'pointer';
        this.icon = iconDisplay;
        this.el = element;

        new UI(this.el).on('click tap enter', (evt) => {
            this.trigger(evt.type);
        });

        _model.on('change:state', (model, newstate) => {
            let newstateLabel;
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

    element() {
        return this.el;
    }
}
