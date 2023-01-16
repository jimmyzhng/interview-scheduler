import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import "components/Appointment";
import { getAppointmentsForDay } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  // Use selectors helper function to get appointments based on current state of day
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // Selector function that takes in our appointments, and creates an array that we display
  const appointmentsArr = dailyAppointments.map(app => {
    return <Appointment key={app.id} {...app} />;
  });

  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));

  // Getting the data from scheduler-api with axios
  // Promise.all resolves all promises, and returns aray of resolved values matching
  // the order of the array passed to it
  useEffect(() => {

    Promise.all([
      Axios.get('/api/days'),
      Axios.get('/api/appointments')
    ])
      // Our res is an array of the response received: [{days}, {appts}]
      .then(res => {
        console.log('res.data[0]', res[0].data);
        console.log('res[1]', res[1]);
        setState(prev => ({ ...prev, days: res[0].data, appointments: res[1].data }));
      });
  }, []);

  return (
    <main className="layout">

      <section className="sidebar">
        <img className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler" />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs" />
      </section>

      <section className="schedule">
        {appointmentsArr}
      </section>
    </main>
  );
}
