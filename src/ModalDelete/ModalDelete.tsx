import React from 'react';
import  './modalDelete.css';
import iconX from "../icons/iconX.svg";
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { action } from 'mobx';

export const ModalDelete = observer(() => {

    const { modalStore } = useStore();
    const { tasksStore } = useStore();

    const handlerDelete = action((id:number) => {
        tasksStore.list.map((n, index) => n.id === id ? {...tasksStore.list.splice(index, 1)} : n);
        modalStore.id = 0;
    })


  return (
    <div className="modalDelete">
        <div className="modalDelete__block">
            <h1>Удалить задачу?</h1>
            <button className="modalDelete__close-top-btn" onClick={() => {modalStore.modal = false}}>
                <img src={iconX} alt="Plus" />  
            </button>
            <button className="modalDelete__main-btn" onClick={() => {handlerDelete(modalStore.id); modalStore.modal = false}}>Удалить</button>
            <button className="modalDelete__close-text-btn" onClick={() => {modalStore.modal = false}}>Отмена</button>
        </div>
    </div>
  );
});
