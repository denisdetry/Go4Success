import React from "react";
import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
    Agenda,
    DateData,
    AgendaEntry,
    AgendaSchedule,
    TimelineEventProps,
    CalendarUtils,
} from "react-native-calendars";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { Component } from "react";
import groupBy from "lodash/groupBy";
import axios from "axios";

interface State {
    items?: AgendaSchedule;
}

const EVENT_COLOR = "#e6add8";
const today = new Date();

export const getDate = (offset = 0) =>
    CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

export const timelineEvents: TimelineEventProps[] = [
    {
        start: `${getDate()} 01:15:00`,
        end: `${getDate()} 02:30:00`,
        title: "Atelier Blocus",
        summary: "Comment préparer votre blocus ?",
        color: EVENT_COLOR,
    },
    {
        start: `${getDate()} 02:30:00`,
        end: `${getDate()} 03:30:00`,
        title: "Atelier Gestion du temps",
        summary: "Comment gérer son temps pendant le quadri ?",
        color: EVENT_COLOR,
    },
    {
        start: `${getDate()} 01:45:00`,
        end: `${getDate()} 02:45:00`,
        title: "Atelier Gestion du stress",
        summary: "Comment gérer son stress pendant le blocus ?",
        color: EVENT_COLOR,
    },
];
const queryClient = new QueryClient();

const INITIAL_TIME = { hour: 9, minutes: 0 };
const EVENTS: TimelineEventProps[] = timelineEvents;

export default function AgendaPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <AgendaScreen />
        </QueryClientProvider>
    );
}

/* class TimelineCalendarScreen extends Component {
    state = {
        currentDate: new Date(),
        events: EVENTS,
        eventsByDate: groupBy(EVENTS, (e) =>
            CalendarUtils.getCalendarDateString(e.start),
        ) as {
            [key: string]: TimelineEventProps[];
        },
    };

    render() {
         const activities = useQuery({
            queryKey: ["agendaActivitiesQuery"],
            queryFn: async () => {
                const res = await axios.get("http://localhost:8000/api/attends/");
                console.log(res.data);
                return res.data;
            },
        }); 
        return (
            <CalendarProvider
                date={Date()}
                showTodayButton
                disabledOpacity={0.6}
                // numberOfDays={3}
            >
                <ExpandableCalendar
                    firstDay={1}
                    //leftArrowImageSource={require("../img/previous.png")}
                    //rightArrowImageSource={require("../img/next.png")}
                    //markedDates={this.marked}
                    initialPosition={ExpandableCalendar.positions.CLOSED}
                />
                <TimelineList
                    events={this.state.eventsByDate}
                    showNowIndicator
                    // scrollToNow
                    scrollToFirst
                    initialTime={INITIAL_TIME}
                />
            </CalendarProvider>
        );
    }
}
 */
export class AgendaScreen extends Component<State> {
    render() {
        return (
            <Agenda
                items={{
                    "2021-10-01": [
                        { name: "item 1 - any js object", height: 100, day: "" },
                    ],
                }}
                selected={"2021-10-01"}
                renderItem={this.renderItem}
                renderDay={this.renderDay}
                renderEmptyDate={this.renderEmptyDate}
                showClosingKnob={true}
                hideKnob={false}
                style={styles.Agenda}
            />
        );
    }

    renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    };

    renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
        const fontSize = isFirst ? 16 : 14;
        const color = isFirst ? "black" : "#43515c";

        return (
            <TouchableOpacity
                style={[styles.item, { height: reservation.height }]}
                onPress={() => Alert.alert(reservation.name)}
            >
                <Text style={{ fontSize, color }}>{reservation.name}</Text>
            </TouchableOpacity>
        );
    };

    renderDay = (day: Date) => {
        if (day) {
            return <Text style={styles.customDay}>{day.getDay()}</Text>;
        }
        return <View style={styles.dayItem} />;
    };
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: "white",
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30,
    },
    customDay: {
        margin: 10,
        fontSize: 24,
        color: "green",
    },
    dayItem: {
        marginLeft: 34,
    },
    Agenda: {
        maxWidth: 400,
    },
});
