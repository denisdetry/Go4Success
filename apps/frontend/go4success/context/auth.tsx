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

const AuthContext = React.createContext<any>(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
    const { t } = useTranslation();
    const rootSegment = useSegments()[0];

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
                signUp: (userData: UserRegister) => {
                    {
                        axios
                            .post(`${API_BASE_URL}/auth/register/`, {
                                username: userData.username,
                                email: userData.email,
                                // eslint-disable-next-line camelcase
                                last_name: userData.lastName,
                                // eslint-disable-next-line camelcase
                                first_name: userData.firstName,
                                noma: userData.noma,
                                password: userData.password,
                            })
                            .then(() => {
                                void queryClient.invalidateQueries({
                                    queryKey: ["current_user"],
                                });
                                Toast.show({
                                    type: "success",
                                    text1: t("translateToast.SuccessText1"),
                                    text2: t("translateToast.RegisterSuccessText2"),
                                });
                            })
                            .catch((err) => {
                                try {
                                    Toast.show({
                                        type: "error",
                                        text1: t("translateToast.ErrorText1"),
                                        text2: err.response.data,
                                    });
                                } catch (e) {
                                    Toast.show({
                                        type: "error",
                                        text1: t("translateToast.ErrorText1"),
                                        text2: t("translateToast.ServerErrorText2"),
                                    });
                                }
                            });
                    }
                },

                signIn: (userData: UserLogin) => {
                    axios
                        .post(`${API_BASE_URL}/auth/login/`, {
                            username: userData.username,
                            password: userData.password,
                        })
                        .then(() => {
                            void queryClient.invalidateQueries({
                                queryKey: ["current_user"],
                            });
                            Toast.show({
                                type: "success",
                                text1: t("translateToast.SuccessText1"),
                                text2: t("translateToast.LoginSuccessText2"),
                            });
                        })
                        .catch((err) => {
                            console.log(err.response.data);
                            try {
                                if (err.response.status === 400) {
                                    Toast.show({
                                        type: "error",
                                        text1: t("translateToast.ErrorText1"),
                                        text2: t("translateToast.LoginInfoErrorText2"),
                                    });
                                }
                            } catch (e) {
                                Toast.show({
                                    type: "error",
                                    text1: t("translateToast.ErrorText1"),
                                    text2: t("translateToast.ServerErrorText2"),
                                });
                            }
                        });
                },

                signOut: () => {
                    axios
                        .post(`${API_BASE_URL}/auth/logout/`)
                        .then(() => {
                            void queryClient.invalidateQueries({
                                queryKey: ["current_user"],
                            });
                            Toast.show({
                                type: "success",
                                text1: t("translateToast.LogoutSuccessText1"),
                                text2: t("translateToast.LogoutSuccessText2"),
                            });
                        })
                        .catch((err) => {
                            console.log(err.response.data);
                        });
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
