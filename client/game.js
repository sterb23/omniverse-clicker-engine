const Game = (() => {

let state = API.getState();

function sync() {
  state = API.getState();
  UI.render(state);
}

function click() {
  let dmg = state.core * CONFIG.clickPower;
  API.click(dmg);
  sync();
}

function upgrade(type) {
  if (type === "core") state.core++;
  if (type === "drone") state.drones++;
  sync();
}

setInterval(() => {
  API.tick();
  sync();
}, 1000);

return {
  click,
  upgrade
};

})();