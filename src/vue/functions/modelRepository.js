import ModelRepository from '../models/ModelRepository';
import useStore from '../stores/modelRepository';

const useGetModelRepository = (() => {
  const store = useStore();

  const initModelRepository = (() => {
    const modelRepository = new ModelRepository();
    store.setModelRepository(modelRepository);
  });

  const getModelRepository = (() => {
    if (store.modelRepository === null) {
      initModelRepository();
    }
    return store.modelRepository;
  });

  return {
    getModelRepository,
    initModelRepository,
  };
});
export default useGetModelRepository;
