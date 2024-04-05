import { ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import styles from "@/styles/global";
import FilterWorkshop from "@/components/FilterActivity";
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

export default function index() {
    const { t } = useTranslation();
    const [allMessages, setAllMessages] = useState([]);
    const { user, showLoginToast, showRegisterToast } = useAuth();


    useEffect(() => {
        showLoginToast();
        showRegisterToast();
    }, []);


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
                        {t("translation.hello")}
                        {user.first_name} ! 👋
                    </Text>
                ) : (
                    <Text style={styles.titleNoPadding}>
                        {t("translation.hello")}
                        {user.username} ! 👋
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
                <Text style={styles.titleNoPadding}>
                    {t("translation.workshopAttend")}
                </Text>
                <FilterWorkshop filterType={"attend"}></FilterWorkshop>
            </View>

            {/* All Activities container */}
            <View style={styles.container}>
                <Text style={styles.titleNoPadding}>Ateliers disponibles</Text>
                <FilterWorkshop filterType={"activity"}></FilterWorkshop>
            </View>

            {/* Calendar container */}
            <View style={styles.container}>
                <Text style={styles.title}>{t("translation.calendar")}</Text>
                <Text style={styles.text}>Le calendrier est en construction...</Text>
            </View>
        </ScrollView>
    );
}
