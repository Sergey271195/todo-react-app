import React from 'react'
import { VscHome } from "react-icons/vsc";
import { BiSearch } from "react-icons/bi"
import '../styles/Icons.css'

const EmployeeHeader = ({returnToMain}) => {

    return (
        <div className = 'HeaderDiv'>
            <VscHome size = '25px' onClick = {() => returnToMain()} className = 'homeIcon'/>
            <input type = 'text' className = 'filterUser'/><BiSearch size = '18px' className = 'searchIcon'/>
        </div>
    )

}

export default EmployeeHeader