import { Platform, ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import axios from "axios";
import styles from "@/styles/global";
import Card from "@/components/Card";

import { Message } from "@/types/Message";
import RenderCarousel from "@/components/RenderCarousel";
import { ActivityOrAttend } from "@/types/ActivityOrAttend";
import { useAttendsAndActivities } from "@/context/AttendsAndActivities";
import { useAuth } from "@/context/auth";
import { useTranslation } from "react-i18next";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default function accueil() {
    const { t } = useTranslation();
    const [allMessages, setAllMessages] = useState([]);
    const { allActivities, registeredActivities } = useAttendsAndActivities();
    const { user } = useAuth();

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
            <View
                style={{
                    width: "90%",
                    alignContent: "flex-start",
                    margin: 20,
                    padding: 10,
                }}
            >
                <Text style={[styles.title, { marginBottom: 0 }]}>
                    {t("translation.hello")} {user.first_name} ! 👋
                </Text>
                <Text style={[styles.title, { marginBottom: 0 }]}>
                    {t("translation.welcome")}
                </Text>
            </View>

            {/* Message container */}
            <View style={styles.container}>
                <Text style={styles.title}>{t("translation.message")}</Text>

                {allMessages.length > 0 ? (
                    <FlatList
                        contentContainerStyle={styles.containerCard}
                        data={allMessages}
                        renderItem={renderMessages}
                    />
                ) : (
                    <Text style={styles.text}> {t("translation.noMessage")}</Text>
                )}
            </View>

            {/* Registered Activities container */}

            <View style={styles.container}>
                <Text style={styles.title}>{t("translation.workshopAttend")}</Text>

                {registeredActivities.length > 0 ? (
                    <RenderCarousel
                        data={registeredActivities}
                        renderItem={renderCards}
                    />
                ) : (
                    <Text style={styles.text}>{t("translation.noWorkshopAttend")}</Text>
                )}
            </View>

            {/* All Activities container */}
            <View style={styles.container}>
                <Text style={styles.title}>{t("translation.workshopAll")}</Text>

                {allActivities.length > 0 ? (
                    <RenderCarousel data={allActivities} renderItem={renderCards} />
                ) : (
                    <Text style={styles.text}>{t("translation.noWorkshopAll")}</Text>
                )}
            </View>

            {/* Calendar container */}
            <View style={styles.container}>
                <Text style={styles.title}>{t("translation.calendar")}</Text>
                <Text style={styles.text}>Le calendrier est en construction...</Text>
            </View>
        </ScrollView>
    );
}
