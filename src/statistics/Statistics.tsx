import React, { useEffect, useState } from "react";
import "./statistics.css";
import tomato from "../icons/tomato.svg";
import tomatoSmall from "../icons/tomatoSmall.svg";
import { useStore } from "../store";
import { observer } from "mobx-react-lite";
import { changeWordEndings } from "../serviceFunctions/changeWordEndings";

export const Statistics = observer(() => {
  const FILTER_ITEM_TITLES = [
    "Эта неделя",
    "Прошедшая неделя",
    "2 недели назад",
  ];

  const POMODORS_WORD = {
    firstState: 'помидоров',
    secondState: 'помидор',
    thirdState: 'помидора',
    fourthState: 'помидоров',
  }

  //Состояния дропдауна фильтра
  const [filtrCurrentValue, setFilterCurrentValue] = useState('Эта неделя');
  const [filtrActive, setFilterActive] = useState(false);

  //Выбор текущего дня недели
  const [day, setDay] = useState('Понедельник');
  
  //Количество рабочего времени в день
  const [timeWork, setTimeWork] = useState(<div>Нет данных</div>);

  //Выбор недельного периода
  const [selectWeek, setSelectWeek] = useState('thisWeek');

  //Выбор дня недели
  const [selectDay, setSelectDay] = useState(new Date().getDay());

  //Количество помидоров дня
  const [coumtPomodor, setCoumtPomodor] = useState(0);

  //Время на паузе
  const [timePause, setTimePause] = useState(0);

  //Строка в разметке - время на паузе
  const [timePauseText, setTimePauseText] = useState('0м');

  //Фокус (рабочее время / рабочее время + паузы)
  const [focus, setFocus] = useState(0);

  //Количество остановок
  const [stopCount, setStopCount] = useState(0);

  //Ативное сосотояние поля Фокус
  const [focusActive, setFocusActive] = useState('');
  const [pauseActive, setPauseActive] = useState('');
  const [stopActive, setStopActive] = useState('');

  //Стор статистики
  const { statsStore } = useStore();

  useEffect(() => {
    //Текстовые константы
    const DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Cуббота'];

     const MINUTES_WORD = {
      firstState: 'минут',
      secondState: 'минута',
      thirdState: 'минуты',
      fourthState: 'минут',
    }
  
    const HOURS_WORD = {
      firstState: 'часов',
      secondState: 'часа',
      thirdState: 'часа',
      fourthState: 'часов',
    }
    
    //Сегодня
    let today = new Date();

    //Выделяем край вчерашнего дня - 23.59.59.999
    let yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1, 23, 59, 59, 999).getTime();

    //Сегодняшний номер дня недели
    let dayWeekToday =  today.getDay();

    //Сутки в миллисекундах 
    const MS_DAY = 86400000;    

    //Получение обекта с недельными массивами: эта неделя, прошлая, позапрошлая
    function getWeeksGroops(list: [number, number][]) {      

      function filterWeeks() {
        return {thisWeek: list.filter((element) => {return element[0] > data}), 
        lastWeek: list.filter((element) => {return element[0] < data && element[0] > data - MS_DAY * 7}),
        beforeLastWeek: list.filter((element) => {return element[0] < data - MS_DAY * 7 && element[0] > data - MS_DAY * 14})};
      }

      let data:number;

      switch (dayWeekToday) {
        case 1:
          data = Date.now();
          return filterWeeks()
        case 2:
          data = yesterday - MS_DAY;
          return filterWeeks()
        case 3:
          data = yesterday - MS_DAY * 2;
          return filterWeeks()
        case 4:
          data = yesterday - MS_DAY * 3;  
          return filterWeeks()
        case 5:
          data = yesterday - MS_DAY * 4; 
          return filterWeeks()
        case 6:
          data = yesterday - MS_DAY * 5; 
          return filterWeeks()
        case 0:
          data = yesterday - MS_DAY * 6; 
          return filterWeeks()                                      
      }
    }

    setDay(DAYS[selectDay])

    let listPomodors = getWeeksGroops(statsStore.pomodoroList);
    let listPauses = getWeeksGroops(statsStore.pauseList);
    let listStop = getWeeksGroops(statsStore.stopList);
  
    function getWorkTimeDay() {
      if (!listPomodors || !listPauses || !listStop) return;
      let resultWorkTime = 0;
      let resultPausesTime = 0;
      let currentWeekPomodors =  listPomodors.thisWeek; 
      let currentWeekPauses =  listPauses.thisWeek; 
      let currentWeekStop =  listStop.thisWeek; 

      switch (selectWeek) {
        case 'thisWeek':
          currentWeekPomodors = listPomodors.thisWeek;
          currentWeekPauses = listPauses.thisWeek;
          currentWeekStop = listStop.thisWeek; 
          break
        case 'lastWeek':
          currentWeekPomodors = listPomodors.lastWeek;
          currentWeekPauses = listPauses.lastWeek;
          currentWeekStop = listStop.lastWeek; 
          break
        case 'beforeLastWeek':
          currentWeekPomodors = listPomodors.beforeLastWeek;
          currentWeekPauses = listPauses.beforeLastWeek;
          currentWeekStop = listStop.beforeLastWeek
          break
      }

      let workToday = currentWeekPomodors.filter((element) => {
        return new Date(element[0]).getDay() === selectDay;
        
      });

      let pauseToday = currentWeekPauses.filter((element) => {
        return new Date(element[0]).getDay() === selectDay;        
      });

      let stopToday = currentWeekStop.filter((element) => {
        return new Date(element[0]).getDay() === selectDay;        
      });


      setStopCount(stopToday.length);

      if (stopToday.length > 0 && !isNaN(stopToday.length)) {
        setStopActive('active');
      } else {setStopActive('no-active')};

      workToday.forEach((element) => {
        resultWorkTime = resultWorkTime + (element[1] - element[0]);
      })

      pauseToday.forEach((element) => {
        resultPausesTime = resultPausesTime + (element[1] - element[0]);
      })

      let totalTime = resultPausesTime + resultWorkTime;
      
      let calculateFocus = Math.round((1 / (totalTime / resultWorkTime) * 100)) || 0;


      if (resultPausesTime > 0 && !isNaN(resultPausesTime)) {
        setPauseActive('active');
      } else {setPauseActive('no-active')};

      setFocus(calculateFocus);
      if(!isNaN(calculateFocus) && calculateFocus > 0) {
        setFocusActive('active');
        console.log(calculateFocus)
       } else {setFocusActive('no-active');}

      setTimePause(resultPausesTime / 1000);

      setCoumtPomodor(workToday.length);

      return resultWorkTime;      
    };
   

    function getStringWorkTime() {
      let getTime = getWorkTimeDay();
      if (!getTime) return <div>Нет данных</div>;
      let time = getTime / 1000;
      let result = <div>Нет данных</div>;

      if(time === 0) {
        result = <div>Нет данных</div>
        } 
      if (time / 60 / 60 >= 1 && time / 60 % 60 !== 0) {
        result = <div>Вы работали над задачами в течение <span>{changeWordEndings(Math.floor((time / 60 / 60)), HOURS_WORD)}</span> <span>{changeWordEndings(Math.round(time / 60 % 60), MINUTES_WORD)}</span></div>
      }
      if (time / 60 / 60 < 1 && time / 60 % 60 !== 0) {
        result = <div>Вы работали над задачами в течение <span>{changeWordEndings(Math.round(time / 60 % 60), MINUTES_WORD)}</span></div>
      }
      if (time / 60 / 60 >= 1 && time / 60 % 60 === 0) {
        result = <div>Вы работали над задачами в течение <span>{changeWordEndings(Math.floor((time / 60 / 60)), HOURS_WORD)}</span></div>
      }
      return result;
    }

    setTimeWork(getStringWorkTime());

    function getStringPause() {
      let result = '0м';

      if (timePause / 60 / 60 >= 1 && timePause / 60 % 60 !== 0) {
        result = `${Math.floor((timePause / 60 / 60))}ч ${Math.round(timePause / 60 % 60)}м`
      }
      if (timePause / 60 / 60 < 1 && timePause / 60 % 60 !== 0) {
        result = `${Math.round(timePause / 60 % 60)}м`
      }
      if (timePause / 60 / 60 >= 1 && timePause / 60 % 60 === 0) {
        result = `${Math.floor((timePause / 60 / 60))}ч`
      }
      return result;
    }

    setTimePauseText(getStringPause());
  },[selectDay, selectWeek, statsStore.pauseList, statsStore.pomodoroList, statsStore.stopList, timePause]);


  return (
    <section className="statistics">
      <div className="statistics__top">
        <h1>Ваша активность</h1>
        <div className="statistics__filter" id={String(filtrActive)} onClick={() => {setFilterActive(!filtrActive)}}>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 9L8 2L15 9" stroke="#B7280F" strokeWidth="2"/>
          </svg>
          <span className="statistics__filter-current-value">{filtrCurrentValue}</span>
          {filtrActive && (<div className="statistics__filter-list">
            <button className="statistics__filter-btn" 
              onClick={() => {setFilterCurrentValue(FILTER_ITEM_TITLES[0]); 
              setSelectWeek('thisWeek')}}>
                {FILTER_ITEM_TITLES[0]}
            </button>
            <button className="statistics__filter-btn" 
              onClick={() => {setFilterCurrentValue(FILTER_ITEM_TITLES[1]); 
              setSelectWeek('lastWeek')}}>
                {FILTER_ITEM_TITLES[1]}
            </button>
            <button className="statistics__filter-btn" 
              onClick={() => {setFilterCurrentValue(FILTER_ITEM_TITLES[2]); 
              setSelectWeek('beforeLastWeek')}}>
                {FILTER_ITEM_TITLES[2]}
            </button>
          </div>)}
        </div>
      </div>
      <div className="statistics__center">
        <div className="statistics__day-stat">
          <div className="statistics__day-time">
            <p>{day}</p>
            {timeWork}
          </div>
          <div className="statistics__day-tasks">
            {coumtPomodor < 1 && (<img src={tomato} alt="Tomato" />)}
            {coumtPomodor > 0 && (<div className="statistics__day-tasks-info">
              <div className="statistics__img-info">
                <img src={tomatoSmall} alt="Tomato small" />
                <span>{`х ${coumtPomodor}`}</span>
              </div>
              <span>{changeWordEndings(coumtPomodor, POMODORS_WORD)}</span>
            </div>)}
          </div>
        </div>
        <div className="statistics__graph">
          <div className="statistics__graph-line"><span>1</span></div>
          <div className="statistics__graph-line"><span>1</span></div>
          <div className="statistics__graph-line"><span>1</span></div>
          <div className="statistics__graph-line"><span>1</span></div>
          <div className="statistics__line-days">
            <div onClick={() => {setSelectDay(1)}}>Пн<span></span></div>
            <div onClick={() => {setSelectDay(2)}}>Вт<span></span></div>
            <div onClick={() => {setSelectDay(3)}}>Ср<span></span></div>
            <div onClick={() => {setSelectDay(4)}}>Чт<span></span></div>
            <div onClick={() => {setSelectDay(5)}}>Пт<span></span></div>
            <div onClick={() => {setSelectDay(6)}}>Сб<span></span></div>
            <div onClick={() => {setSelectDay(0)}}>Вс<span></span></div>            
          </div>
        </div>
      </div>
      <div className="statistics__bottom-list">
        <div className="statistics__bottom-item focus" id={focusActive}>
          <div>
            <p>Фокус</p>
            <span>{focus}%</span>
          </div>
          <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M64.5 102C85.2107 102 102 85.2107 102 64.5C102 43.7893 85.2107 27 64.5 27C43.7893 27 27 43.7893 27 64.5C27 85.2107 43.7893 102 64.5 102Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M64.5 85C75.8218 85 85 75.8218 85 64.5C85 53.1782 75.8218 44 64.5 44C53.1782 44 44 53.1782 44 64.5C44 75.8218 53.1782 85 64.5 85Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

        </div>
        <div className="statistics__bottom-item pause" id={pauseActive}>
          <div>
            <p>Время на паузе</p>
            <span>{timePauseText}</span>
          </div>
          <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M64.3154 37.1579V64.3158L77.8944 77.8947" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="statistics__bottom-item stop-count"  id={stopActive}>
          <div>
            <p>Остановки</p>
            <span>{stopCount}</span>
          </div>
          <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28 27L102 101" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
});
