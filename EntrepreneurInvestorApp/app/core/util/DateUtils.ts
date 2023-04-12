import * as moment from "moment";


export class DateUtils{
    constructor(){}
    
    static convertISOStringToDate(isoString?){
        return (moment(isoString).toDate()   )
    }
    static formatGivenDate(date = new Date(), formatPattern = "YYYY-MM-DD"){
        return (moment(date).format(formatPattern))
    }
    static getFormattedDateFromISOString(isoString, formatPattern){
        let date = moment(isoString)
        return date.format(formatPattern)
    }
    static compareDateAndReturnSeconds(isoString){
        let today = new Date().toISOString()
        let timeStart = moment(today).toDate().getTime();
        let timeEnd = moment(isoString).toDate().getTime();
        let hourDiff = timeEnd - timeStart; //in ms
        let minutes = Math.floor(hourDiff / 60000);
        return minutes*60
    }

    static getTimeInUsersTimezone(time, timezone) {
        return moment(new Date(time)).utc().utcOffset(timezone)
    }

    static addMins(time, minutes){
        const currentTime = new Date(time)
        if (currentTime.getMinutes() > minutes) {
            currentTime.setHours(currentTime.getHours() + 1)
            currentTime.setMinutes(0)
        } else {
            currentTime.setMinutes(currentTime.getMinutes() + 30)
        }
        return currentTime
    }
}
