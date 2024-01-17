import React, { useState } from 'react';

const Header = () => {
    const [notificationState, setNotificationState] = useState('');
    const [messageState, setMessageState] = useState('');
    const [profileState, setProfileState] = useState('');

    const onHeaderToggle = (item) => {
        console.log('item:', item);
        switch (item) {
            case 'notification':
                setNotificationState((prevState) => (prevState === '' ? 'show' : ''));
                setMessageState('');
                setProfileState('');
                break;
            case 'message':
                setMessageState((prevState) => (prevState === '' ? 'show' : ''));
                setNotificationState('');
                setProfileState('');
                break;
            case 'profile':
                setProfileState((prevState) => (prevState === '' ? 'show' : ''));
                setNotificationState('');
                setMessageState('');
                break;
            default:
                break;
        }
    };

    const Notifications = (props) => {
        const notifications = [
            {
                "title": "Lorem Ipsum",
                "content": "Quae dolorem earum veritatis oditseno",
                "time": "30 min. ago",
            },
            {
                "title": "Atque rerum nesciunt",
                "content": "Quae dolorem earum veritatis oditseno",
                "time": "1 hr. ago",
            },
            {
                "title": "Sit rerum fuga",
                "content": "Quae dolorem earum veritatis oditseno",
                "time": "2 hrs. ago",
            },
            {
                "title": "Dicta reprehenderit",
                "content": "Quae dolorem earum veritatis oditseno",
                "time": "4 hrs. ago",
            },
        ];

        return (
            <li class="nav-item dropdown">
                <a 
                    href="#"
                    class={`nav-link nav-icon ${notificationState}`} 
                    data-bs-toggle="dropdown" 
                    aria-expanded={`${notificationState === 'show' ? 'true' : 'false'}`}
                    // onClick={props.onClick}
                    onClick={() => props.onClick('notification')}
                >
                <i class="bi bi-bell"></i>
                <span class="badge bg-primary badge-number">{notifications.length}</span>
                </a>
                <ul 
                    className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications ${notificationState}`}
                    style={notificationState === 'show' ? 
                    { position: 'absolute', inset: '0px 0px auto auto', margin: '0px', transform: 'translate(-25px, 35px)', } 
                    : {}}
                    data-popper-placement={notificationState === 'show' ? 'bottom-end' : ''}
                >
                <li class="dropdown-header">
                    You have {notifications.length} new notifications
                    <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                </li>
                <li>
                    <hr class="dropdown-divider" />
                </li>
                {notifications.map((notification) => (
                    <div key={notifications.indexOf(notification)}>
                        <li class="notification-item">
                            <i class="bi bi-exclamation-circle text-warning"></i>
                            <div>
                                <h4>{notification.title}</h4>
                                <p>{notification.content}</p>
                                <p>{notification.time}</p>
                            </div>
                        </li>
                        <li>
                            <hr class="dropdown-divider" />
                        </li>
                    </div>
                ))}
                </ul>
            </li>
        );
    };

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
                <a 
                    href="#"
                    class={`nav-link nav-icon ${messageState}`}
                    data-bs-toggle="dropdown"
                    aria-expanded={`${messageState === 'show' ? 'true' : 'false'}`}
                    onClick={() => props.onClick('message')}
                >
                <i class="bi bi-chat-left-text"></i>
                <span class="badge bg-success badge-number">3</span>
                </a>
                <ul
                    class={`dropdown-menu dropdown-menu-end dropdown-menu-arrow messages ${messageState}`}
                    style={ messageState === 'show' ?
                    { position: 'absolute', inset: '0px 0px auto auto', margin: '0px', transform: 'translate(-16px, 38px)' }
                    : {}}
                    data-popper-placement={messageState === 'show' ? 'bottom-end' : ''}
                >
                <li class="dropdown-header">
                    You have {messages.length} new messages
                    <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                </li>
                <li>
                    <hr class="dropdown-divider" />
                </li>
                {messages.map((message) => (
                    <div key={messages.indexOf(message)}>
                        <li class="message-item">
                            <a href="#">
                            <img src={message.image} alt="" class="rounded-circle" />
                            <div>
                                <h4>{message.sender}</h4>
                                <p>{message.content}</p>
                                <p>{message.time}</p>
                            </div>
                            </a>
                        </li>    
                        <li>
                            <hr class="dropdown-divider" />
                        </li>
                    </div>
                ))}
                </ul>
            </li>
        );
    };

    const Profile = (props) => {
        const profileData = {
            "name": "John Smith",
            "role": "CEO & Founder",
            "image": "assets/img/profile-img.jpg",
        };

        return (
            <li class="nav-item dropdown pe-3">
                <a 
                    href="#"
                    class={`nav-link nav-profile d-flex align-items-center pe-0 ${profileState}`}
                    data-bs-toggle="dropdown"
                    aria-expanded={`${profileState === 'show' ? 'true' : 'false'}`}
                    onClick={() => props.onClick('profile')}
                >
                <img src={profileData.image} alt="Profile" class="rounded-circle" />
                <span class="d-none d-md-block dropdown-toggle ps-2">{profileData.name}</span>
                </a>
                <ul 
                    class={`dropdown-menu dropdown-menu-end dropdown-menu-arrow profile ${profileState}`}
                    style={ profileState === 'show' ?
                    { position: 'absolute', inset: '0px 0px auto auto', margin: '0px', transform: 'translate(-16px, 38px)' }
                    : {}}
                    data-popper-placement={profileState === 'show' ? 'bottom-end' : ''}
                >
                <li class="dropdown-header">
                    <h6>{profileData.name}</h6>
                    <span>{profileData.role}</span>
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
                    <a class="dropdown-item d-flex align-items-center" href="#">
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                    </a>
                </li>
                </ul>
            </li>
        );
    };

    return (
        <header id="header" class="header fixed-top d-flex align-items-center">
        <div class="d-flex align-items-center justify-content-between">
            <a href="index.html" class="logo d-flex align-items-center">
            <img src="assets/img/logo.png" alt="" />
            <span class="d-none d-lg-block">GasPriceEstimator</span>
            </a>
            <i class="bi bi-list toggle-sidebar-btn"></i>
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
                <Notifications onClick={onHeaderToggle} />
                <Messages onClick={onHeaderToggle} /> 
                <Profile onClick={onHeaderToggle} />
            </ul>
        </nav>
        </header>
  );
};

export default Header;