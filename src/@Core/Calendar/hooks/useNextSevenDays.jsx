import React, {useMemo} from 'react'

const useNextSevenDays = dateNow => {
    const currDate = dateNow.getTime()
    var result = []

    for (var i = 0; i < 7; i++) {
        result.push(new Date(new Date(currDate).setDate(new Date(currDate).getDate() + i)))
    }

    return result
}

export default useNextSevenDays
