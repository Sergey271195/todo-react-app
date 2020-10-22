export const AuthContextReducer = (state, action) => {
    const initial_data = {
        authenticated: false,
        employee: '',
        username: '',
        user: '',
        is_admin: false,
        key: '',
        firstname: '',
        lastname: '',
        bitrix_id: '',
    }
    switch(action.type) {
        case 'LOGIN': {
            return {
                authenticated: true,
                employee: action.data.employee.id,
                username: action.data.user.username,
                user: action.data.user.id,
                is_admin: action.data.is_admin,
                key: action.data.bitrix_token, 
                firstname: action.data.user.first_name,
                lastname: action.data.user.last_name,
                bitrix_id: action.data.employee.bitrix_id,
            }
        }
        case 'LOGOUT': {
            return initial_data
        }
        default:
            return state
    }
}