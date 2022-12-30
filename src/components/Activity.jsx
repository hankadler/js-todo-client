import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";
import { DELETE_ACTIVITY, UPDATE_ACTIVITY, COMPRESS_ACTIVITY_INDEXES } from "../constants";
import editIcon from "../../assets/icons/edit-32x32.png";
import completedIcon from "../../assets/icons/completed-32x32.png";
import repeatIcon from "../../assets/icons/repeat-32x32.png";
import deleteIcon from "../../assets/icons/delete-32x32.png";

const propTypes = {
  index: PropTypes.number.isRequired,
  activity: PropTypes.instanceOf(Object).isRequired,
  refetch: PropTypes.func.isRequired
};

export default function Activity({ index, activity, refetch }) {
  const inputRef = useRef();
  const [description, setDescription] = useState(activity.description);
  const [completed, setCompleted] = useState(activity.completed);
  const [readOnly, setReadOnly] = useState(true);

  const [updateActivity] = useMutation(UPDATE_ACTIVITY, {
    variables: {
      activityId: activity._id,
      input: { description, completed }
    },
    onCompleted: (data) => {
      console.log(data);
      setDescription(data.updateActivity.activity.description);
      setCompleted(data.updateActivity.activity.completed);
    },
    onError: (error) => console.error(error.message)
  });

  const [compressActivityIndexes] = useMutation(COMPRESS_ACTIVITY_INDEXES, {
    onCompleted: async (data) => {
      console.log(data);
      const { data: { activities } } = await refetch();
      if (!activities.length) window.location.reload(false);
    }
  });

  const [deleteActivity] = useMutation(DELETE_ACTIVITY, {
    variables: { activityId: activity._id },
    onCompleted: async (data) => {
      console.log(data);
      await compressActivityIndexes();
    },
    onError: (error) => console.error(error.message)
  });

  /* input handlers */

  const onChange = async ({ target: { value } }) => {
    setDescription(value);
  };

  const onBlur = async () => {
    if (!readOnly) {
      // console.log(activity._id);
      await updateActivity();
      setReadOnly(true);
    }
  };

  const onEnter = async (event) => {
    if (event.key === "Enter") {
      setReadOnly(true);
      inputRef.current.blur();
    }
  };

  /* operation handlers */

  const onClickEdit = async () => {
    setReadOnly(false);
    inputRef.current.focus();
  };

  const onToggleCompleted = async () => {
    setCompleted(!completed);
    setTimeout(updateActivity, 0);
  };

  const onClickDelete = async () => {
    await deleteActivity();
  };

  return (
    <Draggable draggableId={activity._id} index={index}>
      {(provided) => (
        <ActivityBox
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <input
            className={completed ? "completed" : ""}
            ref={inputRef}
            type="text"
            readOnly={readOnly}
            value={description}
            onChange={onChange}
            onBlur={onBlur}
            onKeyPress={onEnter}
          />
          <OperationsBox>
            <img
              id={`completed-${index}`}
              className="icon"
              src={completed ? repeatIcon : completedIcon}
              alt="completed"
              width={32}
              height={32}
              onClick={onToggleCompleted}
            />
            <Tooltip
              anchorId={`completed-${index}`}
              content={completed ? "Redo" : "Done"}
              place="bottom"
            />
            <img
              id={`edit-${index}`}
              className={readOnly ? "icon" : "disabled"}
              src={editIcon}
              alt="edit"
              width={32}
              height={32}
              onClick={readOnly ? onClickEdit : null}
            />
            <Tooltip anchorId={`edit-${index}`} content={readOnly ? "Edit" : ""} place="bottom" />
            <img
              id={`delete-${index}`}
              className="icon"
              src={deleteIcon}
              alt="delete"
              width={32}
              height={32}
              onClick={onClickDelete}
            />
            <Tooltip anchorId={`delete-${index}`} content="Delete" place="bottom" />
          </OperationsBox>
        </ActivityBox>
      )}
    </Draggable>
  );
}

Activity.propTypes = propTypes;

const ActivityBox = styled.div`
  display: grid;
  grid-template-columns: 1fr .3fr;
  grid-gap: 8px;
`;

const OperationsBox = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-evenly;
`;
