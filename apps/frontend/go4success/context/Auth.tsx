import * as React from "react";
import { Redirect, useSegments } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import { UserRegister } from "@/types/UserRegister";
import { UserLogin } from "@/types/UserLogin";
import { API_BASE_URL } from "@/constants/ConfigApp";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/app/_layout";
import { ActivityIndicator } from "react-native";
import styles from "@/styles/global";
import Colors from "@/constants/Colors";
import { useCsrfToken } from "@/hooks/useCsrfToken";
import { fetchBackend } from "@/utils/fetchBackend";

const AuthContext = React.createContext<any>(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
    const { t } = useTranslation();
    const rootSegment = useSegments()[0];

    useCsrfToken();

    const {
        isPending,
        data: user,
        error,
    } = useQuery({
        queryKey: ["current_user"],
        queryFn: async () => {
            try {
                return await axios.get(`${API_BASE_URL}/auth/current_user/`);
            } catch (error) {
                return null;
            }
        },
    });

    if (isPending) {
        return (
            <ActivityIndicator
                style={styles.mainContainer}
                size={"large"}
                color={Colors.primaryColor}
            />
        );
    }

    if (error) {
        return <Redirect href={"/(auth)/login"} />;
    }

    if (!user && rootSegment !== "(auth)") {
        return <Redirect href={"/(auth)/login"} />;
    } else if (user && rootSegment === "(auth)") {
        return <Redirect href={"/"} />;
    }

    return (
        <AuthContext.Provider
            value={{
                user: user?.data,
                signUp: async (userData: UserRegister) => {
                    {
                        const { data, error } = await fetchBackend(
                            "POST",
                            "auth/register/",
                            {
                                username: userData.username,
                                email: userData.email,
                                // eslint-disable-next-line camelcase
                                last_name: userData.lastName,
                                // eslint-disable-next-line camelcase
                                first_name: userData.firstName,
                                noma: userData.noma,
                                password: userData.password,
                            },
                        );

                        console.log(error);
                        console.log();

                        if (error) {
                            if (error.status === 400) {
                                Toast.show({
                                    type: "error",
                                    text1: t("translateToast.ErrorText1"),
                                    text2: await error.json(),
                                });
                            } else {
                                Toast.show({
                                    type: "error",
                                    text1: t("translateToast.ErrorText1"),
                                    text2: t("translateToast.ServerErrorText2"),
                                });
                            }
                        }

                        if (data) {
                            void queryClient.invalidateQueries({
                                queryKey: ["current_user"],
                            });

                            Toast.show({
                                type: "success",
                                text1: t("translateToast.SuccessText1"),
                                text2: t("translateToast.RegisterSuccessText2"),
                            });
                        }
                    }
                },

                signIn: async (userData: UserLogin) => {
                    const { data, error } = await fetchBackend("POST", "auth/login/", {
                        username: userData.username,
                        password: userData.password,
                    });

                    if (error) {
                        if (error.status === 400) {
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

                    if (data) {
                        void queryClient.invalidateQueries({
                            queryKey: ["current_user"],
                        });
                        Toast.show({
                            type: "success",
                            text1: t("translateToast.SuccessText1"),
                            text2: t("translateToast.LoginSuccessText2"),
                        });
                    }
                },

                signOut: async () => {
                    const { data, error } = await fetchBackend("POST", "auth/logout/");
                    if (error) {
                        console.log(error);
                    }

                    if (data) {
                        void queryClient.invalidateQueries({
                            queryKey: ["current_user"],
                        });
                        Toast.show({
                            type: "success",
                            text1: t("translateToast.LogoutSuccessText1"),
                            text2: t("translateToast.LogoutSuccessText2"),
                        });
                    }
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
