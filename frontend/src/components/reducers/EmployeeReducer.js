export const EmployeeReducer = (state, action) => {
    switch(action.type) {
        case 'CHANGE_USER':
            {   
                return action.emplData
            }
        case 'EXTEND_TASKS': {
            return {id: state.id, name: state.name, tasks: [...state.tasks, action.task]}
        }
        default:
            return state
    }
}
