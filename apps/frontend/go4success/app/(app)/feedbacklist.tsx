import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import DataTable, { TableColumn } from "react-data-table-component";
import { Feedback, useFeedback } from "@/hooks/useFeedback";
import { useTranslation } from "react-i18next";
import styles from "@/styles/global";
import Colors from "@/constants/Colors";
import ButtonComponent from "@/components/ButtonComponent";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
    feedbacklistdetails: { feedbackId: string; activityName: string };
};

type FeedbackListDetailsScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "feedbacklistdetails"
>;

const customStyles = {
    rows: {
        style: {
            minHeight: "72px",
            fontSize: 16,
            fontFamily: "Arial",
        },
    },
    headCells: {
        style: {
            paddingLeft: "8px",
            paddingRight: "8px",
            fontSize: 18,
            fontWeight: "bold",
            fontFamily: "Arial",
            backgroundColor: Colors.primaryColor,
            color: "white",
        },
    },
    cells: {
        style: {
            paddingLeft: "8px",
            paddingRight: "8px",
        },
    },
};

export default function FeedbackList() {
    const { feedbacks, error: feedbackError } = useFeedback("");
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
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
                        setModalVisible(false);
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
                <Text style={styles.title}>Feedback</Text>
                <DataTable
                    columns={columns}
                    data={feedbacks}
                    pagination
                    highlightOnHover
                    customStyles={customStyles}
                />
            </View>
        </ScrollView>
    );
}
