import React, { useState } from "react";
import { ScrollView, Text, Modal, View, Pressable, FlatList } from "react-native";
import DataTable, { TableColumn } from "react-data-table-component";
import { FeedbackStudent, useFeedbackStudent } from "@/hooks/useFeedback";
import { useTranslation } from "react-i18next";
import styles from "@/styles/global";
import Colors from "@/constants/Colors";
import ButtonComponent from "@/components/ButtonComponent";
import { StackScreenProps } from "@react-navigation/stack";
import { useRoute, RouteProp } from "@react-navigation/native";

type RootStackParamList = {
    feedbacklistdetails: { feedbackId: string; activityName: string };
};

type FeedbackListDetailsScreenProps = StackScreenProps<
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

export default function FeedbackListDetails({}: Readonly<FeedbackListDetailsScreenProps>) {
    const { feedbackStudent, error: feedbackError } = useFeedbackStudent("");
    const { t } = useTranslation();
    const route = useRoute<RouteProp<RootStackParamList, "feedbacklistdetails">>();
    const feedbackId = route?.params?.feedbackId ?? "not id present";
    const activityName = route?.params?.activityName ?? "not name present";

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
            selector: (row: FeedbackStudent) => row.id.toString(),
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
                <Text style={styles.title}>Feedback : {activityName}</Text>
                <DataTable
                    columns={columns}
                    data={feedbackStudent}
                    pagination
                    highlightOnHover
                    customStyles={customStyles}
                />
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
                                    <Text style={styles.modalTitle}>
                                        {selectedFeedback.id} {"."}{" "}
                                    </Text>
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
                                        keyExtractor={(item, index) => index.toString()}
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
