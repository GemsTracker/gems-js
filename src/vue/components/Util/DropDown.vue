<template>
  <div class="dropdown btn-group">
    <button class="btn btn-secondary dropdown-toggle"
      type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {{label}}
    </button>
    <ul class="dropdown-menu">
      <slot></slot>
      <li v-for="itemUrl, itemLabel, index in items" :key="index">
        <a class="dropdown-item" :href="itemUrl">{{ itemLabel }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
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
  },
};
</script>
