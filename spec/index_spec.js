const { proximize, unproximize } = require('../index');

describe('get', function() {
  it('should import correctly', function() {
    expect(typeof proximize).toBe('function');
    expect(typeof unproximize).toBe('function');
  });

  it('should be able to get value in nested object', function() {
    const obj = { a: { b: { c: 15 } } };
    const p = proximize(obj);
    const result = unproximize(p.a.b.c);
    expect(result).toBe(15);
  });

  it('should get undefined', function() {
    const obj = {};
    const p = proximize(obj);
    const result = unproximize(p.a.b);
    expect(result).toBe(undefined);
  });

  it('should get array element', function() {
    const obj = { a: [12, { b: 2 }] };
    const p = proximize(obj);
    const result = unproximize(p.a[1].b);
    expect(result).toBe(2);
  });

  it('should get undefined array element', function() {
    const obj = {};
    const p = proximize(obj);
    const result = unproximize(p.a[1]);
    expect(result).toBe(undefined);
  });

  it('should get null', function() {
    const obj = { a: null };
    const p = proximize(obj);
    const result = unproximize(p.a);
    expect(result).toBe(null);
  });

  it('should get undefined when getting attribute of null', function() {
    const obj = { a: null };
    const p = proximize(obj);
    const result = unproximize(p.a.b);
    expect(result).toBe(undefined);
  });

  it('should not proximize inside getter', function() {
    const obj = {
      a: 12,
      get hello() {
        expect(this.a).toBe(12);
        return this.a;
      },
    };
    const p = proximize(obj);
    const result = unproximize(p.hello);
    expect(result).toBe(12);
  });
});

describe('set', function() {
  it('should set', function() {
    const obj = {
      a: 12,
    };
    const p = proximize(obj);
    p.a = 15;
    expect(obj.a).toBe(15);
  });
  it('should work when use together with get', function() {
    const obj = {
      a: {
        b: 12,
      },
    };
    const p = proximize(obj);
    p.a.b = 15;
    expect(obj.a.b).toBe(15);
  });
  it('should not throw when assigning to undefined', function() {
    const obj = undefined;
    function assigning() {
      const p = proximize(obj);
      p.a = 15;
    }
    expect(assigning).not.toThrow();
  });
  it('should not proximize inside setter', function() {
    const obj = {
      _b: 0,
      set b(value) {
        expect(this._b).toBe(0);
        this._b = value;
      },
    };
    const p = proximize(obj);
    p.b = 12;
    expect(obj._b).toBe(12);
  });
});

describe('apply', function() {
  it('should proxy function', function() {
    let counter = 1;
    function add(value) {
      counter += value;
    }
    const p = proximize(add);
    p(10);
    expect(counter).toBe(11);
  });
  it('should proxy function in a object', function() {
    const obj = {
      a: 1,
      add(value) {
        return value + this.a;
      },
    };
    expect(obj.add(10)).toBe(11);
    const p = proximize(obj);
    expect(obj.add(20)).toBe(21);
  });
});

describe('reporter', function() {
  it('should report when undefined is access', function() {
    let counter = 0;
    const reporter = function(key, action, target) {
      expect(key).toBe('x');
      expect(action).toBe('get');
      expect(target).toBeUndefined();
      counter++;
    };
    const p = proximize(undefined, reporter);
    const result = p.x;
    expect(counter).toBeGreaterThan(0);
  });
});
