import React from 'react';

const HorizontalNavbar = ({ options, onSelectOption }) => {
  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon">Gas Price Estimator</span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            {options.map((option) => (
              <a key={options.indexOf(option)} href="#" class={`nav-link ${option.isSelected ? 'active' : ''}`} onClick={() => onSelectOption(option)}>{option.name}</a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HorizontalNavbar;
