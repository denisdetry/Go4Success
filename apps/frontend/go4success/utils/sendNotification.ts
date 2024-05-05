import * as Notifications from "expo-notifications";

export async function sendPushNotification(expoPushToken: Notifications.ExpoPushToken, title: string, body: string, data: any) {
    const message = {
        to: expoPushToken,
        sound: "default",
        title: title,
        body: body,
        data: data,
    };

    try {
        await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });

    } catch (error) {
        console.error(error);
    }
}

export function sendNotificationsToAllUsers(allExpoTokens: Notifications.ExpoPushToken[], title: string, body: string, data: any) {
    if (!allExpoTokens) {
        return;
    }

    allExpoTokens.map((userTokens: any) => {
        if (userTokens.token && userTokens.is_active) {
            sendPushNotification(userTokens.token, title, body, data);
        }
    }, []);
}

export async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: "Here is the notification body",
            data: { data: "goes here" },
        },
        trigger: { seconds: 2 },
    });
}