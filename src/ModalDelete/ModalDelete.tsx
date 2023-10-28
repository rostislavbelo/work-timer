import React, { useRef } from "react";
import "./modalDelete.css";
import iconX from "../icons/iconX.svg";
import { observer } from "mobx-react-lite";
import { useStore } from "../store";
import { action } from "mobx";
import { useCloseModal } from "../hooks/useCloseModal";
import { storeTasks } from "../serviceFunctions/keepLocalStorage";

export const ModalDelete = observer(() => {

    const { modalStore } = useStore();
    const { tasksStore } = useStore();

    const handlerDeleteTask = action((id: number) => {
        tasksStore.list =  tasksStore.list.slice().filter((number) => id !== number.id);
        modalStore.id = 0;
        storeTasks('tasksStoreList', tasksStore.list);
    });

    const handlerCloseModal = action(() => {
        modalStore.modal = false;
    });

    function closeModal() {
        if (modalStore.modal) {
            handlerCloseModal();
        }        
    }

    const refBlock = useRef<HTMLDivElement>(null);
    useCloseModal(() => closeModal(), refBlock);

  return (
    <div className="modalDelete" id={String(modalStore.modal)}>
      <div className="modalDelete__block" ref={refBlock}>
        <h2>Удалить задачу?</h2>
        <button
          className="modalDelete__close-top-btn"
          onClick={() => {
            handlerCloseModal()
          }}>
          <img src={iconX} alt="Plus" />
        </button>
        <button
          className="modalDelete__main-btn"
          onClick={() => {
            handlerDeleteTask(modalStore.id);
            handlerCloseModal()
          }}>
          Удалить
        </button>
        <button
          className="modalDelete__close-text-btn"
          onClick={() => {handlerCloseModal()}}>
          Отмена
        </button>
      </div>
    </div>
  );
});
