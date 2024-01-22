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

export const groupDataByField = (data, field) => {
  let groupedData = [];
  let uniqueValues = [...new Set(data.map(item => item[field]))];

  for (let i = 0; i < uniqueValues.length; i++) {
    let value = uniqueValues[i];
    groupedData.push([value, data.filter(item => item[field] === value).length]);
  }

  return groupedData;
};