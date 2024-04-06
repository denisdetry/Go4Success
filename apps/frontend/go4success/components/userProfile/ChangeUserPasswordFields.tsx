import { useAuth } from "@/context/auth";
import { useState } from "react";
import UserProfileModal from "@/components/modals/UserProfileModal";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "@/styles/global";
import ButtonComponent from "@/components/ButtonComponent";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/constants/ConfigApp";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useTranslation } from "react-i18next";

export const ChangeUserPasswordFields = () => {
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editable, setEditable] = useState(false);
    const { user, signIn } = useAuth();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

    const [oldPasswordShow, setOldPasswordShow] = useState(false);
    const [newPasswordShow, setNewPasswordShow] = useState(false);
    const [newPasswordConfirmationShow, setNewPasswordConfirmationShow] =
        useState(false);

    const clearFields = () => {
        setOldPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
    };

    const switchEdit = () => {
        setEditable(!editable);
    };

    // fetch data
    const fetchData = useMutation({
        mutationFn: async () => {
            const response = await axios.put(
                `${API_BASE_URL}/auth/change_password/` + user.id + "/",
                {
                    // eslint-disable-next-line camelcase
                    old_password: oldPassword,
                    password: newPassword,
                    password2: newPasswordConfirmation,
                },
            );
            return response.data;
        },

        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Félicitation ! 🎉",
                text2: t("translationProfile.successPasswordChange"),
            });
            signIn({ username: user.username, password: newPassword });
            clearFields();
        },

        onError(error: any) {
            let errorMessages = t("translationProfile.defaultErrorMessage");

            const { response } = error;
            if (response && response.data) {
                const { data } = response;
                if (data.old_password) {
                    errorMessages = data.old_password.old_password;
                } else if (data.password && data.password[0]) {
                    errorMessages = data.password[0];
                } else if (data.password2 && data.password2[0]) {
                    errorMessages = data.password2[0];
                }
            }

            Toast.show({
                type: "error",
                text1: t("translationProfile.error"),
                text2: errorMessages || t("translationProfile.defaultErrorMessage"),
            });
        },
    });

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleConfirm = () => {
        fetchData.mutate();
        setIsModalVisible(false);
    };

    const passwordFields = (
        label: string,
        value: string,
        onChangeText: (text: string) => void,
        passwordShow: any,
        setPasswordShow: any,
    ) => (
        <>
            <Text style={styles.text}>{label}</Text>
            <View
                style={[
                    styles.inputField,
                    {
                        backgroundColor: !editable
                            ? Colors.lightBackgroundColor
                            : "white",
                    },
                ]}
            >
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    clearButtonMode={"while-editing"}
                    editable={editable}
                    secureTextEntry={!passwordShow}
                />

                {editable && (
                    <TouchableOpacity>
                        <MaterialCommunityIcons
                            name={passwordShow ? "eye-off" : "eye"}
                            size={24}
                            color={Colors.primaryColor}
                            onPress={() => setPasswordShow(!passwordShow)}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </>
    );

    return (
        <>
            <UserProfileModal
                isVisible={isModalVisible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                dataLabelName={t("translationProfile.passwordTitle").toLowerCase()}
            />

            {passwordFields(
                t("translationProfile.oldPassword"),
                oldPassword,
                setOldPassword,
                oldPasswordShow,
                setOldPasswordShow,
            )}

            {passwordFields(
                t("translationProfile.newPassword"),
                newPassword,
                setNewPassword,
                newPasswordShow,
                setNewPasswordShow,
            )}

            {passwordFields(
                t("translationProfile.confirmPassword"),
                newPasswordConfirmation,
                setNewPasswordConfirmation,
                newPasswordConfirmationShow,
                setNewPasswordConfirmationShow,
            )}

            {editable ? (
                <>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <ButtonComponent
                            text={t("translationProfile.cancelPasswordChangeButton")}
                            onPress={() => {
                                switchEdit();
                                clearFields();
                            }}
                            buttonType={"danger"}
                        />
                        <ButtonComponent
                            text={t("translationProfile.confirmPasswordChangeButton")}
                            onPress={() => {
                                setIsModalVisible(true);
                            }}
                            buttonType={"primary"}
                        />
                    </View>
                </>
            ) : (
                <ButtonComponent
                    text={t("translationProfile.modifyPasswordChangeButton")}
                    onPress={() => {
                        switchEdit();
                    }}
                    buttonType={"primary"}
                />
            )}
        </>
    );
};
