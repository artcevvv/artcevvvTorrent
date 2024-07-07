"use strict";

import net from "node:net";
import { Buffer } from "node:buffer";
import getPeers from "./tracker.js";
import { buildHandshake, buildInterested, buildRequest, parse } from "./message.js";

export default (torrent) => {
  const requested = [];
  getPeers(torrent, (peers) => {
    peers.forEach((peer) => download(peer, torrent, requested));
  });
};

function onWholeMsg(socket, callback) {
  let savedBuf = Buffer.alloc(0);
  let handshake = true;

  socket.on("data", (recvBuf) => {
    const msgLen = () =>
      handshake ? savedBuf.readUInt8(0) + 49 : savedBuf.readUInt32BE(0) + 4;
    savedBuf = Buffer.concat([savedBuf, recvBuf]);

    while (savedBuf.length >= 4 && savedBuf.length >= msgLen()) {
      callback(savedBuf.slice(0, msgLen()));
      savedBuf = savedBuf.slice(msgLen());
      handshake = false;
    }
  });
}

function download(peer, torrent, requested) {
  const socket = new net.Socket();

  socket.on("error", console.log);
  socket.connect(peer.port, peer.ip, () => {
    socket.write(buildHandshake(torrent));
  });

  onWholeMsg(socket, (msg) => {
    msgHandler(msg, socket, requested);
  });
}

function msgHandler(msg, socket) {
  if (isHandshake(msg)) {
    socket.write(buildInterested());
  } else {
    const m = parse(msg);

    switch (m.id) {
      case 0:
        chokeHandler();
        break;
      case 1:
        unchokeHandler();
        break;
      case 4:
        haveHandler(m.payload, socket, requested);
        break;
      case 5:
        bitfieldHandler(m.payload);
        break;
      case 7:
        pieceHandler(m.payload);
        break;
    }
  }
}

function chokeHandler() {}
function unchokeHandler() {}
function haveHandler(payload, socket, requested) {
  const pieceIndex = payload.readUInt32BE(0);
  if(!requested[pieceIndex]){
    socket.write(buildRequest());
  }
  requested[pieceIndex] = true;
}
function bitfieldHandler(payload) {}
function pieceHandler(payload) {}

function isHandshake(msg) {
  return (
    msg.length === msg.readUInt8(0) + 49 &&
    msg.toString("ascii", 1) === "BitTorrent protocol"
  );
}
