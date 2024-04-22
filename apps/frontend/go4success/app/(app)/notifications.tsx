import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import React from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import ButtonComponent from "@/components/ButtonComponent";
import styles from "@/styles/global";
import Colors from "@/constants/Colors";

export default function notifications() {
    const { expoPushToken, notification } = usePushNotifications();
    const [count, setCount] = React.useState(0);
    const [isSending, setIsSending] = React.useState(false);

    async function sendPushNotification(expoPushToken: string) {
        const message = {
            to: expoPushToken,
            sound: "default",
            title: "Original Title " + count,
            body: "And here is the body!",
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

    const data = JSON.stringify(notification, undefined, 2);

    return (
        <ScrollView nestedScrollEnabled={true} contentContainerStyle={[styles.mainContainer, { flexGrow: 0 }]}>
            <View style={styles.container}>
                <Text>{expoPushToken}</Text>
                {isSending && !data && (
                    <ActivityIndicator size={"large"} color={Colors.primaryColor} />
                )}
                <ScrollView
                    contentContainerStyle={{ maxHeight: 200 }}
                    nestedScrollEnabled={true}
                >
                    <Text>{data}</Text>
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
            </View>
        </ScrollView>
    );
}
