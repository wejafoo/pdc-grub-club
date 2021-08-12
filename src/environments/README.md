
```
angular-server-side-configuration TYPES:
* stringValue:              process.env.STRING_VALUE,
* stringValueWithDefault:   process.env.STRING_VALUE || 'defaultValue',
* numberValue:              Number(process.env.NUMBER_VALUE),
* numberValueWithDefault:   Number(process.env.NUMBER_VALUE || 10),
* booleanValue:             Boolean(process.env.BOOLEAN_VALUE),
* booleanValueInverted:     process.env.BOOLEAN_VALUE_INVERTED !== 'false'
```

