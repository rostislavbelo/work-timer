import React from 'react';
import  './tasks.css';
import { TaskManager } from '../TaskManager';


export function Tasks() {
  return (
    <section className="tasks">
        <div className="tasks__task-block">
            <h1>Ура! Теперь можно начать работать:</h1>
            <ul>
                <li>{"Выберите категорию и напишите название текущей задачи"}</li>
                <li>{"Запустите таймер («помидор»)"}</li>
                <li>{"Работайте пока «помидор» не прозвонит"}</li>
                <li>{"Сделайте короткий перерыв (3-5 минут)"}</li>
                <li>{"Продолжайте работать «помидор» за «помидором», пока задача не будут выполнена. Каждые 4 «помидора» делайте длинный перерыв (15-30 минут)."}</li>
            </ul>
            <TaskManager />
        </div>
        <div className="tasks__timer-block">

        </div>

    </section>

  );
}
