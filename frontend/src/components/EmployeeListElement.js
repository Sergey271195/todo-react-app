import React from 'react'


const EmployeeListElement = ({emplId, photo, fullName, filterUsers, getUsersTasks}) => {
    
    if (filterUsers.length < 2 || fullName.toLowerCase().includes(filterUsers.toLowerCase())) {
        return (
            <div key = {emplId} className = 'employeeDiv'
                onClick = {() => {
                    getUsersTasks(emplId)
                }}>
                <img style = {{height: '36px', width: '36px', borderRadius: '50%', marginRight: '28px'}} src = {photo} />
                {fullName}
            </div>
        )
    }
    return <></>
    
}

export default EmployeeListElement