import React, { useEffect, useState, useContext } from 'react'

import { getFromLocalStorage, fetchDataHandler, getCurrentDate } from './Utils';

import TasksList from "./TasksList";
import DailyTasksList from "./DailyTasksList";
import EmployeeList from "./EmloyeeList";

import '../styles/App.css';
import { DailyContext } from './context/DailyTasksContext';
import DateHeader from './DateHeader';
import LoadingScreen from './Loading';
import NotFoundScreen from './NotFoundScreen';
import GoodMorningGreeting from './GoodMorning';
import { UserLoading } from './context/UserLoadingContext';

const Contorller = () => {

    const [toggleMain, setToggleMain] = useState(true)
    const {loadingUser, setLoadingUser} = useContext(UserLoading)
    const [error, setError] = useState(false)
    const { dispatchDaily } = useContext(DailyContext)
    const [ greeting, setGreeting ] = useState(false) 

    const prepareDailyList = (tasks) => {
        const dailyList = tasks.reduce((obj, taskObj) => {
            const task = fetchDataHandler(taskObj)
            obj[task.fullName] = (obj[task.fullName] === undefined) ?  [task] : [...obj[task.fullName], task]
            return obj
        }, {})
        return dailyList
    }

    const fetchDailyTasks = (date) => {
        setLoadingUser(true)
        fetch(`api/daily${date}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.status != 404) {
                const dailyTasksId = data.map(({task: {bitrix_id}}) => bitrix_id)
                const dailyList = prepareDailyList(data)
                dailyTasksId.length == 0 ? setGreeting(true) : setGreeting(false)
                dispatchDaily({type: 'GET_DAILY', tasks: dailyList, tasksId: dailyTasksId})
                setError(false)
                setTimeout(setLoadingUser, 100, false)
            }
            else {
                setError(true)
                setLoadingUser(false)
            }
        })
    }

    useEffect(() => {
      getFromLocalStorage('employee') ? setToggleMain(false): setToggleMain(true)
    }, [])

    useEffect(() => {
        fetchDailyTasks(getCurrentDate())
    }, [])

    return (
        <>
            <div className = 'mainDiv'>
                <EmployeeList setToggleMain = {setToggleMain}/>
                    <div className = 'contentDiv'>
                        <DateHeader fetchDailyTasks = {fetchDailyTasks}/>
                        { loadingUser ? <LoadingScreen /> :
                            <>{ greeting ? <GoodMorningGreeting /> :
                                    <>{toggleMain ? 
                                        <>{ error ? <NotFoundScreen /> :
                                            <DailyTasksList /> 
                                        }</>
                                        : <TasksList />
                                    }</>
                                }</>
                            }
                    </div>
            </div>
        </>
    )

}

export default Contorller