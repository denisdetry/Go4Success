import groupBy from "lodash/groupBy";
import filter from "lodash/filter";
import find from "lodash/find";
import { fetchBackend } from "@/utils/fetchBackend";
import React, { Component } from "react";
import { Alert } from "react-native";
import { View, StyleSheet } from "react-native";
import {
    ExpandableCalendar,
    TimelineEventProps,
    TimelineList,
    CalendarProvider,
    TimelineProps,
    CalendarUtils,
} from "react-native-calendars";
import { useQuery } from "@tanstack/react-query";
import { get, max } from "lodash";
import { Activity } from "@/hooks/useActivities";

const EVENT_COLOR = "#e6add8";
const today = new Date();
export const getDate = (offset = 0) =>
    CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

export const timelineEvents: TimelineEventProps[] = [
    {
        start: `${getDate()} 01:15:00`,
        end: `${getDate()} 02:30:00`,
        title: "Comment bien préparer son blocus",
        summary:
            "Trucs et astuce pour aider les nouveaux étudiants à préparer leur blocus",
        color: EVENT_COLOR,
    },
    {
        start: `${getDate()} 01:30:00`,
        end: `${getDate()} 02:30:00`,
        title: "Rattrapage mathématique",
        summary:
            "Scéance de rattrapage pour les étudiants en difficulté en mathématique",
        color: EVENT_COLOR,
    },
    {
        start: `${getDate()} 01:45:00`,
        end: `${getDate()} 02:45:00`,
        title: "Rattrapage programmation",
        summary:
            "Scéance de rattrapage pour les étudiants en difficulté en programmation",
        color: EVENT_COLOR,
    },
    {
        start: `${getDate()} 04:30:00`,
        end: `${getDate()} 05:30:00`,
        title: "Comment bien écrire un rapport",
        summary:
            "Trucs et astuce pour aider les nouveaux étudiants à bien écrire un rapport de stage",
        color: EVENT_COLOR,
    },
];

const INITIAL_TIME = { hour: 9, minutes: 0 };
const EVENTS: TimelineEventProps[] = timelineEvents;

function GetAttendance() {
    console.log("getAttendance called");
    //const attendance = fetchBackend({ type: "GET", url: "/activities/attends" });

    const { isPending, data, error } = useQuery<Activity[]>({
        queryKey: ["activities", "attends"],
        queryFn: async () => {
            try {
                const { data } = await fetchBackend({
                    type: "GET",
                    url: "/activities/attends",
                });
                console.log("resp:", data);
                return data;
            } catch (err) {
                console.log("error:", err);
                return null;
            }
        },
    });
    console.log("attendance fetched");
    console.log("attendance: ", data);

    return { data: data ?? [], isPending, error };
}

class TimelineCalendarScreen extends Component {
    state = {
        currentDate: getDate(),
        events: EVENTS,
        eventsByDate: groupBy(EVENTS, (e) =>
            CalendarUtils.getCalendarDateString(e.start),
        ) as {
            [key: string]: TimelineEventProps[];
        },
    };
    myHookValue: any;
    marked = {
        [`${getDate(-1)}`]: { marked: true },
        [`${getDate()}`]: { marked: true },
        [`${getDate(1)}`]: { marked: true },
        [`${getDate(2)}`]: { marked: true },
        [`${getDate(4)}`]: { marked: true },
    };

    onDateChanged = (date: string, source: string) => {
        console.log("TimelineCalendarScreen onDateChanged: ", date, source);
        this.setState({ currentDate: date });
    };

    onMonthChange = (month: any, updateSource: any) => {
        console.log("TimelineCalendarScreen onMonthChange: ", month, updateSource);
    };

    private timelineProps: Partial<TimelineProps> = {
        format24h: true,
        //onBackgroundLongPress: this.createNewEvent,
        //onBackgroundLongPressOut: this.approveNewEvent,
        // scrollToFirst: true,
        // start: 0,
        // end: 24,
        unavailableHours: [
            { start: 0, end: 6 },
            { start: 22, end: 24 },
        ],
        overlapEventsSpacing: 8,
        rightEdgeSpacing: 24,
    };
    //set max width to 30% of the screen

    render() {
        const { currentDate, eventsByDate } = this.state;
        console.log("myHookValue (in component): ", this.myHookValue);
        return (
            <CalendarProvider
                style={styles.calendar}
                date={currentDate}
                onDateChanged={this.onDateChanged}
                onMonthChange={this.onMonthChange}
                showTodayButton
                disabledOpacity={0.6}
                // numberOfDays={3}
            >
                <ExpandableCalendar
                    style={styles.calendar}
                    firstDay={1}
                    leftArrowImageSource={require("../../assets/images/previous.png")}
                    rightArrowImageSource={require("../../assets/images/next.png")}
                    markedDates={this.marked}
                />
                <TimelineList
                    events={eventsByDate}
                    timelineProps={this.timelineProps}
                    showNowIndicator
                    // scrollToNow
                    scrollToFirst
                    initialTime={INITIAL_TIME}
                    //style={styles.timeline}
                />
            </CalendarProvider>
        );
    }
}

// async function withMyHook(Component: any) {
//     return async function WrappedComponent(props: any) {
//         const attendanceFetch = GetAttendance();

//         var attendanceData;

//         console.log("myHookValue (function): ", attendanceFetch);

//         const exportComponent = <Component {...props} myHookValue={attendanceData} />;

//         attendanceData = await attendanceFetch.then(async (data) => {
//             console.log("myHookValue (function): ", data);
//             return data;
//         });

//         return exportComponent;
//     };
// }

function withMyHook(Component: any) {
    return function WrappedComponent(props: any) {
        const { isPending, data } = GetAttendance();

        console.log("myHookValue (function): ", data);
        // return isPending ? (
        //     <p>Loading...</p>
        // ) : (
        //     (console.log("myHookValue (function DEUX): ", data),

        //     (<Component {...props} myHookValue={data} />))
        // );

        const eventsByDate = groupBy(EVENTS, (e) =>
            CalendarUtils.getCalendarDateString(e.start),
        ) as {
            [key: string]: TimelineEventProps[];
        };
        return <TimelineList events={eventsByDate} initialTime={INITIAL_TIME} />;
    };
}

export default withMyHook(TimelineCalendarScreen);

const styles = StyleSheet.create({
    calendar: {
        maxWidth: 500,
    },
    timeline: {
        maxWidth: 500,
    },
});
