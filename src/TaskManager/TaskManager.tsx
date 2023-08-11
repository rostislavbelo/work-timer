import React from 'react';
import  './taskManager.css';


export function TaskManager() {
  return (
    <div className="taskManager">
        <form action="#">
            <input type="text" placeholder="Название задачи" />
            <button>Добавить</button>

        </form>


    </div>

  );
}