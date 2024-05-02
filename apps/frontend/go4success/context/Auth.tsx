import * as React from "react";
import { Redirect, useSegments } from "expo-router";
import Toast from "react-native-toast-message";
import { UserRegister } from "@/types/UserRegister";
import { UserLogin } from "@/types/UserLogin";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/app/_layout";
import { ActivityIndicator, Platform } from "react-native";
import styles from "@/styles/global";
import Colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBackend } from "@/utils/fetchBackend";
import { fetchError } from "@/utils/fetchError";
import useUser from "@/hooks/useUser";
import { usePushNotifications } from "@/hooks/usePushNotifications";

function isListIncluded(mainList: any[][], searchList: any[]): boolean {
    return mainList.some(
        (subList) =>
            subList.length === searchList.length &&
            subList.every((value, index) => value === searchList[index]),
    );
}

const AuthContext = React.createContext<any>(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
    const { t } = useTranslation();
    const rootSegment = useSegments();

    const { isPending, user } = useUser();
    const { expoPushToken, notification } = usePushNotifications(user);

    if (isPending) {
        return (
            <ActivityIndicator
                style={styles.mainContainer}
                size={"large"}
                color={Colors.primaryColor}
            />
        );
    }

    if (!user && rootSegment[0] !== "(auth)") {
        return <Redirect href={"/(auth)/login"} />;
    } else if (user && rootSegment[0] === "(auth)") {
        return <Redirect href={"/"} />;
    }

    const deniedRoutesForNonSuperUser = [
        ["(app)", "rolemanagement"],
        ["(app)", "feedbacklist"],
        ["(app)", "feedbackcreate"],
    ];

    const isNotSuperUser = !user?.is_superuser && user;

    if (isNotSuperUser && isListIncluded(deniedRoutesForNonSuperUser, rootSegment)) {
        return <Redirect href={"/"} />;
    }

    return (
        <AuthContext.Provider
            value={{
                user: user,
                signUp: async (userData: UserRegister) => {
                    {
                        try {
                            const { data: success } = await fetchBackend({
                                type: "POST",
                                url: "auth/register/",
                                data: {
                                    email: userData.email,
                                    username: userData.username,
                                    // eslint-disable-next-line camelcase
                                    last_name: userData.lastName,
                                    // eslint-disable-next-line camelcase
                                    first_name: userData.firstName,
                                    password: userData.password,
                                    noma: userData.noma ? userData.noma : undefined,
                                },
                            });

                            if (success) {
                                await AsyncStorage.setItem(
                                    "accessToken",
                                    success.access,
                                );
                                await AsyncStorage.setItem(
                                    "refreshToken",
                                    success.refresh,
                                );
                                await queryClient.invalidateQueries({
                                    queryKey: ["current_user"],
                                });

                                Toast.show({
                                    type: "success",
                                    text1: t("translateToast.SuccessText1"),
                                    text2: t("translateToast.RegisterSuccessText2"),
                                });
                            }
                        } catch (err) {
                            const error = err as fetchError;
                            if (error.responseError) {
                                if (
                                    error.responseError.status === 401 ||
                                    error.responseError.status === 400
                                ) {
                                    Toast.show({
                                        type: "error",
                                        text1: t("translateToast.ErrorText1"),
                                        text2: await error.responseError.json(),
                                    });
                                } else {
                                    Toast.show({
                                        type: "error",
                                        text1: t("translateToast.ErrorText1"),
                                        text2: t("translateToast.ServerErrorText2"),
                                    });
                                }
                            }
                        }
                    }
                },

                signIn: async (userData: UserLogin) => {
                    try {
                        const { data: success } = await fetchBackend({
                            type: "POST",
                            url: "auth/token/",
                            data: {
                                username: userData.username,
                                password: userData.password,
                            },
                        });

                        if (success) {
                            await AsyncStorage.setItem("accessToken", success.access);
                            await AsyncStorage.setItem("refreshToken", success.refresh);

                            await queryClient.invalidateQueries({
                                queryKey: ["current_user"],
                            });

                            Toast.show({
                                type: "success",
                                text1: t("translateToast.SuccessText1"),
                                text2: t("translateToast.LoginSuccessText2"),
                            });
                        }
                    } catch (err) {
                        const error = err as fetchError;
                        if (error.responseError) {
                            if (
                                error.responseError.status === 401 ||
                                error.responseError.status === 400
                            ) {
                                Toast.show({
                                    type: "error",
                                    text1: t("translateToast.ErrorText1"),
                                    text2: t("translateToast.LoginInfoErrorText2"),
                                });
                            } else {
                                Toast.show({
                                    type: "error",
                                    text1: t("translateToast.ErrorText1"),
                                    text2: t("translateToast.ServerErrorText2"),
                                });
                            }
                        }
                    }
                },

                signOut: async () => {
                    try {
                        if (Platform.OS !== "web") {
                            await fetchBackend({
                                type: "PATCH",
                                url: "auth/update_expo_token/" + user.id + "/",
                                data: {
                                    token: expoPushToken,
                                    // eslint-disable-next-line camelcase
                                    is_active: false,
                                },
                            });
                        }

                        await AsyncStorage.removeItem("accessToken");
                        await AsyncStorage.removeItem("refreshToken");

                        await queryClient.invalidateQueries({
                            queryKey: ["current_user"],
                        });

                        Toast.show({
                            type: "success",
                            text1: t("translateToast.LogoutSuccessText1"),
                            text2: t("translateToast.LogoutSuccessText2"),
                        });
                    } catch (error) {
                        const err = error as fetchError;
                        console.log(err.responseError);
                    }
                },
                expoPushToken: expoPushToken,
                notification: notification,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
