import React, { useContext } from 'react'
import { VscHome } from "react-icons/vsc";
import { BiSearch } from "react-icons/bi"
import { FiMoon, FiSun } from "react-icons/fi"
import '../styles/Icons.css'
import { ModeContext } from './context/ModeContext';
import { DARK, LIGHT, DARKBACKGROUND, LIGHTBACKGROUND } from './Utils';

const EmployeeHeader = ({returnToMain, filterUsers, setFilterUsers}) => {

    const {mode, setMode} = useContext(ModeContext)

    return (
        <div className = 'HeaderDiv'>
            {mode ? <FiMoon size = '20px' onClick = {() => setMode(!mode)} className = 'modeIcon'/>
            : <FiSun size = '20px' onClick = {() => setMode(!mode)} className = 'modeIcon'/>
            }
            
            <VscHome size = '25px' onClick = {() => returnToMain()} className = 'homeIcon'/>
            <input type = 'text' className = 'filterUser' value = {filterUsers} 
                onChange = {(event) => setFilterUsers(event.target.value)} 
                style = {mode ? {...DARK, ...DARKBACKGROUND} : {...LIGHT, ...LIGHTBACKGROUND}}/>
            <BiSearch size = '18px' className = 'searchIcon'/>
        </div>
    )

}

export default EmployeeHeader