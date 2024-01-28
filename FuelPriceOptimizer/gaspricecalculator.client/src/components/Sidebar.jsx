import React from "react";
import { Link } from "react-router-dom";

const Sidebar = (props) => {
  return (
    <aside id="sidebar" class="sidebar">
      <ul class="sidebar-nav" id="sidebar-nav">
        <li class="nav-item">
          <a class="nav-link " href="/">
            <i class="bi bi-grid"></i>
            <span>Dashboard</span>
          </a>
        </li>
        {props.sidebarOptions.map((item) => (
          <li key={props.sidebarOptions.indexOf(item)} class="nav-item">
            <a class="nav-link collapsed" data-bs-target={`#${item.name}-nav`} data-bs-toggle="collapse" href="#">
              <i class={item.icon}></i><span>{item.name}</span><i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id={`${item.name}-nav`} class="nav-content collapse " data-bs-parent="#sidebar-nav">
              {item.options.map((option) => (
                <li key={`${props.sidebarOptions.indexOf(item)}${item.options.indexOf(option)}}`}>
                  <Link to={option.link}>
                    <i class="bi bi-circle"></i><span>{option.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))
        }
      </ul >
    </aside >
  );
};

export default Sidebar;