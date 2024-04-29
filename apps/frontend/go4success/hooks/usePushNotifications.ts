import { useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Constants from "expo-constants";

import { Platform } from "react-native";
import { fetchBackend } from "@/utils/fetchBackend";
import { User } from "@/types/User";
import { fetchError } from "@/utils/fetchError";

export interface PushNotificationState {
    expoPushToken?: Notifications.ExpoPushToken;
    notification?: Notifications.Notification;
}

export const usePushNotifications = (user: User): PushNotificationState => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    const [expoPushToken, setExpoPushToken] = useState<
        Notifications.ExpoPushToken | undefined
    >();

    const [notification, setNotification] = useState<
        Notifications.Notification | undefined
    >();

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();


    function handleRegistrationError(errorMessage: string) {
        alert(errorMessage);
        throw new Error(errorMessage);
    }

    async function registerForPushNotificationsAsync() {
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                handleRegistrationError("Permission not granted to get push token for push notification!");
                return;
            }
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId;
            if (!projectId) {
                handleRegistrationError("Project ID not found");
            }
            try {
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                return pushTokenString;
            } catch (e: unknown) {
                handleRegistrationError(`${e}`);
            }
        } else {
            handleRegistrationError("Must use physical device for push notifications");
        }
    }


    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(async (token) => {
                setExpoPushToken(token ?? "");

                if (user?.id) {
                    try {
                        await fetchBackend({
                            type: "POST",
                            url: "auth/expo_token/",
                            data: {
                                user: user?.id,
                                token: token,
                                // eslint-disable-next-line camelcase
                                is_active: true,
                            },
                        });

                    } catch (e) {
                        const error = e as fetchError;
                        if (error.responseError.status === 400) {
                            console.log("PushNotif POST: ", error.responseError);
                        }
                    }

                    try {
                        await fetchBackend({
                            type: "PATCH",
                            url: "auth/update_expo_token/" + user?.id + "/",
                            data: {
                                token: token,
                                // eslint-disable-next-line camelcase
                                is_active: true,
                            },
                        });
                    } catch (e) {
                        const error = e as fetchError;
                        if (error.responseError.status === 400) {
                            console.log("PushNotif PATCH: ", error.responseError);
                        }
                    }
                }


            })
            .catch((error: any) => setExpoPushToken(`${error}`));


        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(response);
            });

        return () => {
            notificationListener.current &&
            Notifications.removeNotificationSubscription(
                notificationListener.current,
            );
            responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return {
        expoPushToken,
        notification,
    };
};