import React, {createContext, useReducer} from 'react'
import { EmployeeReducer } from '../reducers/EmployeeReducer';

export const EmployeeContext = createContext();

const EmployeeContextProvider = (props) => {

    const [currEmployee, dispatch] = useReducer(EmployeeReducer, {id: '', tasks: []})

    return (
        <EmployeeContext.Provider value = {{currEmployee, dispatch}}>
            {props.children}
        </EmployeeContext.Provider>
    )
}

export default EmployeeContextProvider