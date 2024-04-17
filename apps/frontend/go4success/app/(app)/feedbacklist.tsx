import React, { useState } from "react";
import { ScrollView, Text, Modal, View, Pressable, FlatList } from "react-native";
import DataTable, { TableColumn } from "react-data-table-component";
import { Feedback, useFeedback } from "@/hooks/useFeedback";
import { useTranslation } from "react-i18next";
import styles from "@/styles/global";
import Colors from "@/constants/Colors";
import ButtonComponent from "@/components/ButtonComponent";

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
    const { feedbacks } = useFeedback();
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

    const handleOpenModal = (feedback: Feedback) => {
        setSelectedFeedback(feedback);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedFeedback(null);
        setModalVisible(false);
    };

    const columns: TableColumn<Feedback>[] = [
        {
            name: "ID",
            selector: (row: Feedback) => row.id.toString(),
            sortable: true,
            grow: 1,
        },
        {
            name: t("translateFeedback.student"),
            selector: (row: Feedback) =>
                `${row.student.first_name} ${row.student.last_name} (${row.student.noma})`,
            sortable: true,
            grow: 3,
        },
        {
            name: t("translateFeedback.activity"),
            selector: (row: Feedback) => row.activity.name,
            sortable: true,
            grow: 5,
        },
        {
            name: t("translateFeedback.evaluation"),
            selector: (row: Feedback) => row.evaluation.toString(),
            sortable: true,
            grow: 1,
        },
        {
            name: t("translateFeedback.open"),
            cell: (row: Feedback) => (
                <ButtonComponent
                    buttonType={"secondary"}
                    text={t("translateFeedback.open")}
                    onPress={() => handleOpenModal(row)}
                />
            ),
            sortable: true,
            grow: 1,
        },
    ];

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <Text style={styles.title}>Feedback</Text>
            <DataTable
                columns={columns}
                data={feedbacks}
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
                                    {selectedFeedback.activity.name}
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
                                            title: "Student",
                                            value: `${selectedFeedback.student.first_name} ${selectedFeedback.student.last_name} (${selectedFeedback.student.noma})`,
                                        },
                                        {
                                            title: "Activity",
                                            value: selectedFeedback.activity.name,
                                        },
                                        {
                                            title: "Evaluation",
                                            value: selectedFeedback.evaluation,
                                        },
                                        {
                                            title: "Positive point",
                                            value: selectedFeedback.positive_point,
                                        },
                                        {
                                            title: "Negative point",
                                            value: selectedFeedback.negative_point,
                                        },
                                        {
                                            title: "Suggestion",
                                            value: selectedFeedback.suggestion,
                                        },
                                        {
                                            title: "Additional comment",
                                            value: selectedFeedback.additional_comment,
                                        },
                                        {
                                            title: "Date submitted",
                                            value: selectedFeedback.date_submitted,
                                        },
                                    ]}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.modalData}>
                                            <Text>
                                                <Text style={{ fontWeight: "bold" }}>
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
                                    text={t("translateRegisterActivity.closeButton")}
                                    onPress={() => setModalVisible(!modalVisible)}
                                    buttonType={"close"}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </ScrollView>
    );
}
