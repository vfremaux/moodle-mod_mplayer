export default (className = '', orientation = '') => {
    return (
        `<div class="${className} ${orientation} jw-reset" aria-hidden="true">` +
            `<div class="jw-slider-container jw-reset">` +
                `<div class="jw-rail jw-reset"></div>` +
                `<div class="jw-buffer jw-reset"></div>` +
                `<div class="jw-progress jw-reset"></div>` +
                `<div class="jw-knob jw-reset"></div>` +
            `</div>` +
        `</div>`
    );
};
