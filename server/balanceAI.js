const BalanceAI = (() => {

function adjust(state) {
  let pressure = state.energy / (state.maxHP + 1);

  if (pressure > 1.2) {
    state.maxHP *= 1.1;
  }

  if (pressure < 0.5) {
    state.energy += 20;
  }
}

return { adjust };

})();