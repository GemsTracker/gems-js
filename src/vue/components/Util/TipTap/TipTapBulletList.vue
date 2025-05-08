<template>
  <button @click="setBulletList" type="button" title="Bullet list" :class="{active: activeBulletList}">
    <font-awesome-icon icon="list-ul" />
  </button>
</template>
<script>
import { inject } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faListUl,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useTipTapFunctions from '../../../functions/tipTapFunctions';

library.add(faListUl);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const editor = inject('editor');

    const {
      activeBulletList,
      setBulletList,
    } = useTipTapFunctions(editor);

    return {
      activeBulletList,
      setBulletList,
    };
  },
};
</script>
