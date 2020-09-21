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