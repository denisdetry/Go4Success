/**
 * @file feedbacklist.tsx
 * @author Allemeersch Maxime <max.allemeersch@gmail.com>
 * @date 02/05/2024
 * @description This page displays a table of all feedback created and select them
 */

import React from "react";
import { ScrollView, Text, View } from "react-native";
import { TableColumn } from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import { useFeedback } from "@/hooks/useFeedback";
import { Feedback } from "@/types/Feedback";
import ButtonComponent from "@/components/ButtonComponent";
import FeedbackTable from "@/components/FeedbackTable";

import styles from "@/styles/global";
import { useAuth } from "@/context/Auth";

type RootStackParamList = {
    feedbacklistdetails: { feedbackId: string; activityName: string };
};

type FeedbackListDetailsScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "feedbacklistdetails"
>;

export default function FeedbackList() {
    const { user } = useAuth();
    const { feedbacks, error: feedbackError } = useFeedback(
        "",
        "",
        user?.is_superuser ? undefined : user?.id,
    );
    const { t } = useTranslation();
    const navigation = useNavigation<FeedbackListDetailsScreenNavigationProp>();

    const columns: TableColumn<Feedback>[] = [
        {
            name: "ID",
            selector: (row: Feedback) => row.id.toString(),
            sortable: true,
            grow: 1,
        },
        {
            name: t("translateFeedback.activity"),
            selector: (row: Feedback) => row.activity.name,
            sortable: true,
            grow: 10,
        },
        {
            name: t("translateFeedback.open"),
            cell: (row: Feedback) => (
                <ButtonComponent
                    buttonType={"littlePrimary"}
                    text={t("translateFeedback.open")}
                    onPress={() => {
                        navigation.navigate("feedbacklistdetails", {
                            feedbackId: row.id.toString(),
                            activityName: row.activity.name,
                        });
                    }}
                />
            ),
            sortable: true,
            grow: 1,
        },
    ];

    if (feedbackError) {
        return (
            <View>
                <Text> Error: {feedbackError.message} </Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <View style={styles.container}>
                <View style={{ alignSelf: "flex-start" }}>
                    <ButtonComponent
                        icon="arrow-back-circle-outline"
                        text="Back"
                        onPress={() => navigation.goBack()}
                        buttonType={"primary"}
                    />
                </View>
                <Text style={styles.title}>Feedback</Text>
                <FeedbackTable feedbacks={feedbacks} columns={columns} />
            </View>
        </ScrollView>
    );
}
