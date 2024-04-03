import { ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import styles from "@/styles/global";
import Card from "@/components/Card";
import { Message } from "@/types/Message";
import RenderCarousel from "@/components/RenderCarousel";
import { ActivityOrAttend } from "@/types/ActivityOrAttend";
import { useAttendsAndActivities } from "@/context/AttendsAndActivities";
import { useAuth } from "@/context/auth";
import axiosConfig from "@/constants/axiosConfig";

axiosConfig();

export default function accueil() {
    const [allMessages, setAllMessages] = useState([]);
    const { allActivities, registeredActivities } = useAttendsAndActivities();
    const { user, showLoginToast, showRegisterToast } = useAuth();

    showLoginToast();
    showRegisterToast();

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
        <ScrollView
            scrollEnabled={true}
            nestedScrollEnabled={true}
            contentContainerStyle={styles.mainContainer}
        >
            <View style={styles.titleContainer}>
                {user.first_name ? (
                    <Text style={styles.titleNoPadding}>
                        Bonjour {user.first_name} ! 👋
                    </Text>
                ) : (
                    <Text style={styles.titleNoPadding}>
                        Bonjour {user.username} ! 👋
                    </Text>
                )}
            </View>

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
                <Text style={styles.titleNoPadding}>Atelier inscrits</Text>

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
                <Text style={styles.titleNoPadding}>Ateliers disponibles</Text>

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
