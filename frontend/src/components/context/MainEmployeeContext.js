import React, {createContext, useState} from 'react'

export const MainEmployee = createContext();

const MainEmployeeProvider = (props) => {

    const [employee, setEmployee] = useState([]);

    return (
        <MainEmployee.Provider value = {{employee, setEmployee}}>
            {props.children}
        </MainEmployee.Provider>
    )

}

export default MainEmployeeProvider