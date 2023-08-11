import React from "react";
import "./header.css";
import mainLogo from "../icons/mainLogo.svg"
import statistics from "../icons/statistics.svg"
// import { Link} from "react-router-dom";
// import  "react-router-dom";

export function Header() {
  return (
    <div className="header">
        <img src={mainLogo} className="header__logo" alt="logo" />
        <img src={statistics} className="header__statistics" alt="statistics" />
    </div>
  )
}