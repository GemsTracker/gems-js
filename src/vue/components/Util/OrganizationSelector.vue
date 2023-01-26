<template>
  <div class="organization-selector d-inline">
    <vue-select v-if="!organizationsLoading" v-model="currentValue" :options="formOptions"
      :reduce="value => value.key" label="value" 
      :style="'width: '+ selectWidth +'rem; max-width: 100%;'"
      :disabled="disabled"
    />
    <loading-screen v-if="organizationsLoading" />
  </div>
</template>
<script>
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { computed, onMounted, ref } from 'vue';
import OrganizationRepository from '../../functions/OrganizationRepository';
import LoadingScreen from './LoadingScreen.vue';

export default {
  props: {
    modelValue: {
      type: Number,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LoadingScreen, VueSelect,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { getOrganizations, loading: organizationsLoading } = OrganizationRepository();

    const currentValue = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        return emit('update:modelValue', value);
      },
    });

    const formOptions = ref([]);
    onMounted(async () => {
      const organizations = await getOrganizations();
      organizations.forEach((organization) => {
        formOptions.value.push({
          key: organization.id,
          value: organization.name,
        });
      });
    });

    const selectWidth = computed(() => {
      let length = 0;
      if (formOptions.value.length) {
        formOptions.value.forEach((option) => {
          if (option.value.length > length) {
            length = option.value.length;
          }
        });
      }
      return length;
    });

    return {
      currentValue,
      formOptions,
      organizationsLoading,
      selectWidth,
    };
  },
};
</script>
