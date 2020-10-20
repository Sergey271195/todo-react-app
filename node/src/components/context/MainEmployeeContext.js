import React, {createContext, useReducer} from 'react'
import {MainEmployeeReducer} from '../reducers/MainEmployeeReducer'

export const MainEmployee = createContext();

const MainEmployeeProvider = (props) => {

    const [employee, setEmployee] = useReducer(MainEmployeeReducer, { 
        loading: true, users: [] 
    });

    return (
        <MainEmployee.Provider value = {{employee, setEmployee}}>
            {props.children}
        </MainEmployee.Provider>
    )

}

export default MainEmployeeProvider