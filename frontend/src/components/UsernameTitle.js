import React from 'react'

import '../styles/UsernameTitle.css'
import AddNewTaskForm from './AddNewTaskForm'

const UsernameTitle = ({employee, emplId}) => {
    
    return (
        <>
            <div className = 'usernameTitleDiv'>
                {employee}
            </div>
            <AddNewTaskForm emplId = {emplId}/>
        </>
    )
}

export default UsernameTitle