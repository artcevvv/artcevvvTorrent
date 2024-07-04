"use strict";

import fs, { readFileSync } from "fs";
import bencode from "bencode";
import crypto from "crypto";
import { bigintToBuffer } from "./sideFuncs.js";

const open = (filepath) => {
  return bencode.decode(readFileSync(filepath));
};

const size = (torrent) => {
  const size = torrent.info.files
    ? torrent.info.files.map((file) => file.length).reduce((a, b) => a + b)
    : torrent.info.length;
  bigintToBuffer(size, {size: 8});
};

const infoHash = (torrent) => {
  const info = bencode.endcode(torrent.info);
  return crypto.createHash("sha1").update(info).digest();
};

export { open, size, infoHash };
