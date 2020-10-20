import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ViewsContext } from '../context/ViewsContext'
import { postFetch, DARK, DARKBACKGROUND, LIGHT, TRANSPARENTBACKGROUND } from '../Utils'
import '../../styles/Auth.css'
import { MobileContext } from '../context/MobileContext'
import { ModeContext } from '../context/ModeContext'

const LoginComponent = () => {

    const [ formData, setFormData ] = useState({
        username: '',
        password: ''
    })

    const { dispatchAuth } = useContext(AuthContext)
    const { dispatchView } = useContext(ViewsContext)
    const { mobileMode } = useContext(MobileContext)
    const { mode } = useContext(ModeContext)

    const logInUser = (event) => {
        event.preventDefault()
        if (formData.username === '') return
        if (formData.password === '') return
        postFetch({url: 'api/auth/login', data: formData})
            .then(data => {
                if (data.STATUS_CODE !== 500) {
                    dispatchAuth({type: 'LOGIN', data: data}),
                    dispatchView({type: 'MAIN'})
                }
            })
                .catch(error => console.log(error))
        setFormData({
            username: '',
            password: ''
        })
    }

    return (
        <div className = 'authContainer' style = {mode ? {...DARK, ...DARKBACKGROUND} : {...LIGHT, ...TRANSPARENTBACKGROUND}}>
            <div className = {'formContainer ' + (mobileMode.mode ? 'mobile': '')}>
                <form onSubmit = {(event) => logInUser(event)} style = {{display: 'flex', flexDirection: 'column'}}>
                    <div>Логин</div>
                    <input className = 'authInput' placeholder = 'Логин' value = {formData.username} type = 'text'
                        onChange = {(event) => setFormData({...formData, username: event.target.value})}/>
                    <div>Пароль</div>
                    <input className = 'authInput' placeholder = 'Пароль' value = {formData.password} type = 'password'
                        onChange = {(event) => setFormData({...formData, password: event.target.value})}/>
                    <button className = 'authBtn'>Войти</button>
                </form>
                <div style = {{display: 'flex', flexDirection: 'column'}}>Нет аккаунта?
                <button className = 'authBtn' onClick = {() => dispatchView({type: 'SIGNUP'})}>Регистрация</button>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent
