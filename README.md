> datetimepicker component for Vue.js

# Requirements

- [Vue.js](https://github.com/vuejs/vue) `^2.x`

# Installation

## npm
``` bash
$ npm install vuejs-datetimepicker
```

# Usage
``` html
<template>
    <datetime format="MM/DD/YYYY" width="300px" v-model="val"></datetime>
</template>

<script>
import datetime from 'vuejs-datetimepicker';

export default {
    components: { datetime }
};
</script>
```
## List of accepted formats
### DateTime formats
#### 12h (AM/PM)
`YYYY-MM-DD h:i:s`, `DD-MM-YYYY h:i:s`, `MM-DD-YYYY h:i:s`,
`YYYY/MM/DD h:i:s`, `DD/MM/YYYY h:i:s` and `MM/DD/YYYY h:i:s`

#### 24h
`YYYY-MM-DD H:i:s`, `DD-MM-YYYY H:i:s`, `MM-DD-YYYY H:i:s`,
`YYYY/MM/DD H:i:s`, `DD/MM/YYYY H:i:s` and `MM/DD/YYYY H:i:s`

### Date only formats
`YYYY-MM-DD`, `DD-MM-YYYY`, `MM-DD-YYYY`,
`YYYY/MM/DD`, `DD/MM/YYYY` and `MM/DD/YYYY`

### Time only format
`h:i:s` (12h) and `H:i:s` (24h)

## Accepting value of date
### The value of picked date can be accepted in 2 ways.
The first is in the case where you want to submit the form to a backend script without interruption from any javascript event,  set the name attribute of the component to the value you want to accept, just like it is set for normal HTML inputs, e.g using dob as the name in the following example
``` html
<template>
    <datetime format="MM/DD/YYYY" width="300px" name='dob'></datetime>
</template>
```
The second case is if the value of the picker is needed in the current component or scope, the value would automatically and reactively be binded to value assigned to `v-model` e.g `dob` in the following example, you may then make a reference to the value as `this.dob` at any point within the current scope.
Also initializing the value of `dob` in the current scope initializes the value of the datetimepicker given that it is a valid date.
``` html
<template>
  <div>
    <datetime format="YYYY-MM-DD" v-model='dob' ></datetime>
    <button @click='alertVal'>Alert current date value</button>
  </div>
</template>

<script>
import datetime from 'vuejs-datetimepicker'

export default {
  components: { datetime },
  methods: {
    alertVal () {
      alert(this.dob)
    }
  }
}
</script>
```
# License

[The MIT License](http://opensource.org/licenses/MIT)
