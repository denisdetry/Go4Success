import React, { useState } from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";
import Colors from "../constants/Colors";
import Button from "./Button";
import axios from "axios";
import GetCurrentUserID from "./GetCurrentUserID";
import { useRouter } from "expo-router";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

interface CardProps {
    id: string;
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
    id,
    title,
    location,
    date,
    type,
    description,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentUserID, setCurrentUserID] = useState("");
    const router = useRouter();

    GetCurrentUserID(setCurrentUserID);

    const handleRegister = async () => {
        axios
            .post("http://localhost:8000/api/register_activity/", {
                activity: id,
                student: currentUserID,
            })
            .then((res) => {
                alert("Registered");
                console.log(res);
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    if (currentUserID === "") {
                        alert("You need to be logged in to register");
                        router.push("/login");
                        setModalVisible(!modalVisible);
                    } else {
                        alert("You are already registered to this activity");
                    }
                } else if (err.response.status === 403) {
                    alert("You are not allowed to register to this activity");
                } else if (err.response.status === 404) {
                    alert("Activity not found");
                } else if (err.response.status === 500) {
                    alert("Server error, please try again later");
                }
                console.log(err);
            });
    };

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
                                onClick={handleRegister}
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
        minWidth: 300,
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
