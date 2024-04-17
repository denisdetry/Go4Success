import { Modal, Text, View } from "react-native";
import Colors from "@/constants/Colors";
import styles from "@/styles/global";
import Button from "@/components/ButtonComponent";
import React from "react";
import { useTranslation } from "react-i18next";

const UserProfileModal = ({
                              isVisible,
                              onCancel,
                              onConfirm,
                              dataLabelName,
                              deleteAccount,
                          }: {
    readonly isVisible: boolean;
    readonly onCancel: any;
    readonly onConfirm: any;
    readonly dataLabelName: string;
    readonly deleteAccount?: boolean;
}) => {
    const { t } = useTranslation();
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
                    {deleteAccount ? (
                        <Text style={styles.text}>
                            {t("translationProfile.areYouSure")} {t("translationProfile.deleteUserAccount")}
                        </Text>
                    ) : (
                        <Text style={styles.text}>
                            {t("translationProfile.areYouSure")} {t("translationProfile.changeTo")} {dataLabelName}
                        </Text>
                    )}

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            marginTop: 20,
                        }}
                    >
                        <Button
                            text={t("translationProfile.cancelButtonModal")}
                            onPress={onCancel}
                            buttonType={"close"}
                        />
                        <Button
                            text={t("translationProfile.confirmButtonModal")}
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
