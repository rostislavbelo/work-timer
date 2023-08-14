import React, { FormEvent, useState } from "react";
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
    tasksStore.list.push({
      title: value,
      id: Date.now(),
    });
  });

  const [count, setCount] = useState(1);
  
  const [popup, setPopup] = useState(false);

  const handlerPopup = function() {
    setPopup(true)
  }


  return (
    <div className="taskManager">
      <form action="#" onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Название задачи" required maxLength={30}/>
        <button className="taskManager__btn-add" type="submit">Добавить</button>
      </form>
      <ul className="taskManager__task-list" >      
          {tasksStore.list.map((l) => (
            <li className="taskManager__task" key={l.id}>
              <span className="taskManager__count">{count}</span>   
              <span className="taskManager__title">{l.title}</span>
              <div className="taskManager__menu">
                <button className="taskManager__btn" onClick={handlerPopup}>
                  <img src={threeDots} alt="Three dots" />
                </button>
                {popup && (<div className="taskManager__popup">
   

                </div>)}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
})
