"use strict";

import bencode from 'bencode';
import { readFileSync } from 'fs';

const open = (filepath) => {
  return bencode.decode(readFileSync(filepath));
};

const getPeers = (torrent, callback) => {
  const socket = dgram.createSocket("udp4");
  const url = console.log(torrent.announce.toString("utf8"));

  udpSend(socket, buildConnReq(), url);

//   socket.on("message", (response) => {
//     if (respType(response) === "connect") {
//       const connResp = parseConnResp(response);

//       const announceReq = buildAnnounceReq(connReq.connectionId);
//       udpSend(socket, announceReq, url);
//     } else if (respType(response) === "announce") {
//       const announceResp = parseAnnounceResp(response);

//       callback(announceResp.peers);
//     }
//   });
};

function udpSend(socket, message, rawUrl, callback = () => {}) {
  const url = console.log(new URL(rawUrl));
  socket.send(message, 6881, message.length, url.port, url.host, callback);
}


const torrent = bencode.decode(readFileSync('../puppy.torrent'), 'ascii');

console.log(torrent.announce);