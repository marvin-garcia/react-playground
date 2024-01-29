import React, { useState } from "react";
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { b2cPolicies } from '../authConfig';

const title = "FuelPriceOptimizer";

export const NavigationBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { instance, inProgress } = useMsal();
  const activeAccount = instance.getActiveAccount();
  
  const Notifications = (props) => {
    const notifications = [
      {
        "title": "Lorem Ipsum",
        "content": "Quae dolorem earum veritatis oditseno",
        "time": "30 min. ago",
        "type": "text-warning",
      },
      {
        "title": "Atque rerum nesciunt",
        "content": "Quae dolorem earum veritatis oditseno",
        "time": "1 hr. ago",
        "type": "text-danger",
      },
      {
        "title": "Sit rerum fuga",
        "content": "Quae dolorem earum veritatis oditseno",
        "time": "2 hrs. ago",
        "type": "text-success",
      },
      {
        "title": "Dicta reprehenderit",
        "content": "Quae dolorem earum veritatis oditseno",
        "time": "4 hrs. ago",
        "type": "text-primary",
      },
    ];

    return (
      <>
        <li class="nav-item dropdown">
          <a class="nav-link nav-icon" data-bs-toggle="dropdown">
            <i class="bi bi-bell"></i>
            <span class="badge bg-primary badge-number">4</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
            <li class="dropdown-header">
              You have {notifications.length} new notifications
              <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            {notifications.map((notification) => (
              <li key={notifications.indexOf(notification)} class="notification-item">
                <i class={`bi bi-exclamation-circle ${notification.type}`}></i>
                <div>
                  <h4>{notification.title}</h4>
                  <p>{notification.content}</p>
                  <p>{notification.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </li>
      </>
    );
  }

  const Messages = (props) => {
    const messages = [
      {
        "image": "assets/img/messages-1.jpg",
        "sender": "Maria Hudson",
        "content": "Velit asperiores et ducimus soluta repudiandae labore officia est ut...",
        "time": "4 hrs. ago",
      },
      {
        "image": "assets/img/messages-2.jpg",
        "sender": "Anna Nelson",
        "content": "Velit asperiores et ducimus soluta repudiandae labore officia est ut...",
        "time": "6 hrs. ago",
      },
      {
        "image": "assets/img/messages-3.jpg",
        "sender": "David Muldon",
        "content": "Velit asperiores et ducimus soluta repudiandae labore officia est ut...",
        "time": "8 hrs. ago",
      },
    ];

    return (
      <li class="nav-item dropdown">
        <a class="nav-link nav-icon" data-bs-toggle="dropdown">
          <i class="bi bi-chat-left-text"></i>
          <span class="badge bg-success badge-number">3</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
          <li class="dropdown-header">
            You have {messages.length} new messages
            <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          {messages.map((message) => (
            <li key={messages.indexOf(message)} class="message-item">
              <a href="#">
                <img src={message.image} alt="" class="rounded-circle" />
                <div>
                  <h4>{message.sender}</h4>
                  <p>{message.content}</p>
                  <p>{message.time}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  const Profile = (props) => {
    const profileData = {
      name: activeAccount.idTokenClaims.name,
      firstName: activeAccount.idTokenClaims.given_name,
    };

    const handleLogoutRedirect = () => {
      instance.logoutRedirect();
    };

    const handleProfileEdit = () => {
      if (inProgress === InteractionStatus.None) {
        instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile);
      }
    };

    return (
      <li class="nav-item dropdown pe-3">
        <a class="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown" href="#">
          <span class="d-none d-md-block dropdown-toggle ps-2">{profileData.firstName}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
          <li class="dropdown-header">
            <h6>{profileData.name}</h6>
            {profileData.role && <span>{profileData.role}</span>}
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <a class="dropdown-item d-flex align-items-center" href="users-profile.html">
              <i class="bi bi-person"></i>
              <span>My Profile</span>
            </a>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <a class="dropdown-item d-flex align-items-center" href="users-profile.html">
              <i class="bi bi-gear"></i>
              <span>Account Settings</span>
            </a>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <a class="dropdown-item d-flex align-items-center" href="pages-faq.html">
              <i class="bi bi-question-circle"></i>
              <span>Need Help?</span>
            </a>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <a class="dropdown-item d-flex align-items-center" onClick={handleLogoutRedirect} href="#">
              <i class="bi bi-box-arrow-right"></i>
              <span>Sign Out</span>
            </a>
          </li>
        </ul>
      </li>
    );
  }

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isSidebarOpen) {
      document.body.classList.remove("toggle-sidebar");
    }
    else {
      document.body.classList.add("toggle-sidebar");
    }
  };

  return (
    <div>
      <header id="header" class="header fixed-top d-flex align-items-center">
        <div class="d-flex align-items-center justify-content-between">
          <a href="/" class="logo d-flex align-items-center">
            <img src="assets/img/logo.png" alt="" />
            <span class="d-none d-lg-block">{title}</span>
          </a>
          <i class="bi bi-list toggle-sidebar-btn" onClick={handleToggleSidebar}></i>
        </div>
        <div class="search-bar">
          <form class="search-form d-flex align-items-center" method="POST" action="#">
            <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
            <button type="submit" title="Search"><i class="bi bi-search"></i></button>
          </form>
        </div>
        <nav class="header-nav ms-auto">
          <ul class="d-flex align-items-center">
            <li class="nav-item d-block d-lg-none">
              <a class="nav-link nav-icon search-bar-toggle " href="#">
                <i class="bi bi-search"></i>
              </a>
            </li>
            <Notifications />
            <Messages />
            <Profile />
          </ul>
        </nav>
      </header>
    </div>
  )
};
