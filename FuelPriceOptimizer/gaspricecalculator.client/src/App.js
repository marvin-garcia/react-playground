import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StationsView from './components/Stations';
import ReportsView, { ReportForm } from './components/Reports';

const backend_url = 'http://localhost:5299';

const App = () => {
  const [mainContent, setMainContent] = React.useState('Dashboard');
  const [breadcrumbTitle, setBreadcrumbTitle] = React.useState('Dashboard');

  const handleSidebarClick = (selection) => {
    selection = selection.replace(/\s/g, '');
    setBreadcrumbTitle(selection.split('.')[0]);

    switch (selection) {
      case 'Stations.View':
        setMainContent('Stations.View');
        break;
      case 'Reports.History':
        setMainContent('Reports.History');
        break;
      case 'Reports.Upload':
        setMainContent('Reports.Upload');
        break;
      case 'Optimizer.History':
        setMainContent('Optimizer.History');
        break;
      case 'Optimizer.Train':
        setMainContent('Optimizer.Train');
        break;
      case 'Optimizer.Predict':
        setMainContent('Optimizer.Predict');
        break;
      default:
        setMainContent('Dashboard');
        break;
    }
  };

  return (
    <div>
      <div id="frame">
        <Header />
        <Sidebar onClick={handleSidebarClick} />
      </div>
      <div class="pagetitle">
        <h1 id="main-frame">{breadcrumbTitle}</h1>
        <nav>
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="index.html">Home</a></li>
            <li class="breadcrumb-item active">{breadcrumbTitle}</li>
          </ol>
        </nav>
      </div>
      <section id="main-section" class="section">
        {mainContent === 'Stations.View' && <StationsView backend_url={backend_url} />}
        {mainContent === 'Reports.History' && <ReportsView backend_url={backend_url} />}
        {mainContent === 'Reports.Upload' && <ReportForm backend_url={backend_url} />}
      </section>
    </div>
  );
};

export default App;