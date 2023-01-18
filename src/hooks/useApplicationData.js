import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import "components/Appointment";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  //
  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return Axios.put(`/api/appointments/${id}`, appointment)
      .then(() => setState({ ...state, appointments }));

  }

  //
  function cancelInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return Axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        setState({ ...state, appointments });
      });
  }

  // Getting the data from scheduler-api with axios
  // Promise.all resolves all promises, and returns array of resolved values matching
  // the order of the array passed to it
  useEffect(() => {

    return Promise.all([
      Axios.get('/api/days'),
      Axios.get('/api/appointments'),
      Axios.get('/api/interviewers')
    ])
      // Our res is an array of the response received: [{days}, {appts}]
      .then(res => {
        setState(prev => ({ ...prev, days: res[0].data, appointments: res[1].data, interviewers: res[2].data }));
      });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}