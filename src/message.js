"use strict";

import { Buffer } from "node:buffer";
import { infoHash } from "./torrent-parser.js";
import genId from "./util.js";

const buildHandshake = (torrent) => {
  const buf = Buffer.alloc(68);
  //pstrlen
  buf.writeUInt8(19, 0);
  // pstr
  buf.write("BitTorrent protocol", 1);
  // reserved
  buf.writeUInt32BE(0, 24);
  buf.writeUInt32BE(0, 24);
  // info hash
  infoHash(torrent).copy(buf, 28);
  // peer id
  buf.write(genId());

  return buf;
};

const buildKeepAlive = () => Buffer.alloc(4);

const buildChoke = () => {
  const buf = Buffer.alloc(5);
  // length
  buf.writeUInt32BE(1, 0);
  // id
  buf.writeUInt8(4, 0);

  return buf;
};

const buildUnchoke = () => {
  const buf = Buffer.alloc(5);
  // lenght
  buf.writeUInt32BE(1, 0);
  //id
  buf.writeUInt8(1, 4);

  return buf;
};

const buildInterested = () => {
  const buf = Buffer.alloc(5);
  // lenght
  buf.writeUInt32BE(1, 0);
  //id
  buf.writeUInt8(2, 4);

  return buf;
};

const buildUnInterested = () => {
  const buf = Buffer.alloc(5);
  // lenght
  buf.writeUInt32BE(1, 0);
  //id
  buf.writeUInt8(3, 4);

  return buf;
};

const buildHave = (payload) => {
  const buf = Buffer.alloc(9);
  // lenght
  buf.writeUInt32BE(5, 0);
  //id
  buf.writeUInt8(4, 4);
  // piece index
  buf.writeUInt32BE(payload, 5);
  return buf;
};

const buildBitfield = (bitfield) => {
  const buf = Buffer.alloc(14);

  buf.writeUInt32BE(bitfield.length + 1, 0);

  buf.writeUint8(5, 4);

  bitfield.copy(buf, 5);
  return buf;
};

const buildRequest = (payload) => {
  const buf = Buffer.alloc(17);
  buf.writeUInt32BE(13, 0);
  buf.writeUInt8(6, 4);
  buf.writeUInt32BE(payload.index, 5);
  buf.writeUInt32BE(payload.begin, 9);
  buf.writeUInt32BE(payload.length, 13);
  return buf;
};

const buildPiece = (payload) => {
  const buf = Buffer.alloc(payload.block.length + 13);

  buf.writeUInt32BE(payload.block.length + 9, 0);
  buf.writeUInt8(7, 4);
  buf.writeUInt32BE(payload.index, 5);
  buf.writeUInt32BE(payload.begin, 9);
  payload.block.copy(buf, 13);
  return buf;
};

const buildCancel = (payload) => {
  const buf = Buffer.alloc(17);

  buf.writeInt32BE(13, 0);
  buf.writeUInt8(8, 4);
  buf.writeUInt32BE(payload.index, 5);
  buf.writeUInt32BE(payload.begin, 9);
  buf.writeUInt32BE(payload.length, 13);
  return buf;
};

const buildPort = (payload) => {
  const buf = Buffer.alloc(7);

  buf.writeUInt32BE(3, 0);
  buf.writeUInt8(9, 4);
  buf.writeUInt16BE(payload, 5);
  return buf;
};

const parse = msg => {
  const id = msg.length > 4 ? msg.readUInt8(4) : null;
  let payload = msg.length > 5 ? msg.slice(5) : null;

  if (id === 6 || id === 7 || id === 8){
    const rest = payload.slice(8);
    payload = {
      index: payload.readInt32BE(0),
      begin: payload.readInt32BE(4)
    };
    payload[id === 7 ? 'block' : 'length'] = rest;
  }

  return {
    size: msg.readInt32BE(0),
    id: id,
    payload: payload
  }
}

export {
  buildPort,
  buildCancel,
  buildPiece,
  buildRequest,
  buildBitfield,
  buildHave,
  buildUnInterested,
  buildInterested,
  buildUnchoke,
  buildChoke,
  buildKeepAlive,
  buildHandshake,
  parse,
};
