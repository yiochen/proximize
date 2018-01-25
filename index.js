const symbol = Symbol('getValue');
function proximize(target) {
  return new Proxy(
    { value: target },
    {
      get(getTarget, key, receiver) {
        if (key === symbol) {
          return getTarget.value;
        }
        if (getTarget.value != null) {
          return proximize(getTarget.value[key]);
        } else {
          return proximize(undefined);
        }
      },
    }
  );
}

function unproximize(proxy) {
  if (proxy) {
    return proxy[symbol];
  }
}

module.exports.proximize = proximize;
module.exports.unproximize = unproximize;
