"use strict";

import dgram from "dgram";
import bencode from "bencode";
import { readFileSync } from "fs";
import crypto from 'crypto';

function buildConnReq() {
  const buf = Buffer.alloc(16);

  buf.writeUInt32BE(0x417, 0);
  buf.writeUInt32BE(0x27101980, 4);

  buf.writeUInt32BE(0, 8);

  crypto.randomBytes(4).copy(buf, 12);

  return buf;
}


console.log(buildConnReq()); 

const rawUrl = bencode.decode(
  readFileSync("../puppy.torrent"),
  "ascii"
).announce.toString();

const myUrl = new URL(rawUrl);
const socket = dgram.createSocket("udp4");
socket.send(buildConnReq(), myUrl.port, myUrl.host, () => {});
