import * as streamTypeUtil from 'providers/utils/stream-type';

describe('stream-type', function() {

    it('stream-type.streamType', function() {
        const minDvrWindow = 120;
        let type = streamTypeUtil.streamType(0, minDvrWindow);
        assert.equal(type, 'VOD', 'streamType with 0 and 120');

        type = streamTypeUtil.streamType(0, 0);
        assert.equal(type, 'VOD', 'streamType with 0 and 0');

        type = streamTypeUtil.streamType(10, minDvrWindow);
        assert.equal(type, 'VOD', 'streamType with 10 and 120');

        type = streamTypeUtil.streamType(10, undefined);
        assert.equal(type, 'VOD', 'streamType with 10 and undefined');

        type = streamTypeUtil.streamType(-120, minDvrWindow);
        assert.equal(type, 'DVR', 'streamType with -120 and 120');

        type = streamTypeUtil.streamType(-120, -10);
        assert.equal(type, 'DVR', 'streamType with 120 and -10');

        type = streamTypeUtil.streamType(-120, 0);
        assert.equal(type, 'DVR', 'streamType with 120 and 0');

        type = streamTypeUtil.streamType(-120, 0);
        assert.equal(type, 'DVR', 'streamType with -120 and 0');

        type = streamTypeUtil.streamType(-120, undefined);
        assert.equal(type, 'DVR', 'streamType with 120 and undefined');

        type = streamTypeUtil.streamType(-20, minDvrWindow);
        assert.equal(type, 'LIVE', 'streamType with -20 and 120');

        type = streamTypeUtil.streamType(-1, minDvrWindow);
        assert.equal(type, 'LIVE', 'streamType with -1 and 120');

        type = streamTypeUtil.streamType(Infinity, minDvrWindow);
        assert.equal(type, 'LIVE', 'streamType with Infinity');

        type = streamTypeUtil.streamType(-20, undefined);
        assert.equal(type, 'LIVE', 'streamType with -20 and undefined');
    });
});
