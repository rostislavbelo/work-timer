import { makeAutoObservable } from "mobx";

export const tasksStore = () => {
  return makeAutoObservable({
    list: [] as { title: string; id: number }[],
  });
};

export default tasksStore;