import React, { FormEvent } from "react";
import "./taskManager.css";
import { useStore } from "../store";
import { action } from "mobx";
import { observer } from "mobx-react-lite";

export function TaskManager() {
  const { tasksStore } = useStore();
  const handleSubmit = action((e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const value = formData.get("title")?.toString() || "";
    tasksStore.list.push({
      title: value,
      id: Date.now(),
    });
    console.log(tasksStore.list)
  });

  return (
    <div className="taskManager">
      <form action="#" onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Название задачи" />
        <button type="submit">Добавить</button>
      </form>
      <ul>      
        <li className="displaytodos">
          {tasksStore.list.map((l) => (
            <h3 className="card" key={l.id}>
              {l.title}
            </h3>
          ))}
        </li>
      </ul>
    </div>
  );
}
