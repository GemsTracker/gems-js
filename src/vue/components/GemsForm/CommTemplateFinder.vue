<template>
  <span v-if="commFieldsLoading === false && commFieldsEmpty" class="text-danger">No fields found</span>
  <comm-template-fields v-if="commFieldsLoading === false && !commFieldsEmpty" :comm-fields="commFields" />
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import CommTemplateFields from './CommTemplateFields.vue';
import CommFieldsRepository from '../../functions/CommFieldsRepository';


const props = defineProps({
  formData: {
    type: Object,
    required: true,
  }
});

const commFields = ref(null);

const { getCommFieldsForTarget, loading: commFieldsLoading } = CommFieldsRepository();

const tokenId = computed(() => {
  if ('id' in props.formData) {
    return props.formData.id;
  }
  return null;
});

const getCommFields = (async (tokenId) => {
  commFields.value = await getCommFieldsForTarget('token', { id: tokenId });
});

const commFieldsEmpty = computed(() => commFields.value === null);

watch(tokenId, (newTokenId) => {
  getCommFields(newTokenId);
});

</script>