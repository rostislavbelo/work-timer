import { makeAutoObservable } from "mobx";
export const statsStore = () => {
    let pomodoroListSave = [];
    let pauseListSave = [];
    let stopListSave = [];
    if (localStorage) {
      const storagePomodoroList = localStorage.getItem('pomodoroStoreList');
      const storagePauseList = localStorage.getItem('pauseStoreList');
      const storageStopList = localStorage.getItem('stopStoreList');
      if (storagePomodoroList) {
        pomodoroListSave.push(...JSON.parse(storagePomodoroList));
      }
      if (storagePauseList) {
        pauseListSave.push(...JSON.parse(storagePauseList));
      }
      if (storageStopList) {
        stopListSave.push(...JSON.parse(storageStopList));
      }
    }

    return makeAutoObservable({
      pomodoroList: pomodoroListSave || [] as [number, number] [],
      pauseList: pauseListSave || [] as [number, number] [],
      stopList: stopListSave || [] as number[],
    });
  };
  
  export default statsStore;