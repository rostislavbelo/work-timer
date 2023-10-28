import { makeAutoObservable } from "mobx";

export const tasksStore = () => {
  return makeAutoObservable({
    list: [] as {title: string; id: number; count:number, popup:boolean, rename:boolean, delete:boolean}[],
    timeWork: 0.18,
    timeBreak: 0.09,
  });
};

export default tasksStore;