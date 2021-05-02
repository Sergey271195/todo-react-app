import React, { useContext, useState, useEffect } from "react";
import { fetchDataHandler, postFetch } from "./Utils";

import "../styles/TaskListElement.css";
import { DailyContext } from "./context/DailyTasksContext";

const TaskListElement = ({ taskId, title, emplId, fullName, included }) => {
    const { dispatchDaily } = useContext(DailyContext);
    const [taskIsIncluded, setTaskIsIncluded] = useState(included);

    const removeTask = () => {
        postFetch({
            url: `api/tasks/user${emplId}`,
            data: { action: "Remove", taskId },
        }).then((data) => {
            if (data.status === 200) {
                dispatchDaily({ type: "REMOVE_FROM_DAILY", fullName, taskId });
                setTaskIsIncluded(false);
            }
        });
    };

    const addExistingTask = () => {
        postFetch({
            url: `api/tasks/user${emplId}`,
            data: { action: "Add", taskId },
        }).then((data) => {
            if (data.status !== 404) {
                const task = fetchDataHandler(data);
                dispatchDaily({ type: "EXTEND_DAILY", task: task });
                setTaskIsIncluded(true);
            }
        });
    };

    useEffect(() => {
        setTaskIsIncluded(included);
    }, [included]);

    return (
        <div
            key={taskId}
            className={"tasksDiv" + (taskIsIncluded ? " included" : "")}
            onClick={
                taskIsIncluded ? () => removeTask() : () => addExistingTask()
            }
            title="Добавить/удалить задачу из списка задач на текущий день"
        >
            <div className="taskDivWrapper">{title}</div>
        </div>
    );
};

export default TaskListElement;
