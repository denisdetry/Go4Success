import { Platform, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/global";
import Card from "@/components/Card";
import { FlatList } from "react-native-gesture-handler";
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

interface Message {
    id: string;
    content: string;
    date: string;
    from_user: string;
    to_user: string;
}

export default function index() {
    const [allActivities, setAllActivities] = useState([]);
    const [registeredActivities, setRegisteredActivities] = useState([]);
    const [allMessages, setAllMessages] = useState([]);
    const [isAuthentificated, setIsAuthentificated] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/attends/")
            .then((res) => {
                setRegisteredActivities(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get("http://localhost:8000/api/activity/")
            .then((res) => {
                setAllActivities(res.data);
                if (Platform.OS === "ios") {
                    console.log(res.data);
                }
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

    const renderMessages = ({ item }: { item: Message }) => {
        return <Text> {item.content}</Text>;
    };

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
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
            <View style={styles.container}>
                <Text style={styles.title}>Atelier inscrits</Text>

                {registeredActivities.length > 0 ? (
                    <FlatList
                        contentContainerStyle={styles.containerCard}
                        data={registeredActivities}
                        renderItem={renderCards}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    />
                ) : (
                    <Text style={styles.text}>Vous n'êtes inscrit à aucun atelier</Text>
                )}
            </View>

            <View style={styles.container}>
                <Text style={styles.title}>Ateliers disponibles</Text>

                {allActivities.length > 0 ? (
                    <>
                        <FlatList
                            contentContainerStyle={styles.containerCard}
                            data={allActivities}
                            renderItem={renderCards}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item: Activity) => item.id}
                        />
                    </>
                ) : (
                    <Text style={styles.text}>Aucun atelier disponible</Text>
                )}
            </View>

            <View style={styles.container}>
                <Text style={styles.title}>Mon calendrier</Text>
                <Text style={styles.text}>Le calendrier est en construction...</Text>
            </View>
        </ScrollView>
    );
}
