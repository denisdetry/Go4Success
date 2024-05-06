import ButtonComponent from "@/components/ButtonComponent";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/Auth";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { queryClient } from "@/app/_layout";
import Toast from "react-native-toast-message";
import { fetchError } from "@/utils/fetchError";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from "@/constants/Colors";
import styles from "@/styles/global";
import modalStyles from "@/styles/modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const DeleteUserAccount = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const { t } = useTranslation();
    const { user } = useAuth();

    const handleDeleteUser = useMutation({
        mutationFn: async () => {
            await fetchBackend({
                type: "DELETE",
                url: "auth/delete_user/" + user.id + "/",
                data: { password: passwordValue },
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["current_user"] });
            Toast.show({
                type: "success",
                text1: t("translateToast.SuccessText1"),
                text2: t("translationProfile.successUserDelete"),
            });
            closeModal();
        },
        onError: (error: fetchError) => {
            if (error.responseError.status === 400) {
                setPasswordErrorMessage(t("translationProfile.wrongPassword"));
            } else {
                setPasswordErrorMessage(
                    t("translationProfile.defaultErrorMessage"),
                );
            }
        },
    });

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleConfirm = () => {
        handleDeleteUser.mutate();
    };

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={closeModal}
            >
                <View style={modalStyles.centeredView}>
                    {/* Modal content */}
                    <View style={modalStyles.modalView}>
                        {/* Modal are you sure text */}
                        <View style={modalStyles.modalText}>
                            <Text style={styles.text}>
                                {t("translationProfile.areYouSure")}{" "}
                                {t("translationProfile.deleteUserAccount")}
                            </Text>
                            {/* Modal asking password field */}
                            <View style={styles.inputField}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t(
                                        "translationProfile.passwordPlaceholder",
                                    )}
                                    secureTextEntry={!showPassword}
                                    value={passwordValue}
                                    onChangeText={(text) => {
                                        setPasswordValue(text);
                                        setPasswordErrorMessage("");
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name={!showPassword ? "eye" : "eye-off"}
                                        size={24}
                                        color={Colors.primaryColor}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.errorMsg}>
                                {passwordErrorMessage}
                            </Text>
                        </View>

                        {/* Modal Buttons section */}
                        <View style={modalStyles.modalButtons}>
                            <ButtonComponent
                                text={t("translationProfile.cancelButtonModal")}
                                onPress={closeModal}
                                buttonType={"close"}
                            />
                            <ButtonComponent
                                text={t(
                                    "translationProfile.confirmButtonModal",
                                )}
                                onPress={handleConfirm}
                                buttonType={"primary"}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Open modal button */}
            <ButtonComponent
                text={t("translationProfile.deleteUserButton")}
                onPress={() => {
                    setIsModalVisible(true);
                }}
                buttonType={"danger"}
            />
        </>
    );
};
