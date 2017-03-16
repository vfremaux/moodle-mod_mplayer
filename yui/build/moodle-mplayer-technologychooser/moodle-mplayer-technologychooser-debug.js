YUI.add('moodle-mplayer-technologychooser', function (Y, NAME) {

var TECHNOLOGYCHOOSER = function() {
    TECHNOLOGYCHOOSER.superclass.constructor.apply(this, arguments);
};

Y.extend(TECHNOLOGYCHOOSER, Y.Base, {
    initializer : function(params) {
        if (params && params.formid) {
            var updatebut = Y.one('#' + params.formid + ' #id_updatetechnology');
            var technologyselect = Y.one('#'+params.formid+' #id_technology');
            var ancestor = updatebut.ancestor('fieldset');
            var action = Y.one('form.mform').get('action');
            if (updatebut && technologyselect) {
                updatebut.setStyle('display', 'none');
                technologyselect.on('change', function() {
                    Y.one('form.mform').set('action', action + '#' + ancestor.get('id'));
                    updatebut.simulate('click');
                });
            }
        }
    }
});

M.course = M.course || {};
M.course.init_technologychooser = function(params) {
    return new TECHNOLOGYCHOOSER(params);
};


}, '@VERSION@', {"requires": ["base", "node", "node-event-simulate"]});
