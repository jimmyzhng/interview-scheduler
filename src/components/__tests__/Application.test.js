import React from "react";

import {
  render, cleanup, waitForElement, fireEvent, prettyDOM,
  getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe('Application Tests', () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    // Promise chain is hidden using await keyword
    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText('Leopold Silvers')).toBeInTheDocument();

  });

  it.only("loads data, booked an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    // This creates an array - we can access the first appointment via it's index
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];


    fireEvent.click(getByAltText(appointment, 'Add'));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // Click first interviewer of list and save
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(container, "Save"));

    expect(getByText(container, /saving/i)).toBeInTheDocument();

    // We wait for the saving function to finish
    await waitForElement(() => queryByText(container, 'Lydia Miller-Jones'));

    // We added data-testid="day" to the <li> (each day), 
    // and we find the day that contains Monday
    // Then, we ensure that the specified <li> node contains 'no spots remaining'
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });
});
