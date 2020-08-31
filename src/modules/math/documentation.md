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


### modulo
Return modulo with the same sign as the divisor (Floored division)

```js
modulo(7, 3); // 1
modulo(-7, 3); // 2
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| value | ``Number`` | Required | Dividend |
| divisor | ``Number`` | Required | Divisor |


### distribute
Returns an array of evenly distributed value across a range

```js
distribute(10); // Array of 10 "random" distributed across 0 and 1
distribute(100, 1, 10); // Array of 100 "random" distributed across 1 and 10
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| nbValue | ``Number`` | Required | Number of value to generate |
| min | ``Number`` | ``0`` | Minimum value of the set |
| max | ``Number`` | ``1`` | Maximum value of the set |


### sum
Add up all values passed as argument

```js
sum(1, 2, 3); // 6
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| values | ``...Number`` | Required | Set of number |


### average
Return the average of all values (Arithmetic mean)

```js
sum(1, 2, 3); // 2
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| values | ``...Number`` | Required | Set of number |


### map
Return the equivalent of a value from a scale to another

```js
map(8, 0, 10); // 0.8
map(7, 0, 10, 0, 100); // 70
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| values | ``Number`` | Required | Any number |
| fromMin | ``Number`` | Required | Start of the origin scale |
| fromMax | ``Number`` | Required | End of the origin scale |
| toMin | ``Number`` | ``0`` | Start of the target scale |
| toMax | ``Number`` | ``1`` | End of the target scale |


### lerp
Linear extrapolation computation, useful when doing animation

```js
lerp(5, 7, 0.2); // 5.4
map(10, 20, 0.5); // 15
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| from | ``...Number`` | Required | Starting value |
| to | ``...Number`` | Required | Target value |
| ratio | ``...Number`` | Required | Extrapolation ratio, 0 is the starting value and 1 the target value |


## Properties

### radianCircle
Value of a full rotation on a radian circle (2 * PI).

### degreeCircle
Value of a full rotation on a degree circle (360).

### phi
Golden ratio number (about 1.62)
