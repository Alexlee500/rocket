export const getDirection = (val) => {
    if (val > 0) return 1;
    if (val < 0) return -1;
    return 0;
}

export const percentDelta = (initial:number, final:number, places:number=2):number => {
    return Number(((final - initial) / (Math.abs(initial)) * 100).toFixed(places))
}

export const percentToString = (val) => {
    return (!isNaN(val) && val != null) ? (
        (val>=0? '+':'') + val + '%'):('-')
}

export const valueToString = (val) => {
    return (!isNaN(val) && val != null)? 
    ((val < 0? '-' : '') + '$'+ Math.abs(val).toFixed(2)):( '-' )
}