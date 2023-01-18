import React from "react";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  // Use selectors helper functions to get appointments/interviewers based on current state of day
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  // console.log('daily appointments', Boolean(dailyAppointments));
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
        {dailyAppointments.length !== 0 && <Appointment key="last" time="5pm" />}
      </section>
    </main>
  );
}
