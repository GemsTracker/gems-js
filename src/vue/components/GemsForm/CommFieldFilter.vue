<template>
  <div class="input-group input-group-sm mt-3 mb-3">
    <span class="input-group-text">{{ idLabel }}</span>
    <input class="form-control form-control-sm" type="text" v-model="id" />
    <template v-if="showOrganizationIdField">
      <span class="input-group-text">Organization:</span>
      <organization-selector v-model="organizationId" />
    </template>
    <button type="button" class="btn" @click="setFilter">
      <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
    </button>
    <button type="button" class="btn" @click="clearFilter">Clear</button>

  </div>
</template>
<script>
import { computed, inject, ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import OrganizationSelector from '../Util/OrganizationSelector.vue';

library.add(faMagnifyingGlass);

export default {
  props: {
    commTarget: {
      type: String,
      required: true,
    },
  },
  components: {
    FontAwesomeIcon,
    OrganizationSelector,
  },
  setup(props) {
    const id = ref(null);
    const organizationId = ref(null);

    const filter = inject('fieldFilter');

    const clearFilter = (() => {
      filter.value = {};
      id.value = null;
      organizationId.value = null;
      return false;
    });

    const setFilter = (() => {
      const newFilter = {
        id: id.value,
      };
      if (organizationId.value !== null && organizationId.value !== '') {
        newFilter.organizationId = organizationId.value;
      }
      filter.value = newFilter;
      return false;
    });

    const idLabel = computed(() => {
      switch (props.commTarget) {
        case 'token':
          return 'Token ID';
        case 'respondent':
          return 'Patient number';
        case 'staff':
        case 'staff-password':
          return 'Username';
        default:
          return null;
      }
    });

    const showOrganizationIdField = computed(() => {
      if (props.commTarget === 'staff' || props.commTarget === 'respondent') {
        return true;
      }
      return false;
    });

    return {
      clearFilter,
      id,
      idLabel,
      organizationId,
      setFilter,
      showOrganizationIdField,
    };
  },
};
</script>
