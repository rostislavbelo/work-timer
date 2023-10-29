import React, { useState } from "react";
import "./statistics.css";
import tomato from "../icons/tomato.svg";
import tomatoSmall from "../icons/tomatoSmall.svg";

export function Statistics() {

  const FILTER_ITEM_TITLES = [
    "Эта неделя",
    "Прошедшая неделя",
    "2 недели назад"
  ]

  const [filtrCurrentValue, setFilterCurrentValue] = useState('Эта неделя');
  const [filtrActive, setFilterActive] = useState(false);


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
            <button className="statistics__filter-btn" onClick={() => {setFilterCurrentValue(FILTER_ITEM_TITLES[0])}}>{FILTER_ITEM_TITLES[0]}</button>
            <button className="statistics__filter-btn" onClick={() => {setFilterCurrentValue(FILTER_ITEM_TITLES[1])}}>{FILTER_ITEM_TITLES[1]}</button>
            <button className="statistics__filter-btn" onClick={() => {setFilterCurrentValue(FILTER_ITEM_TITLES[2])}}>{FILTER_ITEM_TITLES[2]}</button>
          </div>)}
        </div>
      </div>
      <div className="statistics__center">
        <div className="statistics__day-stat">
          <div className="statistics__day-time">
            <p>Воскресенье</p>
            <span>Нет данных</span>
          </div>
          <div className="statistics__day-tasks">
            {/* <img src={tomato} alt="Tomato" /> */}
            <div className="statistics__day-tasks-info">
              <div className="statistics__img-info">
                <img src={tomatoSmall} alt="Tomato small" />
                <span>х 2</span>
              </div>
              <span>2 помидора</span>
            </div>
          </div>
        </div>
        <div className="statistics__graph">
          <div className="statistics__graph-line"><span>1</span></div>
          <div className="statistics__graph-line"><span>1</span></div>
          <div className="statistics__graph-line"><span>1</span></div>
          <div className="statistics__graph-line"><span>1</span></div>
          <div className="statistics__line-days">
            <div>Пн<span></span></div>
            <div>Вт<span></span></div>
            <div>Ср<span></span></div>
            <div>Чт<span></span></div>
            <div>Пт<span></span></div>
            <div>Сб<span></span></div>
            <div>Вс<span></span></div>            
          </div>
        </div>
      </div>
      <div className="statistics__bottom-list">
        <div className="statistics__bottom-item">
          <div>
            <p>Фокус</p>
            <span>10%</span>
          </div>
          <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M64.5 102C85.2107 102 102 85.2107 102 64.5C102 43.7893 85.2107 27 64.5 27C43.7893 27 27 43.7893 27 64.5C27 85.2107 43.7893 102 64.5 102Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M64.5 85C75.8218 85 85 75.8218 85 64.5C85 53.1782 75.8218 44 64.5 44C53.1782 44 44 53.1782 44 64.5C44 75.8218 53.1782 85 64.5 85Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

        </div>
        <div className="statistics__bottom-item">
          <div>
            <p>Время на паузе</p>
            <span>10м</span>
          </div>
          <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M64.3154 37.1579V64.3158L77.8944 77.8947" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

        </div>
        <div className="statistics__bottom-item">
          <div>
            <p>Остановки</p>
            <span>3</span>
          </div>
          <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28 27L102 101" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
