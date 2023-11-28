<template>
  <button @click="setBold" type="button" title="Bold (ctrl+b)" :class="{active: activeBold}">
    <font-awesome-icon icon="bold" />
  </button>
</template>
<script>
import { inject } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBold,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useTipTapFunctions from '../../../functions/tipTapFunctions';

library.add(faBold);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const editor = inject('editor');

    const {
      activeBold,
      setBold,
    } = useTipTapFunctions(editor);

    return {
      activeBold,
      setBold,
    };
  },
};
</script>
