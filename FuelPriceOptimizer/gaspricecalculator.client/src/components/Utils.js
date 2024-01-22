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