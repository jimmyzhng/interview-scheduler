# Interview Scheduler
Interview Scheduler is a single-paged application for students to create, edit, and delete interview appointments. This application relies on an API server for a PostgreSQL database of students and interviewers. This can be found [here](https://github.com/jimmyzhng/scheduler-api).

Unit, integration and end-to-end testing completed with Storybook, Jest, and Cypress!

## The Project:
!["Homepage"](https://github.com/jimmyzhng/interview-scheduler/blob/master/docs/is-home.png)

!["Editing Name And Interviewer"](https://github.com/jimmyzhng/interview-scheduler/blob/master/docs/is-edit.png)

!["Deleting"](https://github.com/jimmyzhng/interview-scheduler/blob/master/docs/is-delete.png)

!["Status"](https://github.com/jimmyzhng/interview-scheduler/blob/master/docs/is-status.png)

## Setup

1) Install dependencies with `npm install`

2) Clone the [Scheduler-API](https://github.com/jimmyzhng/scheduler-api) database, and follow instructions on the README file. Once completed, we run `npm start` for this server. When the Scheduler API is up and running, we can run our application!

3) We run the Webpack Development Server with ```npm start```

4) For the Jest Test Framework, we run ```npm test```

5) For the Storybook Visual Testbed, we have the command ```npm run storybook```

6) Cypress testing was definitely the most interesting testing software we used, and this can be run with ```npm run cypress```

## Dependencies
* React
* Webpack, Babel
* Axios
* Storybook, Jest, Cypress, Testing Library
