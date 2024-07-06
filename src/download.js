"use strict";

import net from "net";
import Buffer from "buffer";
import getPeers from "./tracker.js";

export default (torrent) => {
    getPeers(torrent, peers => {
        peers.forEach(download);
    })
};

function download(peers) {
  const socket = new net.Socket();

  socket.on("error", console.log());
  socket.connect(peers.port, peers.ip, () => {
    socket.write(Buffer.from("hello"));
  });

  socket.on("data", (data) => {});
}
