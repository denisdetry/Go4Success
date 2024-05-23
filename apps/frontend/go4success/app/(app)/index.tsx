import { ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import styles from "@/styles/global";
import { useAuth } from "@/context/Auth";
import { useTranslation } from "react-i18next";
import FilterActivity from "@/components/FilterActivity";

interface Message {
    id: string;
    content: string;
    date: string;
    from_user: string;
    to_user: string;
}

export default function Index() {
    const { t } = useTranslation();
    const [allMessages, setAllMessages] = useState([]);
    const { user } = useAuth();
    const today = new Date();
    const dayOfMonth = today.getDate();
    const month = today.getMonth() + 1;

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
                        {user.first_name} !{" "}
                        {dayOfMonth === 1 && month === 4
                            ? "🐠"
                            : dayOfMonth === 31 && month === 10
                              ? "🎃"
                              : "👋"}
                    </Text>
                ) : (
                    <Text style={styles.titleNoPadding}>
                        {t("translation.hello")}
                        {user.username} !{" "}
                        {dayOfMonth === 1 && month === 4
                            ? "🐠"
                            : dayOfMonth === 31 && month === 10
                              ? "🎃"
                              : "👋"}
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
                    <Text style={styles.text}>
                        {t("translation.noMessage")}
                    </Text>
                )}
            </View>

            {/* Registered Activities container */}
            <View style={styles.container}>
                <Text style={styles.titleNoPadding}>
                    {t("translation.workshopAttend")}
                </Text>
                <FilterActivity filterType={"attend"}></FilterActivity>
            </View>

            {/* All Activities container */}
            <View style={styles.container}>
                <Text style={styles.titleNoPadding}>
                    {t("translation.workshopAll")}
                </Text>
                <FilterActivity filterType={"activity"}></FilterActivity>
            </View>

            {/* Calendar container */}
            <View style={styles.container}>
                <Text style={styles.title}>{t("translation.calendar")}</Text>
                <Text style={styles.text}>
                    {t("translation.calendarWorking")}
                </Text>
            </View>
        </ScrollView>
    );
}
