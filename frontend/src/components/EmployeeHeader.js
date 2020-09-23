import React from 'react'
import { VscHome } from "react-icons/vsc";
import { BiSearch } from "react-icons/bi"
import '../styles/Icons.css'

const EmployeeHeader = ({returnToMain, filterUsers, setFilterUsers}) => {

    return (
        <div className = 'HeaderDiv'>
            <VscHome size = '25px' onClick = {() => returnToMain()} className = 'homeIcon'/>
            <input type = 'text' className = 'filterUser' value = {filterUsers} 
                onChange = {(event) => setFilterUsers(event.target.value)}/>
            <BiSearch size = '18px' className = 'searchIcon'/>
        </div>
    )

}

export default EmployeeHeader