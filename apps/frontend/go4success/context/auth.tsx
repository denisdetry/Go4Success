import * as React from "react";
import { useRouter, useSegments } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import { UserRegister } from "@/types/UserRegister";
import { UserLogin } from "@/types/UserLogin";
import axiosConfig from "@/constants/axiosConfig";
import { API_BASE_URL } from "@/constants/ConfigApp";
import { User } from "@/types/User";
import { useTranslation } from "react-i18next";

axiosConfig();

const AuthContext = React.createContext<any>(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
    const { t } = useTranslation();
    const rootSegment = useSegments()[0];
    const router = useRouter();
    const [user, setUser] = React.useState<User | string | undefined>("");
    const [isRegistered, setIsRegistered] = React.useState<boolean>(false);
    const [isSignedIn, setIsSignedIn] = React.useState<boolean>(false);
    const [isSignedOut, setIsSignedOut] = React.useState<boolean>(false);

    const refreshUser = () => {
        axios
            .get(`${API_BASE_URL}/auth/current_user/`)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    React.useEffect(() => {
        refreshUser();
    }, []);

    React.useEffect(() => {
        if (user === undefined) return;

        if (!user && rootSegment !== "(auth)") {
            router.replace("/(auth)/login");
        } else if (user && rootSegment === "(auth)") {
            router.replace("/");
        }
    }, [user, rootSegment]);

    return (
        <AuthContext.Provider
            value={{
                user: user,
                refreshUser: refreshUser,
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
                            .then((res) => {
                                setUser(res.data);
                                setIsRegistered(true);
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
                        .then((res) => {
                            setUser(res.data);
                            setIsSignedIn(true);
                        })
                        .catch((err) => {
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
                            setUser("");
                            setIsSignedOut(true);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                },

                showLoginToast: () => {
                    if (isSignedIn) {
                        Toast.show({
                            type: "success",
                            text1: t("translateToast.SuccessText1"),
                            text2: t("translateToast.LoginSuccessText2"),
                        });
                        setIsSignedIn(false);
                    }
                },
                showRegisterToast: () => {
                    if (isRegistered) {
                        Toast.show({
                            type: "success",
                            text1: t("translateToast.SuccessText1"),
                            text2: t("translateToast.RegisterSuccessText2"),
                        });
                        setIsRegistered(false);
                    }
                },
                showLogoutToast: () => {
                    if (isSignedOut) {
                        Toast.show({
                            type: "success",
                            text1: t("translateToast.LogoutSuccessText1"),
                            text2: t("translateToast.LogoutSuccessText2"),
                        });
                        setIsSignedOut(false);
                    }
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
