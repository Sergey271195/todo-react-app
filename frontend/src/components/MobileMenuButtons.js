import React, {useContext, useState} from 'react';

/* Icons */
import {FiMenu} from 'react-icons/fi';
import { BiUser } from 'react-icons/bi';
import { BsCheckCircle, BsSearch } from 'react-icons/bs';
import { VscHome, VscChromeClose } from "react-icons/vsc";

/* Context */
import { MobileContext } from './context/MobileContext';

/* Styling */
import '../styles/MobileMenu.css';
import { FilterUsers } from './context/FilterUsers';

const MobileMenuButtons = ({setToggleMain}) => {

    const returnToMain = () => {
        localStorage.removeItem('employee')
        setToggleMain(true)
      }
    const { setMobileMode } = useContext(MobileContext);
    const {filterUsers, setFilterUsers} = useContext(FilterUsers);
    const [search, setSearch] = useState(false)
    /* let path = document.getElementById('app');
    let attr = path.getAttribute('static-path'); */


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
            </>}
            
        </div>
       
    )
}



export default MobileMenuButtons

{/* <FiMenu style = {{fontSize: '30px', cursor: 'pointer', position: 'absolute', bottom: '20px',
            right: '30px', padding: '8px', borderRadius: '50%', backgroundColor: '#FDD835', zIndex: '2'}}
                onClick = {() => {
                    setMobileMode({...mobileMode, menu: !mobileMode.menu})
                }}
        /> */}