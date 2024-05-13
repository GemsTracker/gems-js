<template>
  <div class="find-token">
    <div class="form-group">
      <label>
        {{ t('Token') }}
        <input type="text"
               v-model="tokenId"
               pattern="[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}"
               size="9"
               maxlength="9"
               class="form-control token-input" />
      </label>
      <loading-screen v-if="loading" color="gray" size="2rem" />
    </div>
    <div class="find-token-result">
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
    </div>
  </div>
</template>
<script setup>

import {ref, watch} from "vue";
import { useI18n } from "vue-i18n";
import useTokenRepository from "../functions/tokenRepository";

import useBasePropStorer from "../functions/basePropStorer";
import LoadingScreen from "./Util/LoadingScreen.vue";

import useUrlHelper from "../functions/urlHelper";

const props = defineProps({
  apiUrl: {
    type: String,
    required: true,
  },
  locale: {
    type: String,
    required: false,
    default: 'en',
  },
  baseUrl: {
    type: String,
    default: '/',
  },
});
useBasePropStorer(props);

const { t } = useI18n();

const tokenRepository = useTokenRepository();
const tokenId = ref(null);
const loading = ref(false);
const urlHelper = useUrlHelper();
const error = ref(null);

const searchToken = (async (tokenId) => {
  error.value = null;
  loading.value = true;
  const token = await tokenRepository.getOneToken(tokenId);
  if (token === null || token === undefined) {
    error.value = t('Token not found');
    loading.value = false;
    return;
  }
  console.log(token);
  console.log(token.id);

  const tokenInfo = tokenRepository.getTokenInfo(token);
  const organizationId = token.managingOrganization.id;
  const patientNrParts = token.for.id.split('@');
  const patientNr = patientNrParts[0];

  const tokenShowUrl = urlHelper.getTokenShowUrl(token.id, tokenInfo.carePlanId, patientNr, organizationId);
  loading.value = false;
  window.location = tokenShowUrl;
  console.log(tokenShowUrl);
});

watch(tokenId, async (newValue) => {
  if (newValue.length > 4 && newValue.charAt(4) !== '-') {
    tokenId.value = `${newValue.slice(0,4)}-${newValue.slice(4)}`;
  }
  if (newValue.length !== 9 || newValue.charAt(4) !== '-') {
    return;
  }
  searchToken(newValue.toLowerCase());
});

</script>
<style lang="scss">
.find-token {
  //--c: #ccc; /* control the color of border */
  --w: 1ch;   /* control the width for each letter */
  //--g: 0px;   /* control the gap between letter */
  //--b: .5px;   /* control the border */
  //--n: 9;    /* control the number of letters*/

  .token-input {
    font-size: 50px;
    letter-spacing: var(--w);

    font-family: monospace;
  }
  .find-token-result {
    margin-top: 1rem;
    max-width: 50%;
  }
}
</style>