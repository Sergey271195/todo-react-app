import React from 'react'
import { BiPlus } from "react-icons/bi"

import '../styles/UsernameTitle.css'

const UsernameTitle = ({employee, emplId}) => {
    return (
        <>
            <div className = 'usernameTitleDiv'>
                {employee}
            </div>
            <div className = 'addTaskContainer'>
                <BiPlus className = 'plusIcon'/>
                <p className = 'addTaskLabel' >Добавить задачу</p>
            </div>
        </>
    )
}

export default UsernameTitle