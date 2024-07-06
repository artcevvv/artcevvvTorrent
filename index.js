'use strict';

import { readFileSync } from 'fs';
import bencode from 'bencode';
import getPeers from './src/tracker.js';
import { open } from './src/torrent-parser.js';
import download from './src/download.js';
import net from 'net';
import Buffer from 'buffer';

const torrent = open('puppy.torrent');

download(torrent);