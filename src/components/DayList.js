import DayListItem from "./DayListItem";
import React from "react";

export default function DayList(props) {

  // DayList receives days (array with id, name, spots)
  // we need to convert that to an array of DayListItem components

  // DayListItem component needs a key, name, spots, setDay (to change state), 
  // and selected - this needs to know if the given parent day (props.day) = current item's name
  const dayListArr = props.days.map(day => {
    return (<DayListItem
      key={day.id}
      name={day.name}
      spots={day.spots}
      selected={day.name === props.value}
      setDay={() => props.onChange(props.name)}
    />
    );
  });

  return (
    <ul>
      {dayListArr}
    </ul>
  );
};