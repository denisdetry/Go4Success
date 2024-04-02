import { Modal, Text, View } from "react-native";
import Colors from "@/constants/Colors";
import styles from "@/styles/global";
import Button from "@/components/Button";
import React from "react";

const UserProfileModal = ({
    isVisible,
    onCancel,
    onConfirm,
    dataLabelName,
}: {
    readonly isVisible: boolean;
    readonly onCancel: any;
    readonly onConfirm: any;
    readonly dataLabelName: string;
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCancel}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                }}
            >
                <View
                    style={{
                        backgroundColor: Colors.lightBackgroundColor,
                        padding: 20,
                        borderRadius: 10,
                    }}
                >
                    <Text style={styles.text}>
                        Êtes vous sûr de vouloir changer votre {dataLabelName}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            marginTop: 20,
                        }}
                    >
                        <Button
                            text="Annuler"
                            onPress={onCancel}
                            buttonType={"close"}
                        />
                        <Button
                            text="Confirmer"
                            onPress={onConfirm}
                            buttonType={"primary"}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default UserProfileModal;
