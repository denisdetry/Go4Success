import * as React from "react";
import { useRouter, useSegments } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import { UserRegister } from "@/types/UserRegister";
import { UserLogin } from "@/types/UserLogin";
import axiosConfig from "@/constants/axiosConfig";
import { API_BASE_URL } from "@/constants/ConfigApp";

axiosConfig();

const AuthContext = React.createContext<any>(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
    const rootSegment = useSegments()[0];
    const router = useRouter();
    const [user, setUser] = React.useState<string | undefined>("");
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
                                        text1: "Erreur",
                                        text2: err.response.data,
                                    });
                                } catch (e) {
                                    Toast.show({
                                        type: "error",
                                        text1: "Erreur",
                                        text2: "Veuillez réessayer plus tard. Le serveur ne répond pas.",
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
                                        text1: "Erreur",
                                        text2: "Nom d'utilisateur ou mot de passe incorrect",
                                    });
                                }
                            } catch (e) {
                                Toast.show({
                                    type: "error",
                                    text1: "Erreur",
                                    text2: "Veuillez réessayer plus tard. Le serveur ne répond pas.",
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
                            text1: "Félicitation ! 🎉",
                            text2: "Connexion réussie ! Bienvenue sur Go4Success",
                        });
                        setIsSignedIn(false);
                    }
                },
                showRegisterToast: () => {
                    if (isRegistered) {
                        Toast.show({
                            type: "success",
                            text1: "Félicitations ! 🎉",
                            text2: "Inscription reussie ! Bienvenue sur Go4Success",
                        });
                        setIsRegistered(false);
                    }
                },
                showLogoutToast: () => {
                    if (isSignedOut) {
                        Toast.show({
                            type: "success",
                            text1: "Déconnexion réussie",
                            text2: "A bientôt sur Go4Success !",
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
