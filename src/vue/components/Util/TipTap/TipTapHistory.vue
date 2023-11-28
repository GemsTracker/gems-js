<template>
  <div class="tip-tap-menu-group">
    <button @click="doUndo" :disabled="!hasUndo" type="button" title="Undo (ctrl+z)">
        <font-awesome-icon icon="undo" />
    </button>
    <button @click="doRedo" :disabled="!hasRedo" type="button" title="Redo (shift+ctrl+z)">
        <font-awesome-icon icon="redo" />
    </button>
  </div>
</template>
<script>
import { inject } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faRedo, faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useTipTapFunctions from '../../../functions/tipTapFunctions';

library.add(faRedo, faUndo);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const editor = inject('editor');

    const {
      doRedo,
      doUndo,
      hasRedo,
      hasUndo,
    } = useTipTapFunctions(editor);

    return {
      doRedo,
      doUndo,
      hasRedo,
      hasUndo,
    };
  },
};
</script>
