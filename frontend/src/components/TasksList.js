import React, {useContext, useState, useEffect} from 'react';
import { DailyContext } from './context/DailyTasksContext';
import { EmployeeContext } from './context/EmployeeContext';

import '../styles/Tasks.css'
import {fetchDataHandler, postFetch, saveToLocalStorage} from './Utils'

const TasksList = () => {

    const {currEmployee, dispatch} = useContext(EmployeeContext)
    const {dailyTasks, dispatchDaily} = useContext(DailyContext)
    const [newTask, setNewTask] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        comment: ''
    })
    const [validationError, setValidationError] = useState(false)

    useEffect(() => {
        if (currEmployee && currEmployee.emplId) {
            saveToLocalStorage({key: 'employee', data: currEmployee})
        }        
    }, [currEmployee])

    const submitHandler = (event) => {

        event.preventDefault()
        if (formData.title == '') {
            setValidationError(true)
        }

        else {
            const data = {
                action: 'Create',
                title: formData.title,
                comment: formData.comment,
                responsibleId: currEmployee.emplId
            }
            console.log(data)
            postFetch({url: `api/tasks/create${currEmployee.emplId}`, data: data})
                .then(data => {
                    console.log(data)
                    if (data.status !== 404) {
                        const task = fetchDataHandler(data)
                        dispatchDaily({type: 'EXTEND_DAILY', task: task})
                        dispatch({type: 'EXTEND_TASKS', task: task})
                    }
                })
        }
    }

    const removeTask = ({taskId, emplId, fullName}) => {
        postFetch({url: `api/tasks/user${emplId}`, data: {action: 'Remove', taskId}})
            .then(data => 
                {
                if (data.status === 200) {
                    dispatchDaily({type: 'REMOVE_FROM_DAILY', fullName, taskId})
                }
            })
        }

    const addExistingTask = ({taskId, emplId}) => {
        postFetch({url: `api/tasks/user${emplId}`, data: {action: 'Add', taskId}})
            .then(data => {
                if (data.status !== 404) {
                    const task = fetchDataHandler(data)
                    dispatchDaily({type: 'EXTEND_DAILY', task: task})
                }
        })
    }

    if (currEmployee) {
        return (
            <div className = 'usersTasksDiv'>

            {/* MAIN */}
                <h2>{currEmployee.fullName}</h2>

                <form className = 'formTag' /* method = 'POST' */ 
                    onSubmit = {(event) => {console.log(formData), submitHandler(event)}}>
                        <textarea name = 'title' className = 'newTaskInput' placeholder = 'Новое задание...' 
                            value = {formData.title}
                            onChange = {(event) => {setFormData({...formData, title: event.target.value}), setValidationError(false)}}>
                        </textarea>
                        <textarea name = 'comment' className = 'newTaskInput' placeholder = 'Комментарий...'
                            value = {formData.comment}
                            onChange = {(event) => setFormData({...formData, comment: event.target.value})}>
                        </textarea>
                    <button className = 'addBtn' onClick = {() => {console.log(currEmployee)}}>+</button>
                </form>

                {currEmployee.tasks.map(({taskId, title}) => {
                    const emplId = currEmployee.emplId
                    const included = dailyTasks.tasksId.includes(parseInt(taskId)) ? true : false
                    return <div key = {taskId} className = {included ? 'tasksDivActive': 'tasksDiv'}
                                onClick = {included ? () => removeTask({taskId, emplId, fullName: currEmployee.fullName}) : () => addExistingTask({taskId, emplId})}
                            >
                                {title}
                            </div>
                })}

            </div>
        )
    }
    return (
        <div></div>
    )
    
}

export default TasksList

