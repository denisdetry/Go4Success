import dayjs from "dayjs";
import { DateType } from "react-native-ui-datepicker";

export const convertDateToISO = (date: DateType): string | null => {
    if (date instanceof Date) {
        return date.toISOString().split("T")[0];
    } else if (typeof date === "string" && date !== "") {
        return date;
    } else if (typeof date === "number") {
        return new Date(date).toISOString().split("T")[0];
    } else if (date instanceof dayjs) {
        return date.format("YYYY-MM-DD");
    } else {
        return null;
    }
};
