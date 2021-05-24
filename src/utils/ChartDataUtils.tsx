export const getDirection = (val) => {
    if (val > 0) return 1;
    if (val < 0) return -1;
    return 0;
}

export const percentDelta = (initial:number, final:number, places:number=2):number => {
    return Number(((final - initial) / (Math.abs(initial)) * 100).toFixed(places))
}

export const percentToString = (val) => {
    if (val == 0) return `0%`
    if (val > 0) return `+${formatNumberString(val)}%`
    if (val < 0) return `${formatNumberString(val)}%`
    return '-'
}

export const valueToString = (val) => {
    return (!isNaN(val) && val != null)? 
    ((val < 0? '-' : '') + '$'+ formatNumberString((Math.abs(val).toFixed(2)))):( '-' )
}

export const formatNumberString = (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export const formatOptionTitle = (option, underlying) => option.replace(underlying+' ', '')
