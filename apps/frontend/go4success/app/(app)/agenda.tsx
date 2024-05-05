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

async function GetAttendance() {
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
    return data;
}

function getTimelineProps(): Partial<TimelineProps> {
    return {
        format24h: true,
        //onBackgroundLongPress: this.createNewEvent,
        //onBackgroundLongPressOut: this.approveNewEvent,
        scrollToFirst: true,
        start: 0,
        end: 24,
        unavailableHours: [
            { start: 0, end: 6 },
            { start: 22, end: 24 },
        ],
        overlapEventsSpacing: 8,
        rightEdgeSpacing: 24,
    };
}

function getAgendaState() {
    //const eventsFetch = await getAgendaEvents();
    console.log("Setting up agenda state");
    const agendaState = {
        selectedDate: getDate(),
        events: timelineEvents,
        attendance: [],
        eventsByDate: groupBy(timelineEvents, (e) =>
            CalendarUtils.getCalendarDateString(e.start),
        ) as {
            [key: string]: TimelineEventProps[];
        },
        currentDate: getDate(),
    };
    console.log("agendaState: ", agendaState);
    console.log("Agenda state set up");
    return agendaState;
}

async function getAgendaEvents() {
    console.log("getAgendaEvents called");
    const attendanceFetch = await GetAttendance();
    //console.log("activity: ", data[0]["name"]);
    //console.log("student", data[0]);
    console.log("attendanceFetch: ", attendanceFetch);
    return timelineEvents;
}

const App = () => {
    const agendaState = getAgendaState();

    return (
        <CalendarProvider
            date={getDate()}
            style={styles.calendar}
            //onDateChanged={this.onDateChanged}
            //onMonthChange={this.onMonthChange}
            showTodayButton
            disabledOpacity={0.6}
            numberOfDays={3}
        >
            <ExpandableCalendar
                style={styles.calendar}
                firstDay={1}
                leftArrowImageSource={require("../../assets/images/previous.png")}
                rightArrowImageSource={require("../../assets/images/next.png")}
            />
            <TimelineList
                events={agendaState.eventsByDate}
                timelineProps={getTimelineProps()}
                showNowIndicator
                scrollToNow
                scrollToFirst
                initialTime={INITIAL_TIME}
                //style={styles.timeline}
            />
        </CalendarProvider>
    );
};

export default App;

const styles = StyleSheet.create({
    calendar: {
        maxWidth: 500,
    },
    timeline: {
        maxWidth: 500,
    },
});
