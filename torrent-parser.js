'use strict';

import fs, { readFileSync } from 'fs';
import bencode from 'bencode';
import crypto from 'crypto';
import { toBuffer } from 'bignum';


const open = (filepath) => {
    return bencode.decode(readFileSync(filepath));
};

const size = torrent => {

};

const infoHash = torrent => {
    const info = bencode.endcode(torrent.info);
    return crypto.createHash('sha1').update(info).digest();
};

export {open, size, infoHash};
