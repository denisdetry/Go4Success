import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import React from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import ButtonComponent from "@/components/ButtonComponent";
import styles from "@/styles/global";
import Colors from "@/constants/Colors";
import useAllUsers from "@/hooks/useAllUsers";

export default function Notifications() {
    const { expoPushToken, notification } = usePushNotifications();
    const [count, setCount] = React.useState(0);
    const [isSending, setIsSending] = React.useState(false);
    const { allUsers } = useAllUsers();


    async function sendPushNotification(expoPushToken: string) {
        const message = {
            to: expoPushToken,
            sound: "default",
            title: "Venez voir !",
            body: "Vous avez reçu un feedback de la part de vos étudiants! 📬",
            data: { someData: "goes here" },
        };

        try {
            setIsSending(true);
            await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Accept-encoding": "gzip, deflate",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            });
            setCount(count + 1);
            setIsSending(false);
        } catch (error) {
            console.error(error);
        }
    }

    function sendNotificationsToAllUsers() {
        allUsers.map((user: any) => {
            if (user.expo_push_token) {
                sendPushNotification(user.expo_push_token);
            }
        }, []);
    }

    const data = JSON.stringify(notification, undefined, 2);

    return (
        <ScrollView nestedScrollEnabled={true} contentContainerStyle={[styles.mainContainer, { flexGrow: 0 }]}>
            <View style={styles.container}>
                <Text>{expoPushToken}</Text>
                {isSending && !data && (
                    <ActivityIndicator size={"large"} color={Colors.primaryColor} />
                )}
                <ScrollView>
                    <Text style={{ maxHeight: 200 }}>{data}</Text>
                </ScrollView>
                <ButtonComponent
                    text="Send notification"
                    buttonType="primary"
                    onPress={() => {
                        if (expoPushToken) {
                            sendPushNotification(expoPushToken);
                        }
                    }}
                />

                <ButtonComponent text={"Send notifications to all users"} onPress={() => {
                    sendNotificationsToAllUsers();
                }} buttonType={"secondary"}
                />
            </View>
        </ScrollView>
    );
}
