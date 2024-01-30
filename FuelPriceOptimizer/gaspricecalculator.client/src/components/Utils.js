import React from "react";
import { format } from "date-fns";

export const UrlCellRenderer = (props) => {
  return (
    <a href={props.value} target="_blank" rel="noopener noreferrer">
      Download
    </a>
  );
};

export const DateCellRenderer = (dateFormat) => (props) => {
  const date = new Date(props.value);
  const formattedDate = format(date, dateFormat);
  return formattedDate;
};

export const GroupDataByProperty = (data, property) => {
  let groupedData = [];
  let uniqueValues = [...new Set(data.map(item => item[property]))];

  for (let i = 0; i < uniqueValues.length; i++) {
    let value = uniqueValues[i];
    groupedData.push([value, data.filter(item => item[property] === value).length]);
  }

  return groupedData;
};

export const FormatDatesInArray = (data, dateFormat) => {
  return data.map((item) => {
    const formattedDate = DateCellRenderer(dateFormat)({ value: item.date });

    return { ...item, date: formattedDate };
  });
};

export const LoadingSpinnerCard = (cardStyle, spinnerStyle, text) => {
  return (
    <div class="card" style={cardStyle}>
      <div class="card-body d-flex align-items-center justify-content-center">
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status" style={spinnerStyle}>
            {/* <span class="visually-hidden">Loading...</span> */}
          </div>
          <h5>{text}</h5>
        </div>
      </div>
    </div>
  );
};

export const CalculateMapBounds = (stations) => {
  if (stations.length === 0) {
    return { north: 0, south: 0, east: 0, west: 0 }; // Default values when no stations
  }

  let west = stations[0].longitude;
  let east = west;
  let north = stations[0].latitude;
  let south = north;

  for (let i = 1; i < stations.length; i++) {
    const station = stations[i];
    west = Math.min(west, station.longitude);
    east = Math.max(east, station.longitude);
    north = Math.max(north, station.latitude);
    south = Math.min(south, station.latitude);
  }

  return { north, south, east, west };
};

export const CapitalizeWord = (word) => {
  // Make sure the wording is not empty
  if (word.length === 0) {
    return word;
  }

  // Change the first letter to uppercase and concatenate the rest of the wording
  return word.charAt(0).toUpperCase() + word.slice(1);
}
