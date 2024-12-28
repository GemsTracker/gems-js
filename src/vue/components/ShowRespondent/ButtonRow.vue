<template>
  <div class="button-row">
    <div v-if="showButtons">
      <a class="btn btn-primary ms-3" type="button" :href="disableButtonUrl"
         :class="{disabled: disableButtonLabel === null}">
        <loading-screen v-if="disableButtonLabel === null" size="1rem" color="white" />
        {{ disableButtonLabel }}
      </a>
    </div>

    <add-tracks-dropdowns v-if="showDropdownAdd" />

  </div>
</template>
<script>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import AddTracksDropdowns from './AddTracksDropdowns.vue';
import LoadingScreen from '../Util/LoadingScreen.vue';
import usePatientRepository from '../../functions/patientRepository';
import useUrlHelper from '../../functions/urlHelper';

export default {
  components: { LoadingScreen, AddTracksDropdowns },
  props: {
    showButtons: {
      type: Boolean,
      default: true,
    },
    showDropdownAdd: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const { t } = useI18n();
    const { active, getPatientData } = usePatientRepository();

    onMounted(() => {
      getPatientData();
    });

    const disableButtonLabel = computed(() => {
      if (active.value === true) {
        return t('Delete patient');
      }
      if (active.value === false) {
        return t('Undelete patient');
      }
      return null;
    });

    const {
      getRespondentDeleteUrl,
      getRespondentUndeleteUrl,
    } = useUrlHelper();

    const disableButtonUrl = computed(() => {
      if (active.value === true) {
        return getRespondentDeleteUrl();
      }
      if (active.value === false) {
        return getRespondentUndeleteUrl();
      }
      return null;
    });

    return {
      disableButtonLabel,
      disableButtonUrl,
    };
  },
};
</script>
