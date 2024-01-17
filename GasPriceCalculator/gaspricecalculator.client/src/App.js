import React, { useState } from 'react';
import './App.css';
import VerticalNavbar from './components/VerticalNavbar';
import HorizontalNavbar from './components/HorizontalNavbar';
import StationGrid from './components/StationGrid';
import ReportFileGrid from './components/ReportFileGrid';

const NavbarOptions = [
  {
    name: 'History',
    isSelected: true,
    verticalOptions: [
      {
        name: 'Stations',
        href: '#',
        isSelected: false,
      },
      {
        name: 'Reports',
        href: '#',
        isSelected: false,
      },
    ],
  },
  {
    name: 'Forecast',
    isSelected: false,
    verticalOptions: [
      {
        name: 'Price estimator',
        href: '#',
        isSelected: false,
      },
    ],
  },
];

const App = () => {
  const [navbarMenu, setNavbarMenu] = useState(NavbarOptions);

  const resetAndSelectOption = (horizontalSelection, verticalSelection = null) => {
    const updatedNavbarOptions = navbarMenu.map(option => ({
      ...option,
      isSelected: false,
      verticalOptions: option.verticalOptions.map(verticalOption => ({
        ...verticalOption,
        isSelected: false,
      })),
    }));

    const horizontalIndex = updatedNavbarOptions.findIndex(option => option.name === horizontalSelection.name);
    updatedNavbarOptions[horizontalIndex].isSelected = true;

    if (verticalSelection) {
      const verticalIndex = updatedNavbarOptions[horizontalIndex].verticalOptions.findIndex(option => option.name === verticalSelection.name);
      updatedNavbarOptions[horizontalIndex].verticalOptions[verticalIndex].isSelected = true;
    }

    return updatedNavbarOptions;
  };

  const RenderBody = () => {
    const horizontalSelection = navbarMenu.find(option => option.isSelected);
    const verticalOption = horizontalSelection?.verticalOptions.find(option => option.isSelected) || horizontalSelection?.verticalOptions[0];

    switch (verticalOption?.name) {
      case 'Stations':
        console.log('stations case');
        return <StationGrid />;
      case 'Reports':
        console.log('reports case');
        return <ReportFileGrid />;
      default:
        console.log('default case');
        return <div>Default</div>;
    }
  };

  const handleHorizontalSelectionClick = (horizontalSelection) => {
    const updatedNavbarOptions = resetAndSelectOption(horizontalSelection);
    setNavbarMenu(updatedNavbarOptions);
  };

  const handleVerticalOptionClick = (horizontalSelection, verticalSelection) => {
    const updatedNavbarOptions = resetAndSelectOption(horizontalSelection, verticalSelection);
    setNavbarMenu(updatedNavbarOptions);
  };

  return (
    <div>
      <div>
        <HorizontalNavbar options={navbarMenu} onSelectOption={handleHorizontalSelectionClick} />
      </div>
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-2 overflow-auto border-bottom border-right tab d-inline-block h-100">
            <VerticalNavbar options={navbarMenu} onSelectOption={handleVerticalOptionClick} />
          </div>
          <div className="col-10 w-auto h-100">
            <RenderBody />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
