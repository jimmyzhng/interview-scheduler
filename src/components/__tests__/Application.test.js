import React from "react";

import {
  render, cleanup, waitForElement, fireEvent, prettyDOM,
  getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText
} from "@testing-library/react";

import axios from "__mocks__/axios";
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

  it("loads data, booked an interview and reduces the spots remaining for the first day by 1", async () => {
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

  it("loads data, cancels an interview and increases spots remaining for Monday by 1", async () => {
    //1. Render the application
    const { container, debug } = render(<Application />);

    //2. Wait until we see Archie's name
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // debug();

    const archieAppt = getAllByTestId(container, 'appointment').find(day => queryByText(day, 'Archie Cohen'));
    console.log(prettyDOM(archieAppt));

    // CLick on delete
    fireEvent.click(getByAltText(archieAppt, "Delete"));

    // Check that the delete message is displayed
    expect(getByText(archieAppt, /Are you sure you would like to delete?/i)).toBeInTheDocument();
    // Click on confirm
    fireEvent.click(getByText(archieAppt, "Confirm"));

    // Check that the deleting message shows up
    expect(getByText(archieAppt, /deleting/i)).toBeInTheDocument();

    // Wait for deleting mode to complete - we will wait until we see "add"
    await waitForElement(() => (getByAltText(archieAppt, "Add")));

    // Check the daylistitem monday, and we expect getbyText 'one spot remaining' to be in the document
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //1. Render the application
    const { container, debug } = render(<Application />);

    //2. Wait until we see Archie's name
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const archieAppt = getAllByTestId(container, 'appointment').find(day => queryByText(day, 'Archie Cohen'));

    // CLick on edit
    fireEvent.click(getByAltText(archieAppt, "Edit"));

    // Change name
    fireEvent.change(getByPlaceholderText(archieAppt, /enter student name/i), {
      target: { value: "Bob" }
    });

    // Click on confirm
    fireEvent.click(getByText(archieAppt, "Save"));

    //we will wait until we see the newly, updated name
    await waitForElement(() => (getByText(archieAppt, "Bob")));

    // Check the daylistitem monday, and we expect getbyText 'one spot remaining' to be in the document
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", () => {
    axios.put.mockRejectedValueOnce();
  });

  it("shows the delete error when failing to delete an existing appointment", () => {
    axios.delete.mockRejectedValueOnce();
  });



});
