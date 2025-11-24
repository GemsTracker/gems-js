const useArrayObjectFunctions = (() => {
  const sortFieldsFunction = ((fields) => {
    const fieldsInfo = fields.map((order) => {
      const fieldInfo = {
        field: order,
        direction: 1,
      };
      if (order[0] === '-') {
        fieldInfo.field = order.substring(1);
        fieldInfo.direction = -1;
      }
      return fieldInfo;
    });

    return (a, b) => {
      let i = 0;
      let result = 0;
      while (i < fieldsInfo.length && result === 0) {
        const fieldA = a[fieldsInfo[i].field];
        const fieldB = b[fieldsInfo[i].field];
        if (fieldA === null && fieldB === null) {
          result = 0;
        } else if (fieldA === null || fieldA === undefined) {
          result = 1 * fieldsInfo[i].direction;
        } else if (fieldB === null || fieldB === undefined) {
          console.log(b);
          result = -1 * fieldsInfo[i].direction;
        } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
          result = fieldsInfo[i].direction
              * (fieldA - fieldB);
        } else {
          result = fieldsInfo[i].direction
            * (fieldA.toString().localeCompare(fieldB.toString()));
        }
        i += 1;
      }
      return result;
    };
  });

  return {
    sortFieldsFunction,
  };
});

export default useArrayObjectFunctions;
