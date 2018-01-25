const { proximize, unproximize } = require('../index');

describe('should work', function() {
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

  fit('should get undefined when getting attribute of null', function() {
    const obj = { a: null };
    const p = proximize(obj);
    const result = unproximize(p.a.b);
    expect(result).toBe(undefined);
  });
});
