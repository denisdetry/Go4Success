import { ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import axios from "axios";
import styles from "@/styles/global";
import FilterWorkshop from "@/components/FilterActivity";
//import { Message } from "@/types/Message";
import { useAuth } from "@/context/auth";
import { useTranslation } from "react-i18next";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

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
    const { user } = useAuth();

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
                <ScrollView contentContainerStyle={styles.containerCard}>
                    <FilterWorkshop filterType={"attend"}></FilterWorkshop>
                </ScrollView>
            </View>

            {/* All activities container */}
            <View style={styles.container}>
                <Text style={styles.title}>Ateliers disponibles</Text>
                <ScrollView contentContainerStyle={styles.containerCard}>
                    <FilterWorkshop filterType={"activity"}></FilterWorkshop>
                </ScrollView>
            </View>

            {/* Calendar container */}
            <View style={styles.container}>
                <Text style={styles.title}>{t("translation.calendar")}</Text>
                <Text style={styles.text}>Le calendrier est en construction...</Text>
            </View>
        </ScrollView>
    );
}
