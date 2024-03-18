import { Platform, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/global";
import Card from "@/components/Card";
import FilterActivity from "@/components/FilterActivity";
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

export default function accueil() {
    const [allMessages, setAllMessages] = useState([]);

    useEffect(() => {}, []);

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
                <ScrollView contentContainerStyle={styles.containerCard}>
                    <FilterActivity filterType={"attend"} />
                </ScrollView>
            </View>

            <View style={styles.container}>
                <Text style={styles.title}>Ateliers disponibles</Text>
                <ScrollView contentContainerStyle={styles.containerCard}>
                    <FilterActivity filterType={"activity"} />
                </ScrollView>
            </View>

            <View style={styles.container}>
                <Text style={styles.title}>Mon calendrier</Text>
                <Text style={styles.text}>Le calendrier est en construction...</Text>
            </View>
        </ScrollView>
    );
}
