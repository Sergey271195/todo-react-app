import React, {useContext, useState, useEffect} from 'react';
import { EmployeeContext } from './context/EmployeeContext';

import '../styles/TasksList.css'
import { saveToLocalStorage } from './Utils'
import TaskListElement from './TaskListElement';
import UsernameTitle from './UsernameTitle'
import { ModeContext } from './context/ModeContext';

const TasksList = () => {

    const { currEmployee } = useContext(EmployeeContext)
    const { mode } = useContext(ModeContext)

    useEffect(() => {
        if (currEmployee && currEmployee.emplId) {
            saveToLocalStorage({key: 'employee', data: currEmployee})
        }        
    }, [currEmployee])

    if (currEmployee) {
        return (
            <div className = {'usersTasksDiv' + (mode ? ' dark': ' light')}>
                <div className = 'currUserTitleDiv'>
                    <UsernameTitle employee = {currEmployee.fullName} emplId = {currEmployee.emplId} mainList = {false}/>
                </div>
                {currEmployee.tasks.map(({taskId, title}) => {
                    return <TaskListElement key = {taskId} taskId = {taskId} title = {title} emplId = {currEmployee.emplId} fullName = {currEmployee.fullName}/>
                })}
            </div>
        )
    }
    return (
        <div></div>
    )
    
}

export default TasksList

