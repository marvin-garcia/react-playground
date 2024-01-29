import React, { useEffect } from 'react';
import * as Utils from './Utils';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';

import Login from './Login';
import { NavigationBar } from './NavigationBar';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

export const PageLayout = (props) => {
  const [breadcrumbTitle, setBreadcrumbTitle] = React.useState('Dashboard');
  const location = useLocation();
  
  useEffect(() => {
    setBreadcrumbTitle(Utils.CapitalizeWord(location.pathname.split('/')[1]));
  }, [location.pathname]);

  return (
    <>
      <AuthenticatedTemplate>
        <div>
          <div id="frame">
            <NavigationBar />
            <Sidebar sidebarOptions={props.sidebarOptions} />
          </div>
          <div class="pagetitle">
            <h1 id="main-frame">{breadcrumbTitle}</h1>
            <nav>
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/">Home</a></li>
                <li class="breadcrumb-item active">{breadcrumbTitle}</li>
              </ol>
            </nav>
          </div>
          <section id="main-section" class="section">
            {props.children}
          </section>
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
    </>
  );
};