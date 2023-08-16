import React, { FormEvent} from "react";
import "./taskManager.css";
import { useStore } from "../store";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import threeDots from "../icons/threeDots.svg"

export const TaskManager = observer(() => {
  const { tasksStore } = useStore();
  const handleSubmit = action((e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const value = formData.get("title")?.toString() || "";
    tasksStore.list = [...tasksStore.list, {
      title: value,
      id: Date.now(),
      count: 1,
      popup: false,
    }];
  });

  const handlerPopup = action((id:number) => {
    tasksStore.list = tasksStore.list.map(n => n.id === id ? { ...n, popup: !n.popup} : n)
  })

  const handlerPlus = action((id:number) => {
    tasksStore.list = tasksStore.list.map(n => n.id === id && n.count < 100 ? { ...n, count: n.count+1} : n)
  })

  const handlerMinus = action((id:number) => {
    tasksStore.list = tasksStore.list.map(n => n.id === id && n.count > 1 ? { ...n, count: n.count-1} : n)
  })

  return (
    <div className="taskManager">
      <form action="#" onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Название задачи" required maxLength={30}/>
        <button className="taskManager__btn-add" type="submit">Добавить</button>
      </form>
      <ul className="taskManager__task-list" >      
          {tasksStore.list.map((l) => (
            <li className="taskManager__task" key={l.id}>
              <span className="taskManager__count">{l.count}</span>   
              <span className="taskManager__title">{l.title}</span>
              <div className="taskManager__menu">
                <button className="taskManager__btn" onClick={()=>handlerPopup(l.id)}>
                  <img src={threeDots} alt="Three dots" />
                </button>
                {l.popup && (<div className="taskManager__popup">
                    <button onClick={()=>handlerPlus(l.id)}>Увеличить</button>
                    <button onClick={()=>handlerMinus(l.id)}>Уменьшить</button>
                    <button>Редактировать</button>
                    <button>Удалить</button>
                </div>)}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
})

