export const generateHourQuarterList = () => {
    const list = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let quarter = 0; quarter < 4; quarter++) {
            // key is an integer from 0 to 95 caster to string
            const key = (hour * 4 + quarter).toString();
            const value = `${hour.toString().padStart(2, "0")}:${(quarter * 15).toString().padStart(2, "0")}`;
            list.push({ key, value });
        }
    }
    return list;
};
