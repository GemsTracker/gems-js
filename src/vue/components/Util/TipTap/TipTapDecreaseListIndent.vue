<template>
  <button @click="sinkList" type="button" title="Decrease indent" :disabled="!activeListItem">
    <font-awesome-icon icon="outdent" />
  </button>
</template>
<script>
import { inject } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faOutdent,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useTipTapFunctions from '../../../functions/tipTapFunctions';

library.add(faOutdent);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const editor = inject('editor');

    const {
      activeListItem,
      sinkList,
    } = useTipTapFunctions(editor);

    return {
      activeListItem,
      sinkList,
    };
  },
};
</script>
