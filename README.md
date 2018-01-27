# proximize

A experimental utility for accessing deeply nested JavaScript object

For a object like this

```
obj = {
  response: {
      col: [
        { header: 'first', content: 'hello world' }
        ...
      ]
  }
  ...
}
```

I want to be able to get a nested value without worrying about null pointer exceptions.

Usually people do

```
if (obj && obj.response && obj.response.col && obj.response.col[0]) {
    console.log(obj.response.col[0].header);
}
```

There are some tools like `lodash/get`, which let you do

```
get(obj, 'response.col[0].header');
```

But having all the keys in a string doesn't provide syntax highlighting.

So I want a API like this

```
const proxy = proximize(obj); // convert the object to a proxy
const resultProxy = proxy.response.col[0].extraData.something[1].note; // get as deep as you like
const result = unproximze(resultProxy); // if the path actually exist, it will return the value, otherwise, undefined
```

This project is for that
