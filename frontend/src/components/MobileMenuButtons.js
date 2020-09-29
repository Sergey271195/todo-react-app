import React, { useContext, useState, useEffect } from 'react';

/* Icons */
import { BiUser } from 'react-icons/bi';
import { BsCheckCircle, BsSearch } from 'react-icons/bs';
import { VscHome, VscChromeClose } from "react-icons/vsc";

/* Context */
import { MobileContext } from './context/MobileContext';

/* Styling */
import '../styles/MobileMenu.css';
import { FilterUsers } from './context/FilterUsers';

const MobileMenuButtons = ({setToggleMain}) => {


    const { setMobileMode } = useContext(MobileContext);
    const {filterUsers, setFilterUsers} = useContext(FilterUsers);
    const [search, setSearch] = useState(false)

    useEffect(() => {
        setToggleMain(true)
    }, [])

    return (
        <div className = 'menuBar'>
            {search ? 
            <>
                <input placeholder = 'Сотрудник' className = 'mobileFilterInput' value = {filterUsers} 
                    onChange = {(event) => {
                        event.preventDefault()
                        setFilterUsers(event.target.value)
                        setMobileMode({
                            mode: true,
                            menu: true
                        })
                        }} />
                <VscChromeClose className = 'mobileMenuIcon' onClick = {() => {
                    setSearch(false),
                    setFilterUsers('')
                }}/>
            </>:
            <>
                <div className = 'mobileMenuDiv' onClick = {() => {
                        setMobileMode({
                            mode: true,
                            menu: false
                        })
                        setToggleMain(true)
                    }}>
                        <VscHome className = 'mobileMenuIcon' />
                        <label className = 'mobileMenuLabel'>Главная</label>
                </div>
                <div className = 'mobileMenuDiv' onClick = {() => setMobileMode({
                        mode: true,
                        menu: true
                    })}>
                    <BiUser className = 'mobileMenuIcon' />
                    <label className = 'mobileMenuLabel'>Сотрудники</label>
                </div>

                <div className = 'mobileMenuDiv' onClick = {() => {
                    setMobileMode({
                        mode: true,
                        menu: false
                    })
                    setToggleMain(false)
                }}>
                    <BsCheckCircle className = 'mobileMenuIcon' />
                    <label className = 'mobileMenuLabel'>Задачи</label>
                </div>
                
                <div className = 'mobileMenuDiv' onClick = {() => {
                    setSearch(!search)
                    setMobileMode({
                        mode: true,
                        menu: true
                    })
                }}>
                    <BsSearch className = 'mobileMenuIcon' />   
                    <label className = 'mobileMenuLabel'>Поиск</label> 
                </div>
                
                
            </>}
            
        </div>
       
    )
}



export default MobileMenuButtons
