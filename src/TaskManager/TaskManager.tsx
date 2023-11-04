import React, { FormEvent, useEffect, useRef} from "react";
import "./taskManager.css";
import { useStore } from "../store";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import threeDots from "../icons/threeDots.svg";
import plus from "../icons/plus.svg";
import minusGray from "../icons/plusGray.svg";
import minus from "../icons/minus.svg";
import pen from "../icons/pen.svg";
import del from "../icons/delete.svg";
import { useCloseModal } from "../hooks/useCloseModal";
import { ModalDelete } from "../ModalDelete";
import { storeTasks } from "../serviceFunctions/keepLocalStorage";

export const TaskManager = observer(() => {

  const refInput = useRef<HTMLInputElement>(null);
  const refPopup = useRef<HTMLUListElement>(null);
  const refRename = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (refInput.current === null ) return;
    refInput.current.focus();
  }, [refInput]);

  const { tasksStore } = useStore();
  const { modalStore } = useStore();

  const handleSubmit = action((e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    let value = formData.get("title")?.toString() || "";
    tasksStore.list = [...tasksStore.list, {
      title: value,
      id: Date.now(),
      count: 1,
      popup: false,
      rename: false,
      delete: false,
      numberPomodor: 1,
      numberBreak: 1,
    }];
    if (refInput.current !== null) {
      refInput.current.value = '';
    };
    tasksStore.list = tasksStore.list.map(n => n = { ...n, popup: false});
    storeTasks('tasksStoreList', tasksStore.list);
  });

  const handlerPopup = action((id?:number) => {
    tasksStore.list = tasksStore.list.map(n => n.id === id ? { ...n, popup: !n.popup} : { ...n, popup: false});
    storeTasks('tasksStoreList', tasksStore.list);
  })

  const handlerPlus = action((id:number) => {
    tasksStore.list = tasksStore.list.map(n => n.id === id && n.count < 100 ? { ...n, count: n.count+1} : n);
    storeTasks('tasksStoreList', tasksStore.list);
  })

  const handlerMinus = action((id:number) => {
    tasksStore.list = tasksStore.list.map(n => n.id === id && n.count > 1 ? { ...n, count: n.count-1} : n);
    storeTasks('tasksStoreList', tasksStore.list);
  })

  const handlerModal = action((id:number) => {
    modalStore.modal = true;
    modalStore.id = id;
    tasksStore.list = tasksStore.list.map(n => n = { ...n, popup: false});
    storeTasks('tasksStoreList', tasksStore.list);
  })

  const handlerRename = action((id:number) => {
    tasksStore.list = tasksStore.list.map(n => n.id === id ? { ...n, rename: !n.rename} : n);
    tasksStore.list = tasksStore.list.map(n => n = { ...n, popup: false});
    if (refRename.current?.value === undefined) return;
    tasksStore.list = tasksStore.list.map(n => n.id === id && refRename.current?.value !== "" ? { ...n, title: String(refRename.current?.value)} : n);
    storeTasks('tasksStoreList', tasksStore.list);
  })

  useCloseModal(()=>handlerPopup(), refPopup);

  //const TIME_TASK_DEFAULT = 25;
  let counterTotal = 0;
  let timeTotal;

  function calculateTasks() {
    tasksStore.list.forEach((element) => {
      counterTotal += element.count;
    });

    timeTotal = counterTotal * tasksStore.timeWork;

    return timeTotal;
  }

  return (
    <div className="taskManager">
      <form action="#" onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Название задачи" required maxLength={40} ref={refInput}/>
        <button className="taskManager__btn-add" type="submit">Добавить</button>
      </form>
      <ul className="taskManager__task-list" ref={refPopup}>      
          {tasksStore.list.map((l) => (
            <li className="taskManager__task" key={l.id}>
              <span className="taskManager__count" data-count={l.count === 0 ? 'zero' : ''}>{l.count}</span>   
              <span className="taskManager__title">{l.title}
                {l.rename && (
                  <input type="text" placeholder={l.title} maxLength={40} ref={refRename} autoFocus onBlur={() => {handlerRename(l.id)}}></input>
                )}
              </span>
              <div className="taskManager__menu" >
                <button className="taskManager__btn" onClick={()=>handlerPopup(l.id)}>
                  <img src={threeDots} alt="Three dots" />
                </button>
                {l.popup && (<div className="taskManager__popup">
                    <button onClick={()=>{handlerPlus(l.id)}}> 
                    <img src={plus} alt="Plus" />            
                      Увеличить
                    </button>
                    <button onClick={()=>{handlerMinus(l.id)}} className={'pointer'+l.count}>                      
                      {l.count > 1 && (<img src={minus} alt="Minus" />)} 
                      {(l.count === 1 || l.count === 0) && (<img src={minusGray} alt="Minus no active" />)} 
                      Уменьшить
                    </button>                      
                    <button onClick={() => {handlerRename(l.id)}}>
                      <img src={pen} alt="Change" />
                      Редактировать
                    </button>
                    <button onClick={()=>handlerModal(l.id)}>
                      <img src={del} alt="Delete" />
                      Удалить
                    </button>
                </div>)}
              </div>
            </li>
          ))}
      </ul>
      {tasksStore.list.length > 0 && (<span className="taskManager__totalTime">{calculateTasks()} мин</span>)}      
      {modalStore.modal && (<ModalDelete />)}
    </div>
  );
})
