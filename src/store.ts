import { createContext, useContext } from "react";
import tasksStore from "./stores/TasksStore";

const store = {
  tasksStore: tasksStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext<typeof store>(StoreContext);
};

export default store;