import { ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import styles from "@/styles/global";
import FilterWorkshop from "@/components/FilterActivity";
//import { Message } from "@/types/Message";
import { useAuth } from "@/context/auth";
import { useTranslation } from "react-i18next";
import axiosConfig from "@/constants/axiosConfig";

axiosConfig();

interface Message {
    id: string;
    content: string;
    date: string;
    from_user: string;
    to_user: string;
}

export default function accueil() {
    const { t } = useTranslation();
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
                        {t("translation.hello")} {user.first_name} ! 👋
                    </Text>
                ) : (
                    <Text style={styles.titleNoPadding}>
                        {t("translation.hello")} {user.username} ! 👋
                    </Text>
                )}
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
                <Text style={styles.titleNoPadding}>{t("translation.workshopAttend")}</Text>
                <ScrollView contentContainerStyle={styles.containerCard}>
                    <FilterWorkshop filterType={"attend"}></FilterWorkshop>
                </ScrollView>
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
                <ScrollView contentContainerStyle={styles.containerCard}>
                    <FilterWorkshop filterType={"activity"}></FilterWorkshop>
                </ScrollView>
                {allActivities.length > 0 ? (
                    <RenderCarousel data={allActivities} renderItem={renderCards} />
                ) : (
                    <Text style={styles.text}>Aucun atelier disponible</Text>
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
