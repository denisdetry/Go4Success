import React, { useState } from "react";
import {
    Modal,
    Platform,
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
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
    feedbackanswer: { activityId: string };
};

interface CardProps {
    readonly id: string;
    readonly title: string;
    readonly location: string;
    readonly date: string;
    readonly hour: string;
    readonly type: string;
    readonly description: string;
    readonly language: string;
    readonly dateEnd: string;
    readonly attendOrActivity: string;
}

type FeedbackAnswerScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "feedbackanswer"
>;

const styleFunctions = {
    getModalViewTitleStyle: (
        type: string,
        newDateEnd: Date,
        currentDate: Date,
    ) => {
        if (newDateEnd > currentDate) {
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
        }
        return {
            ...styles.modalViewTitle,
            backgroundColor: Colors.workshopColorDateEnd,
        };
    },

    getModalDataStyle: (type: string, newDateEnd: Date, currentDate: Date) => {
        if (newDateEnd > currentDate) {
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
        }
        return {
            ...styles.modalData,
            backgroundColor: Colors.workshopLightColor,
        };
    },

    getCardStyle: (type: string, newDateEnd: Date, currentDate: Date) => {
        if (newDateEnd > currentDate) {
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
        }
        return {
            ...styles.card,
            backgroundColor: Colors.workshopColorDateEnd,
        };
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
    dateEnd,
    attendOrActivity,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigation = useNavigation<FeedbackAnswerScreenNavigationProp>();
    const currentDate = new Date();
    const [datePart, timePart] = dateEnd?.split(" - ") || [];
    const [day, month, year] = datePart?.split("-") || [];
    const [partHour, partMinute] = timePart?.split(":") || [];
    const newDateEnd = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(partHour),
        parseInt(partMinute),
    );

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

    interface ModalTextComponentProps {
        title: string;
        content: string;
        icon?: any;
    }

    const ModalTextComponent: React.FC<ModalTextComponentProps> = ({
        title,
        content,
        icon,
    }) => {
        return (
            <View style={styles.modalTextView}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={24}
                        color={Colors.primaryColor}
                    />
                )}
                <Text style={[styles.modalText, { fontWeight: "700" }]}>
                    {title} :
                    <Text style={[styles.modalText, { textAlign: "justify" }]}>
                        {" "}
                        {content}
                    </Text>
                </Text>
            </View>
        );
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
                        <View
                            style={styleFunctions.getModalViewTitleStyle(
                                type,
                                newDateEnd,
                                currentDate,
                            )}
                        >
                            <Text style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Ionicons
                                    name={"close"}
                                    color={"white"}
                                    size={24}
                                ></Ionicons>
                            </TouchableOpacity>
                        </View>

                        <View
                            style={[
                                styleFunctions.getModalDataStyle(
                                    type,
                                    newDateEnd,
                                    currentDate,
                                ),
                                {
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignContent: "center",
                                },
                            ]}
                        >
                            <ModalTextComponent
                                title={t("translateCard.date")}
                                content={date}
                                icon={"calendar"}
                            />
                            <ModalTextComponent
                                title={t("translateCard.hour")}
                                content={hour}
                                icon={"time"}
                            />
                            <ModalTextComponent
                                title={t("translateCard.place")}
                                content={location}
                                icon={"location"}
                            />
                            <ModalTextComponent
                                title={t("translateCard.type")}
                                content={type}
                                icon={"list"}
                            />
                            <ModalTextComponent
                                title={t("translateCard.language")}
                                content={language}
                                icon={"language"}
                            />

                            <View style={styles.separator} />
                            <ModalTextComponent
                                title={t("translateCard.description")}
                                content={description}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            {newDateEnd > currentDate ? (
                                <ButtonComponent
                                    text={t(
                                        "translateRegisterActivity.registerButton",
                                    )}
                                    onPress={() => handleRegister.mutate()}
                                    buttonType={"primary"}
                                />
                            ) : attendOrActivity === "attend" ? (
                                <ButtonComponent
                                    text={t("translateFeedback.feedback")}
                                    onPress={() => {
                                        navigation.navigate("feedbackanswer", {
                                            activityId: id,
                                        });
                                        setModalVisible(false);
                                    }}
                                    buttonType={"secondary"}
                                />
                            ) : null}
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

            {/* Card content */}
            <TouchableOpacity
                style={styleFunctions.getCardStyle(
                    type,
                    newDateEnd,
                    currentDate,
                )}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.title}>{title}</Text>
                <View style={styles.bottomRow}>
                    <View style={styles.bottomRowLocation}>
                        <View style={{ flexDirection: "row", gap: 3 }}>
                            <Ionicons
                                name={"location-outline"}
                                size={20}
                                color={"white"}
                            />
                            <Text style={styles.text}>{location}</Text>
                        </View>
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
    modalTextView: {
        alignSelf: "center",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 5,
        marginBottom: 15,
    },
    modalText: {
        fontSize: 16,
        alignSelf: "flex-end",
        textAlign: "center",
        fontWeight: "normal",
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
        justifyContent: "flex-start",
        alignItems: "flex-end",
        flexDirection: "row",
    },

    bottomRowDate: {
        width: "50%",
        justifyContent: "flex-end",
        flexDirection: "column",
    },

    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    centeredViewModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modalView: {
        backgroundColor: Colors.workshopLightColor,
        borderRadius: 20,
        width: Platform.OS !== "web" ? "95%" : undefined,
        maxWidth: Platform.OS === "web" ? "95%" : undefined,
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
        fontSize: isMobile ? 14 : 16,
        color: "white",
    },
});

export default Card;
