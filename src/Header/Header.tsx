import React from "react";
import "./header.css";
import mainLogo from "../icons/mainLogo.svg"
import statistics from "../icons/statistics.svg"
import { NavLink } from "react-router-dom";
import  "react-router-dom";

export function Header() {
  return (
    <header className="header">
        <NavLink to="/"  className={({ isActive, isPending }) => isPending ? "noActive" : isActive ? "isActive" : "" }>
            <img src={mainLogo} className="header__logo" alt="logo" />
        </NavLink>
        <NavLink to="/stats/"  className={({ isActive, isPending }) => isPending ? "noActive" : isActive ? "isActive" : "" }>
            <img src={statistics} className="header__statistics" alt="statistics" />
        </NavLink>        
    </header>
  )
}