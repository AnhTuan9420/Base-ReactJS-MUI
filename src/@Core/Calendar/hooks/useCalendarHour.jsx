import {useMemo} from 'react'

const useCalendarHour = between => {
    // Loop from current hour number to 23
    const hours = useMemo(() => {
        const result = []
        for (var i = 0; i < 24; i++) {
            if(i < 10) {
                result.push('0' + i + ':00')
            }else {
                result.push(i + ':00')
            }
        }
        return result
    }, [between])

    return hours
}

export default useCalendarHour
