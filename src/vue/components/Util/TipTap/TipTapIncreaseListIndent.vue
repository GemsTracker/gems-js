<template>
  <button @click="liftList" type="button" title="Increase indent" :disabled="!activeListItem">
    <font-awesome-icon icon="indent" />
  </button>
</template>
<script>
import { inject } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faIndent,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useTipTapFunctions from '../../../functions/tipTapFunctions';

library.add(faIndent);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const editor = inject('editor');

    const {
      activeListItem,
      liftList,
    } = useTipTapFunctions(editor);

    return {
      activeListItem,
      liftList,
    };
  },
};
</script>
