module.exports = (schema) => {
  const newSchema = {
    ...schema,
    paths: Object.entries(schema.paths).reduce((acc, [path, pathItem]) => {
      const newObject = replaceRef(pathItem);
      acc[path] = newObject;
      return acc;
    }, {}),
    components: {
      ...schema.components,
      schemas: Object.entries(schema.components.schemas).reduce((acc, [key, value]) => {
        const removeOsiTypesRegExp = /, OSI.Core.Types, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null/g;
        const removeCoreLibRegExp =
          /, System.Private.CoreLib, Version=5.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e/g;
        const removeMetaInfo = /OSI.Core.Models./;
        let newKey = key.replace(removeOsiTypesRegExp, '');
        newKey = newKey.replace(removeCoreLibRegExp, '');
        newKey = newKey.replace(removeMetaInfo, '');
        acc[newKey] = replaceRefInComponents(value);
        return acc;
      }, {})
    }
  };

  return newSchema;
};

const replaceRef = (obj) =>
  typeof obj === 'object' && obj !== null
    ? Array.isArray(obj)
      ? obj.map(replaceRef)
      : Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [
            key,
            typeof value === 'object' && value !== null
              ? replaceRef(value)
              : key === '$ref'
              ? clearMetaInfo(value)
              : value
          ])
        )
    : obj;

const clearMetaInfo = (str) => {
  const removeOsiTypesRegExp = /, OSI.Core.Types, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null/g;
  const removeCoreLibRegExp =
    /, System.Private.CoreLib, Version=5.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e/g;
  const removeMetaInfo = /OSI.Core.Models./;

  const newStr = str.replace(removeOsiTypesRegExp, '').replace(removeCoreLibRegExp, '').replace(removeMetaInfo, '');
  return newStr;
};

const replaceRefInComponents = (obj) => {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map(replaceRef);
    }
    const result = {};

    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        result[key] = replaceRef(value);
      } else if (key === '$ref') {
        result[key] = clearMetaInfoComponents(value);
      } else {
        result[key] = value;
      }
    });

    return result;
  }

  return obj;
};

const clearMetaInfoComponents = (str) => {
  const removeMetaInfo = /OSI.Core.Models./;

  return str.replace(removeMetaInfo, '');
};
