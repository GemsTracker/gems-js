<template>
  <div>
    <form v-if="!loading" :class="formClass">
      <div v-for="(group, groupIndex) in groupedStructure"
           :key="groupIndex"
          class="panel">
        <gems-form-element v-for="(elementOptions, index) in group"
          :key="`${groupIndex}_${index}`"
          :options="elementOptions" />
      </div>
    </form>
    <loading-screen v-if="loading" />
  </div>
</template>
<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import LoadingScreen from '../Util/LoadingScreen.vue';

const props = defineProps({
  formType: {
    type: String,
    required: false,
    default: null,
  },
  structure: {
    required: true,
  },
});

const GemsFormElement = defineAsyncComponent(() => import('./GemsFormElement.vue'));
const loading = ref(false);

const groupedStructure = computed(() => {
  let { structure } = props;
  if (typeof structure === 'object') {
    structure = Object.values(structure);
  }
  const newStructure = [];
  let group = [];
  structure.forEach((elementData) => {
    if (Array.isArray(elementData) && elementData.length === 0) {
      newStructure.push(group);
      group = [];
      return;
    }
    group.push(elementData);
  });
  if (group.length) {
    newStructure.push(group);
  }
  return newStructure;
})

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

</script>
