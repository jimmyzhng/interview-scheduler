import { useState, useEffect } from "react";
import Axios from "axios";
import "components/Application.scss";
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
      .then(() => {
        const updatedDays = updateSpots(state, appointments);
        setState({ ...state, appointments, days: updatedDays });
      });

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
        const updatedDays = updateSpots(state, appointments);
        setState({ ...state, appointments, days: updatedDays });
      });
  }

  function updateSpots(state, appointments) {
    // find the day matching state.day, save its object into dayObj
    const dayObj = state.days.find(element => element.name === state.day);

    // counter for spots
    let spots = 0;
    // iterate through ids of appointments array in dayObj
    for (const id of dayObj.appointments) {
      // appointment is at appointments index of [id]
      const appointment = appointments[id];
      // if not appointment (appointments of [id]).interview = null, spots++
      if (!appointment.interview) {
        spots++;
      }
    }
    // new day object that copies contents of dayObj and inserts 'spots'
    const day = { ...dayObj, spots };
    // return an updated state.days array ; if day name matches, return day, otherwise return element
    return state.days.map(element => element.name === state.day ? day : element);
  }

  // Getting the data from scheduler-api with axios
  // Promise.all resolves all promises, and returns array of resolved values matching
  // the order of the array passed to it
  useEffect(() => {

    Promise.all([
      Axios.get('/api/days'),
      Axios.get('/api/appointments'),
      Axios.get('/api/interviewers')
    ])
      // Our res is an array of the response received: [{days}, {appts}]
      .then(res => {
        setState(prev => ({ ...prev, days: res[0].data, appointments: res[1].data, interviewers: res[2].data }));
      });
  }, []);

  return { state, setDay, bookInterview, cancelInterview, updateSpots };
}