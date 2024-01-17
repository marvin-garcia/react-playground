import React from 'react';

const VerticalNavbar = ({ options, onSelectOption }) => {

  const option = options.find(option => option.isSelected);
  const navMenu = option.verticalOptions;

  return (
    <div class="navbar-nav">
      <ul class="nav flex-column">
        {navMenu.map((item) => (
          <li class="nav-item" key={navMenu.indexOf(item)}>
            <a key={navMenu.indexOf(item)} href="#" class={`nav-link btn btn-link ${item.isSelected ? 'active' : ''}`} onClick={() => onSelectOption(option, item)}>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
  
  export default VerticalNavbar;