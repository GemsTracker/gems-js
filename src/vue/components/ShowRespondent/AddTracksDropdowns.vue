<template>
  <div class="track-buttons">
      <loading-screen v-if="loading === true"></loading-screen>
      <strong>Add&nbsp;</strong>
      <drop-down label="Tracks" :disabled="tracks === null || tracks.length === 0" :loading="trackLoading">
        <li v-for="(track, index) in tracks" :key="index">
          <a class="dropdown-item" :href="getTrackCreateUrl(track.id)">{{ track.name }}</a>
        </li>
      </drop-down>
      &nbsp;
      <div class="btn-group">
        <button class="btn" type="button" disabled="disabled">Surveys for</button>
        <drop-down label="Patients" :loading="questionnaireLoading"
         :disabled="patientQuestionnaires === null || patientQuestionnaires.length === 0">
          <li v-for="(questionnaire, index) in patientQuestionnaires" :key="index">
            <a class="dropdown-item" :href="getInsertSurveyUrl(questionnaire)">
              {{ questionnaire.name }}
            </a>
          </li>
        </drop-down>
        <drop-down label="Staff" :loading="questionnaireLoading"
         :disabled="practitionerQuestionnaires === null || practitionerQuestionnaires.length === 0">
          <li v-for="(questionnaire, index) in practitionerQuestionnaires" :key="index">
            <a class="dropdown-item" :href="getInsertSurveyUrl(questionnaire)">
                {{ questionnaire.name }}
            </a>
          </li>
        </drop-down>
      </div>

      <a v-if="active === true" class="btn btn-primary ms-3" type="button" :href="getRespondentDeleteUrl()">Delete patient</a>
      <a v-if="active === false" class="btn btn-primary ms-3" type="button" :href="getRespondentUndeleteUrl()">Undelete patient</a>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import useTrackRepository from '../../functions/TrackRepository';
import useInsertableQuestionnaireRepositoryRepository from '../../functions/InsertableQuestionnaireRepository';
import useUrlHelper from '../../functions/urlHelper';
import usePatientStore from '../../stores/patientStore';
import DropDown from '../Util/DropDown.vue';
import LoadingScreen from '../Util/LoadingScreen.vue';
import usePatientRepository from "../../functions/patientRepository";

export default {
  components: {
    DropDown, LoadingScreen,
  },
  setup() {
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

    const { getInsertSurveyUrl, getTrackCreateUrl, getRespondentDeleteUrl, getRespondentUndeleteUrl } = useUrlHelper();

    onMounted(() => {
      getData();
    });

    const { active } = usePatientRepository();

    return {
      getInsertSurveyUrl,
      getTrackCreateUrl,
      questionnaireLoading,
      patientQuestionnaires,
      practitionerQuestionnaires,
      tracks,
      trackLoading,
      active,
      getRespondentDeleteUrl,
      getRespondentUndeleteUrl,
    };
  },
};
</script>
