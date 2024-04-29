import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import React from "react";
import ButtonComponent from "@/components/ButtonComponent";
import useAllExpoTokens from "@/hooks/useAllExpoTokens";
import { useAuth } from "@/context/Auth";
import { sendNotificationsToAllUsers, sendPushNotification } from "@/utils/sendNotification";

export default function Notifications() {
    const { allExpoTokens } = useAllExpoTokens();
    const { expoPushToken, notification } = useAuth();

    const data = JSON.stringify(notification, undefined, 2);

    return (
        <ScrollView nestedScrollEnabled={true} contentContainerStyle={[styles.mainContainer, { flexGrow: 0 }]}>
            <View style={styles.container}>
                <Text>{expoPushToken}</Text>
                <ScrollView>
                    <Text style={{ maxHeight: 200 }}>{data}</Text>
                </ScrollView>
                <ButtonComponent
                    text="Send notification"
                    buttonType="primary"
                    onPress={() => {
                        if (expoPushToken) {
                            void sendPushNotification(expoPushToken, "Venez voir !", "Vous avez reçu un feedback de la part de vos étudiants! 📬", { someData: "goes here" });
                        }
                    }}
                />

                <ButtonComponent
                    text={"Send notifications to all users"}
                    onPress={() => {
                        sendNotificationsToAllUsers(allExpoTokens, "Venez voir !", "Vous avez reçu un feedback de la part de vos étudiants! 📬", { someData: "goes here" });
                    }}
                    buttonType={"secondary"}
                />
            </View>
        </ScrollView>
    );

}
