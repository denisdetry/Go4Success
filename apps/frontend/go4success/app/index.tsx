import { Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../styles/global";
import axios from "axios";
import Card from "../components/Card";
import { FlatList } from "react-native-gesture-handler";

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
    const [allActivities, setAllActivities] = useState([]);
    const [registeredActivities, setRegisteredActivities] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/attends/")
            .then((res) => {
                setRegisteredActivities(res.data);
                res.data.map((attend: { activity: { name: string } }) =>
                    console.log("Activity Name: " + attend.activity.name),
                );
            })
            .catch((err) => {
                setError(err.message);
            });

        axios
            .get("http://localhost:8000/api/activity/")
            .then((res) => {
                setAllActivities(res.data);
                console.log("All Activity" + res.data);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

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
            <Text style={styles.heading2}>Registered Workshops</Text>
            <FlatList data={registeredActivities} renderItem={renderCards} />

            <Text style={styles.heading2}>Available Workshops</Text>
            <FlatList data={allActivities} renderItem={renderCards} />
        </ScrollView>
    );
}
