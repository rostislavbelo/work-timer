import { makeAutoObservable } from "mobx";

export const tasksStore = () => {

  let taskLocalSave = [];
  let timeWorkSave: number = 25;
  let timeBreakSave: number = 5;
  let timeBigBreakSave: number = 15;
  if (localStorage) {
    const storageTaskList = localStorage.getItem('tasksStoreList');
    const storageTimeWork = localStorage.getItem('storeTimeWork');
    const storageTimeBreak = localStorage.getItem('storeTimeBreak');
    const storageTimeBigBreak = localStorage.getItem('storeTimeBigBreak');
    if (storageTaskList) {
      taskLocalSave.push(...JSON.parse(storageTaskList));
    }
    if (storageTimeWork) {
      timeWorkSave = JSON.parse(storageTimeWork);
    }
    if (storageTimeBreak) {
      timeBreakSave = JSON.parse(storageTimeBreak);
    }
    if (storageTimeBigBreak) {
      timeBigBreakSave = JSON.parse(storageTimeBigBreak);
    }
  }
  return makeAutoObservable({
    list: taskLocalSave || [] as { title: string; id: number | string; count: number, popup: boolean, rename: boolean, delete: boolean, numberPomodor: number, numberBreak: number }[],
    timeWork: timeWorkSave || 25 as number,
    timeBreak: timeBreakSave || 5 as number,
    timeBigBreak: timeBigBreakSave || 15 as number,
  });
};

export default tasksStore;