const API = (() => {

function getState() {
  return UniverseEngine.getState();
}

function click(dmg) {
  UniverseEngine.click(dmg);
}

function tick() {
  UniverseEngine.tick();
  BalanceAI.adjust(UniverseEngine.getState());
}

return { getState, click, tick };

})();