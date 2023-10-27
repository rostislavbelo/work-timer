import React, { useEffect, useState } from "react";
import "./timer.css";
import iconPlus from "../icons/iconPlus.svg";
import { useStore } from "../store";
import { observer } from "mobx-react-lite";

export const Timer = observer(() => {
  const DEFAULT_TIME_WORK = 0.18;
  //const DEFAULT_TIME_BREAK = 0.09;

  let timeWork = DEFAULT_TIME_WORK * 60;

  let [timerPause, setTimerPause] = useState(false);
  const [timerStart, setTimerStart] = useState(false);
  const [time, setTime] = useState(timeWork);
  const [currentState, setCurrentState] = useState('waiting');

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
    if (time >= 59*60) return;
    setTime(time + 60);
  }

  const { tasksStore } = useStore();
  
  return (
    <div className="timer" id={currentState}>
      <div className="timer__top">
        <span className="timer__title">{tasksStore.list[0].title}</span>
        <span className="timer__number">Текст2</span>
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
        { currentState === "waiting" && <div className="timer__controls-waiting">
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
              <button className="timer__btn-stop">Стоп</button>
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
                <button className="timer__btn-ready">Сделано</button>
            </div>
        )}
        {currentState === "XXXXXX" && ( 
            <div className="timer__controls-break">
                <button className="timer__btn-pause">Пауза</button>
                <button className="timer__btn-skip">Пропустить</button>
            </div>
        )}
        {currentState === "XXXXXX" && (    
            <div className="timer__controls-break-pause">
                <button className="timer__btn-continue">Продолжить</button>
                <button className="timer__btn-skip">Пропустить</button>
            </div>
        )}
      </div>
    </div>
  );
});
