import { ref } from 'vue';
import useArrayObjectFunctions from './ArrayObject';
import useGetModelRepository from './modelRepository';

const useAppointmentRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();
  const appointmentModel = modelRepository.getModel('Appointment');

  const { sortFieldsFunction } = useArrayObjectFunctions();

  const loading = ref(null);

  const getAllAppointments = (async () => {
    loading.value = true;
    const appointments = await appointmentModel.all({ per_page: 200 });
    loading.value = false;
    if (appointments) {
      return appointments.sort(sortFieldsFunction(['-start']));
    }
    return null;
  });

  return {
    loading,
    getAllAppointments,
  };
});

export default useAppointmentRepository;
