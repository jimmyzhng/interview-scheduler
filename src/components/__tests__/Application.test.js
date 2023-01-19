import React from "react";

import { render, cleanup, waitForElement, fireEvent } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", () => {
  const { getByText } = render(<Application />);

  // We make our test async by returning a promise
  // It resolves when the callback returns a truthy value, and rejects after a time out
  // Jest knows that the test is not complete until promise chain has been resolved/rejected
  return waitForElement(() => getByText('Monday'))
    .then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText('Leopold Silvers')).toBeInTheDocument();
    });
});
