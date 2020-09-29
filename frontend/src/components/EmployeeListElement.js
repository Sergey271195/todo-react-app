import React, { useContext } from 'react'
import { MobileContext } from './context/MobileContext';


const EmployeeListElement = ({emplId, photo, fullName, filterUsers, getUsersTasks}) => {
    
    const { mobileMode, setMobileMode } = useContext(MobileContext);

    if (filterUsers.length < 2 || fullName.toLowerCase().includes(filterUsers.toLowerCase())) {
        return (
            <div key = {emplId} className = 'employeeDiv'
                onClick = {() => {
                    getUsersTasks(emplId)
                    if (mobileMode.mode) {
                        setMobileMode({
                            ...mobileMode,
                            menu: false
                        })
                    }
                }}>
                <img style = {{height: '36px', width: '36px', borderRadius: '50%', marginRight: '28px'}} src = {photo} />
                {fullName}
            </div>
        )
    }
    return <></>
    
}

export default EmployeeListElement