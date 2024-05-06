import { useAuth } from "@/context/Auth";
import { useState } from "react";
import UserProfileModal from "@/components/modals/UserProfileModal";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "@/styles/global";
import ButtonComponent from "@/components/ButtonComponent";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/app/_layout";
import { fetchBackend } from "@/utils/fetchBackend";
import { fetchError } from "@/utils/fetchError";

export const ChangeUserPasswordFields = () => {
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editable, setEditable] = useState(false);
    const { user } = useAuth();

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
            await fetchBackend({
                type: "PUT",
                url: "auth/change_password/" + user.id + "/",
                data: {
                    // eslint-disable-next-line camelcase
                    old_password: oldPassword,
                    password: newPassword,
                    password2: newPasswordConfirmation,
                },
            });
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["current_user"] });
            Toast.show({
                type: "success",
                text1: t("translateToast.SuccessText1"),
                text2: t("translationProfile.successPasswordChange"),
            });
            clearFields();
            switchEdit();
        },

        onError: async (error: fetchError) => {
            let errorMessages = t("translationProfile.defaultErrorMessage");

            const response = await error.responseError.json();
            if (response) {
                if (response.old_password) {
                    errorMessages = response.old_password.old_password;
                } else if (response.password && response.password[0]) {
                    errorMessages = response.password[0];
                } else if (response.password2 && response.password2[0]) {
                    errorMessages = response.password2[0];
                }
            }

            Toast.show({
                type: "error",
                text1: t("translationProfile.error"),
                text2:
                    errorMessages ||
                    t("translationProfile.defaultErrorMessage"),
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
    ) => {
        return (
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
                        placeholder={editable ? "" : "*".repeat(8)}
                        placeholderTextColor={"grey"}
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
    };

    return (
        <>
            <UserProfileModal
                isVisible={isModalVisible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                dataLabelName={t(
                    "translationProfile.passwordTitle",
                ).toLowerCase()}
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
                            text={t(
                                "translationProfile.cancelPasswordChangeButton",
                            )}
                            onPress={() => {
                                switchEdit();
                                clearFields();
                            }}
                            buttonType={"danger"}
                        />
                        <ButtonComponent
                            text={t(
                                "translationProfile.confirmPasswordChangeButton",
                            )}
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
