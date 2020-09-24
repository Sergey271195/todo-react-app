import React, { useState, useContext } from 'react'
import { BiPlus } from "react-icons/bi"

import '../styles/UsernameTitle.css'
import { DailyContext } from './context/DailyTasksContext'
import { EmployeeContext } from './context/EmployeeContext'
import { ModeContext } from './context/ModeContext'
import { LIGHT, DARK, fetchDataHandler, postFetch } from './Utils'

const AddNewTaskForm = ({emplId, mainList}) => {

    const { mode } = useContext(ModeContext)
    const { dispatch } = useContext(EmployeeContext)
    const { dispatchDaily } = useContext(DailyContext)

    const submitHandler = () => {

        if (formData.title == '') {
            setValidationError(true)
        }

        else {
            const data = {
                action: 'Create',
                title: formData.title,
                comment: formData.comment,
                responsibleId: emplId
            }
            postFetch({url: `api/tasks/create${emplId}`, data: data})
                .then(data => {
                    if (data.status !== 404) {
                        const task = fetchDataHandler(data)
                        dispatchDaily({type: 'EXTEND_DAILY', task: task})
                        if (!mainList) {
                            dispatch({type: 'EXTEND_TASKS', task: task})
                        }
                    }
                })
            setFormData({
                title: '',
                comment: ''
            })
        }
    }

    const [formData, setFormData] = useState({
        title: '',
        comment: ''
    })

    return (
        <div className = 'addTaskContainer'>
            <BiPlus className = 'plusIcon' onClick = {() => submitHandler()}/>
            <div className = 'addTaskInputContainer'>
                <input className = 'addTaskInput' placeholder = 'Добавить задачу' style = {mode ? DARK: LIGHT}
                    value = {formData.title}
                    onChange = {(event) => setFormData({...formData, title: event.target.value})}
                />
                {formData.title !== '' ?
                    <input className = 'addTaskInput' placeholder = 'Добавить комментарий' style = {mode ? DARK: LIGHT}
                        value = {formData.comment}
                        onChange = {(event) => setFormData({...formData, comment: event.target.value})}
                    />
                    : <></>
                }
            </div> 
        </div>
    )
}

export default AddNewTaskForm