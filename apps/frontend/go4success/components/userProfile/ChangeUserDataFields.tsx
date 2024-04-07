import React, { useState } from "react";
import styles from "@/styles/global";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import axios from "axios";
import { useAuth } from "@/context/auth";
import UserProfileModal from "@/components/modals/UserProfileModal";
import { API_BASE_URL } from "@/constants/ConfigApp";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/app/_layout";

interface ChangeUserDataFieldsProps {
    readonly data: any;
    readonly label: string;
    readonly dataKey: string;
}

const ChangeUserDataFields: React.FC<ChangeUserDataFieldsProps> = ({
    data,
    label,
    dataKey,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editable, setEditable] = useState(false);
    const [newData, setNewData] = useState(data);
    const { user } = useAuth();

    const { t } = useTranslation();
    const switchEdit = () => {
        setEditable(!editable);
    };

    const fetchData = useMutation({
        mutationFn: async () => {
            const data: { [index: string]: any } = {};
            data[dataKey] = newData;
            const response = await axios.patch(
                `${API_BASE_URL}/auth/user_profile/` + user.id + "/",
                data,
            );

            return response.data;
        },
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Félicitation ! 🎉",
                text2:
                    t("translationProfile.changeUserInfoSuccessPart1") +
                    label.toLowerCase() +
                    t("translationProfile.changeUserInfoSuccessPart2"),
            });
            void queryClient.invalidateQueries({ queryKey: ["current_user"] });
            switchEdit();
        },
        onError: (error: any) => {
            console.log(error);
            const errorMessages =
                error.response.data[dataKey] || "Une erreur est survenue";
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

    return (
        <>
            <UserProfileModal
                isVisible={isModalVisible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                dataLabelName={label.toLowerCase()}
            />
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
                    value={newData}
                    onChangeText={setNewData}
                    editable={editable}
                    clearButtonMode={"while-editing"} // on IOS
                />

                {editable ? (
                    <>
                        <TouchableOpacity
                            onPress={() => {
                                setNewData(data);
                                switchEdit();
                            }}
                        >
                            <Ionicons
                                name="close-sharp"
                                size={26}
                                color={Colors.importantColor}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setIsModalVisible(true);
                            }}
                        >
                            <Ionicons
                                name="checkmark"
                                size={26}
                                color={Colors.appointmentColor}
                            />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={switchEdit}>
                            {newData ? (
                                <FontAwesome6
                                    name="pen"
                                    size={22}
                                    color={Colors.primaryColor}
                                />
                            ) : (
                                <Ionicons
                                    name="add-circle"
                                    size={26}
                                    color={Colors.primaryColor}
                                />
                            )}
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </>
    );
};

export default ChangeUserDataFields;
