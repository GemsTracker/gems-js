import { ref } from 'vue';
import useArrayObjectFunctions from './ArrayObject';
import useGetModelRepository from './modelRepository';

const useTokenRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();
  const tokenModel = modelRepository.getModel('Tokens');

  const { sortFieldsFunction } = useArrayObjectFunctions();

  const loading = ref(null);

  const getTokenInfo = ((token) => {
    let roundDescription = null;
    let roundOrder = null;
    let carePlan = null;
    let carePlanId = null;
    let url = null;
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
              carePlan = infoItem;
              carePlanId = infoItem.id;
              break;
            case 'url':
              url = infoItem.value;
              break;
            default:
              break;
          }
        }
      });
    }

    return {
      carePlan,
      carePlanId,
      roundDescription,
      roundOrder,
      url,
    };
  });

  const addTokenInfoFields = ((tokens) => tokens.map((token) => {
    const {
      carePlan,
      carePlanId,
      roundDescription,
      roundOrder,
      url,
    } = getTokenInfo(token);
    const augmentedToken = token;
    augmentedToken.carePlan = carePlan;
    augmentedToken.carePlanId = carePlanId;
    augmentedToken.roundDescription = roundDescription;
    augmentedToken.roundOrder = roundOrder;
    augmentedToken.surveyUrl = url;
    augmentedToken.start = token.executionPeriod.start;
    augmentedToken.ownerType = token.owner.type;
    augmentedToken.status = token.status;
    return augmentedToken;
  }));

  const getAllTokens = (async () => {
    loading.value = true;
    const rawTokens = await tokenModel.all();
    if (rawTokens === null) {
      loading.value = false;
      return [];
    }
    const tokenArray = Object.values(rawTokens);
    const augmentedTokens = addTokenInfoFields(tokenArray);
    loading.value = false;
    return augmentedTokens.sort(sortFieldsFunction(['roundOrder']));
  });

  const getCarePlanTokens = (async (carePlanId) => {
    const allTokens = await getAllTokens();
    console.log(allTokens, carePlanId);
    return allTokens.filter((token) => token.carePlanId === carePlanId);
  });

  const getToken = (async (tokenId) => {
    const allTokens = await getAllTokens();
    if (allTokens !== null) {
      for (let i = 0; i < allTokens.length; i += 1) {
        const token = allTokens[i];
        if (token.id === tokenId) {
          return token;
        }
      }
    }
    return null;
  });

  const getOneToken = (async (tokenId) => {
    const token = await tokenModel.findById(tokenId);
    if (token !== null) {
      return token;
    }
    return null;
  });

  const groupByCarePlans = ((tokens) => {
    const groupedTokens = {};
    Object.keys(tokens).forEach((tokenId) => {
      const token = tokens[tokenId];
      const { carePlanId } = getTokenInfo(token);
      if (!(carePlanId in groupedTokens)) {
        groupedTokens[carePlanId] = [];
      }

      groupedTokens[carePlanId].push(token);
    });
    return groupedTokens;
  });

  const groupByCareplanyMeasureMoment = ((tokens) => {
    const groupedTokens = {};
    Object.keys(tokens).forEach((tokenId) => {
      const token = tokens[tokenId];
      const { carePlanId, roundDescription } = getTokenInfo(token);

      if (roundDescription !== null && carePlanId !== null) {
        if (!(carePlanId in groupedTokens)) {
          groupedTokens[carePlanId] = {};
        }
        if (!(roundDescription in groupedTokens[carePlanId])) {
          groupedTokens[carePlanId][roundDescription] = [];
        }
        groupedTokens[carePlanId][roundDescription].push(token);
      }
    });
    return groupedTokens;
  });

  const groupByMeasureMoment = ((tokens) => {
    const groupedTokens = [];
    const foundMoments = [];
    Object.values(tokens).forEach((token) => {
      const { roundDescription } = getTokenInfo(token);

      if (roundDescription !== null) {
        if (!foundMoments.includes(roundDescription)) {
          foundMoments.push(roundDescription);
          groupedTokens.push({ name: roundDescription, tokens: [] });
        }

        groupedTokens[foundMoments.indexOf(roundDescription)].tokens.push(token);
      }
    });
    return groupedTokens;
  });

  const groupByDate = ((tokens) => {
    const groupedTokens = [];
    const foundStarts = [];
    tokens.sort(sortFieldsFunction(['-start', 'roundOrder'])).forEach((token) => {
      let { start } = token;
      if (start === null) {
        start = 0;
      }
      if (!foundStarts.includes(token.start)) {
        foundStarts.push(token.start);
        groupedTokens.push({ start: token.start, tokens: [] });
      }

      groupedTokens[foundStarts.indexOf(token.start)].tokens.push(token);
    });

    return groupedTokens;
  });

  const groupByOwner = ((tokens) => {
    const groupedTokens = [];
    const foundOwners = [];
    tokens.sort(sortFieldsFunction(['ownerType', 'roundOrder'])).forEach((token) => {
      if (token.ownerType !== null) {
        if (!foundOwners.includes(token.ownerType)) {
          foundOwners.push(token.ownerType);
          groupedTokens.push({ type: token.ownerType, tokens: [] });
        }

        groupedTokens[foundOwners.indexOf(token.ownerType)].tokens.push(token);
      }
    });

    return groupedTokens;
  });

  const groupByStatus = ((tokens) => {
    const groupedTokens = [];
    const foundStatus = [];
    tokens.sort(sortFieldsFunction(['status', 'roundOrder'])).forEach((token) => {
      if (token.status !== null) {
        if (!foundStatus.includes(token.status)) {
          foundStatus.push(token.status);
          groupedTokens.push({ status: token.status, tokens: [] });
        }

        groupedTokens[foundStatus.indexOf(token.status)].tokens.push(token);
      }
    });

    return groupedTokens;
  });

  return {
    getAllTokens,
    groupByCarePlans,
    getCarePlanTokens,
    getOneToken,
    getToken,
    groupByCareplanyMeasureMoment,
    groupByDate,
    groupByMeasureMoment,
    groupByOwner,
    groupByStatus,
    loading,
  };
});

export default useTokenRepository;
