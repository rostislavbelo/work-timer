import { makeAutoObservable } from "mobx";

export const modalStore = () => {
  return makeAutoObservable({
    modal: false,
    id: 0,
  });
};

export default modalStore;