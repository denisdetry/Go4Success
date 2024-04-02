import React, { useState } from "react";
import styles from "@/styles/global";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import axios from "axios";
import { useAuth } from "@/context/auth";
import Toast from "react-native-toast-message";
import axiosConfig from "@/constants/axiosConfig";
import UserProfileModal from "@/components/UserProfileModal";

axiosConfig();

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
    const { user, refreshUser } = useAuth();

    const switchEdit = () => {
        setEditable(!editable);
    };

    const fetchData = () => {
        const data: { [index: string]: any } = {};
        data[dataKey] = newData;

        axios
            .patch("http://localhost:8000/api/user_profile/" + user.id + "/", data)
            .then(() => {
                Toast.show({
                    type: "success",
                    text1: "Félicitation ! 🎉",
                    text2: "Votre " + label.toLowerCase() + " a été mise à jour",
                });
                refreshUser();
                switchEdit();
            })
            .catch((err) => {
                const error = err.response.data[dataKey] || "Une erreur est survenue";
                Toast.show({
                    type: "error",
                    text1: "Erreur",
                    text2: error,
                });
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleConfirm = () => {
        fetchData();
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
