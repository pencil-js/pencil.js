# Documentation

## Methods

### constrain
Constrain a number between two limits.

```js
constrain(99, 0, 10); // 10
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| value | ``Number`` | Required | Any number |
| min | ``Number`` | Required | Minimal limit for the value |
| max | ``Number`` | Required | Maximal limit for the value |


### equals
Determine if two number can considered equals accounting for JS precision.

```js
equals(0.2 + 0.1, 0.3); // true
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| number1 | ``Number`` | Required | Any number |
| number2 | ``Number`` | Required | Any number |

### random
Return a random number between limits.

```js
random(0.1, 0.2); // between 0.1 and 0.2 => 0.1724935816940606
random(0.1); // between 0 and 0.1 => 0.0038693216847277335
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| min | ``Number`` | 1 | Lower limit, or upper limit if max is omitted |
| max | ``Number`` |  | Upper limit, can be omitted |

### truncate
Truncate a floating number to its integer part.

```js
truncate(-99.9); // -99
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| value | ``Number`` | Required | Any number |


## Properties

### radianCircle
Value of a full rotation on a radian circle (2 * PI).

### degreeCircle
Value of a full rotation on a egree circle (360).