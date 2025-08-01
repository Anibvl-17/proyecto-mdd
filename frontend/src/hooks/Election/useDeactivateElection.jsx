import { deactivateElection } from '@services/election.service.js';

export const useDeactivateElection = () => {
  const deactivate = async (id) => {
    try {
      await deactivateElection(id);
    } catch (error) {
      console.error("Error desactivando elección:", error);
    }
  };

  return { deactivateElection: deactivate };
};

export default useDeactivateElection;
