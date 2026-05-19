const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

/* =========================
   ROOMS SYSTEM
========================= */

const rooms = {};

/* create default room */
function createRoom(id) {
  rooms[id] = {
    state: {
      energy: 0,
      universe: 0,
      hp: 1000,
      maxHP: 1000
    },
    players: new Set()
  };
}

createRoom("lobby");

/* =========================
   GET ROOM
========================= */

function getRoom(id) {
  if (!rooms[id]) createRoom(id);
  return rooms[id];
}

/* =========================
   BROADCAST ROOM
========================= */

function broadcast(roomId) {
  const room = rooms[roomId];

  const msg = JSON.stringify({
    type: "state",
    room: roomId,
    state: room.state,
    players: room.players.size
  });

  wss.clients.forEach(client => {
    if (client.roomId === roomId && client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

/* =========================
   DAMAGE SYSTEM
========================= */

function damage(room, dmg) {
  const state = room.state;

  state.hp -= dmg;

  if (state.hp <= 0) {
    state.universe++;
    state.maxHP *= 2.2;
    state.hp = state.maxHP;
  }
}

/* =========================
   CONNECTION HANDLING
========================= */

wss.on("connection", (ws) => {

  ws.roomId = "lobby";
  const room = getRoom(ws.roomId);

  room.players.add(ws);

  ws.send(JSON.stringify({
    type: "state",
    room: ws.roomId,
    state: room.state,
    players: room.players.size
  }));

  broadcast(ws.roomId);

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    /* =====================
       SWITCH ROOM
    ===================== */
    if (data.type === "joinRoom") {

      room.players.delete(ws);

      ws.roomId = data.room;
      const newRoom = getRoom(ws.roomId);
      newRoom.players.add(ws);

      ws.send(JSON.stringify({
        type: "state",
        room: ws.roomId,
        state: newRoom.state,
        players: newRoom.players.size
      }));

      broadcast(ws.roomId);
      return;
    }

    /* =====================
       CLICK EVENT
    ===================== */
    if (data.type === "click") {
      const room = getRoom(ws.roomId);

      room.state.energy += data.power;
      damage(room, data.power);

      broadcast(ws.roomId);
    }
  });

  ws.on("close", () => {
    const room = getRoom(ws.roomId);
    room.players.delete(ws);
  });
});

/* =========================
   GLOBAL TICK
========================= */

setInterval(() => {
  for (const id in rooms) {
    rooms[id].state.energy += 1;
    broadcast(id);
  }
}, 1000);

/* =========================
   START
========================= */

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});