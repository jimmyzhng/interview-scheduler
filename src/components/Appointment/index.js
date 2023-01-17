import "components/Appointment/styles.scss";
import React, { Fragment } from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";

  // using our hook to create functions that we use for the onClick functionality of our site
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // We pass this to form component (saves name, interviewer) that is passed to onSave as arguments
  function save(name, interviewer) {
    transition(SAVING);

    const interview = {
      student: name,
      interviewer
    };

    props.bookInterview(props.id, interview);
    transition(SHOW);
  }

  function deleteInterview(id) {
    props.cancelInterview(id);
    transition(DELETING);
    transition(EMPTY);
  }

  function confirmDelete() {
    transition(CONFIRM);
  }

  // console.log('props interview', props?.interview);

  return (
    <article className="appointment">
      <Header time={props.time}></Header>
      {mode === EMPTY && <Empty
        onAdd={() => transition(CREATE)}
      />
      }
      {mode === SHOW &&
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDelete}
        />
      }

      {mode === CREATE &&
        <Form
          student={props.student}
          interviewer={props.interviewer}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      }

      {mode === SAVING &&
        <Status message={"Saving"} />
      }

      {mode === SAVING &&
        <Status message={"Deleting"} />
      }

      {mode === CONFIRM &&
        <Confirm
          onCancel={back}
          onConfirm={() => deleteInterview(props.id)}
          message={"Are you sure you would like to delete?"}
        />
      }

    </article>
  );

}
