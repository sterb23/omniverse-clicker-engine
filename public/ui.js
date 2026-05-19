const UI = (() => {

function render(state) {
  document.getElementById("energy").innerText =
    Math.floor(state.energy);

  document.getElementById("universe").innerText =
    state.universe;
}

return { render };

})();