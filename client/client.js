function joinRoom(id) {
  socket.send(JSON.stringify({
    type: "joinRoom",
    room: id
  }));
}