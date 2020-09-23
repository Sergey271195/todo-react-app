export const fetchDataHandler = ({task: {bitrix_id: taskId, title},
    employee_id: {bitrix_id: emplId, full_name: fullName}, pk, completed, comments}) => {
        return {
            taskId, title,
            emplId, fullName,
            pk, completed, comments
        }
}

export const postFetch = ({url, data}) => {
    return fetch(url, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(data)
        }).then(response => response.json())
}

export const saveToLocalStorage = ({key, data}) => {
    localStorage.setItem(key, JSON.stringify(data))
}

export const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data): data 
}

export const getCurrentDate = () => {
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const today = `${date.getFullYear()}-${month < 10 ? ('0' + month): month}-${day < 10 ? ('0' + day): day}`
    return today
}

export const LIGHT = {
    color: '#1F1F1F'
  }
  
export const DARK = {
    color: 'white'
  }

export const DARKBACKGROUND = {
    backgroundColor: '#1A1A1A'
}

export const LIGHTBACKGROUND = {
    backgroundColor: '#FFFFFF'
}