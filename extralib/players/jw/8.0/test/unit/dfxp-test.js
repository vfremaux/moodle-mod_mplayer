import dfxp from 'parsers/captions/dfxp';

describe('dfxp', function() {

    it('exceptions', function() {
        assert.equal(typeof dfxp, 'function', 'dfxp is a function');

        assert.throws(function() {
            dfxp(null);
        }, Error, 'Invalid DFXP file');

        var DFXP = '<?xml version="1.0" encoding="UTF-8"?><tt xmlns="http://www.w3.org/2006/10/ttaf1"><head></head><body><div><p begin="00:00:00.5" end="00:00:04">The Peach Open Movie Project presents</p><p begin="00:00:06.5" end="00:00:09">One big rabbit</p><p begin="00:00:11" end="00:00:13">Three rodents</p><p begin="00:00:16.5" end="00:00:19">And one giant payback</p><p begin="00:00:23" end="00:00:25">Get ready</p><p begin="00:00:27" end="00:00:30">Big Buck Bunny</p><p begin="00:00:30" end="00:00:31">Coming soon</p><p begin="00:00:31" end="00:00:33">www.bigbuckbunny.org<br/>Licensed as Creative Commons 3.0 attribution</p></div></body></tt>';

        // Do not run the test if inner HTML does not exist, as it will fail in phantomjs
        var p = parseXML(DFXP).getElementsByTagName('p');
        var innerXmlSupported = !!(p && p[0] && p[0].innerHTML);

        var captions = parseDFXP(DFXP);
        assert.equal(captions.length, 8, 'DXFP captions are parsed');
        assert.equal(captions[7].text.indexOf('www.bigbuckbunny.org'), 0, 'Text is parsed');
        assert.isOk(captions[7].text.indexOf('\r\n') > -1, 'Break elements are replaced by carriage returns and newlines');

        var DFXPns = '<?xml version="1.0" encoding="UTF-8"?><!-- v1.1 --><tt:tt xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ttp="http://www.w3.org/ns/ttml#parameter" xmlns:tts="http://www.w3.org/ns/ttml#styling" xmlns:tt="http://www.w3.org/ns/ttml" xmlns:ebuttm="urn:ebu:tt:metadata" ttp:timeBase="media" xml:lang="de" ttp:cellResolution="50 30"><tt:body><tt:div><tt:p xml:id="subtitle1" region="bottom" begin="00:00:00.000" end="00:00:02.120" style="textCenter"><tt:span style="textWhite">weiß auf schwarz, Abschnitt: eins</tt:span></tt:p></tt:div></tt:body></tt:tt>';
        captions = parseDFXP(DFXPns);
        assert.equal(captions.length, 1, 'Namespaced DXFP captions are parsed');
        assert.isOk(captions[0].text.indexOf('schwarz') > -1, 'Text is parsed');
        assert.isOk(captions[0].text.indexOf('Abschnitt') > -1, 'Namespace prefixes are not removed from text content');
        if (innerXmlSupported) {
            assert.isOk(captions[0].text.indexOf('<span') > -1, 'Namespace prefixes are removed from opening tags');
            assert.isOk(captions[0].text.indexOf('</span') > -1, 'Namespace prefixes are removed from closing tags');
        }
    });

    function parseDFXP(xmlString) {
        var xmlDoc = parseXML(xmlString);
        return dfxp(xmlDoc);
    }

    function parseXML(input) {
        if (window.DOMParser) {
            var parser = new window.DOMParser();
            return parser.parseFromString(input, 'text/xml');
        }
        var xmlDom = new window.ActiveXObject('Microsoft.XMLDOM');
        xmlDom.async = 'false';
        xmlDom.loadXML(input);
        return xmlDom;
    }
});
