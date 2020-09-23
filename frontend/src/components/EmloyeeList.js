import React, { useState, useEffect, useContext } from "react";
import { EmployeeContext } from "./context/EmployeeContext";

import EmployeeHeader from './EmployeeHeader'

import '../styles/EmployeeList.css'
import { MainEmployee } from "./context/MainEmployeeContext";
import { UserLoading } from "./context/UserLoadingContext";
import EmployeeListElement from "./EmployeeListElement";

const EmployeeList = ({setToggleMain}) => {

    const {dispatch} = useContext(EmployeeContext)
    const {employee, setEmployee} = useContext(MainEmployee)
    const {setLoadingUser} = useContext(UserLoading)
    const [filterUsers, setFilterUsers] = useState('')

    const returnToMain = () => {
        localStorage.removeItem('employee')
        setToggleMain(true)
      }

    const fetchUsers = () => {
        setEmployee({type: 'FETCH_USERS'})
        fetch(`api/users`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setEmployee({type: 'RETURN_USERS', data});
        });
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const getUsersTasks = (id) => {
        setLoadingUser(true)
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
        .then(emplData => {
                dispatch({type: 'CHANGE_USER', emplData : emplData})
                setLoadingUser(false)
                setToggleMain(false)
            })
        }


    return (
        <div className = 'employeeListDiv' >
        
        {(!employee || employee.loading) ? <div className = 'loadingDiv'>Loading...</div> : 
            <>
                <EmployeeHeader returnToMain = {returnToMain} setFilterUsers = {setFilterUsers} filterUsers = {filterUsers}/>

                {employee.users.map(({bitrix_id: emplId, full_name: fullName, photo}) => {
                    return <EmployeeListElement key = {emplId} emplId = {emplId} fullName = {fullName} photo = {photo}
                        getUsersTasks = {getUsersTasks} filterUsers = {filterUsers}/>
                })}

            </>
        }
        </div>
    )
}


export default EmployeeList