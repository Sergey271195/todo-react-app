import React, { useContext, useState, useEffect } from 'react';

/* Icons */
import { BiUser } from 'react-icons/bi';
import { BsCheckCircle } from 'react-icons/bs';
import { VscHome, VscChromeClose } from "react-icons/vsc";
import { FiLogIn, FiLogOut } from 'react-icons/fi'

/* Context */
import { MobileContext } from './context/MobileContext';

/* Styling */
import '../styles/MobileMenu.css';
import { FilterUsers } from './context/FilterUsers';
import { ViewsContext } from './context/ViewsContext';
import { AuthContext } from './context/AuthContext';

const MobileMenuButtons = () => {


    const { setMobileMode } = useContext(MobileContext);
    const {filterUsers, setFilterUsers} = useContext(FilterUsers);
    const {dispatchView} = useContext(ViewsContext)
    const {auth, dispatchAuth} = useContext(AuthContext)
    const [search, setSearch] = useState(false)

    useEffect(() => {
        dispatchView({type: 'MAIN'})
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
                        dispatchView({type: 'MAIN'})
                    }}>
                        <VscHome className = 'mobileMenuIcon' />
                        <label className = 'mobileMenuLabel'>Главная</label>
                </div>
                <div className = 'mobileMenuDiv' onClick = {() => {
                    setMobileMode({
                        mode: true,
                        menu: true
                    }),
                    dispatchView({type: 'MOBILEMENU'})}}>
                    <BiUser className = 'mobileMenuIcon' />
                    <label className = 'mobileMenuLabel'>Сотрудники</label>
                </div>

                <div className = 'mobileMenuDiv' onClick = {() => {
                    setMobileMode({
                        mode: true,
                        menu: false
                    })
                    dispatchView({type: 'EMPLOYEE'})
                }}>
                    <BsCheckCircle className = 'mobileMenuIcon' />
                    <label className = 'mobileMenuLabel'>Задачи</label>
                </div>

                <div className = 'mobileMenuDiv' onClick = {() => {

                }}>
                    {auth.authenticated ? 
                    <>
                        <FiLogOut onClick = {() => {
                            dispatchAuth({type: 'LOGOUT'}),
                            dispatchView({type: 'LOGIN'})
                        }} className = 'mobileMenuIcon'/>
                        <label className = 'mobileMenuLabel'>{auth.username}</label> 
                    </>
                    : 
                    <>
                    <FiLogIn className = 'mobileMenuIcon'
                        onClick = {() => dispatchView({type: 'LOGIN'})}/>
                    <label className = 'mobileMenuLabel'>Войти</label> 
                    </>}
                    
                </div>
                
                
            </>}
            
        </div>
       
    )
}



export default MobileMenuButtons

//If you will need to reimplement search

{/* <div className = 'mobileMenuDiv' onClick = {() => {
    setSearch(!search)
    setMobileMode({
        mode: true,
        menu: true
    })
}}>
    <BsSearch className = 'mobileMenuIcon' />   
    <label className = 'mobileMenuLabel'>Поиск</label> 
</div> */}
