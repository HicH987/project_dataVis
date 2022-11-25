import React from "react";
import usthbIcon from "../../assets/usthb-icon.png";
import appIcon from "../../assets/app-icon-white.png";
import "./header.scss";

export default function Header() {
  return (
    <header className="global-header">
      <div className="header-title">
        <img src={appIcon} className="app-icon" />
        <span className="app-name">Schedule-Map</span>
      </div>
      <div>
        <img src={usthbIcon} className="usthb-icon" />
        <span className="usthb-span">USTHB</span>
      </div>
    </header>
  );
}
