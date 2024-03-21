import { Platform, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import axios from "axios";
import styles from "@/styles/global";
import Card from "@/components/Card";
import { Message } from "@/types/Message";
import RenderCarousel from "@/components/RenderCarousel";
import { ActivityOrAttend } from "@/types/ActivityOrAttend";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default function accueil() {
    const [allActivities, setAllActivities] = useState([
        {
            course: null,
            date_end: "21-12-2023 - 16:00",
            date_start: "21-12-2023 - 14:00",
            description: "Atelier planning #2",
            id: 11,
            name: "Atelier 4 : Atelier planning #2",
            room: "Vauban - UNamur",
            type: "Planning",
        },
        {
            course: null,
            date_end: "21-12-2023 - 16:00",
            date_start: "21-12-2023 - 14:00",
            description: "Atelier planning #2",
            id: 12,
            name: "Atelier 5 : Atelier planning #2",
            room: "Vauban - UNamur",
            type: "Planning",
        },
        {
            course: null,
            date_end: "21-12-2023 - 16:00",
            date_start: "21-12-2023 - 14:00",
            description: "Atelier planning #2",
            id: 13,
            name: "Atelier 6 : Atelier planning #2",
            room: "Vauban - UNamur",
            type: "Planning",
        },
        {
            course: null,
            date_end: "21-12-2023 - 16:00",
            date_start: "21-12-2023 - 14:00",
            description: "Atelier planning #2",
            id: 14,
            name: "Atelier 6 : Atelier planning #2",
            room: "Vauban - UNamur",
            type: "Planning",
        },
    ]);
    const [registeredActivities, setRegisteredActivities] = useState([
        {
            course: null,
            date_end: "21-12-2023 - 16:00",
            date_start: "21-12-2023 - 14:00",
            description: "Atelier planning #2",
            id: 11,
            name: "Atelier 4 : Atelier planning #2",
            room: "Vauban - UNamur",
            type: "Planning",
        },
        {
            course: null,
            date_end: "21-12-2023 - 16:00",
            date_start: "21-12-2023 - 14:00",
            description: "Atelier planning #2",
            id: 12,
            name: "Atelier 5 : Atelier planning #2",
            room: "Vauban - UNamur",
            type: "Planning",
        },
        {
            course: null,
            date_end: "21-12-2023 - 16:00",
            date_start: "21-12-2023 - 14:00",
            description: "Atelier planning #2",
            id: 13,
            name: "Atelier 6 : Atelier planning #2",
            room: "Vauban - UNamur",
            type: "Planning",
        },
        {
            course: null,
            date_end: "21-12-2023 - 16:00",
            date_start: "21-12-2023 - 14:00",
            description: "Atelier planning #2",
            id: 14,
            name: "Atelier 6 : Atelier planning #2",
            room: "Vauban - UNamur",
            type: "Planning",
        },
    ]);
    const [allMessages, setAllMessages] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/attends/")
            .then((res) => {
                setRegisteredActivities(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get("http://localhost:8000/api/activity/")
            .then((res) => {
                setAllActivities(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const renderCards = ({ item }: { item: ActivityOrAttend }) => {
        let activity = item;

        if ("activity" in item) {
            activity = item.activity;
        } else {
            activity = item;
        }

        return Platform.OS === "web" ? (
            <Card
                id={activity.id}
                title={activity.name}
                location={activity.room}
                date={activity.date_start}
                type={activity.type}
                description={activity.description}
            />
        ) : (
            <View style={styles.containerCard}>
                <Card
                    id={activity.id}
                    title={activity.name}
                    location={activity.room}
                    date={activity.date_start}
                    type={activity.type}
                    description={activity.description}
                />
            </View>
        );
    };

    const renderMessages = ({ item }: { item: Message }) => {
        return <Text> {item.content}</Text>;
    };

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            {/* Message container */}
            <View style={styles.container}>
                <Text style={styles.title}>Mes messages</Text>

                {allMessages.length > 0 ? (
                    <FlatList
                        contentContainerStyle={styles.containerCard}
                        data={allMessages}
                        renderItem={renderMessages}
                    />
                ) : (
                    <Text style={styles.text}> Vous n'avez pas de messages</Text>
                )}
            </View>

            {/* Registered Activities container */}

            <View style={styles.container}>
                <Text style={styles.title}>Atelier inscrits</Text>

                {registeredActivities.length > 0 ? (
                    <RenderCarousel
                        data={registeredActivities}
                        renderItem={renderCards}
                    />
                ) : (
                    <Text style={styles.text}>Vous n'êtes inscrit à aucun atelier</Text>
                )}
            </View>

            {/* All Activities container */}
            <View style={styles.container}>
                <Text style={styles.title}>Ateliers disponibles</Text>

                {allActivities.length > 0 ? (
                    <RenderCarousel data={allActivities} renderItem={renderCards} />
                ) : (
                    <Text style={styles.text}>Aucun atelier disponible</Text>
                )}
            </View>

            {/* Calendar container */}
            <View style={styles.container}>
                <Text style={styles.title}>Mon calendrier</Text>
                <Text style={styles.text}>Le calendrier est en construction...</Text>
            </View>
        </ScrollView>
    );
}
