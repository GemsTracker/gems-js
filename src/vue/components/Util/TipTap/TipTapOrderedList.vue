<template>
  <button @click="setOrderedList" type="button" title="Ordered list" :class="{active: activeOrderedList}">
    <font-awesome-icon icon="list-ol" />
  </button>
</template>
<script>
import { inject } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faListOl,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useTipTapFunctions from '../../../functions/tipTapFunctions';

library.add(faListOl);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const editor = inject('editor');

    const {
      activeOrderedList,
      setOrderedList,
    } = useTipTapFunctions(editor);

    return {
      activeOrderedList,
      setOrderedList,
    };
  },
};
</script>
