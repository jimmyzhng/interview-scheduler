export function getAppointmentsForDay(state, day) {
  // return an array of appointments for that day
  let apptsArray = [];

  for (const stateDay in state.days) {
    let dayObj = state.days[stateDay];
    let apptsObj = state.appointments;

    if (dayObj.name === day) {
      let appts = [...dayObj.appointments];

      for (let appt of appts) {
        apptsArray.push(apptsObj[appt]);

      }
    }
  }
  return apptsArray;
}

export function getInterview(state, interview) {
  // return a new object containing interview data (with interviewer info) that we can use as a prop
  // It is needed because the prop requires the data in a specific way - where the interviewer key 
  // has the interviewer's info object as the value
  // It is currently only displaying the interviewer's id (1 in the example)

  if (interview) {
    let interviewerId = interview.interviewer;
    interview.interviewer = state.interviewers[interviewerId];
    return interview;
  }

  return null;
}