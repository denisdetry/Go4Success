import * as React from "react";
import { Redirect, useSegments } from "expo-router";
import Toast from "react-native-toast-message";
import { UserRegister } from "@/types/UserRegister";
import { UserLogin } from "@/types/UserLogin";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/app/_layout";
import { ActivityIndicator } from "react-native";
import styles from "@/styles/global";
import Colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBackend } from "@/utils/fetchBackend";
import { fetchError } from "@/utils/fetchError";
import useUser from "@/hooks/useUser";

const AuthContext = React.createContext<any>(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
    const { t } = useTranslation();
    const rootSegment = useSegments()[0];

    const { isPending, user } = useUser();

    if (isPending) {
        return (
            <ActivityIndicator
                style={styles.mainContainer}
                size={"large"}
                color={Colors.primaryColor}
            />
        );
    }

    if (!user && rootSegment !== "(auth)") {
        return <Redirect href={"/(auth)/login"} />;
    } else if (user && rootSegment === "(auth)") {
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
                                    username: userData.username,
                                    email: userData.email,
                                    // eslint-disable-next-line camelcase
                                    last_name: userData.lastName,
                                    // eslint-disable-next-line camelcase
                                    first_name: userData.firstName,
                                    noma: userData.noma,
                                    password: userData.password,
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
                                void queryClient.invalidateQueries({
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
                                if (error.responseError.status === 401) {
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

                            void queryClient.invalidateQueries({
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
                            if (error.responseError.status === 401) {
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
                        await AsyncStorage.removeItem("accessToken");
                        await AsyncStorage.removeItem("refreshToken");

                        void queryClient.invalidateQueries({
                            queryKey: ["current_user"],
                        });
                        Toast.show({
                            type: "success",
                            text1: t("translateToast.LogoutSuccessText1"),
                            text2: t("translateToast.LogoutSuccessText2"),
                        });
                    } catch (error) {
                        console.log(error);
                    }
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
