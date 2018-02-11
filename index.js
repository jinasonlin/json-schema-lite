const typeis = (obj) => {
  return (obj === null || obj === undefined) ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase();
};

const buildSchema = (schema) => {
  switch (schema.type) {
    case 'object':
      return schema.properties.reduce((obj, item) => {
        if (item.name) {
          obj[item.name] = buildSchema(item);
        }
        return obj;
      }, {});
    case 'null': {
      return null;
    }
    case 'array':
      return [buildSchema(schema.items)];
    case 'number': {
      const value = +schema.example;
      return Number.isNaN(value) ? Math.ceil(Math.random() * 2) - 1 : value;
    }
    case 'boolean': {
      const isEmpty = !schema.example;
      const value = !isEmpty && schema.example === 'true';
      return isEmpty ? Math.ceil(Math.random() * 2) > 1 : value;
    }
    default:
      return schema.example || schema.type;
  }
};

const buildJson = (example, name = 'root') => {
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
        properties: keys.map(key => buildJson(example[key], key)),
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
        items: buildJson(example[0] || defaultItem, `${name}.item`),
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
  buildSchema,
  buildJson,
};
