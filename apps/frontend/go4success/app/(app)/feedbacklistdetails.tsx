/**
 * @file feedbacklistdetails.tsx
 * @author Allemeersch Maxime <max.allemeersch@gmail.com>
 * @date  02/05/2024
 * @description This page displays the various feedbacks for the previously selected activity.
 */

import React, { useState } from "react";
import { ScrollView, Text, Modal, View, Pressable, FlatList } from "react-native";
import { TableColumn } from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { StackScreenProps } from "@react-navigation/stack";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

import {
    useFeedbackStudent,
    useFeedbackStudentAdditionalQuestions,
} from "@/hooks/useFeedback";
import { FeedbackStudent } from "@/types/Feedback";
import ButtonComponent from "@/components/ButtonComponent";
import { FeedbackStudentTable } from "@/components/FeedbackTable";

import styles from "@/styles/global";
import Colors from "@/constants/Colors";

type RootStackParamList = {
    feedbacklistdetails: { feedbackId: string; activityName: string };
};

type FeedbackListDetailsScreenProps = StackScreenProps<
    RootStackParamList,
    "feedbacklistdetails"
>;

export default function FeedbackListDetails(
    props: Readonly<FeedbackListDetailsScreenProps>,
) {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, "feedbacklistdetails">>();
    const feedbackId = route?.params?.feedbackId ?? "not id present";
    const activityName = route?.params?.activityName ?? "not name present";
    const { feedbackStudent, error: feedbackError } = useFeedbackStudent(feedbackId);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackStudent | null>(
        null,
    );
    const satisfactionLevels = [
        { value: "5", label: t("satisfactionLevels.verySatisfied") },
        { value: "4", label: t("satisfactionLevels.satisfied") },
        { value: "3", label: t("satisfactionLevels.neutral") },
        { value: "2", label: t("satisfactionLevels.unsatisfied") },
        { value: "1", label: t("satisfactionLevels.veryUnsatisfied") },
    ];

    const { feedbackstudentadditionnalquestions } =
        useFeedbackStudentAdditionalQuestions(
            selectedFeedback?.student.id ?? "",
            feedbackId,
        );

    const handleOpenModal = (feedback: FeedbackStudent) => {
        setSelectedFeedback(feedback);
        setModalVisible(true);
    };

    const getLabelFromValue = (value: string) => {
        const item = satisfactionLevels.find((level) => level.value === value);
        return item ? item.label : value;
    };

    const columns: TableColumn<FeedbackStudent>[] = [
        {
            name: "ID",
            selector: (_, index: number = 0) => (index + 1).toString(),
            sortable: true,
            grow: 1,
        },
        {
            name: t("translateFeedback.student"),
            selector: (row: FeedbackStudent) =>
                `${row.student.first_name} ${row.student.last_name} (${row.student.noma})`,
            sortable: true,
            grow: 3,
        },
        {
            name: t("translateFeedback.evaluation"),
            selector: (row: FeedbackStudent) =>
                getLabelFromValue(row.evaluation.toString()),
            sortable: true,
            grow: 2,
        },
        {
            name: t("translateFeedback.open"),
            cell: (row: FeedbackStudent) => (
                <ButtonComponent
                    buttonType={"littlePrimary"}
                    text={t("translateFeedback.open")}
                    onPress={() => handleOpenModal(row)}
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
                        onPress={() => navigation.navigate({ name: "feedbacklist" })} //Affiche une erreur, mais fonctionne tkt
                        buttonType={"primary"}
                    />
                </View>
                <Text style={styles.title}>Feedback : {activityName}</Text>
                <FeedbackStudentTable feedbacks={feedbackStudent} columns={columns} />
                {selectedFeedback && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredViewModal}>
                            <View style={styles.modalView}>
                                <View
                                    style={[
                                        styles.modalViewTitle,
                                        { backgroundColor: Colors.workshopColor },
                                    ]}
                                >
                                    <Text style={styles.modalTitle}>Modal</Text>
                                    <Pressable
                                        style={styles.closeButton}
                                        onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        <Text style={styles.closeButtonText}>✖</Text>
                                    </Pressable>
                                </View>

                                <View style={[styles.modalData]}>
                                    <FlatList
                                        data={[
                                            {
                                                title: t("translateFeedback.student"),
                                                value: `${selectedFeedback.student.first_name} ${selectedFeedback.student.last_name} (${selectedFeedback.student.noma})`,
                                            },
                                            {
                                                title: t(
                                                    "translateFeedback.evaluation",
                                                ),
                                                value: getLabelFromValue(
                                                    selectedFeedback.evaluation.toString(),
                                                ),
                                            },
                                            {
                                                title: t(
                                                    "translateFeedback.positivePoint",
                                                ),
                                                value: selectedFeedback.positive_point,
                                            },
                                            {
                                                title: t(
                                                    "translateFeedback.negativePoint",
                                                ),
                                                value: selectedFeedback.negative_point,
                                            },
                                            {
                                                title: t(
                                                    "translateFeedback.suggestion",
                                                ),
                                                value: selectedFeedback.suggestion,
                                            },
                                            {
                                                title: t(
                                                    "translateFeedback.additionalComment",
                                                ),
                                                value: selectedFeedback.additional_comment,
                                            },
                                            {
                                                title: t(
                                                    "translateFeedback.dateSubmitted",
                                                ),
                                                value: selectedFeedback.date_submitted,
                                            },
                                        ]}
                                        keyExtractor={(_, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <View style={styles.modalData}>
                                                <Text>
                                                    <Text
                                                        style={{ fontWeight: "bold" }}
                                                    >
                                                        {item.title}
                                                    </Text>{" "}
                                                    : {item.value}
                                                </Text>
                                            </View>
                                        )}
                                    />
                                    <FlatList
                                        data={feedbackstudentadditionnalquestions}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <View style={styles.modalData}>
                                                <Text>
                                                    <Text
                                                        style={{ fontWeight: "bold" }}
                                                    >
                                                        {item.question.question}
                                                    </Text>{" "}
                                                    : {item.answer}
                                                </Text>
                                            </View>
                                        )}
                                    />
                                </View>

                                <View style={styles.buttonContainer}>
                                    <ButtonComponent
                                        text={t(
                                            "translateRegisterActivity.closeButton",
                                        )}
                                        onPress={() => setModalVisible(!modalVisible)}
                                        buttonType={"close"}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </ScrollView>
    );
}
