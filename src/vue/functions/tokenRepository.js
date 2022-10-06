import useGetModelRepository from './modelRepository';

const useTokenRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();
  const tokenModel = modelRepository.getModel('Tokens');

  const getAllTokens = (async () => {
    const tokens = tokenModel.all();
    return tokens;
  });

  const groupByCareplanRound = ((tokens) => {
    const groupedTokens = {};
    Object.keys(tokens).forEach((tokenId) => {
      const token = tokens[tokenId];
      let roundDescription = null;
      let roundOrder = null;
      let carePlanId = null;
      if ('info' in token) {
        Object.values(token.info).forEach((infoItem) => {
          if ('type' in infoItem) {
            switch (infoItem.type) {
              case 'roundDescription':
                roundDescription = infoItem.value;
                break;
              case 'roundOrder':
                roundOrder = infoItem.value;
                break;
              case 'CarePlan':
                carePlanId = infoItem.id;
                break;
              default:
                break;
            }
          }
        });
      }
      if (roundDescription !== null && carePlanId !== null) {
        if (!(carePlanId in groupedTokens)) {
          groupedTokens[carePlanId] = {};
        }
        if (!(roundDescription in groupedTokens[carePlanId])) {
          groupedTokens[carePlanId][roundDescription] = {};
        }
        if (!(roundOrder in groupedTokens[carePlanId][roundDescription])) {
          groupedTokens[carePlanId][roundDescription][roundOrder] = [];
        }
        groupedTokens[carePlanId][roundDescription][roundOrder].push(token);
      }
    });
    return groupedTokens;
  });

  return {
    getAllTokens,
    groupByCareplanRound,
  };
});

export default useTokenRepository;
