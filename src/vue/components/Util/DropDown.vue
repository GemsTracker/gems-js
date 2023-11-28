<template>
  <div class="dropdown btn-group">
    <button class="btn btn-secondary dropdown-toggle"
      type="button" data-bs-toggle="dropdown" aria-expanded="false" :disabled="disabled">
      {{label}} <loading-screen v-if="loading" size="1rem" color="white" />
    </button>
    <ul class="dropdown-menu">
      <slot></slot>
      <li v-for="(itemUrl, itemLabel, index) in items" :key="index">
        <a class="dropdown-item" :href="itemUrl">{{ itemLabel }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
import LoadingScreen from './LoadingScreen.vue';

export default {
  components: {
    LoadingScreen,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    items: {
      type: Object,
      default() {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
