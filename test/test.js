const assert = require('assert');
const jsl = require('../');

const JsonObject = {
  n: 1234567890,
  nn: 0,
  s: 'string',
  ss: '',
  b: true,
  bb: false,
  null: null,
  object: {
    ks: 'string',
    kss: '',
    kn: 1234567890,
    knn: 0,
    kb: true,
    kbb: false,
  },
  array: [{
    ks: 'string',
    kss: '',
    kn: 1234567890,
    knn: 0,
    kb: true,
    kbb: false,
  }],
};
const JsonSchema = {
  "name": "root",
  "type": "object",
  "properties": [
    {
      "name": "n",
      "type": "number",
      "example": 1234567890
    },
    {
      "name": "nn",
      "type": "number",
      "example": 0
    },
    {
      "name": "s",
      "type": "string",
      "example": "string"
    },
    {
      "name": "ss",
      "type": "string",
      "example": ""
    },
    {
      "name": "b",
      "type": "boolean",
      "example": true
    },
    {
      "name": "bb",
      "type": "boolean",
      "example": false
    },
    {
      "name": "null",
      "type": "null",
      "example": null
    },
    {
      "name": "object",
      "type": "object",
      "properties": [
        {
          "name": "ks",
          "type": "string",
          "example": "string"
        },
        {
          "name": "kss",
          "type": "string",
          "example": ""
        },
        {
          "name": "kn",
          "type": "number",
          "example": 1234567890
        },
        {
          "name": "knn",
          "type": "number",
          "example": 0
        },
        {
          "name": "kb",
          "type": "boolean",
          "example": true
        },
        {
          "name": "kbb",
          "type": "boolean",
          "example": false
        }
      ]
    },
    {
      "name": "array",
      "type": "array",
      "items": {
        "name": "array.item",
        "type": "object",
        "properties": [
          {
            "name": "ks",
            "type": "string",
            "example": "string"
          },
          {
            "name": "kss",
            "type": "string",
            "example": ""
          },
          {
            "name": "kn",
            "type": "number",
            "example": 1234567890
          },
          {
            "name": "knn",
            "type": "number",
            "example": 0
          },
          {
            "name": "kb",
            "type": "boolean",
            "example": true
          },
          {
            "name": "kbb",
            "type": "boolean",
            "example": false
          }
        ]
      }
    }
  ]
};

describe('buildJson', function() {
  it('should be string', function() {
    assert.equal(jsl.buildJson('string').type, 'string');
    assert.equal(jsl.buildJson('').type, 'string');

    assert.equal(jsl.json2schema('string').type, 'string');
    assert.equal(jsl.json2schema('').type, 'string');
  });
  it('should be number', function() {
    assert.equal(jsl.buildJson(1).type, 'number');
    assert.equal(jsl.buildJson(0).type, 'number');

    assert.equal(jsl.json2schema(1).type, 'number');
    assert.equal(jsl.json2schema(0).type, 'number');
  });
  it('should be boolean', function() {
    assert.equal(jsl.buildJson(true).type, 'boolean');
    assert.equal(jsl.buildJson(false).type, 'boolean');

    assert.equal(jsl.json2schema(true).type, 'boolean');
    assert.equal(jsl.json2schema(true).example, true);
    assert.equal(jsl.json2schema(false).type, 'boolean');
    assert.equal(jsl.json2schema(false).example, false);
  });
  it('should be ok', function() {
    assert.equal(JSON.stringify(jsl.buildJson(JsonObject)), JSON.stringify(JsonSchema));

    assert.equal(JSON.stringify(jsl.json2schema(JsonObject)), JSON.stringify(JsonSchema));
  });
});

describe('buildSchema', function() {
  it('should be ok', function() {
    assert.equal(JSON.stringify(jsl.buildSchema(JsonSchema)), JSON.stringify(JsonObject));

    assert.equal(JSON.stringify(jsl.schema2json(JsonSchema)), JSON.stringify(JsonObject));
  });
  it('should be random', function() {
    const _string = jsl.schema2json({
      "name": "root",
      "type": "string",
      "example": null,
    });
    const _number = jsl.schema2json({
      "name": "root",
      "type": "number",
      "example": "not number",
    });
    const _boolean = jsl.schema2json({
      "name": "root",
      "type": "boolean",
      "example": "not boolean",
    });
    assert(_string === '');
    assert(typeof _number === 'number');
    assert(typeof _boolean === 'boolean');
  });
  it('should be default', function() {
    const _default = jsl.schema2json({
      "name": "root",
      "type": "type",
      "example": undefined,
    });
    assert(_default === undefined);
  });
});
