import { makeAutoObservable } from "mobx";

export const tasksStore = () => {

  let taskLocalSave = [];
  if (localStorage) {
    const storageTaskList = localStorage.getItem('tasksStoreList');
    if (storageTaskList) {
      taskLocalSave.push(...JSON.parse(storageTaskList));
    }
  }
  return makeAutoObservable({
    list: taskLocalSave || [] as { title: string; id: number; count: number, popup: boolean, rename: boolean, delete: boolean }[],
    timeWork: 0.18,
    timeBreak: 0.09,
  });
};

export default tasksStore;