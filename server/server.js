const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

/* =========================
   GAME STATE (GLOBAL WORLD)
========================= */

let state = {
  energy: 0,
  universe: 0,
  hp: 1000,
  maxHP: 1000
};

/* =========================
   BROADCAST TO ALL PLAYERS
========================= */

function broadcast() {
  const data = JSON.stringify({
    type: "state",
    state
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

/* =========================
   GAME LOGIC
========================= */

function damage(dmg) {
  state.hp -= dmg;

  if (state.hp <= 0) {
    state.universe++;
    state.maxHP *= 2.2;
    state.hp = state.maxHP;
  }
}

/* =========================
   CONNECTIONS
========================= */

wss.on("connection", (ws) => {

  // send initial state
  ws.send(JSON.stringify({ type: "state", state }));

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "click") {
      state.energy += data.power;
      damage(data.power);

      broadcast();
    }
  });
});

/* =========================
   SERVER TICK (AUTO SYSTEM)
========================= */

setInterval(() => {
  state.energy += 1; // passive gain
  broadcast();
}, 1000);

/* =========================
   START SERVER
========================= */

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});