<template>
    <div class="tip-tap-menu-group">
      <button @click="askLink" type="button" title="Link"
          :class="{active: editor.isActive('link')}">
        <font-awesome-icon icon="link" />
      </button>
        <button @click="breakLink" type="button" title="Link" :disabled="!editor.isActive('link')">
        <font-awesome-icon icon="link-slash" />
      </button>
    </div>
</template>
<script>
import { inject } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faLink,
  faLinkSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useTipTapFunctions from '../../../functions/tipTapFunctions';

library.add(faLink, faLinkSlash);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const editor = inject('editor');
    const {
      activeLink,
      breakLink,
      getCurrentLink,
      setLink,
    } = useTipTapFunctions(editor);

    const askLink = (() => {
      const previousUrl = getCurrentLink();
      const url = window.prompt('URL', previousUrl);
      if (url === null) {
        return;
      }
      if (url === '') {
        breakLink();
      }
      setLink(url);
    });

    return {
      activeLink,
      askLink,
      breakLink,
      editor,
    };
  },
};
</script>
