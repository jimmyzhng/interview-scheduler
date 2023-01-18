import "components/Appointment/styles.scss";
import React, { Fragment } from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  // using our hook to create functions that we use for the onClick functionality of our site
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // We pass this to form component (saves name, interviewer) that is passed to onSave as arguments
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));

  }

  function deleteInterview(id) {
    transition(DELETING, true);

    props.cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  }

  function confirmDelete() {
    transition(CONFIRM);
  }

  function edit(id) {
    transition(EDIT);
  }

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
          onEdit={edit}
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
      {mode === EDIT &&
        <Form
          student={props.interview.student}
          interviewer={props.interview?.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      }

      {mode === SAVING &&
        <Status message={"Saving"} />
      }

      {mode === DELETING &&
        <Status message={"Deleting"} />
      }

      {mode === CONFIRM &&
        <Confirm
          onCancel={back}
          onConfirm={() => deleteInterview(props.id)}
          message={"Are you sure you would like to delete?"}
        />
      }

      {mode === ERROR_SAVE &&
        <Error message={"Could not save."} onClose={back} />
      }

      {mode === ERROR_DELETE &&
        <Error message={"Could not delete."} onClose={back} />
      }

    </article>
  );

}
