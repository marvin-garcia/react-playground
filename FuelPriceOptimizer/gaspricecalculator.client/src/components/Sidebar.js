import React from "react";

const Sidebar = (props) => {
  const itemList = [
    {
      "name": "Locations",
      "icon": "bi geo-alt-fill",
      "options": [
        {
          "name": "View",
          "href": "#",
        },
      ],
    },
    {
      "name": "Reports",
      "icon": "bi journal-text",
      "options": [
        {
          "name": "Summary",
          "href": "#",
        },
        {
          "name": "File History",
          "href": "#",
        },
        {
          "name": "Upload",
          "href": "#",
        },
      ],
    },
    {
      "name": "Optimizer",
      "icon": "bi calculator-fill",
      "options": [
        // {
        //   "name": "History",
        //   "image": "assets/img/profile-img.jpg",
        //   "href": "#",
        // },
        {
          "name": "Train",
          "image": "assets/img/profile-img.jpg",
          "href": "#",
        },
        {
          "name": "Predict",
          "image": "assets/img/profile-img.jpg",
          "href": "#",
        },
      ],
    },
  ];

  return (
    <aside id="sidebar" class="sidebar">
      <ul class="sidebar-nav" id="sidebar-nav">
        <li class="nav-item">
          <a class="nav-link " href="index.html">
            <i class="bi bi-grid"></i>
            <span>Dashboard</span>
          </a>
        </li>
        {itemList.map((item) => (
        <li key={itemList.indexOf(item)} class="nav-item">
          <a class="nav-link collapsed" data-bs-target={`#${item.name}-nav`} data-bs-toggle="collapse" href="#">
            <i class={item.icon}></i><span>{item.name}</span><i class="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id={`${item.name}-nav`} class="nav-content collapse " data-bs-parent="#sidebar-nav">
            {item.options.map((option) => (
            <li key={`${itemList.indexOf(item)}${item.options.indexOf(option)}}`}>
              <a href={option.href} onClick={() => props.onClick(`${item.name}.${option.name}`)}>
                <i class="bi bi-circle"></i><span>{option.name}</span>
              </a>
            </li>
            ))}
          </ul>
        </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;