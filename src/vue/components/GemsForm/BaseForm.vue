<template>
  <div :class="{'inline-block': formClass = 'inline'}" >
    <form v-if="!loading" :class="formClass">
      <gems-form-element v-for="(elementOptions, index) in structure"
        :key="index"
        :options="elementOptions" />
    </form>
    <loading-screen v-if="loading" />
  </div>
</template>
<script>
import { computed, defineAsyncComponent, ref } from 'vue';
import LoadingScreen from '../Util/LoadingScreen.vue';

export default {
  props: {
    formType: {
      type: String,
      required: false,
      default: null,
    },
    structure: {
      type: Object,
      required: true,
    },
  },
  components: {
    GemsFormElement: defineAsyncComponent(() => import('./GemsFormElement.vue')),
    LoadingScreen,
  },
  setup(props) {
    const loading = ref(false);

    const formClass = computed(() => {
      const classes = ['gems-form'];
      switch (props.formType) {
        case 'horizontal':
          classes.push('form-horizontal');
          break;
        case 'inline':
          classes.push('form-inline');
          break;
        default:
          break;
      }
      return classes.join(' ');
    });

    return {
      formClass,
      loading,
    };
  },
};
</script>
