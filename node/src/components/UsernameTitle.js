import React, {useContext} from 'react'

import '../styles/UsernameTitle.css'
import AddNewTaskForm from './AddNewTaskForm'

const UsernameTitle = ({employee, emplId, mainList}) => {

    return (
        <>
            <div className = 'usernameTitleDiv'>
                {employee}
            </div>
            <AddNewTaskForm emplId = {emplId} mainList = {mainList}/>
        </>
    )
}

export default UsernameTitle