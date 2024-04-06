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

export const ChangeUserPasswordFields = () => {
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
                text2: "Votre mot de passe a été mis à jour",
            });
            signIn({ username: user.username, password: newPassword });
            clearFields();
        },

        onError(error: any) {
            let errorMessages = "Une erreur est survenue";

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
                text1: "Erreur",
                text2: errorMessages,
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
                dataLabelName={"Mot de passe"}
            />

            {passwordFields(
                "Ancien mot de passe",
                oldPassword,
                setOldPassword,
                oldPasswordShow,
                setOldPasswordShow,
            )}

            {passwordFields(
                "Nouveau mot de passe",
                newPassword,
                setNewPassword,
                newPasswordShow,
                setNewPasswordShow,
            )}

            {passwordFields(
                "Confirmer nouveau mot de passe",
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
                            text={"Annuler"}
                            onPress={() => {
                                switchEdit();
                                clearFields();
                            }}
                            buttonType={"danger"}
                        />
                        <ButtonComponent
                            text={"Confirmer"}
                            onPress={() => {
                                setIsModalVisible(true);
                            }}
                            buttonType={"primary"}
                        />
                    </View>
                </>
            ) : (
                <ButtonComponent
                    text={"Modifier le mot de passe"}
                    onPress={() => {
                        switchEdit();
                    }}
                    buttonType={"primary"}
                />
            )}
        </>
    );
};
