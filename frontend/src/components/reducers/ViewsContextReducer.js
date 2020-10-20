export const ViewsContextReducer = (state, action) => {
    const initial =  Object.keys(state).reduce((obj, item) => {
        return {...obj, [item]: {show: false}}
    }, {})
    switch(action.type) {
        case 'MAIN': {
            return {...initial, main: {show: true}}
        }
        case 'EMPLOYEE': {
            return {...initial, employee: {show: true}}
        }
        case 'LOADING': {
            return {...initial, loading: {show: true}}
        }
        case 'NOT_FOUND': {
            return {...initial, notFound: {show: true}}
        }
        case 'LOGIN': {
            return {...initial, login: {show: true}}
        }
        case 'SIGNUP': {
            return {...initial, signup: {show: true}}
        }
        case 'MOBILEMENU': {
            return {...initial, mobilemenu: {show: true}}
        }
        default:
            return state
    }
}