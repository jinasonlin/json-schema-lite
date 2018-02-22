const typeis = (obj) => {
  return (obj === null || obj === undefined) ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase();
};

const schema2json = (schema) => {
  switch (schema.type) {
    case 'null': {
      return null;
    }
    case 'object':
      return schema.properties.reduce((obj, item) => {
        if (item.name) {
          obj[item.name] = schema2json(item);
        }
        return obj;
      }, {});
    case 'array':
      return [schema2json(schema.items)];
    case 'string': {
      const isString = typeis(schema.example) === 'string';
      return !isString ? '' : schema.example;
    }
    case 'number': {
      const value = +schema.example;
      return Number.isNaN(value) ? Math.ceil(Math.random() * 2) - 1 : value;
    }
    case 'boolean': {
      const isBoolean = typeis(schema.example) === 'boolean';
      return !isBoolean ? Math.ceil(Math.random() * 2) > 1 : schema.example;
    }
    default:
      return schema.example;
  }
};

const json2schema = (example, name = 'root') => {
  const defaultProperties = [{}];
  const defaultItem = '';
  const type = typeis(example);

  switch (type) {
    case 'object': {
      const keys = Object.keys(example);
      if (!keys.length) {
        return {
          name,
          type,
          properties: defaultProperties,
        };
      }

      return {
        name,
        type,
        properties: keys.map(key => json2schema(example[key], key)),
      };
    }
    case 'null': {
      return {
        name,
        type,
        example: null,
      }; 
    }
    case 'array': {
      return {
        name,
        type,
        items: json2schema(example[0] || defaultItem, `${name}.item`),
      };
    }
    default:
      return {
        name,
        type,
        example,
      };
  }
};

module.exports = {
  schema2json,
  buildSchema: schema2json,
  json2schema,
  buildJson: json2schema,
};
