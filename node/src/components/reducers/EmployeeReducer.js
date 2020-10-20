export const EmployeeReducer = (state, action) => {
    switch(action.type) {
        case 'CHANGE_USER':
            {   
                return action.emplData
            }
        case 'EXTEND_TASKS': {
            return {emplId: state.emplId, fullName: state.fullName, tasks: [...state.tasks, {taskId: action.task.taskId, title: action.task.title}]}
        }
        default:
            return state
    }
}
