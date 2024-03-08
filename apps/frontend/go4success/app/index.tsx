import { View, Text, ScrollView } from "react-native";
import React from "react";
import styles from "../styles/global";
import { useEffect, useState } from "react";
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
}

interface Attend {
    activity: Activity;
    student_id: string;
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
                res.data.map(
                    (attend: { activity: { activity_name: string } }) =>
                        console.log(
                            "Activity Name: " + attend.activity.activity_name,
                        ),
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
            <h2>Registered Workshops</h2>
            <FlatList data={registeredActivities} renderItem={renderCards} />

            <h2>Available Workshops</h2>
            <FlatList data={allActivities} renderItem={renderCards} />
        </ScrollView>
    );
}
