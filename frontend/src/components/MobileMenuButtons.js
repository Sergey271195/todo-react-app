import React, {useContext} from 'react';

/* Icons */
import {FiMenu} from 'react-icons/fi';
import { BiUser } from 'react-icons/bi';
import { BsCheckCircle, BsSearch } from 'react-icons/bs';
import { VscHome } from "react-icons/vsc";

/* Context */
import { MobileContext } from './context/MobileContext';

/* Styling */
import '../styles/MobileMenu.css';

const MobileMenuButtons = () => {

    const { mobileMode, setMobileMode } = useContext(MobileContext);

    return (
        <div className = 'menuBar'>

            <div className = 'mobileMenuDiv' onClick = {() => setMobileMode({
                    mode: true,
                    menu: true
                })}>
                <BiUser className = 'mobileMenuIcon' />
                <label className = 'mobileMenuLabel'>Сотрудники</label>
            </div>

            <div className = 'mobileMenuDiv'>
                <BsCheckCircle className = 'mobileMenuIcon' />
                <label className = 'mobileMenuLabel'>Задачи</label>
            </div>
            
            <div className = 'mobileMenuDiv'>
                <BsSearch className = 'mobileMenuIcon' />   
                <label className = 'mobileMenuLabel'>Поиск</label> 
            </div>
            
            <div className = 'mobileMenuDiv' onClick = {() => setMobileMode({
                    mode: true,
                    menu: false
                })}>
                <VscHome className = 'mobileMenuIcon' />
                <label className = 'mobileMenuLabel'>Главная</label>
            </div>
            
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