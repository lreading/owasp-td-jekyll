---
title: Environment Setup
path: /development/env-setup
group: Environment
layout: page
nav_order: 0
---
# Env Setup
blah blah blah

## Test Table

I've updated the styles so that tables will always inherit from Bootstrap's `.table-striped`, as the spacing is better and it's easier to read.  This is a test table.

|Name|Default|Description|
|---|---|---|
|LOG_LEVEL|`info`|The level at which to log.  Debug is most verbose, error is least verbose but you may miss important context|
|APP_PORT|`3000`|What port the server should listen on|
|SOMETHING||Something that does a thing|

## Code Blocks

Code blocks need to be readable.  While I'm not interested in adding a dependency for code highlighting, the code blocks should at least be distinguishable from regular text.

```javascript
const foo = 'bar';

const getFoo = () => {
  return foo; // Why would you even do this?
};

console.warn('heyyo');
```

---


```python
# The main code
def main():
    print("Hello, world!")

if __name__ == "__main__":
    main()

```
