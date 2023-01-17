import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "",
    days: [],
    appointments: {},
    interviewers: {}
  });

  console.log('state.appointments', state.appointments);
  // Use selectors helper function to get appointments based on current state of day
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  // console.log('daily appointments', dailyAppointments);

  const interviewers = getInterviewersForDay(state, state.day);

  // Selector function that takes in our appointments, and creates an array that we display
  const appointmentsArr = dailyAppointments.map(app => {
    // We need to transform the interview before passing it as a prop, since the data we 
    // retrieved from the api is an object of objects.
    const interview = getInterview(state, app.interview);

    return <Appointment
      key={app.id}
      {...app}
      id={app.id}
      time={app.time}
      interview={interview}
      interviewers={interviewers}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview} />;
  });

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    Axios.put(`/api/appointments/${id}`, appointment)
      .then(res => {
        console.log(res);
      });

    setState({ ...state, appointments });

  }

  function cancelInterview(id) {
    return Axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState({ ...state });
      })
      .catch(err => console.log('axios delete error', err));
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
