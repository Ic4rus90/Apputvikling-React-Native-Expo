import {Round2} from './ExtraMath'

/**
 *
 * @param date
 */
export const DateTimeToBeautiful = (date : Date|number|string) : string => {
    let epoch : number = ToEpoch(date);
    let now : number = EpochNow();

    if(epoch > (now + 60 * 60 * 24)) { // If within the next day
        const value = Round2((epoch - now)/60/60/24, 2);
        const days = Math.floor(value);
        const hours = Math.floor((value - days) * 24);
        return `${days} days, ${hours} hours`;
    }else if(epoch > (now + 60 * 60)) { // If within the next day
        const value = Round2((epoch - now)/60/60, 2);
        const hours = Math.floor(value);
        const minutes = Math.floor((value - hours) * 60);
        return `${hours} hours, ${minutes} minutes`;
    }else if(epoch > (now + 60)) { // If within the next hour
        const value = Round2((epoch - now)/60, 2);
        const minutes = Math.floor(value);
        const seconds = Math.floor((value - minutes) * 60);
        return `${minutes} minutes, ${seconds} seconds`;
    }else if(epoch > (now)) { // If within the next minute
        const value = Math.floor(epoch - now);
        return `${value} seconds`;
    }

    else if(epoch > (now - 60)) { // If within the previous minute
        const value = Math.floor(now - epoch);
        return `${value} seconds ago`;
    }else if(epoch > (now - 60 * 60)) { // If within the previous hour
        const value = Round2((now - epoch)/60, 1);
        const minutes = Math.floor(value);
        const seconds = Math.floor((value - minutes) * 60);
        return `${minutes} minutes, ${seconds} seconds ago`;
    }else if(epoch > (now - 60 * 60 * 24)) { // If within the previous day
        const value = Round2((now - epoch)/60/60, 1);
        const hours = Math.floor(value);
        const minutes = Math.floor((value - hours) * 60);
        return `${hours} hours, ${minutes} minutes ago`;
    }else if(epoch > (now - 60 * 60 * 24 * 3)) { // If within the previous 3 days
        const value = Round2((now - epoch)/60/60/24, 1);
        const days = Math.floor(value);
        const hours = Math.floor((value - days) * 60);
        return `${days} days, ${hours} hours ago`;
    }else{
        let d = new Date(epoch);
        return d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
            ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
    }
}

/**
 * The amount of seconds between 2 dates
 * @param timeDate1 start time
 * @param timeDate2 end time
 */
export const SecondsBetween = (timeDate1 : Date|number|string, timeDate2: Date|number|string) : number =>{
    const epoch1 = ToEpoch(timeDate1);
    const epoch2 = ToEpoch(timeDate2);

    return epoch1 - epoch2
}

/**
 * The epoch right now in seconds
 */
export const EpochNow = () : number => {
    let now = new Date();
    return Math.floor(now.getTime() / 1000)
}

/**
 * Convert a string, number or Date into epoch seconds.
 * @param date{string|number|Date} The date input is dynamic, and can be string, number or Date.
 */
export const ToEpoch = (date : string|number|Date) : number => {
    if (typeof date === "number" && 10000000000 > date){
        date = Math.floor(date*1000);
    }
    if (date instanceof Date)
        return Math.floor(date.getTime() / 1000);

    let someDate = new Date(date);
    return Math.floor(someDate.getTime() / 1000);
}