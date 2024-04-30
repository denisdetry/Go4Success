import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import DateTimePicker, { DateType, ModeType } from "react-native-ui-datepicker";
import dayjs from "dayjs";

interface DatePickerProps {
    readonly onDateRangeChange: (
        date: DateType,
        range: { startDate: DateType; endDate: DateType },
    ) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateRangeChange }) => {
    const [locale] = useState("fr");
    const [mode, setMode] = useState<ModeType>("range");
    const [date, setDate] = useState<DateType | undefined>();
    const [range, setRange] = React.useState<{
        startDate: DateType;
        endDate: DateType;
    }>({ startDate: undefined, endDate: undefined });

    type ParamsType = { date: DateType } | { startDate: DateType; endDate: DateType };

    const onChange = useCallback(
        (params: ParamsType) => {
            if (mode === "single") {
                setDate((params as { date: DateType }).date);
            } else if (mode === "range") {
                setRange(params as { startDate: DateType; endDate: DateType });
            }
        },
        [mode],
    );

    const toggleMode = () => {
        setMode((prevMode) => (prevMode === "single" ? "range" : "single"));
    };

    useEffect(() => {
        onDateRangeChange(date, range);
    }, [date, range]);

    return (
        <View style={styles.container}>
            <Button
                title={`Switch to ${mode === "single" ? "range" : "single"} mode`}
                onPress={toggleMode}
            />
            <DateTimePicker
                mode={mode as "single" | "range"}
                locale={locale}
                date={date}
                startDate={range.startDate}
                endDate={range.endDate}
                onChange={onChange}
            />
            <Button
                title="Clear dates"
                onPress={() => {
                    setDate(null);
                    setRange({ startDate: null, endDate: null });
                }}
            />
            <View style={{ gap: 3 }}>
                {mode === "single" && date && (
                    <Text>
                        <Text
                            style={{
                                marginRight: 5,
                                fontWeight: "bold",
                            }}
                        >
                            Date:
                        </Text>
                        {dayjs(date).locale(locale).format("MMMM, DD, YYYY")}
                    </Text>
                )}
                {mode === "range" && (
                    <>
                        <Text>
                            <Text
                                style={{
                                    marginRight: 5,
                                    fontWeight: "bold",
                                }}
                            >
                                Start Date:
                            </Text>
                            {range.startDate
                                ? dayjs(range.startDate)
                                      .locale(locale)
                                      .format("MMMM, DD, YYYY")
                                : "..."}
                        </Text>
                        <Text>
                            <Text
                                style={{
                                    marginRight: 5,
                                    fontWeight: "bold",
                                }}
                            >
                                End Date:
                            </Text>
                            {range.endDate
                                ? dayjs(range.endDate)
                                      .locale(locale)
                                      .format("MMMM, DD, YYYY")
                                : "..."}
                        </Text>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5FCFF",
    },
});

export default DatePicker;
