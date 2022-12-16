<template>
  <div class="track-buttons">
      <loading-screen v-if="loading === true"></loading-screen>
      <strong>Add&nbsp;</strong>
      <drop-down label="Tracks">
        <li v-for="track, index in tracks" :key="index">
          <a class="dropdown-item" :href="getTrackCreateUrl(track.id)">{{ track.name }}</a>
        </li>
      </drop-down>
      &nbsp;
      <div class="btn-group">
        <button class="btn" type="button" disabled="1">Surveys for</button>
        <drop-down label="Patients">
          <!-- <li v-for="track, index in tracks" :key="index">
            <a class="dropdown-item" :href="getTrackUrl(track)">{{ track.name }}</a>
          </li> -->
        </drop-down>
        <drop-down label="Staff">
          <!-- <li v-for="track, index in tracks" :key="index">
            <a class="dropdown-item" :href="getTrackUrl(track)">{{ track.name }}</a>
          </li> -->
        </drop-down>
      </div>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import useTrackRepository from '../../functions/TrackRepository';
import useUrlHelper from '../../functions/urlHelper';
import usePatientStore from '../../stores/patientStore';
import DropDown from '../Util/DropDown.vue';
import LoadingScreen from '../Util/LoadingScreen.vue';

export default {
  components: {
    DropDown, LoadingScreen,
  },
  setup() {
    const tracks = ref(null);

    const patientStore = usePatientStore();

    const { getTracksForOrganization, loading } = useTrackRepository();

    const getTracks = (async () => {
      tracks.value = await getTracksForOrganization(patientStore.organizationId);
    });

    const { getTrackCreateUrl } = useUrlHelper();

    onMounted(() => {
      getTracks();
    });

    return {
      loading,
      getTrackCreateUrl,
      tracks,
    };
  },
};
</script>
