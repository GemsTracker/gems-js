<template>
  <button @click="setItalic" type="button" title="Italic (ctrl+i)" :class="{active: activeItalic}">
    <font-awesome-icon icon="italic" />
  </button>
</template>
<script>
import { inject } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faItalic,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useTipTapFunctions from '../../../functions/tipTapFunctions';

library.add(faItalic);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const editor = inject('editor');

    const {
      activeItalic,
      setItalic,
    } = useTipTapFunctions(editor);

    return {
      activeItalic,
      setItalic,
    };
  },
};
</script>
