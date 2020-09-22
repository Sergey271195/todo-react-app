export const MainEmployeeReducer = (state, action) => {
    switch(action.type) {
        case 'FECTH_USERS': {
            return {loading: true, users: []}
        }
        case 'RETURN_USERS': {
            return {loading: false, users: action.data}
        }
    }
}