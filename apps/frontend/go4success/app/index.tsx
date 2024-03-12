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
    activity_id: string;
    activity_name: string;
    activity_room: string;
    activity_date_start: string;
    activity_type: string;
    activity_description: string;
}

interface Attend {
    activity: Activity;
    student_id: string;
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
                id={activity.activity_id}
                title={activity.activity_name}
                location={activity.activity_room}
                date={activity.activity_date_start}
                type={activity.activity_type}
                description={activity.activity_description}
            />
        );
    };
    return (
        <ScrollView contentContainerStyle={styles.containerCard}>
            <FilterActivity />
        </ScrollView>
    );
}
