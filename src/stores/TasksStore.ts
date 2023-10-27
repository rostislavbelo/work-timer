import { makeAutoObservable } from "mobx";

export const tasksStore = () => {
  return makeAutoObservable({
    list: [] as {title: string; id: number; count:number, popup:boolean, rename:boolean, delete:boolean}[],
  });
};

export default tasksStore;