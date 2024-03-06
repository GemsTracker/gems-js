<template>
  <div class="track-buttons">
      <strong>{{ t('Add') }}&nbsp;</strong>
      <drop-down label="Tracks" :disabled="tracks === null || tracks.length === 0"
                 :loading="trackLoading">
        <li v-for="(track, index) in tracks" :key="index">
          <a class="dropdown-item" :href="getTrackCreateUrl(track.id)">{{ track.name }}</a>
        </li>
      </drop-down>
      &nbsp;
      <strong>{{ t('Add surveys for') }}</strong>
      &nbsp;
      <div class="btn-group">
        <drop-down label="Patients" :loading="questionnaireLoading"
         :disabled="patientQuestionnaires === null || patientQuestionnaires.length === 0">
          <li v-for="(questionnaire, index) in patientQuestionnaires" :key="index">
            <a class="dropdown-item" :href="getInsertSurveyUrl(questionnaire.id)">
              {{ questionnaire.name }}
            </a>
          </li>
        </drop-down>
        <drop-down label="Staff" :loading="questionnaireLoading"
         :disabled="practitionerQuestionnaires === null || practitionerQuestionnaires.length === 0">
          <li v-for="(questionnaire, index) in practitionerQuestionnaires" :key="index">
            <a class="dropdown-item" :href="getInsertSurveyUrl(questionnaire.id)">
                {{ questionnaire.name }}
            </a>
          </li>
        </drop-down>
      </div>
  </div>
</template>
<script>
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import useTrackRepository from '../../functions/TrackRepository';
import useInsertableQuestionnaireRepositoryRepository from '../../functions/InsertableQuestionnaireRepository';
import useUrlHelper from '../../functions/urlHelper';
import usePatientStore from '../../stores/patientStore';
import DropDown from '../Util/DropDown.vue';

export default {
  components: {
    DropDown,
  },
  setup() {
    const { t } = useI18n();

    const tracks = ref(null);
    const questionnaires = ref(null);
    const patientQuestionnaires = ref(null);
    const practitionerQuestionnaires = ref(null);

    const patientStore = usePatientStore();

    const { getTracksForOrganization, loading: trackLoading } = useTrackRepository();
    const {
      getInsertableQuestionnairesForOrganization,
      groupByServiceType,
      loading: questionnaireLoading,
    } = useInsertableQuestionnaireRepositoryRepository();

    const getData = (async () => {
      const promises = [
        getTracksForOrganization(patientStore.organizationId),
        getInsertableQuestionnairesForOrganization(patientStore.organizationId),
      ];

      [tracks.value, questionnaires.value] = await Promise.all(promises);

      if (Array.isArray(questionnaires.value)) {
        [
          patientQuestionnaires.value,
          practitionerQuestionnaires.value,
        ] = groupByServiceType(questionnaires.value);
      }
    });

    const {
      getInsertSurveyUrl,
      getTrackCreateUrl,
    } = useUrlHelper();

    onMounted(() => {
      getData();
    });

    const patientCombi = computed(() => patientStore.patientOrganizationCombination);
    watch(patientCombi, () => {
      tracks.value = null;
      questionnaires.value = null;
      patientQuestionnaires.value = null;
      practitionerQuestionnaires.value = null;
      getData();
    });

    return {
      getInsertSurveyUrl,
      getTrackCreateUrl,
      questionnaireLoading,
      patientQuestionnaires,
      practitionerQuestionnaires,
      t,
      tracks,
      trackLoading,
    };
  },
};
</script>
