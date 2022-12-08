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
        if (typeof a[fieldsInfo[i].field] === 'number' && typeof b[fieldsInfo[i].field] === 'number') {
          result = fieldsInfo[i].direction
            * (a[fieldsInfo[i].field] - b[fieldsInfo[i].field]);
        } else {
          result = fieldsInfo[i].direction
            * (a[fieldsInfo[i].field].toString().localeCompare(b[fieldsInfo[i].field].toString()));
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
