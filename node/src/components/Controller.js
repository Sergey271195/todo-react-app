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
import MobileMenuButtons from './MobileMenuButtons';
import { UserLoading } from './context/UserLoadingContext';
import { MobileContext } from './context/MobileContext';
import FilterUsersProvider from './context/FilterUsers';
import DatepickerComponent from './DatepickerComponent';
import { EmployeeContext } from './context/EmployeeContext';
import { AuthContext } from './context/AuthContext';
import { ViewsContext } from './context/ViewsContext';
import LoginComponent from './authcomponents/LoginComponent';
import SignupComponent from './authcomponents/SignupComponent';

const Contorller = () => {

    const {loadingUser, setLoadingUser} = useContext(UserLoading)
    const [error, setError] = useState(false)
    const { dailyTasks, dispatchDaily } = useContext(DailyContext)
    const { currEmployee } = useContext(EmployeeContext)

    /* Auth part */
    const { auth } = useContext(AuthContext)
    const { view, dispatchView } = useContext(ViewsContext)
    
    /* Mobile version */
    const { mobileMode, setMobileMode } = useContext(MobileContext);
    const [mobileDate, setMobileDate] = useState(false)

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
        dispatchView({type: 'LOADING'})
        fetch(`api/daily${date}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.status != 404) {
                const dailyTasksId = data.map(({task: {bitrix_id}}) => bitrix_id)
                const dailyList = prepareDailyList(data)
                dispatchDaily({type: 'GET_DAILY', tasks: dailyList, tasksId: dailyTasksId})
                setError(false)
                dispatchView({type: 'MAIN'})
                setTimeout(setLoadingUser, 100, false)
            }
            else {
                dispatchView({type: 'MAIN'})
                setError(true)
                setLoadingUser(false)
            }
        })
    }

    useEffect(() => {
      getFromLocalStorage('employee') ? dispatchView({type: 'EMPLOYEE'}): dispatchView({type: 'MAIN'})
    }, [])

    useEffect(() => {
        fetchDailyTasks(getCurrentDate())
    }, [])

    useEffect(() => {
        if (dailyTasks.tasksId.length === 0) return;
        setError(false)
    }, [dailyTasks])

    useEffect(() => {
        const handleWindowResize = () => {
            window.innerWidth < 600 ? setMobileMode({
                mode: true,
                menu: false
            }) : setMobileMode({
                    mode: false,
                    menu: false
                }) 
        }
        window.addEventListener('resize', handleWindowResize);
        handleWindowResize()
        return () => window.removeEventListener("resize", handleWindowResize)
    }, [])

    if (mobileMode.mode) {
        return (
            <FilterUsersProvider>
                <div className = 'mainDiv'>
                        <div className = 'contentDiv'>
                            <DateHeader fetchDailyTasks = {fetchDailyTasks} mobileDate = {mobileDate} setMobileDate = {setMobileDate}/>
                                {mobileDate ? <DatepickerComponent fetchDailyTasks = {fetchDailyTasks} mobileDate = {mobileDate} setMobileDate = {setMobileDate}/> : 
                                <>  
                                    {view.mobilemenu.show ? <EmployeeList /> : <>
                                        {view.login.show ? <LoginComponent />:
                                        <>
                                        {view.signup.show ? <SignupComponent />:
                                            <>
                                            { loadingUser ? <LoadingScreen /> :
                                                    <>{view.main.show ? <>{ error ? <NotFoundScreen /> :<DailyTasksList />}</>: <></>}
                                                        {view.employee.show ? <>{currEmployee ? <TasksList /> : <DailyTasksList/>}</> : <></>}
                                                    </>
                                                }
                                            </>}
                                        </>}
                                    </>}
                                </>}
                                <MobileMenuButtons />
                        </div>
                </div>
            </FilterUsersProvider>
        )
    }

    return (
        <FilterUsersProvider>
            <div className = 'mainDiv'>
                <>
                <EmployeeList />
                    <div className = 'contentDiv'>
                        <DateHeader fetchDailyTasks = {fetchDailyTasks} mobileDate = {mobileDate} setMobileDate = {setMobileDate}/> 
                            {view.login.show ? <LoginComponent />: <></>}
                            {view.signup.show ? <SignupComponent />: <></>}
                                { loadingUser ? <LoadingScreen /> :
                                    <>{view.main.show ? <>{ error ? <NotFoundScreen /> :<DailyTasksList />}</>: <></>}
                                        {view.employee.show ? <>{currEmployee ? <TasksList /> : <DailyTasksList/>}</> : <></>}
                                    </>
                                }
                    </div>
                </>
            </div>
        </FilterUsersProvider>
    )

}

export default Contorller