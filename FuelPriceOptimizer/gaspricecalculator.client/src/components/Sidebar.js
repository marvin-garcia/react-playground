import React from "react";

const Sidebar = (props) => {
  const itemList = [
    {
      "name": "Stations",
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
          "name": "History",
          "href": "#",
        },
        {
          "name": "Add",
          "href": "#",
        },
      ],
    },
    {
      "name": "Optimizer",
      "icon": "bi calculator-fill",
      "options": [
        {
          "name": "History",
          "image": "assets/img/profile-img.jpg",
          "href": "#",
        },
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
        <li class="nav-heading">Pages</li>
        <li class="nav-item">
          <a class="nav-link collapsed" href="users-profile.html">
            <i class="bi bi-person"></i>
            <span>Profile</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link collapsed" href="pages-faq.html">
            <i class="bi bi-question-circle"></i>
            <span>F.A.Q</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link collapsed" href="pages-contact.html">
            <i class="bi bi-envelope"></i>
            <span>Contact</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link collapsed" href="pages-register.html">
            <i class="bi bi-card-list"></i>
            <span>Register</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link collapsed" href="pages-login.html">
            <i class="bi bi-box-arrow-in-right"></i>
            <span>Login</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link collapsed" href="pages-error-404.html">
            <i class="bi bi-dash-circle"></i>
            <span>Error 404</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link collapsed" href="pages-blank.html">
            <i class="bi bi-file-earmark"></i>
            <span>Blank</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;