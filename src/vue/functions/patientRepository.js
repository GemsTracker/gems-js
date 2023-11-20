import { computed, ref, watch } from 'vue';
import usePatientStore from '../stores/patientStore';
import useGetModelRepository from './modelRepository';

const usePatientRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();
  const patientModel = modelRepository.getModel('Patient');

  const patientStore = usePatientStore();

  const loading = ref(null);
  const patientNr = computed(() => patientStore.patientNr);

  const patientOrgCombination = computed(() => `${patientStore.patientNr}@${patientStore.organizationId}`);

  const patientData = ref(null);

  const getPatientData = (async () => {
    loading.value = true;
    patientData.value = await patientModel.find();
    loading.value = false;
    return patientData.value;
  });

  watch(patientOrgCombination, () => {
    getPatientData();
  });

  const organization = computed(() => {
    if (patientData.value && 'managingOrganization' in patientData.value
      && 'display' in patientData.value.managingOrganization) {
      return patientData.value.managingOrganization.display;
    }
    return null;
  });

  const familyName = computed(() => {
    if (patientData.value && 'name' in patientData.value && patientData.value.name.length
      && 'family' in patientData.value.name[0]) {
      return patientData.value.name[0].family;
    }
    return null;
  });

  const givenName = computed(() => {
    if (patientData.value && 'name' in patientData.value && patientData.value.name.length
      && 'given' in patientData.value.name[0]) {
      return patientData.value.name[0].given;
    }
    return null;
  });

  const fullName = computed(() => {
    const nameParts = [];
    if (givenName.value !== null) {
      nameParts.push(givenName.value);
    }
    if (familyName.value !== null) {
      nameParts.push(familyName.value);
    }
    if (nameParts.length) {
      return nameParts.join(' ');
    }
    return null;
  });

  const gender = computed(() => {
    if (patientData.value && 'gender' in patientData.value) {
      return patientData.value.gender;
    }
    return null;
  });

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  };

  const birthDate = computed(() => {
    if (patientData.value && 'birthDate' in patientData.value && patientData.value.birthDate !== null) {
      return new Date(patientData.value.birthDate);
    }
    return null;
  });

  const age = computed(() => {
    if (birthDate.value !== null) {
      return calculateAge(birthDate.value);
    }
    return null;
  });

  const birthdayYear = computed(() => {
    if (birthDate.value !== null) {
      return birthDate.value.getFullYear();
    }
    return null;
  });

  const birthdayDmy = computed(() => {
    if (birthDate.value !== null) {
      const month = `${birthDate.value.getMonth() + 1}`.padStart(2, '0');
      const day = `${birthDate.value.getDate()}`.padStart(2, '0');
      return `${day}-${month}-${birthDate.value.getFullYear()}`;
    }
    return null;
  });

  const birthdayYmd = computed(() => {
    if (birthDate.value !== null) {
      const month = `${birthDate.value.getMonth() + 1}`.padStart(2, '0');
      const day = `${birthDate.value.getDate()}`.padStart(2, '0');
      return `${birthDate.value.getFullYear()}-${month}-${day}`;
    }
    return null;
  });

  const email = computed(() => {
    let emailAddress = null;
    if (patientData.value && 'telecom' in patientData.value) {
      patientData.value.telecom.forEach((contactInfo) => {
        if ('system' in contactInfo && contactInfo.system === 'email') {
          emailAddress = contactInfo.value;
        }
      });
    }
    return emailAddress;
  });

  const emailInfo = computed(() => {
    let emailAddress = null;
    if (patientData.value && 'telecom' in patientData.value) {
      patientData.value.telecom.forEach((contactInfo) => {
        if ('system' in contactInfo && contactInfo.system === 'email') {
          emailAddress = contactInfo;
        }
      });
    }
    return emailAddress;
  });

  const phoneNumber = computed(() => {
    let number = null;
    let use = null;
    if (patientData.value && 'telecom' in patientData.value) {
      patientData.value.telecom.forEach((contactInfo) => {
        if ('system' in contactInfo && contactInfo.system === 'phone' && use !== 'mobile') {
          number = contactInfo.value;
          use = contactInfo.use;
        }
      });
    }
    return number;
  });

  const phoneNumbers = computed(() => {
    if (patientData.value && 'telecom' in patientData.value) {
      return patientData.value.telecom
        .filter((telecomItem) => 'system' in telecomItem && telecomItem.system === 'phone')
        .sort((telecomItem) => {
          if (telecomItem.use === 'mobile') {
            return -1;
          }
          return 1;
        });
    }
    return [];
  });

  const active = computed(() => {
    if (patientData.value && 'active' in patientData.value) {
      return patientData.value.active;
    }
    return null;
  });

  return {
    age,
    birthDate,
    birthdayDmy,
    birthdayYear,
    birthdayYmd,
    email,
    emailInfo,
    familyName,
    fullName,
    gender,
    givenName,
    getPatientData,
    loading,
    organization,
    patientNr,
    phoneNumber,
    phoneNumbers,
    active,
  };
});

export default usePatientRepository;
