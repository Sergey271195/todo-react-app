import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ViewsContext } from '../context/ViewsContext'
import { postFetch, DARK, DARKBACKGROUND, LIGHT, TRANSPARENTBACKGROUND } from '../Utils'
import '../../styles/Auth.css'
import { MobileContext } from '../context/MobileContext'
import { ModeContext } from '../context/ModeContext'

const SignupComponent = () => {

    const { dispatchAuth } = useContext(AuthContext)
    const { dispatchView } = useContext(ViewsContext)
    const { mobileMode } = useContext(MobileContext)
    const { mode } = useContext(ModeContext)

    const [ formData, setFormData ] = useState({
        bitrix_key: '',
        username: '',
        password: ''
    })

    const logInUser = (event) => {
        event.preventDefault()
        if (formData.username === '') return
        if (formData.password === '') return
        if (formData.bitrix_key === '') return
        postFetch({url: 'api/auth/register', data: formData})
            .then(data => {
                if (data.STATUS_CODE !== 500) {
                    dispatchAuth({type: 'LOGIN', data: data}),
                    dispatchView({type: 'MAIN'})
                }
            })
                .catch(error => console.log(error))
        setFormData({
            bitrix_key: '',
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
                <div>Ключ Битрикс24</div>
                <input className = 'authInput' placeholder = 'Ключ' value = {formData.bitrix_key} type = 'text'
                    onChange = {(event) => setFormData({...formData, bitrix_key: event.target.value})}/>
                <button className = 'authBtn'>Регистрация</button>
            </form>
            <div style = {{display: 'flex', flexDirection: 'column'}}>Уже есть аккаунт?
                <button className = 'authBtn' onClick = {() => dispatchView({type: 'LOGIN'})}>Войти</button>
            </div>
            </div>
        </div>
    )
}

export default SignupComponent