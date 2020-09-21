import React, {createContext, useReducer, useEffect} from 'react'
import { EmployeeReducer } from '../reducers/EmployeeReducer';
import { saveToLocalStorage, getFromLocalStorage } from '../Utils'

export const EmployeeContext = createContext();

const EmployeeContextProvider = (props) => {

    const [currEmployee, dispatch] = useReducer(EmployeeReducer, getFromLocalStorage('employee'))

    return (
        <EmployeeContext.Provider value = {{currEmployee, dispatch}}>
            {props.children}
        </EmployeeContext.Provider>
    )
}

export default EmployeeContextProvider