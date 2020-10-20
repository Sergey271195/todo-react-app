import React, {useContext, useEffect, useState } from 'react'
import {BiPauseCircle, BiTimeFive} from 'react-icons/bi'
import { DailyContext } from './context/DailyTasksContext'

const handleTime = (time) => {
    return {
        hours: Math.floor(time/3600),
        minutes: Math.floor(time/60) - Math.floor(time/3600)*60,
        seconds: time%60,
        total: time
    }
}

const TimeTracker = ({emplId, taskId, time, rightDate, employee, index}) => {

    const [tracking, setTracking] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
    })

    const managersIds = [26, 334, 406]

    const { active, startingTime, totalTime } = time
    const { dailyTasks, dispatchDaily } = useContext(DailyContext)
    const [ manager, setManager ] = useState(true)

    useEffect(() => {
        managersIds.includes(emplId) ? setManager(true): setManager(false)
    }, [emplId])

    useEffect(() => {
        setTracking(handleTime(totalTime))
        if (active) {
            const start = Date.parse(startingTime)
            const now = Date.parse(new Date())
            setTracking(handleTime(totalTime + Math.floor((now-start)/1000)))
        }
    }, [])

    useEffect(() => {
        let tracker
        if (active) {
            tracker = setInterval(() => {setTracking
                (handleTime(tracking.total+1))
            }, 1000)

        }
        return () => {
            clearInterval(tracker)
        }
    }, [active, tracking])

    


    const startTracking = () => {
        if (dailyTasks.tasks[employee][index].completed) return
        const activeArray = dailyTasks.tasks[employee].filter(item => item.time.active)
        if (activeArray.length > 0) return
        dispatchDaily({type: 'SWITCH_ACTIVE', taskId, active})
        fetch(`api/time/start&user${emplId}&task${taskId}`)
            .then(response => response.json())
                .then(data => console.log(data))
    }

    const stopTracking = () => {
        dispatchDaily({type: 'SWITCH_ACTIVE', taskId, active})
        fetch(`api/time/end&user${emplId}&task${taskId}`)
            .then(response => response.json())
                .then(data => console.log(data))
    }

    return (
        <>
        {(rightDate && !manager) ? <>{
        active ? <BiPauseCircle className = 'timeBtn' onClick = {() => stopTracking()} title = 'Завершить учет затраченного времени (Затраченное время будет сохранено в Битрикс24)'/> 
        : <BiTimeFive className = 'timeBtn' onClick = {() => startTracking()} title = 'Начать учет затраченного времени'/>
        }</> : <></>}
        {!manager && <div className = 'timeNum'>{`${tracking.hours}:${tracking.minutes >= 10 ?  
                tracking.minutes: '0'+tracking.minutes}:${tracking.seconds >= 10 ?
                    tracking.seconds: '0'+tracking.seconds}`}
        </div>}
        </>
        
    )
}

export default TimeTracker