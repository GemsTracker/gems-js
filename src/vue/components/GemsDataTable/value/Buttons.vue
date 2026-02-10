<template>
  <div class="buttons mb-0">
    <template v-for="(link, index) in links"
              :key="index">
      <br v-if="link.newLine ?? false" />
      <a v-if="link.url !== null"
          :href="link.url"
        :class="getLinkClasses(link)"
      >
        {{ link.label }}
      </a>
    </template>
  </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  rawValue: {
    type: [String, Number],
    default: null,
  },
  structureData: {
    type: Object,
    required: true,
  },
  otherValues: {
    type: Object,
    required: true,
  }
});

const getLinkClasses = ((link) => {
  let linkClass = props.structureData.class ?? 'actionlink btn';
  if ('class' in link) {
    linkClass = linkClass + ` ${link.class}`;
  }
  return linkClass;
})

const renderUrl = ((url, variables, hideNull = false) => {
  console.log('RENDER URL:', url, variables, hideNull);

  let missing = false;
  const result = url.replace(/\{([a-zA-Z0-9_\-]+)\}/g, (_, key) => {
    if (key in variables && variables[key] !== null) {
      return String(variables[key]);
    } else {
      console.log('MISSING!!!', key in variables, key, variables);
    }
    missing = true;
    return `{${key}}`;
  });
  return hideNull && missing ? null : result;
});

const links = computed(() => {
  if (!props.structureData?.links) {
    return [];
  }

  return props.structureData.links.map((item) => {
    return {
      ...item,
      url: renderUrl(item.url, props.otherValues, item.hideNull ?? false),
    }
  });
});
</script>