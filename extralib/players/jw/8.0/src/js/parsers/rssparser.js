import { localName, textContent, getChildNode, numChildren } from 'parsers/parsers';
import { xmlAttribute } from 'utils/strings';
import mediaParser from 'parsers/mediaparser';
import parseEntry from 'parsers/jwparser';
import PlaylistItem from 'playlist/item';

/**
* Parse an RSS feed and translate it to playlistItems.
*/

export default function parseRss(dat) {
    const arr = [];
    arr.feedData = {};
    for (let i = 0; i < numChildren(dat); i++) {
        const node = getChildNode(dat, i);
        const name = localName(node).toLowerCase();

        if (name === 'channel') {
            for (let j = 0; j < numChildren(node); j++) {
                const subNode = getChildNode(node, j);
                const nodeName = localName(subNode).toLowerCase();
                if (nodeName === 'item') {
                    arr.push(parseItem(subNode));
                } else if (nodeName) {
                    arr.feedData[nodeName] = textContent(subNode);
                }
            }
        }
    }
    return arr;
}

// Translate RSS item to playlist item.
function parseItem(obj) {
    const item = {};
    for (let i = 0; i < obj.childNodes.length; i++) {
        const node = obj.childNodes[i];
        const name = localName(node);
        if (!name) {
            continue;
        }
        switch (name.toLowerCase()) {
            case 'enclosure':
                item.file = xmlAttribute(node, 'url');
                break;
            case 'title':
                item.title = textContent(node);
                break;
            case 'guid':
                item.mediaid = textContent(node);
                break;
            case 'pubdate':
                item.date = textContent(node);
                break;
            case 'description':
                item.description = textContent(node);
                break;
            case 'link':
                item.link = textContent(node);
                break;
            case 'category':
                if (item.tags) {
                    item.tags += textContent(node);
                } else {
                    item.tags = textContent(node);
                }
                break;
            default:
                break;
        }
    }
    return new PlaylistItem(parseEntry(obj, mediaParser(obj, item)));
}
