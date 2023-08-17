export function greetings(): string {
    const date = new Date();
    const hours = date.getHours();

    let status = '';
    if (hours > 4 && hours < 12) {
        status = 'morning';
    } else if (hours >= 12 && hours < 18) {
        status = 'afternoon';
    } else if (hours >= 18 && hours < 23) {
        status = 'evening';
    } else {
        status = 'night';
    }

    return `Good ${status}`;
}
