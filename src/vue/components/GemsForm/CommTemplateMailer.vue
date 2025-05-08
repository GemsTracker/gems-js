<template>
  <div class="comm-template-mailer">
    <hr>
    <h3 class="fs-3">{{ t('Send test e-mail')}}</h3>
    <label for="test-email">E-mail</label>
    <input v-model="email" name="test-email" class="form-control" type="text" />&nbsp;
    <button class="btn" :disabled="!canEmail" @click.prevent="sendTestEmail">
      <loading-screen v-if="testMailSending" size="1rem" color="white" />
      Send test E-mail
    </button>
    &nbsp;<span v-if="submitInfo !== null" class="submitMessage"
          :class="`text-${submitInfo.status}`">
        <font-awesome-icon :icon="submitInfo.icon" />
        {{submitInfo.message}}
      </span>
    <hr>
  </div>
</template>
<script setup>

import {computed, onMounted, ref, watch} from 'vue';
import useGetModelRepository from '../../functions/modelRepository';
import LoadingScreen from '../Util/LoadingScreen.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

library.add(faCheck, faTimes);

const props = defineProps({
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  commTarget: {
    type: String,
    required: true,
  },
  fieldFilter: {
    type: Object,
    required: true,
  },
});

const { getModelRepository } = useGetModelRepository();
const modelRepository = getModelRepository();
const testCommunicationEmail = modelRepository.getEndpointModel(
    'test-communication-email',
    `test-communication-email`,
    [],
);

const renderedBody = ref(null);
const renderedSubject = ref(null);

const email = ref(null);

const canEmail = computed(() => {
  if (email.value !== null && renderedBody !== null && renderedSubject !== null) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(email.value)) {
      return true;
    }
  }
  return false;
});

const mailData = computed(() => {
  return {
    subject: props.subject,
    body: props.body,
    to: email.value,
    type: props.commTarget,
    id: props.fieldFilter.id ?? null,
    organizationId: props.fieldFilter.organizationId ?? null,
  };
});

const testMailSending = ref(false);
const submitInfo = ref(null);

const sendTestEmail = (async () => {
  testMailSending.value = true;
  const response = await testCommunicationEmail.insert(mailData.value);
  testMailSending.value = false;
  if (response !== null && 'status' in response) {
    if (response.status === 201 || response.status === 200) {
      submitInfo.value = {
        icon: 'check',
        status: 'success',
        message: t('E-mail sent'),
      };
    } else {
      if ('data' in response && 'error' in response.data) {
        if (response.data.error === 'validation_error') {
          let message = 'Validation errors';
          if ('message' in response.data) {
            message += ':';
            Object.keys(response.data.message).forEach((key) => {
              message += ` ${key}: ${response.data.message[key].join(', ')}`;
            });
          }
          submitInfo.value = {
            icon: 'times',
            status: 'danger',
            message
          };
        }
      }
    }
  }
});

</script>