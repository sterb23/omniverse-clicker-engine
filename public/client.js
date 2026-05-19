const socket = new WebSocket("ws://localhost:3000");

let state = {};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "state") {
    state = data.state;
    UI.render(state);
  }
};

function click() {
  socket.send(JSON.stringify({
    type: "click",
    power: 1
  }));
}