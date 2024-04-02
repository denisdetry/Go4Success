import React, { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../constants/Colors";
import Button from "./Button";
import axios from "axios";
import { useAuth } from "@/context/auth";
import { useAttendsAndActivities } from "@/context/AttendsAndActivities";
import Toast from "react-native-toast-message";
import { isMobile } from "@/constants/screensWidth";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

interface CardProps {
    readonly id: string;
    readonly title: string;
    readonly location: string;
    readonly date: string;
    readonly type: string;
    readonly description: string;
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

    getModalDataStyle: (type: string) => {
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

    const { user } = useAuth();
    const { refreshAttendsAndActivities } = useAttendsAndActivities();

    const handleRegister = () => {
        axios
            .post("http://localhost:8000/api/register_activity/", {
                activity: id,
                student: user.id,
            })
            .then((res) => {
                Toast.show({
                    type: "success",
                    text1: "Félicitation ! 🎉",
                    text2: "Vous êtes parfaitement inscrit à l'atelier : " + title,
                });
                refreshAttendsAndActivities();
                setModalVisible(!modalVisible);
                console.log(res);
            })
            .catch((err) => {
                if (err.response.status === 400 && user.id) {
                    Toast.show({
                        type: "error",
                        text1: "Erreur",
                        text2: "Vous êtes déjà inscrit à cet atelier",
                    });
                } else if (err.response.status === 403 && user.id) {
                    Toast.show({
                        type: "error",
                        text1: "Erreur",
                        text2: "Vous n'êtes pas autorisé à vous inscrire à cet atelier",
                    });
                } else {
                    Toast.show({
                        type: "error",
                        text1: "Erreur",
                        text2: "Veuillez réessayer plus tard. Le serveur ne répond pas.",
                    });
                }
                setModalVisible(!modalVisible);
                console.log(err);
            });
    };

    return (
        <View style={styles.centeredView}>
            {/* Modal content */}
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
                        <View style={styleFunctions.getModalViewTitleStyle(type)}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.closeButtonText}>✖</Text>
                            </Pressable>
                        </View>

                        <View style={styleFunctions.getModalDataStyle(type)}>
                            <Text style={styles.modalText}>Date : {date}</Text>
                            <Text style={styles.modalText}>Place : {location}</Text>
                            <Text style={styles.modalText}>Type : {type}</Text>
                            <View style={styles.separator} />
                            <Text style={styles.modalText}>{description}</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                text="S'inscrire"
                                onPress={handleRegister}
                                buttonType={"primary"}
                            />
                            <Button
                                text="Fermer"
                                onPress={() => setModalVisible(!modalVisible)}
                                buttonType={"close"}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Card content */}
            <TouchableOpacity
                style={styleFunctions.getCardStyle(type)}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.title}>{title}</Text>
                <View style={styles.bottomRow}>
                    <Text style={styles.text}>{location}</Text>
                    <Text style={styles.text}>{date}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        paddingTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },
    modalViewTitle: {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        width: "100%",
        padding: 10,
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
        borderRadius: 10,
        padding: 15,
        height: 180,
        width: isMobile ? 280 : 350,
    },
    bottomRow: {
        flex: 1,
        flexDirection: "row",
        gap: 30,
    },
    centeredView: {
        marginTop: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    centeredViewModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modalView: {
        backgroundColor: Colors.workshopLightColor,
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
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
        color: "white",
        fontSize: 20,
    },
    separator: {
        borderBottomColor: "#000",
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    title: {
        fontSize: isMobile ? 16 : 18,
        fontWeight: "bold",
        color: "white",
    },
    text: {
        alignSelf: "flex-end",
        alignItems: "stretch",
        fontSize: isMobile ? 13 : 16,
        color: "white",
    },
});

export default Card;
