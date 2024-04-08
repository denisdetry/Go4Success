import React, { useRef, useCallback } from "react";
import { StyleSheet, TouchableOpacity, Alert, View, Text, Button } from "react-native";
import isEmpty from "lodash/isEmpty";
import {
    ExpandableCalendar,
    AgendaList,
    CalendarProvider,
    WeekCalendar,
} from "react-native-calendars";
/* import testIDs from "../testIDs";
import { agendaItems, getMarkedDates } from "../mocks/agendaItems";
import AgendaItem from "../mocks/AgendaItem";
import { getTheme, themeColor, lightThemeColor } from "../mocks/theme"; */

const agendaItems = [
    {
        title: "2021-09-01",
        data: [
            {
                hour: "08:00",
                title: "Meeting",
                duration: "1h",
            },
        ],
    },
];

//const leftArrowIcon = require("../img/previous.png");
//const rightArrowIcon = require("../img/next.png");
const ITEMS: any[] = agendaItems;

interface Props {
    weekView?: boolean;
}

const ExpandableCalendarScreen = (props: Props) => {
    const { weekView } = props;
    const marked = useRef(getMarkedDates());
    const theme = useRef(getTheme());
    const todayBtnTheme = useRef({
        todayButtonTextColor: themeColor,
    });

    // const onDateChanged = useCallback((date, updateSource) => {
    //   console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
    // }, []);

    // const onMonthChange = useCallback(({dateString}) => {
    //   console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
    // }, []);

    const renderItem = useCallback(({ item }: any) => {
        return <AgendaItem item={item} />;
    }, []);

    return (
        <CalendarProvider
            date={ITEMS[1]?.title}
            // onDateChanged={onDateChanged}
            // onMonthChange={onMonthChange}
            showTodayButton
            // disabledOpacity={0.6}
            theme={todayBtnTheme.current}
            // todayBottomMargin={16}
        >
            {weekView ? (
                <WeekCalendar
                    //testID={testIDs.weekCalendar.CONTAINER}
                    firstDay={1}
                    markedDates={marked.current}
                />
            ) : (
                <ExpandableCalendar
                    //testID={testIDs.expandableCalendar.CONTAINER}
                    // horizontal={false}
                    // hideArrows
                    // disablePan
                    // hideKnob
                    // initialPosition={ExpandableCalendar.positions.OPEN}
                    // calendarStyle={styles.calendar}
                    // headerStyle={styles.header} // for horizontal only
                    // disableWeekScroll
                    theme={theme.current}
                    // disableAllTouchEventsForDisabledDays
                    firstDay={1}
                    markedDates={marked.current}
                    //leftArrowImageSource={leftArrowIcon}
                    //rightArrowImageSource={rightArrowIcon}
                    // animateScroll
                    // closeOnDayPress={false}
                />
            )}
            <AgendaList
                sections={ITEMS}
                renderItem={renderItem}
                // scrollToNextEvent
                sectionStyle={styles.section}
                // dayFormat={'yyyy-MM-d'}
            />
        </CalendarProvider>
    );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
    calendar: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    header: {
        backgroundColor: "lightgrey",
    },
    section: {
        backgroundColor: "white",
        color: "grey",
        textTransform: "capitalize",
    },
    item: {
        padding: 20,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
        flexDirection: "row",
    },
    itemHourText: {
        color: "black",
    },
    itemDurationText: {
        color: "grey",
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    itemTitleText: {
        color: "black",
        marginLeft: 16,
        fontWeight: "bold",
        fontSize: 16,
    },
    itemButtonContainer: {
        flex: 1,
        alignItems: "flex-end",
    },
    emptyItem: {
        paddingLeft: 20,
        height: 52,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
    },
    emptyItemText: {
        color: "lightgrey",
        fontSize: 14,
    },
});

//=========================================================================================================

const themeColor = "#00AAAF";
const lightThemeColor = "#f2f7f7";

function getTheme() {
    const disabledColor = "grey";

    return {
        // arrows
        arrowColor: "black",
        arrowStyle: { padding: 0 },
        // knob
        expandableKnobColor: themeColor,
        // month
        monthTextColor: "black",
        textMonthFontSize: 16,
        textMonthFontFamily: "HelveticaNeue",
        textMonthFontWeight: "bold" as const,
        // day names
        textSectionTitleColor: "black",
        textDayHeaderFontSize: 12,
        textDayHeaderFontFamily: "HelveticaNeue",
        textDayHeaderFontWeight: "normal" as const,
        // dates
        dayTextColor: themeColor,
        todayTextColor: "#af0078",
        textDayFontSize: 18,
        textDayFontFamily: "HelveticaNeue",
        textDayFontWeight: "500" as const,
        //textDayStyle: { marginTop: Platform.OS === "android" ? 2 : 4 },
        // selected date
        selectedDayBackgroundColor: themeColor,
        selectedDayTextColor: "white",
        // disabled date
        textDisabledColor: disabledColor,
        // dot (marked date)
        dotColor: themeColor,
        selectedDotColor: "white",
        disabledDotColor: disabledColor,
        dotStyle: { marginTop: -2 },
    };
}
//=========================================================================================================

interface ItemProps {
    item: any;
}

const AgendaItem = (props: ItemProps) => {
    const { item } = props;

    const buttonPressed = useCallback(() => {
        Alert.alert("Show me more");
    }, []);

    const itemPressed = useCallback(() => {
        Alert.alert(item.title);
    }, []);

    if (isEmpty(item)) {
        return (
            <View style={styles.emptyItem}>
                <Text style={styles.emptyItemText}>No Events Planned Today</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity
            onPress={itemPressed}
            style={styles.item}
            //testID={testIDs.agenda.ITEM}
        >
            <View>
                <Text style={styles.itemHourText}>{item.hour}</Text>
                <Text style={styles.itemDurationText}>{item.duration}</Text>
            </View>
            <Text style={styles.itemTitleText}>{item.title}</Text>
            <View style={styles.itemButtonContainer}>
                <Button color={"grey"} title={"Info"} onPress={buttonPressed} />
            </View>
        </TouchableOpacity>
    );
};

//=========================================================================================================

export type MarkedDates = {
    [key: string]: {};
};

export function getMarkedDates() {
    const marked: MarkedDates = {};

    agendaItems.forEach((item) => {
        // NOTE: only mark dates with data
        if (item.data && item.data.length > 0 && !isEmpty(item.data[0])) {
            marked[item.title] = { marked: true };
        } else {
            marked[item.title] = { disabled: true };
        }
    });
    return marked;
}
