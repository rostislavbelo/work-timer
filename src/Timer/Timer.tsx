import React, { useEffect, useState } from "react";
import "./timer.css";
import iconPlus from "../icons/iconPlus.svg";
import { useStore } from "../store";
import { observer } from "mobx-react-lite";

export const Timer = observer(() => {
  //доступ к стору задач  
  const { tasksStore } = useStore(); 

//   const DEFAULT_TIME_WORK = 0.18;
//   const DEFAULT_TIME_BREAK = 0.09;

  //Значение типового времени задачи в секундах
  let timeWork = tasksStore.timeWork * 60;

  //Значение типового времени перерыва в секундах
  let timeBreak = tasksStore.timeBreak * 60;

  let [timerPause, setTimerPause] = useState(false);
  const [timerStart, setTimerStart] = useState(false);
  const [time, setTime] = useState(timeWork);
  const [currentState, setCurrentState] = useState('working-waiting');

  let secCurrent = Math.floor(time % 60);
  let minCurrent = Math.floor((time / 60) % 60);

  let i = time;

  useEffect(() => {
    if (!timerStart) return;
    let id = setInterval(function () {
      i--;
      if (i < 0 || timerPause) {
        clearInterval(id);
      } else {
        setTime(i);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [i, timerPause, timerStart]);

  // Прибавление по 1 минуте к текущему времени. 
  function plusTime() {
    if (time >= 59 * 60) return;
    setTime(time + 60);
  }

  //Счетчик помидоров
  const [numberPomodor, setNumberPomodor] = useState(1);

  //Счетчик перерывов
  const [numberBreak, setNumberBreak] = useState(1);

  //Автопереключение помидор/пауза
  useEffect(() => {
    if (minCurrent === 0 && secCurrent === 0 && currentState === "working") {
        setCurrentState("break-active");
        setTime(timeBreak);
        setNumberPomodor(numberPomodor + 1);
    }
    if (minCurrent === 0 && secCurrent === 0 && currentState === "break-active") {
        setCurrentState("working");
        setTime(timeWork);
        setNumberBreak(numberBreak + 1);
    }
  },[currentState, minCurrent, numberBreak, numberPomodor, secCurrent, timeBreak, timeWork]);

  //Фиксируем id первого (активного) помидора и обнуляем всё в таймере при его удалении. 
  let taskActive = tasksStore.list.slice()[0].id;
  useEffect(() => {
    setTimerPause(false);
    setTimerStart(false);
    setCurrentState("working-waiting");
    setTime(timeWork);
    setNumberPomodor(1);
    setNumberBreak(1)
  },[taskActive, timeWork]);


  return (
    <div className="timer" id={currentState}>
      <div className="timer__top">
        <span className="timer__title">{tasksStore.list[0].title}</span>
        {currentState.includes('working') && (<span className="timer__number">{`Помидор ${numberPomodor}`}</span>)}
        {currentState.includes("break") && (<span className="timer__number">{`Перерыв ${numberBreak}`}</span>)}
      </div>
      <div className="timer__clock">
        <div className="timer__display">
          <span className="timer__display-min">
            {("0" + minCurrent).slice(-2)}
          </span>
          <span className="timer__display-separator">:</span>
          <span className="timer__display-sec">
            {("0" + secCurrent).slice(-2)}
          </span>
        </div>
        <button
          className="timer__btn-plus"
          onClick={() => {
            plusTime()
          }}>
          <img src={iconPlus} alt="Plus" />
        </button>
      </div>
      <div className="timer__controls">
        { currentState === "working-waiting" && <div className="timer__controls-waiting">
          <button
            className="timer__btn-start"
            onClick={() => {
              setTimerPause(false);
              setTimerStart(true);
              setCurrentState("working");
            }}>Cтарт</button>
          <button className="timer__btn-stop">Стоп</button>
        </div>}
        {currentState === "working" && (    
            <div className="timer__controls-working-work">
              <button className="timer__btn-pause"
                onClick={() => {
                    setTimerStart(false);
                    setTimerPause(true);
                    setCurrentState("working-pause");
                }}>Пауза</button>
              <button className="timer__btn-stop"
                    onClick={() => {
                    setTimerPause(false);
                    setTimerStart(false);
                    setCurrentState("working-waiting");
                    setTime(timeWork);
                }}>Стоп</button>
            </div>
        )}
        {currentState === "working-pause" && (   
            <div className="timer__controls-working-pause">
                <button className="timer__btn-continue"
                    onClick={() => {
                    setTimerPause(false);
                    setTimerStart(true);
                    setCurrentState("working");
                }}>Продолжить</button>
                <button className="timer__btn-ready"
                onClick={() => {
                    setNumberPomodor(numberPomodor + 1);
                    setTimerPause(false);
                    setTimerStart(false);
                    setCurrentState("working-waiting");
                    setTime(timeWork);
                }}>Сделано</button>
            </div>
        )}
        {currentState === "break-active" && ( 
            <div className="timer__controls-break">
                <button className="timer__btn-pause"
                    onClick={() => {
                        setTimerStart(false);
                        setTimerPause(true);
                        setCurrentState("break-pause");
                    }}>Пауза</button>
                <button className="timer__btn-skip"
                   onClick={() => {
                    setTimerStart(false);
                    setCurrentState("working-waiting");
                    setTime(timeWork);
                }}>Пропустить</button>
            </div>
        )}
        {currentState === "break-pause" && (    
            <div className="timer__controls-break-pause">
                <button className="timer__btn-continue"
                    onClick={() => {
                    setTimerStart(true);
                    setTimerPause(false);
                    setCurrentState("break-active");
                }}>Продолжить</button>
                <button className="timer__btn-skip"
                   onClick={() => {
                    setTimerPause(false);
                    setTimerStart(false);
                    setCurrentState("working-waiting");
                    setTime(timeWork);
                }}>Пропустить</button>
            </div>
        )}
      </div>
    </div>
  );
});
