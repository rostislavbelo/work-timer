import React, { useEffect, useRef, useState } from "react";
import "./statistics.css";
import tomato from "../icons/tomato.svg";
import tomatoSmall from "../icons/tomatoSmall.svg";
import { useStore } from "../store";
import { observer } from "mobx-react-lite";
import { changeWordEndings } from "../serviceFunctions/changeWordEndings";
import { useCloseModal } from "../hooks/useCloseModal";
import { JSX } from "react/jsx-runtime";

export const Statistics = observer(() => {

  //Текстовые константы
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
  const [day, setDay] = useState('');

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

  //Ативное сосотояние полей Фокус, Пауза, Стоп
  const [focusActive, setFocusActive] = useState('');
  const [pauseActive, setPauseActive] = useState('');
  const [stopActive, setStopActive] = useState('');

  //Высота элементов диаграммы
  const [heightElement, setHeightElemen] = useState([0, 0, 0, 0, 0, 0, 0]);

  //Масштабируемые значения линий диаграммы
  const [lineOne, setLineOne] = useState(<span>0</span>);
  const [lineTwo, setLineTwo] = useState(<span>0</span>);
  const [lineThree, setLineThree] = useState(<span>0</span>);
  const [lineFour, setLineFour] = useState(<span>0</span>);

  //Стор статистики
  const { statsStore } = useStore();

  //Закрытие фильтра по клику вне и esc
  let refFilter = useRef(null);
  useCloseModal(() => { setFilterActive(false) }, refFilter)

  useEffect(() => {
    //Текстовые константы
    const DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Cуббота'];

    const MINUTES_WORD = {
      firstState: 'минут',
      secondState: 'минуты',
      thirdState: 'минут',
      fourthState: 'минут',
    }

    const HOURS_WORD = {
      firstState: 'часов',
      secondState: 'часа',
      thirdState: 'часов',
      fourthState: 'часов',
    }

    //Сегодня
    let today = new Date();

    //Выделяем край вчерашнего дня - 23.59.59.999
    let yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59, 999).getTime();

    //Сегодняшний номер дня недели
    let dayWeekToday = today.getDay();

    //Сутки в миллисекундах 
    const MS_DAY = 86400000;

    //Получение обекта с недельными массивами: эта неделя, прошлая, позапрошлая
    function getWeeksGroops(list: [number, number][]) {

      function filterWeeks() {
        return {
          thisWeek: list.filter((element) => { return element[0] > data }),
          lastWeek: list.filter((element) => { return element[0] < data && element[0] > data - MS_DAY * 7 }),
          beforeLastWeek: list.filter((element) => { return element[0] < data - MS_DAY * 7 && element[0] > data - MS_DAY * 14 })
        };
      }

      let data: number;

      switch (dayWeekToday) {
        case 1:
          data = yesterday;
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
      let currentWeekPomodors = listPomodors.thisWeek;
      let currentWeekPauses = listPauses.thisWeek;
      let currentWeekStop = listStop.thisWeek;

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
      };

      function getTimeDay(typeEvent: number[][], day: number) {
        return typeEvent.filter((element) => {
          return new Date(element[0]).getDay() === day;
        });
      };

      let workToday = getTimeDay(currentWeekPomodors, selectDay);

      let pauseToday = getTimeDay(currentWeekPauses, selectDay);

      let stopToday = getTimeDay(currentWeekStop, selectDay);


      setStopCount(stopToday.length);

      if (stopToday.length > 0 && !isNaN(stopToday.length)) {
        setStopActive('active');
      } else { setStopActive('no-active') };

      workToday.forEach((element) => {
        resultWorkTime = resultWorkTime + (element[1] - element[0]);
      });


      let valuesTimeWork: number[] = [];

      //Вычисляем продолжительность рабочего времени для одного дня
      function getListValuesWeek(i: number) {
        let valueTimeDay: number = 0;
        getTimeDay(currentWeekPomodors, i).forEach((element) => {
          valueTimeDay = valueTimeDay + (element[1] - element[0]);
        });
        return valueTimeDay;
      }

      //Формируем массив значений времени для каждого дня текущей недели
      for (let i: number = 0; i <= 6; i++) {
        valuesTimeWork.push(getListValuesWeek(i))
      };

      //Вычисляем значение самого продуктивного рабочего дня - 100% на диаграмме.
      let maxValueWork = Math.floor(Math.max(...valuesTimeWork) / 1000);

      //Получаем значение высоты элементов диаграммы. 
      function getHeightElement() {
        if (isNaN(maxValueWork) || maxValueWork === 0) return [0, 0, 0, 0, 0, 0, 0];
        let heightElementDiagramm = valuesTimeWork.map((element) => { return Math.round(349 * (1 / (maxValueWork / (element / 1000)))) }) || [0, 0, 0, 0, 0, 0, 0];
        return heightElementDiagramm;
      }

      //Сетим значения высот
      setHeightElemen(getHeightElement());

      //Формируем масштабируемые подписи к линиям диаграммы
      function getValueDiagrammLine(time: number) {
        if (!maxValueWork) return <span>0</span>;
        let result = <span>0</span>;
        if (time === 0) {
          result = <span>0</span>
        }

        else if (time < 60) {
          result = <span>{`${Math.floor(time)} сек`}</span>
        }
        else if (time / 60 / 60 >= 1 && time / 60 % 60 !== 0) {
          result = <span><span>{`${Math.floor((time / 60 / 60))} ч`}</span> <span>{`${Math.round(time / 60 % 60)} мин`}</span></span>
        }
        else if (time / 60 / 60 < 1 && time / 60 % 60 !== 0) {
          result = <span>{`${Math.round(time / 60 % 60)} мин`}</span>
        }
        else if (time / 60 / 60 >= 1 && time / 60 % 60 === 0) {
          result = <span>{`${Math.floor((time / 60 / 60))} ч`}</span>
        }
        return result;
      }

      function getValueLineDiagramm() {
        const intervals = [maxValueWork, maxValueWork * 0.75, maxValueWork * 0.5, maxValueWork * 0.25];

        let result: React.SetStateAction<JSX.Element>[] = []

        intervals.forEach((value) => {
          result.push(getValueDiagrammLine(value));
        });

        setLineOne(result[0]);
        setLineTwo(result[1]);
        setLineThree(result[2]);
        setLineFour(result[3]);
      }

      getValueLineDiagramm();


      //Максимальный неучитываемый размер паузы в мс, паузы короче 3сек не учитываем в расчёте фокуса.  
      const pauseLimit = 3000;
      //Расчитываем время пауз
      pauseToday.forEach((element) => {
        if (element[1] - element[0] > pauseLimit) {
          resultPausesTime = resultPausesTime + (element[1] - element[0]);
        }
      });

      let totalTime = resultPausesTime + resultWorkTime;

      let calculateFocus = Math.round((1 / (totalTime / resultWorkTime) * 100)) || 0;

      if (Math.round(resultPausesTime / 1000 / 60) >= 1 && !isNaN(resultPausesTime)) {
        setPauseActive('active');
      } else { setPauseActive('no-active') };

      setFocus(calculateFocus);
      if (!isNaN(calculateFocus) && calculateFocus > 0) {
        setFocusActive('active');
      } else { setFocusActive('no-active'); }

      setTimePause(resultPausesTime / 1000);

      setCoumtPomodor(workToday.length);

      return resultWorkTime;
    };

    function getStringWorkTime() {
      let getTime = getWorkTimeDay();
      if (!getTime) return <div>Нет данных</div>;
      let time = getTime / 1000;
      let result = <div>Нет данных</div>;

      if (time === 0) {
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

  }, [selectDay, selectWeek, statsStore.pauseList, statsStore.pomodoroList, statsStore.stopList, timePause]);

  return (
    <section className="statistics">
      <div className="statistics__top">
        <h1>Ваша активность</h1>
        <div className="statistics__filter" id={String(filtrActive)} onClick={() => { setFilterActive(!filtrActive) }} ref={refFilter}>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 9L8 2L15 9" stroke="#B7280F" strokeWidth="2" />
          </svg>
          <span className="statistics__filter-current-value">{filtrCurrentValue}</span>
          {filtrActive && (<div className="statistics__filter-list">
            <button className="statistics__filter-btn"
              onClick={() => {
                setFilterCurrentValue(FILTER_ITEM_TITLES[0]);
                setSelectWeek('thisWeek');
              }}>
              {FILTER_ITEM_TITLES[0]}
            </button>
            <button className="statistics__filter-btn"
              onClick={() => {
                setFilterCurrentValue(FILTER_ITEM_TITLES[1]);
                setSelectWeek('lastWeek');
              }}>
              {FILTER_ITEM_TITLES[1]}
            </button>
            <button className="statistics__filter-btn"
              onClick={() => {
                setFilterCurrentValue(FILTER_ITEM_TITLES[2]);
                setSelectWeek('beforeLastWeek');
              }}>
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
          <div className="statistics__graph-line statistics__graph-line-1">{lineOne}</div>
          <div className="statistics__graph-line statistics__graph-line-2"><span>{lineTwo}</span></div>
          <div className="statistics__graph-line statistics__graph-line-3"><span>{lineThree}</span></div>
          <div className="statistics__graph-line statistics__graph-line-4"><span>{lineFour}</span></div>
          <div className="statistics__line-days">
            <div onClick={() => { setSelectDay(1) }} data-active={selectDay === 1 ? 'active' : ''}>Пн<span style={{ height: heightElement[1] + 'px' }}></span></div>
            <div onClick={() => { setSelectDay(2) }} data-active={selectDay === 2 ? 'active' : ''}>Вт<span style={{ height: heightElement[2] + 'px' }}></span></div>
            <div onClick={() => { setSelectDay(3) }} data-active={selectDay === 3 ? 'active' : ''}>Ср<span style={{ height: heightElement[3] + 'px' }}></span></div>
            <div onClick={() => { setSelectDay(4) }} data-active={selectDay === 4 ? 'active' : ''}>Чт<span style={{ height: heightElement[4] + 'px' }}></span></div>
            <div onClick={() => { setSelectDay(5) }} data-active={selectDay === 5 ? 'active' : ''}>Пт<span style={{ height: heightElement[5] + 'px' }}></span></div>
            <div onClick={() => { setSelectDay(6) }} data-active={selectDay === 6 ? 'active' : ''}>Сб<span style={{ height: heightElement[6] + 'px' }}></span></div>
            <div onClick={() => { setSelectDay(0) }} data-active={selectDay === 0 ? 'active' : ''}>Вс<span style={{ height: heightElement[0] + 'px' }}></span></div>
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
            <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M64.5 102C85.2107 102 102 85.2107 102 64.5C102 43.7893 85.2107 27 64.5 27C43.7893 27 27 43.7893 27 64.5C27 85.2107 43.7893 102 64.5 102Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M64.5 85C75.8218 85 85 75.8218 85 64.5C85 53.1782 75.8218 44 64.5 44C53.1782 44 44 53.1782 44 64.5C44 75.8218 53.1782 85 64.5 85Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

        </div>
        <div className="statistics__bottom-item pause" id={pauseActive}>
          <div>
            <p>Время на паузе</p>
            <span>{timePauseText}</span>
          </div>
          <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M64.3154 37.1579V64.3158L77.8944 77.8947" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="statistics__bottom-item stop-count" id={stopActive}>
          <div>
            <p>Остановки</p>
            <span>{stopCount}</span>
          </div>
          <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 27L102 101" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
});
