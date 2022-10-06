<template>
  <div>
    show respondent!!
    {{ patientData }}
    <ul>
      <li v-for="(token, index) in tokenData" :key="index">{{ token.id }}</li>
    </ul>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import useGetModelRepository from '../functions/modelRepository';
import useBasePropStorer from '../functions/basePropStorer';
import useTokenRepository from '../functions/tokenRepository';

export default {
  props: {
    apiUrl: {
      type: String,
      required: true,
    },
    patientNr: {
      type: String,
      required: true,
    },
    organizationId: {
      type: Number,
      required: true,
    },
    locale: {
      type: String,
      required: false,
      default: 'en',
    },
  },
  setup(props) {
    useBasePropStorer(props);
    const patientData = ref(null);
    const tokenData = ref(null);

    const { getModelRepository } = useGetModelRepository();
    const modelRepository = getModelRepository();

    const getPatientData = (async () => {
      const patientModel = modelRepository.getModel('Patient');
      patientData.value = await patientModel.find();
    });

    const getTokens = (async () => {
      const tokenRepository = useTokenRepository();
      const tokens = await tokenRepository.getAllTokens();
      console.log(tokens);
      tokenData.value = tokenRepository.groupByCareplanRound(tokens);
    });

    onMounted(() => {
      getPatientData();
      getTokens();
    });

    return {
      patientData,
      tokenData,
    };
  },
};
</script>
