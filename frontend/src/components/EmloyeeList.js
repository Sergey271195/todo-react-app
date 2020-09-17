import React, { useState, useEffect, useContext } from "react";
import { EmployeeContext } from "./context/EmployeeContext";

import '../styles/EmployeeList.css'
import { DailyContext } from "./context/DailyTasksContext";
import { MainEmployee } from "./context/MainEmployeeContext";
import {fetchDataHandler} from './Utils'



const EmployeeList = ({setToggleMain}) => {

    const {dispatch} = useContext(EmployeeContext)
    const {dispatchDaily} = useContext(DailyContext)
    const {employee, setEmployee} = useContext(MainEmployee)
    const [toggleMenu, setToggleMenu] = useState(true);

    const fetchUsers = () => {
        fetch(`api/users`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setEmployee(data);
        });
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        fetch(`api/daily`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const dailyTasksId = data.map(({task: {bitrix_id}}) => bitrix_id)
            const dailyList = prepareDailyList(data)
            dispatchDaily({type: 'GET_DAILY', tasks: dailyList, tasksId: dailyTasksId})
        });
    }, [])

    const prepareDailyList = (tasks) => {
        const dailyList = tasks.reduce((obj, taskObj) => {
            const task = fetchDataHandler(taskObj)
            obj[task.fullName] = (obj[task.fullName] === undefined) ?  [task] : [...obj[task.fullName], task]
            return obj
        }, {})
        return dailyList
    }


    const getUsersTasks = (id) => {
        fetch(`/api/tasks/user${id}`)
        .then( response => response.json())
        .then( data => 
            data.reduce((obj, {id: taskId, title, responsible: {id: emplId, name: fullName}}) => {
                obj = {
                    emplId,
                    fullName,
                    tasks: obj.tasks === undefined ? [{taskId, title}] : [...obj.tasks, {taskId, title}]
                }
                return obj
        }, {}))
        .then(emplData => dispatch({type: 'CHANGE_USER', emplData : emplData}))
        }


    if (employee.length == 0) {
        return null
    }

    else {
        return (
            <div className = {toggleMenu ? 'employeeListDiv': 'employeeListDiv'} >
            {/* <div className = 'employeeDiv' onClick = {() => setToggleMenu(false)}>Скрыть</div> */}
            <div className = 'employeeDiv' onClick = {() => setToggleMain(true)}>Главная</div>
            {employee.map(({bitrix_id: emplId, full_name: fullName}) => {
                return <div key = {emplId} className = 'employeeDiv'
                         onClick = {() => {
                             setToggleMain(false),
                             getUsersTasks(emplId)
                            }}>
                            {fullName}
                        </div>
            })}
            </div>
        )
    }
}


export default EmployeeList