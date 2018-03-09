# Documentation

## Methods

### constain
Constrain a number between two limits.

```js
constain(99, 0, 10); // 10
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| value | ``Number`` | Required | Any number |
| min | ``Number`` | Required | Minimal limit for the value |
| max | ``Number`` | Required | Maximal limit for the value |


### equal
Determine if two number can considered equals accounting for JS precision.

```js
equal(0.2+0.1, 0.3); // true
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| number1 | ``Number`` | Required | Any number |
| number2 | ``Number`` | Required | Any number |

### truncate
Truncate a floating number to its integer part.

```js
truncate(-99.9); // -99
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| value | ``Number`` | Required | Any number |
