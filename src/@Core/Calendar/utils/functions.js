import {dayString} from './constants'
import useDate from '../hooks/useDate'
var userAgent = navigator.userAgent;

export const getDateHeaderString = date => {
    const {month,dayTime,day} = useDate(date)
    return `${parseInt(month)}/${parseInt(dayTime)}${dayString[day]}`
}

export const getDateInBox = (dates, index, time) => {
    let chooseDate;
    const {month,dayTime,year} = useDate(dates[index])

    if(userAgent.indexOf("Safari") !== -1) {
        chooseDate = new Date(`${year}/${month}/${dayTime} ${time}`)
    }else {
        chooseDate = new Date(`${year}-${month}-${dayTime} ${time}`)
    }

    return chooseDate.getTime()
}

export const checkDisabledDate = (disableDates,date) => {
    let check = false;
    for (const d of disableDates) {
        if(d.getTime() === date) {
            check = true;
        }
    }
    return check;
}