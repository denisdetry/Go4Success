import React, { useState } from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";
import Colors from "../constants/Colors";
import Button from "./Button";

interface CardProps {
    title: string;
    location: string;
    date: string;
    type: string;
    description: string;
}

const styleFunctions = {
    getModalViewTitleStyle: (type: string) => {
        switch (type) {
            case "Important":
                return {
                    ...styles.modalViewTitle,
                    backgroundColor: Colors.importantColor,
                };
            case "Warning":
                return {
                    ...styles.modalViewTitle,
                    backgroundColor: Colors.warningColor,
                };
            case "Appointment":
                return {
                    ...styles.modalViewTitle,
                    backgroundColor: Colors.appointmentColor,
                };
            case "Workshop":
                return {
                    ...styles.modalViewTitle,
                    backgroundColor: Colors.workshopColor,
                };
            default:
                return {
                    ...styles.modalViewTitle,
                    backgroundColor: Colors.primaryColor,
                };
        }
    },

    getmodalDataStyle: (type: string) => {
        switch (type) {
            case "Important":
                return {
                    ...styles.modalData,
                    backgroundColor: Colors.importantLightColor,
                };
            case "Warning":
                return {
                    ...styles.modalData,
                    backgroundColor: Colors.warningLightColor,
                };
            case "Appointment":
                return {
                    ...styles.modalData,
                    backgroundColor: Colors.appointmentLightColor,
                };
            case "Workshop":
                return {
                    ...styles.modalData,
                    backgroundColor: Colors.workshopLightColor,
                };
            default:
                return {
                    ...styles.modalData,
                    backgroundColor: Colors.normalLightColor,
                };
        }
    },

    getCardStyle: (type: string) => {
        switch (type) {
            case "Important":
                return {
                    ...styles.card,
                    backgroundColor: Colors.importantColor,
                };
            case "Warning":
                return {
                    ...styles.card,
                    backgroundColor: Colors.warningColor,
                };
            case "Appointment":
                return {
                    ...styles.card,
                    backgroundColor: Colors.appointmentColor,
                };
            case "Workshop":
                return {
                    ...styles.card,
                    backgroundColor: Colors.workshopColor,
                };
            default:
                return {
                    ...styles.card,
                    backgroundColor: Colors.primaryColor,
                };
        }
    },
};

const Card: React.FC<CardProps> = ({
    title,
    location,
    date,
    type,
    description,
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredViewModal}>
                    <View style={styles.modalView}>
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.closeButtonText}>✖</Text>
                        </Pressable>
                        <View
                            style={styleFunctions.getModalViewTitleStyle(type)}
                        >
                            <Text style={styles.modalTitle}>{title}</Text>{" "}
                        </View>
                        <View style={styleFunctions.getmodalDataStyle(type)}>
                            <Text style={styles.modalText}>Date : {date}</Text>
                            <Text style={styles.modalText}>
                                Place : {location}
                            </Text>
                            <Text style={styles.modalText}>Type : {type}</Text>
                            <View style={styles.separator} />
                            <Text style={styles.modalText}>{description}</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                text="Register"
                                onClick={() => {}}
                                buttonType={"primary"}
                            />
                            <Button
                                text="Hide Modal"
                                onClick={() => setModalVisible(!modalVisible)}
                                buttonType={"close"}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <Pressable
                style={styleFunctions.getCardStyle(type)}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.title}>{title}</Text>
                <View style={styles.bottomRow}>
                    <Text style={styles.text}>{location}</Text>
                    <Text style={styles.text}>{date}</Text>
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        paddingTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalViewTitle: {
        width: "100%",
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        padding: 20,
        width: "100%",
    },
    modalData: {
        padding: 20,
        width: "100%",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    card: {
        width: "100%",
        maxWidth: 350,
        minHeight: 200,
        height: "100%",
        maxHeight: 500,
        borderRadius: 10,
        padding: 20,
        paddingHorizontal: 10,
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: 100,
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 0,
        width: "100%",
        paddingTop: 20,
        paddingRight: 20,
        paddingLeft: 5,
        paddingBottom: 10,
    },
    centeredView: {
        marginTop: 22,
    },
    centeredViewModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 24,
        color: "#333",
    },
    separator: {
        borderBottomColor: "#000",
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    text: {
        fontSize: 16,
        color: "white",
    },
});

export default Card;
