import mixed from 'data/mixed';
import aac from 'data/aac';
import flv from 'data/flv';
import mp4 from 'data/mp4';

export default {
    flv_mp4: [flv.tagged, mp4.tagged, flv.tagged, mp4.tagged],
    mp4_flv: [mp4.tagged, flv.tagged, mp4.tagged, flv.tagged],
    aac_mp4: [aac.tagged, mp4.tagged, aac.tagged, mp4.tagged],
    mp4_aac: [mp4.tagged, aac.tagged, mp4.tagged, aac.tagged],
    invalid: [undefined, false, undefined],
    empty: [],
    mixed: [mp4.tagged, undefined, mp4.tagged],
    webm_mp4: [ mixed.webm_mp4, mixed.mp4_webm],
    mp4_webm: [ mixed.mp4_webm, mixed.webm_mp4]
};
