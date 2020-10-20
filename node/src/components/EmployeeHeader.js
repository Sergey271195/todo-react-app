import React, { useContext } from 'react'
import { VscHome } from "react-icons/vsc";
import { BiSearch } from "react-icons/bi"
import { FiMoon, FiSun } from "react-icons/fi"
import '../styles/Icons.css'
import { ModeContext } from './context/ModeContext';
import { DARK, LIGHT, DARKBACKGROUND, LIGHTBACKGROUND, saveToLocalStorage } from './Utils';
import { MobileContext } from './context/MobileContext';
import { FilterUsers } from './context/FilterUsers';

const EmployeeHeader = ({returnToMain}) => {

    const { mode, setMode } = useContext(ModeContext)
    const { mobileMode } = useContext(MobileContext)
    const {filterUsers, setFilterUsers} = useContext(FilterUsers)

    const saveMode = () => {
        saveToLocalStorage({key: 'mode', data: !mode})
        setMode(!mode)
    }

    return (
        <div className = 'HeaderDiv'>
            {mobileMode.mode ? <></> :
            <>
                {mode ? <FiMoon size = '20px' onClick = {() => saveMode()} className = 'modeIcon' title = 'Дневной режим'/>
                : <FiSun size = '20px' onClick = {() => saveMode()} className = 'modeIcon' title = 'Ночной режим'/>
                }
                
                <VscHome size = '25px' onClick = {() => returnToMain()} className = 'homeIcon' title = 'К списку задач на день'/>
                <input type = 'text' className = 'filterUser' value = {filterUsers} title = 'Поиск сотрудника по имени'
                    onChange = {(event) => setFilterUsers(event.target.value)} placeholder = 'Сотрудник' 
                    style = {mode ? {...DARK, ...DARKBACKGROUND} : {...LIGHT, ...LIGHTBACKGROUND}}/>
                <BiSearch size = '18px' className = 'searchIcon'/>
            </>}
        </div>
    )

}

export default EmployeeHeader