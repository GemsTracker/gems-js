<template>
  <ul v-if="isInvalid && messages.length > 1" class="errors alert alert-danger">
    <li v-for="(message, index) in messages" :key="index">
      {{message}}
    </li>
  </ul>
  <span v-else-if="isInvalid" class="errors alert alert-danger">
    {{messages[0]}}
    </span>
</template>
<script>
import { computed } from 'vue';

export default {
  props: ['validator', 'serverValidator'],
  setup(props) {
    const isInvalid = computed(() => {
      /* if ((props.validator && props.validator.$inValid)
        || (props.serverValidator && Object.keys(props.serverValidator).length)) {
        return true;
      } */
      if (props.validator && props.validator.$invalid) {
        return true;
      }
      if (props.serverValidator && Object.keys(props.serverValidator).length) {
        return true;
      }
      return false;
    });
    const messages = computed(() => {
      const combinedMessages = [];
      if (props.validator) {
        props.validator.$messages.forEach((message) => {
          combinedMessages.push(message);
        });
      }
      if (props.serverValidator) {
        props.serverValidator.messages.forEach((message) => {
          combinedMessages.push(message);
        });
      }

      return combinedMessages;
    });

    return {
      isInvalid,
      messages,
    };
  },
};
</script>
<style scoped lang="scss">
  .errors {
    display: inline-block;
    margin-left: 2rem;
    margin-bottom: 0;
    padding: .5rem 15px
  }
</style>
