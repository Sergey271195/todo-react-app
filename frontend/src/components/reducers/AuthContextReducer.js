export const AuthContextReducer = (state, action) => {
    const initial_data = {
        authenticated: false,
        employee: '',
        username: '',
        user: '',
        is_admin: false,
        key: ''
    }
    switch(action.type) {
        case 'LOGIN': {
            return {
                authenticated: true,
                employee: action.data.employee,
                username: action.data.user.username,
                user: action.data.user.id,
                is_admin: action.data.is_admin,
                key: action.data.bitrix_token
            }
        }
        case 'LOGOUT': {
            return initial_data
        }
        default:
            return state
    }
}