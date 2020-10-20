import React, { useReducer, createContext, useEffect } from 'react'
import { AuthContextReducer } from '../reducers/AuthContextReducer';
import { getFromLocalStorage, saveToLocalStorage } from '../Utils'

export const AuthContext = createContext();

const AuthContextProvider = (props) => {


    const initial_data = getFromLocalStorage('auth') ? getFromLocalStorage('auth') : {
        authenticated: false,
        employee: '',
        username: '',
        user: '',
        is_admin: false,
        key: ''
    }

    const [ auth, dispatchAuth ] = useReducer(AuthContextReducer, initial_data)

    useEffect(() => {
        saveToLocalStorage({key: 'auth', data: auth})
    }, [auth])

    return (
        <AuthContext.Provider value = {{auth, dispatchAuth}} >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider
