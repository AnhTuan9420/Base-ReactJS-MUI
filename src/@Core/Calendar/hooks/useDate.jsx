const useDate = date => {
    const month = date.getMonth() + 1
    const dayTime = date.getDate()
    const year = date.getFullYear()
    const day = date.getDay()

    return {month, day, year,dayTime}
}

export default useDate