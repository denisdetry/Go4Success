import { Modal, Text, View } from "react-native";
import styles from "@/styles/global";
import Button from "@/components/ButtonComponent";
import React from "react";
import { useTranslation } from "react-i18next";
import modalStyles from "@/styles/modal";

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
    const { t } = useTranslation();
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCancel}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <Text style={styles.text}>
                        {t("translationProfile.areYouSure")}{" "}
                        {t("translationProfile.changeTo")} {dataLabelName}
                    </Text>

                    <View style={modalStyles.modalButtons}>
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
