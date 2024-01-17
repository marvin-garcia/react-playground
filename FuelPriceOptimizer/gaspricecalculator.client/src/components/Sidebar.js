import React, { useState } from 'react';

const Sidebar = () => {
    return (
        <aside id="sidebar" class="sidebar">
      <ul class="sidebar-nav" id="sidebar-nav">
        <li class="nav-item">
          <a class="nav-link " href="index.html">
            <i class="bi bi-grid"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
            <i class="bi bi-menu-button-wide"></i><span>Stations</span><i class="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="components-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <a href="components-alerts.html">
                <i class="bi bi-circle"></i><span>List</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse" href="#">
            <i class="bi bi-journal-text"></i><span>Reports</span><i class="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="forms-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <a href="forms-elements.html">
                <i class="bi bi-circle"></i><span>History</span>
              </a>
            </li>
            <li>
              <a href="forms-layouts.html">
                <i class="bi bi-circle"></i><span>Add new</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse" href="#">
            <i class="bi bi-layout-text-window-reverse"></i><span>Price estimator</span><i class="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="tables-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <a href="tables-general.html">
                <i class="bi bi-circle"></i><span>Estimate</span>
              </a>
            </li>
            <li>
              <a href="tables-data.html">
                <i class="bi bi-circle"></i><span>History</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
      </aside>
    );
};
export default Sidebar;