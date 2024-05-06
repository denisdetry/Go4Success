import React, { useState } from "react";
import styles from "@/styles/global";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/Auth";
import UserProfileModal from "@/components/modals/UserProfileModal";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import Toast from "react-native-toast-message";
import { queryClient } from "@/app/_layout";
import { fetchError } from "@/utils/fetchError";

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
            await fetchBackend({
                type: "PATCH",
                url: "auth/user_profile/" + user.id + "/",
                data: data,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["current_user"] });
            switchEdit();
            Toast.show({
                type: "success",
                text1: t("translateToast.SuccessText1"),
                text2:
                    t("translationProfile.changeUserInfoSuccessPart1") +
                    label.toLowerCase() +
                    t("translationProfile.changeUserInfoSuccessPart2"),
            });
        },
        onError: async (error: fetchError) => {
            const errorResponse = await error.responseError.json();
            const errorMessages =
                errorResponse[dataKey] ||
                t("translationProfile.defaultErrorMessage");
            Toast.show({
                type: "error",
                text1: t("translationProfile.error"),
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
                    value={newData ? newData : ""}
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
