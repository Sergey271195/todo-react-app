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
    const { active, startingTime, totalTime } = time
    const { dailyTasks, dispatchDaily } = useContext(DailyContext)

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
        {rightDate ? <>{
        active ? <BiPauseCircle className = 'timeBtn' onClick = {() => stopTracking()} title = 'Завершить учет затраченного времени (Затраченное время будет сохранено в Битрикс24)'/> 
        : <BiTimeFive className = 'timeBtn' onClick = {() => startTracking()} title = 'Начать учет затраченного времени'/>
        }</> : <></>}
        <div className = 'timeNum'>{`${tracking.hours}:${tracking.minutes >= 10 ?  
                tracking.minutes: '0'+tracking.minutes}:${tracking.seconds >= 10 ?
                    tracking.seconds: '0'+tracking.seconds}`}
        </div>
        </>
        
    )
}

export default TimeTracker