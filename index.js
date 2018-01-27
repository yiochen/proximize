const symbol = Symbol('getValue');
const defaultReporter = function(key, action, target) {
  console.warn(`Trying to ${action} ${key}, but the target is ${value}`);
};

function proximize(target, reporter) {
  const proxyReporter = new Proxy(() => {}, {
    apply(applyTarget, thisArg, argumentsList) {
      if (typeof reporter === 'function') {
        reporter(...argumentsList);
      }
    },
  });

  const targetObj = function() {}; // in order for proxy-apply to work, the target has to be a function.
  targetObj.value = target;
  return new Proxy(targetObj, {
    get(getTarget, key) {
      if (key === symbol) {
        return getTarget.value;
      }
      if (getTarget.value != null) {
        return proximize(getTarget.value[key], reporter);
      } else {
        proxyReporter(key, 'get', getTarget.value);
        return proximize(undefined, reporter);
      }
    },
    set(setTarget, key, value) {
      if (setTarget.value != null) {
        setTarget.value[key] = value;
      } else {
        proxyReporter(key, 'set', setTarget.value);
      }
    },
    apply(applyTarget, thisArg, argumentsList) {
      if (typeof applyTarget.value === 'function') {
        const actualFunction = applyTarget.value;
        return actualFunction.call(thisArg, ...argumentsList);
      } else {
        proxyReporter('', 'call', applyTarget.value);
      }
    },
  });
}

function unproximize(proxy) {
  if (proxy) {
    return proxy[symbol];
  }
}

module.exports.defaultReporter = defaultReporter;
module.exports.proximize = proximize;
module.exports.unproximize = unproximize;
