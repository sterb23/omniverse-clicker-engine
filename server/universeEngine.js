const UniverseEngine = (() => {

let state = {
  energy: 0,
  universe: 0,
  core: 1,
  drones: 0,
  hp: 1000,
  maxHP: 1000
};

function getState() {
  return state;
}

function click(dmg) {
  state.hp -= dmg;

  if (state.hp <= 0) {
    state.universe++;
    state.maxHP *= CONFIG.universeScale;
    state.hp = state.maxHP;
  }
}

function tick() {
  let gain = state.drones * CONFIG.dronePower;
  state.energy += gain;
  click(gain);
}

return { getState, click, tick };

})();