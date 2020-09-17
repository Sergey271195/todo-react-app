import React, {createContext, useReducer} from 'react'
import { DailyTasksReducer } from '../reducers/DailyTasksReducer'

export const DailyContext = createContext();


const DailyContextProvider = (props) => {

    const [dailyTasks, dispatchDaily] = useReducer(DailyTasksReducer, {tasks: [], tasksId: []})

    return (
        <DailyContext.Provider value = {{dailyTasks, dispatchDaily}}>
            {props.children}
        </DailyContext.Provider>
    )

}

export default DailyContextProvider