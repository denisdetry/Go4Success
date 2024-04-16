import React, { useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../constants/Colors";
import ButtonComponent from "./ButtonComponent";
import { useAuth } from "@/context/Auth";
import { isMobile, width } from "@/constants/screensWidth";
import { useTranslation } from "react-i18next";
import { fetchBackend } from "@/utils/fetchBackend";
import Toast from "react-native-toast-message";
import { queryClient } from "@/app/_layout";
import { useMutation } from "@tanstack/react-query";
import { fetchError } from "@/utils/fetchError";

// axiosConfig();

interface CardProps {
    readonly id: string;
    readonly title: string;
    readonly location: string;
    readonly date: string;
    readonly hour: string;
    readonly type: string;
    readonly description: string;
    readonly language: string;
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
    hour,
    type,
    description,
    language,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { user } = useAuth();
    const { t } = useTranslation();

    const handleRegister = useMutation({
        mutationFn: async () => {
            const { data, error } = await fetchBackend({
                type: "POST",
                url: "activities/register_activity/",
                data: {
                    activity: id,
                    student: user.id,
                },
            });
            return { data, error };
        },
        onSuccess: () => {
            console.log("success");
            Toast.show({
                type: "success",
                text1: t("translateToast.SuccessText1"),
                text2: t("translateToast.RegisterActivitySuccessText2") + title,
            });
            void queryClient.invalidateQueries({
                queryKey: ["activities"],
            });
            setModalVisible(!modalVisible);
        },
        onError: (error: fetchError) => {
            if (error.responseError.status === 400) {
                Toast.show({
                    type: "error",
                    text1: t("translateToast.ErrorText1"),
                    text2: t("translateToast.AlreadyRegisteredActivityText2"),
                });
            } else {
                Toast.show({
                    type: "error",
                    text1: t("translateToast.ErrorText1"),
                    text2: t("translateToast.RegisterActivityErrorText2"),
                });
            }

            setModalVisible(!modalVisible);
        },
    });

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
                            <Text style={styles.modalText}>
                                {t("translateCard.date")} : {date}
                            </Text>
                            <Text style={styles.modalText}>
                                {t("translateCard.hour")} : {hour}
                            </Text>
                            <Text style={styles.modalText}>
                                {t("translateCard.place")} : {location}
                            </Text>
                            <Text style={styles.modalText}>
                                {t("translateCard.type")} : {type}
                            </Text>
                            <Text style={styles.modalText}>
                                {t("translateCard.language")}: {language}
                            </Text>
                            <View style={styles.separator} />
                            <Text style={styles.modalText}>{description}</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <ButtonComponent
                                text={t("translateRegisterActivity.registerButton")}
                                onPress={() => handleRegister.mutate()}
                                buttonType={"primary"}
                            />
                            <ButtonComponent
                                text={t("translateRegisterActivity.closeButton")}
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
                    <View style={styles.bottomRowLocation}>
                        <Text style={styles.text}>{location}</Text>
                    </View>

                    <View style={styles.bottomRowDate}>
                        <Text style={styles.text}>{language}</Text>
                        <Text style={styles.text}>{date}</Text>
                        <Text style={styles.text}>{hour}</Text>
                    </View>
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
        padding: 12,
        height: 180,
        width: Platform.OS === "web" ? (isMobile ? 280 : 350) : width - 80,
    },
    bottomRow: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },

    bottomRowLocation: {
        width: "50%",
        justifyContent: "center",
        flexDirection: "row",
    },

    bottomRowDate: {
        width: "50%",
        justifyContent: "flex-end",
        flexDirection: "column",
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
