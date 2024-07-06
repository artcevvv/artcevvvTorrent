"use strict";

import url from "node:url";
import crypto from "crypto";
import { Buffer } from "buffer";
import dgram from "dgram";

const getPeers = (torrent, callback) => {
  const socket = dgram.createSocket("udp4");
  const url = torrent.announce;

  udpSend(socket, buildConnReq(), url);

  socket.on("message", (response) => {
    if (respType(response) === "connect") {
      const connResp = parseConnResp(response);
      const announceReq = buildAnnounceReq(connReq.connectionId);
      console.log(announceReq);
      udpSend(socket, announceReq, url);
    } else if (respType(response) === "announce") {
      const announceResp = parseAnnounceResp(response);

      callback(announceResp.peers);
    }
  });
};

function udpSend(socket, message, rawUrl, callback = () => {}) {
  const myUrl = url.parse(rawUrl);
  console.log(myUrl);
  socket.send(message, 6969, message.length, myUrl.port, myUrl.host, callback);
}

function respType(resp) {
  const action = resp.readUInt16BE(0);
  switch (action) {
    case 0:
      return "connect";
    case 1:
      return "announce";
  }
}

function buildConnReq() {
  const buf = Buffer.alloc(16);

  buf.writeUint32BE(0x417, 0);
  buf.writeUInt32BE(0x27101980, 4);

  buf.writeUInt32BE(0, 8);

  crypto.randomBytes(4).copy(buf, 12);

  return buf;
}

function buildAnnounceReq(connId, torrent, port = 6881) {
  const buf = Buffer.allocUnsafe(98);

  connId.copy(buf, 0);

  buf.writeUInt32BE(1, 8);

  torrentParser.infoHash(torrent).copy(buf, 16);

  genId().copy(buf, 36);

  Buffer.alloc(8).copy(buf, 72);

  buf.writeUInt32BE(0, 80);

  buf.writeUInt32BE(0, 80);

  crypto.randomBytes(4).copy(buf, 88);

  buf.writeInt32BE(-1, 92);

  buf.writeUInt16BE(port, 96);

  return buf;
}
