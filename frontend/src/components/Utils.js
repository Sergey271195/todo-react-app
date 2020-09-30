export const fetchDataHandler = ({task: {bitrix_id: taskId, title},
    employee_id: {bitrix_id: emplId, full_name: fullName}, pk, completed, comments,
                    active, starting_time: startingTime, ending_time: endingTime, total_time: totalTime}) => {
        return {
            taskId, title,
            emplId, fullName,
            pk, completed, comments,
            time: {active, startingTime,
            endingTime, totalTime}
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

export const Months = {
    1:  'Января',
    2:	'Февраля',
    3:	'Марта',
    4:	'Апреля',
    5:	'Мая',
    6:	'Июня',
    7:	'Июля',
    8:	'Августа',
    9:	'Сентября',
    10:	'Октября',
    11:	'Ноября',
    12:	'Декабря',
}

export const Months_IP = {
    1:  'Январь',
    2:	'Февраль',
    3:	'Март',
    4:	'Апрель',
    5:	'Май',
    6:	'Июнь',
    7:	'Июль',
    8:	'Август',
    9:	'Сентябрь',
    10:	'Октябрь',
    11:	'Ноябрь',
    12:	'Декабрь',
}

export const Weekdays = {
    0: 'Воскресенье',
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота'
}

export const formatDate = (date) => {
    const [year, month, day] = date.split('-')
    const monthName = Months[parseInt(month)].toLowerCase()
    const weekday = new Date(date).getDay()
    return `${day} ${monthName} ${year} (${Weekdays[weekday]})`
}