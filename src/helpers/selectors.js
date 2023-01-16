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