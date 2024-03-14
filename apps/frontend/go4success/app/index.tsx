import React from "react";
import { ScrollView } from "react-native";
import styles from "../styles/global";
import axios from "axios";
import Card from "../components/Card";
import FilterActivity from "../components/FilterActivity";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

interface Activity {
    id: string;
    name: string;
    room: string;
    date_start: string;
    type: string;
    description: string;
}

interface Attend {
    activity: Activity;
    student: string;
}

type ActivityOrAttend = Activity | Attend;

export default function index() {
    const renderCards = ({ item }: { item: ActivityOrAttend }) => {
        let activity: Activity;

        if ("activity" in item) {
            activity = item.activity;
        } else {
            activity = item;
        }

        return (
            <Card
                id={activity.id}
                title={activity.name}
                location={activity.room}
                date={activity.date_start}
                type={activity.type}
                description={activity.description}
            />
        );
    };
    return (
        <ScrollView contentContainerStyle={styles.containerCard}>
            <FilterActivity />
        </ScrollView>
    );
}
