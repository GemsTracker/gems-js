<template>
  <div class="copy-to-clipboard" :class="buttonClass"
    :title="title" @click="copyToClipboard">
    <font-awesome-icon :icon="iconOptions[icon]" />
    {{ label }}
  </div>
</template>
<script>
import { computed, ref } from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useCopyToClipboard from '../../functions/ClipboardFunctions';

library.add(faCheck, faClipboard);

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Copy to Clipboard',
    },
    label: {
      type: String,
      default: '',
    },
  },
  emit: [
    'endCopy',
    'startCopy',
  ],
  components: {
    FontAwesomeIcon,
  },
  setup(props, { emit }) {
    const iconOptions = [
      ['far', 'clipboard'],
      ['fas', 'check'],
    ];

    const { copyRich, copyText, copied } = useCopyToClipboard();

    const icon = computed(() => {
      return copied.value === true ? 1 : 0;
    });

    const buttonClass = computed(() => {
      if (copied.value === true) {
        return 'success';
      }
      return null;
    });

    const copyToClipboard = (async () => {

      if (props.value) {
        emit('startCopy');

        if (!props.plain) {
          copyRich(props.value);
        } else {
          copyText(props.value);
        }

        emit('endCopy');

        element.classList.add('copied');
        setTimeout(() => {
          element.classList.remove('copied');
        }, 200);
      }

      setTimeout(() => {
        copied.value = false;
      }, 1000);
    });

    return {
      buttonClass,
      copied,
      copyToClipboard,
      iconOptions,
      icon,
    };
  },
};
</script>
<style lang="scss" scoped>
  .copy-to-clipboard {
    transition: none;
    cursor: pointer;
    &:disabled {
      cursor: not-allowed;
    }
    &.success {
      transition: color 250ms linear;
      color: rgb(56, 161, 105);
    }
    .extra-text {
      margin-left: 1rem;
    }
  }
</style>
