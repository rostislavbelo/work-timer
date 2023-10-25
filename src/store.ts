import { createContext, useContext } from "react";
import tasksStore from "./stores/TasksStore";
import modalStore from "./stores/ModalStore";

const store = {
  tasksStore: tasksStore(),
  modalStore: modalStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext<typeof store>(StoreContext);
};

export default store;