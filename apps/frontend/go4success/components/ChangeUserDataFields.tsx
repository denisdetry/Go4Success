import React, { useState } from "react";
import styles from "@/styles/global";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface ChangeUserDataFieldsProps {
    readonly data: any;
    readonly label: string;
    readonly query: any;
}

const ChangeUserDataFields: React.FC<ChangeUserDataFieldsProps> = ({
    data,
    label,
    query,
}) => {
    const [editable, setEditable] = useState(false);
    const [newData, setNewData] = useState(data);

    const switchEdit = () => {
        setEditable(!editable);
    };
    const fetchData = () => {
        console.log("newData : " + newData);
        switchEdit();
    };

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
                    value={newData}
                    onChangeText={setNewData}
                    editable={editable}
                    clearButtonMode={"while-editing"}
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
                        <TouchableOpacity onPress={fetchData}>
                            <Ionicons
                                name="checkmark"
                                size={26}
                                color={Colors.appointmentColor}
                            />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {data ? (
                            <TouchableOpacity onPress={switchEdit}>
                                <FontAwesome6
                                    name="pen"
                                    size={22}
                                    color={Colors.primaryColor}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={switchEdit}>
                                <Ionicons
                                    name="add-circle"
                                    size={26}
                                    color={Colors.primaryColor}
                                />
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </>
    );
};

export default ChangeUserDataFields;
