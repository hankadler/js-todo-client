import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "@emotion/styled";
import { CREATE_ACTIVITY, GET_ACTIVITIES, SWAP_ACTIVITY_INDEXES } from "./constants";
import Activity from "./components/Activity";

export default function App() {
  const [activity, setActivity] = useState("");
  const [activities, setActivities] = useState([]);
  const [adding, setAdding] = useState(false);

  /* query/mutations */

  const { loading, refetch } = useQuery(GET_ACTIVITIES, {
    onCompleted: async (data) => setActivities(data.activities),
    onError: (error) => console.error(error.message)
  });

  const [createActivity] = useMutation(CREATE_ACTIVITY, {
    variables: {
      input: { description: activity }
    },
    onCompleted: async (data) => {
      setActivity("");
      const newActivity = data.createActivity.activity;
      setActivities([...activities, newActivity]);
    },
    onError: (error) => console.error(error.message)
  });

  const [swapActivityIndexes] = useMutation(SWAP_ACTIVITY_INDEXES, {
    onCompleted: async (data) => {
      console.log(data);
      // await refetch();
    },
    onError: (error) => console.error(error.message)
  });

  /* effects */

  // on change activity: enable/disable add button
  useEffect(() => setAdding(activity.length > 0), [activity]);
  // useEffect(() => console.log({ activities }), [activities]);

  /* input section handlers */

  const onChangeActivity = async ({ target: { value } }) => setActivity(value);

  const onClickAdd = async () => {
    await createActivity();
  };

  const onEnter = async (event) => {
    if (event.key === "Enter" && adding) await createActivity();
  };

  /* output section handlers */

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    // bad reorder
    if (!destination) return;

    // no reorder
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // reorder
    const indexA = source.index;
    const indexB = destination.index;

    // todo: move instead of swap
    await swapActivityIndexes({ variables: { indexA, indexB } });
    await refetch();
  };

  return (
    <AppBox>
      <AppMain>
        <InputSection>
          <legend>Input</legend>
          <label htmlFor="activity">Activity:</label>
          <input type="text" value={activity} onChange={onChangeActivity} onKeyPress={onEnter} />
          <button type="button" onClick={onClickAdd} disabled={!adding}>+</button>
        </InputSection>
        <OutputSection>
          <legend>Output</legend>
          <TableHeader>
            <label>Activities</label>
            <label>Operations</label>
          </TableHeader>
          {!loading ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="activities">
                {(provided) => (
                  <TableMain ref={provided.innerRef} {...provided.droppableProps}>
                    {activities.map((a, i) => (
                      <Activity key={a._id} index={i} activity={a} refetch={refetch} />
                    ))}
                    {provided.placeholder}
                  </TableMain>
                )}
              </Droppable>
            </DragDropContext>
          ) : null}
        </OutputSection>
      </AppMain>
    </AppBox>
  );
}

const AppBox = styled.div`
  display: grid;
  grid-template-rows: fit-content(100%) fit-content(100%) 1fr;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, .025);
`;

const AppMain = styled.main`
  display: grid;
  grid-gap: 8px;
  padding: 8px;
`;

const InputSection = styled.fieldset`
  display: grid;
  grid-template-columns: fit-content(100%) 1fr fit-content(100%);
  grid-gap: 8px;
  align-items: center;
  padding: 8px;
  
  & > input {
    height: 2em;
  }
  
  & > button {
    width: 2em;
    height: 2em;
  }
`;

const OutputSection = styled.fieldset`
  padding: 8px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr .3fr;
  grid-gap: 8px;
  
  & > * {
    width: 100%;
    text-align: center;
  }
`;

const TableMain = styled.main`
  display: grid;
  grid-gap: 8px;
  margin-top: 8px;
`;
