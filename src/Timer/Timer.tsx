import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./timer.css";
import iconPlus from "../icons/iconPlus.svg";
import service from "../icons/service.svg";
import iconX from "../icons/iconX.svg";
import { useStore } from "../store";
import { observer } from "mobx-react-lite";
import { action } from "mobx";
import { storeTasks } from "../serviceFunctions/keepLocalStorage";
import { useCloseModal } from "../hooks/useCloseModal";

export const Timer = observer(() => {
  //доступ к стору задач  
  const { tasksStore } = useStore(); 

  //доступ к стору статистики
  const { statsStore } = useStore();

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

  //Сохранение номера помидора выполняемой задачи
  const handlerPomodorNumberPlus = action(() => {
    tasksStore.list[0].numberPomodor = tasksStore.list[0].numberPomodor + 1;
    storeTasks('tasksStoreList', tasksStore.list);
  })

  //Сохранение номера паузы выполняемой задачи
  const handlerBreakNumberPlus = action(() => {
    tasksStore.list[0].numberBreak = tasksStore.list[0].numberBreak + 1;
    storeTasks('tasksStoreList', tasksStore.list);
  })

  //Фиксация времени начала/окончания помидоров
    const [startPomodor, setStartPomodor] = useState(0);

    function recordStartPomodor() {
        setStartPomodor(Date.now());        
    }

   const updatePomodoroList = action(() => {
    statsStore.pomodoroList.push([startPomodor, Date.now()]);
    storeTasks('pomodoroStoreList', statsStore.pomodoroList);
    setStartPomodor(0); 
  });

    //Фиксация времени начала/окончания пауз
    const [startPause, setStartPause] = useState(0);

    function recordStartPause() {
        setStartPause(Date.now());        
    }

   const updatePauseList = action(() => {
    statsStore.pauseList.push([startPause, Date.now()]);
    storeTasks('pauseStoreList', statsStore.pauseList);
    setStartPause(0); 
  })

    //Фиксация остановок
   const updatStopList = action(() => {
    statsStore.stopList.push([Date.now()]);
    storeTasks('stopStoreList', statsStore.stopList);
    setStartPause(0); 
  }); 
  
  const handlerMinus = action(() => {
    if (tasksStore.list[0].count >= 1) {
        tasksStore.list[0].count = tasksStore.list[0].count - 1; 
        storeTasks('tasksStoreList', tasksStore.list);
    }
  });

  //Автопереключение помидор/перерыв
  useEffect(() => {
    if (minCurrent === 0 && secCurrent === 0 && currentState === "working") {        
        setCurrentState("break-active");
        setTime(timeBreak);
        updatePomodoroList();
        setTimeout(() => {handlerMinus()}, 100)
        setTimeout(() => {handlerPomodorNumberPlus()}, 100)
    }
    if (minCurrent === 0 && secCurrent === 0 && currentState === "break-active") {
        setCurrentState("working");
        setTime(timeWork);
        setTimeout(() => {handlerBreakNumberPlus()}, 100);
        recordStartPomodor();
    }
  },[currentState, updatePomodoroList, minCurrent, secCurrent, timeBreak, timeWork, statsStore.pomodoroList, handlerMinus, handlerPomodorNumberPlus, handlerBreakNumberPlus]);

  //Фиксируем id первого (активного) помидора и обнуляем всё в таймере при его удалении. 
  let taskActive = tasksStore.list.slice()[0].id;
  useEffect(() => {
    setTimerPause(false);
    setTimerStart(false);
    setCurrentState("working-waiting");
    setTime(timeWork);
  },[taskActive, timeWork]);

  //Открытие попапа настроек
  const [settingPopup, setSettingPopup] = useState(false);

  //Закрытие попапа настроек по esc и клику вне.
  const refPopupSettings = useRef<HTMLDivElement>(null);
  useCloseModal(() => {setSettingPopup(false)}, refPopupSettings);
  
  //Состояние инпутов настройки таймера
  const [valuePomodor, setValuePomodor] = useState('');
  const [valuePause, setValuePause] = useState('')

  // Ограничения ввода в инпуты настроек таймера
  const MIN = 1;
  const MAX = 59;

  function checkInput(event: ChangeEvent<HTMLInputElement>, setValue: ((arg0: string) => void), handler: ((arg0: number) => void)) {
    if (isNaN(Number(event.target.value))) {
      return;
    }
    if (Number(event.target.value) > MAX) {
        setValue('59');      
        handler(59)} 
    else if (Number(event.target.value) < MIN) { 
        setValue('');
        handler(1)}
    else {setValue(event.target.value);
          handler(Number(event.target.value))
        };
  }

  function handleChangePomodor(event: ChangeEvent<HTMLInputElement>) {   
    checkInput(event, setValuePomodor, handlerChangeTimeWork);
  }
    
  function handleChangePause(event: ChangeEvent<HTMLInputElement>) {
    checkInput(event, setValuePause, handlerChangeTimeBreak);
  }

  //Фиксация  настроек в сторе
  const handlerChangeTimeWork = action((value:number) => {
    tasksStore.timeWork = value;
    storeTasks('storeTimeWork', tasksStore.timeWork);
  })

  const handlerChangeTimeBreak = action((value:number) => {
    tasksStore.timeBreak = value;
    storeTasks('storeTimeBreak', tasksStore.timeBreak);
  })

  return (
    <div className="timer" id={currentState}>
      <div className="timer__top">
        <span className="timer__title">{tasksStore.list[0].title}</span>
        {currentState.includes('working') && (<span className="timer__number">{`Помидор ${tasksStore.list[0].numberPomodor}`}</span>)}
        {currentState.includes("break") && (<span className="timer__number">{`Перерыв ${tasksStore.list[0].numberBreak}`}</span>)}
      </div>
      <div className="timer__settings" ref={refPopupSettings}>
        <button onClick={() => {setSettingPopup(!settingPopup)}}>
            <img src={service} alt="Service" />
        </button>
        {settingPopup && (<div className="timer__settings-popup">
           <label><input value={valuePomodor} placeholder={String(tasksStore.timeWork)} type="text" maxLength={2} title="Число от 1 до 59" onChange={handleChangePomodor} autoFocus pattern="[0-9]{2}" />Количество минут на 1 помидор</label>
           <label><input value={valuePause} placeholder={String(tasksStore.timeBreak)} type="text" maxLength={2} title="Число от 1 до 59" onChange={handleChangePause} pattern="[0-9]{2}" />Количество минут на 1 перерыв</label>  
           <button onClick={() => setSettingPopup(false)}><img src={iconX} alt="Plus" /></button>
        </div>)}
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
            plusTime();
          }}>
          <img src={iconPlus} alt="Plus" />
        </button>
        {tasksStore.list[0].count < 1 && (<div className="timer__notice"><span>Обратите внимание!</span><span>У выполняемой задачи закончились запланированные помидоры!</span></div>)}
      </div>      
      <div className="timer__controls">
        { currentState === "working-waiting" && <div className="timer__controls-waiting">
          <button
            className="timer__btn-start"
            onClick={() => {
              setTimerPause(false);
              setTimerStart(true);
              setCurrentState("working");
              recordStartPomodor();
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
                    recordStartPause();
                }}>Пауза</button>
              <button className="timer__btn-stop"
                    onClick={() => {
                    setTimerPause(false);
                    setTimerStart(false);
                    setCurrentState("working-waiting");
                    setTime(timeWork);
                    setStartPomodor(0);
                    updatStopList();
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
                    updatePauseList();
                }}>Продолжить</button>
                <button className="timer__btn-ready"
                onClick={() => {
                    handlerPomodorNumberPlus();
                    setTimerPause(false);
                    setTimerStart(false);
                    setCurrentState("working-waiting");
                    setTime(timeWork);
                    updatePauseList();
                    updatePomodoroList();
                    handlerMinus()
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
                        recordStartPause();
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
                    updatePauseList();
                }}>Продолжить</button>
                <button className="timer__btn-skip"
                   onClick={() => {
                    setTimerPause(false);
                    setTimerStart(false);
                    setCurrentState("working-waiting");
                    setTime(timeWork);
                    updatePauseList();
                }}>Пропустить</button>
            </div>
        )}
      </div>
    </div>
  );
});
