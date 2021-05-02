export const DailyTasksReducer = (state, action) => {
    switch (action.type) {
        case "GET_DAILY": {
            return { tasks: action.tasks, tasksId: action.tasksId };
        }
        case "ADD_COMMENT": {
            state.tasks[action.employee][action.index].comments = [
                ...state.tasks[action.employee][action.index].comments,
                {
                    content: action.comment,
                    creator: {
                        first_name: action.first_name,
                        last_name: action.last_name,
                    },
                },
            ];
            return { ...state };
        }
        case "EXTEND_DAILY": {
            state.tasks[action.task.fullName] =
                state.tasks[action.task.fullName] === undefined
                    ? [action.task]
                    : [...state.tasks[action.task.fullName], action.task];
            return {
                tasks: state.tasks,
                tasksId: [...state.tasksId, action.task.taskId],
            };
        }
        case "REMOVE_FROM_DAILY": {
            let fullName = action.fullName;
            const reduced_tasks = state.tasks[fullName].filter(
                (task) => task.taskId != action.taskId
            );
            const reduced_ids = state.tasksId.filter(
                (id) => id != action.taskId
            );
            return {
                tasks: { [fullName]: reduced_tasks },
                tasksId: reduced_ids,
            };
        }
        case "TOGGLE_TASK": {
            state.tasks[action.employee] = state.tasks[action.employee].map(
                (task) => {
                    return task.pk == action.pk
                        ? { ...task, completed: !task.completed }
                        : task;
                }
            );
            return { ...state };
        }
        case "MOVE_UP": {
            const temp = state.tasks[action.employee][action.index - 1];
            state.tasks[action.employee][action.index - 1] =
                state.tasks[action.employee][action.index];
            state.tasks[action.employee][action.index] = temp;
            return { ...state };
        }
        case "MOVE_DOWN": {
            const temp = state.tasks[action.employee][action.index + 1];
            state.tasks[action.employee][action.index + 1] =
                state.tasks[action.employee][action.index];
            state.tasks[action.employee][action.index] = temp;
            return { ...state };
        }
        case "SWITCH_ACTIVE": {
            const updated_tasks = Object.keys(state.tasks).reduce(
                (obj, task) => {
                    obj[task] = state.tasks[task].map((taskObj) => {
                        const upTask =
                            taskObj.taskId === action.taskId &&
                            taskObj.emplId == action.emplId
                                ? {
                                      ...taskObj,
                                      time: {
                                          ...taskObj.time,
                                          active: !action.active,
                                      },
                                  }
                                : taskObj;
                        return upTask;
                    });
                    return obj;
                },
                {}
            );
            return { tasksId: state.tasksId, tasks: updated_tasks };
        }
        default:
            return state;
    }
};
