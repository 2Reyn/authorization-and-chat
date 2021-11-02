import 'colors';

const getTimestamp = () => {
    const dt = new Date()
    return `[${
        dt.getDate().toString().padStart(2, '0')}.${
        (dt.getMonth()+1).toString().padStart(2, '0')}.${
        dt.getFullYear().toString().padStart(4, '0')} ${
        dt.getHours().toString().padStart(2, '0')}:${
        dt.getMinutes().toString().padStart(2, '0')}:${
        dt.getSeconds().toString().padStart(2, '0')}]`
}

export class Logs {
    static info(...args: any[]){
        console.log(getTimestamp(), '[INFO]'.cyan, ...args);
    }
    static warn(...args: any[]){
        console.warn(getTimestamp(), '[WARN]'.yellow, ...args);
    }
    static error(...args: any[]){
        console.error(getTimestamp(), '[ERROR]'.red, ...args);
    }
    static crash(...args: any[]){
        this.error(...args);
        process.exit(-1);
    }
}