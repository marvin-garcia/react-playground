import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StationsView from './components/Stations';
import ReportFiles, { UploadReportForm, ReportSummary } from './components/Reports';
import OptimizerView, { ModelTrainerView, TrainingHistoryView } from './components/Optimizer';

const backend_url = process.env.REACT_APP_BACKEND_URL;

const App = () => {
  const [mainContent, setMainContent] = React.useState('Dashboard');
  const [breadcrumbTitle, setBreadcrumbTitle] = React.useState('Dashboard');

  const handleSidebarClick = (selection) => {
    selection = selection.replace(/\s/g, '');
    setBreadcrumbTitle(selection.split('.')[0]);

    switch (selection) {
      case 'Locations.View':
        setMainContent('Stations.View');
        break;
      case 'Reports.Summary':
        setMainContent('Reports.Summary');
        break;
      case 'Reports.FileHistory':
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
        {mainContent === 'Reports.Summary' && <ReportSummary backend_url={backend_url} />}
        {mainContent === 'Reports.History' && <ReportFiles backend_url={backend_url} />}
        {mainContent === 'Reports.Upload' && <UploadReportForm backend_url={backend_url} />}
        {mainContent === 'Optimizer.History' && <TrainingHistoryView backend_url={backend_url} />}
        {mainContent === 'Optimizer.Predict' && <OptimizerView backend_url={backend_url} />}
        {mainContent === 'Optimizer.Train' && <ModelTrainerView backend_url={backend_url} />}
      </section>
    </div>
  );
};

export default App;