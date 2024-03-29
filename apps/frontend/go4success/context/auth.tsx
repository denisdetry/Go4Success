import * as React from "react";
import { useRouter, useSegments } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import { UserRegister } from "@/types/UserRegister";
import { UserLogin } from "@/types/UserLogin";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const AuthContext = React.createContext<any>(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
    const rootSegment = useSegments()[0];
    const router = useRouter();
    const [user, setUser] = React.useState<string | undefined>("");
    const [isRegistered, setIsRegistered] = React.useState<boolean>(false);

    React.useEffect(() => {
        axios
            .get("http://localhost:8000/api/current_user/")
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    React.useEffect(() => {
        if (user === undefined) return;

        if (!user && rootSegment !== "(auth)") {
            router.replace("/(auth)/login");
        } else if (user && rootSegment !== "(app)") {
            router.replace("/");
        }
    }, [user, rootSegment]);

    return (
        <AuthContext.Provider
            value={{
                user: user,
                signUp: (userData: UserRegister) => {
                    {
                        axios
                            .post("http://localhost:8000/api/register/", {
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
                                console.log(err.response.data);
                                Toast.show({
                                    type: "error",
                                    text1: "Erreur",
                                    text2: err.response.data,
                                });
                            });
                    }
                },
                signIn: (userData: UserLogin) => {
                    axios
                        .post("http://localhost:8000/api/login/", {
                            username: userData.username,
                            password: userData.password,
                        })
                        .then((res) => {
                            setUser(res.data);
                        })
                        .catch((err) => {
                            if (err.response.status === 400) {
                                Toast.show({
                                    type: "error",
                                    text1: "Erreur",
                                    text2: "Nom d'utilisateur ou mot de passe incorrect",
                                });
                            }
                        });
                },

                signOut: () => {
                    axios
                        .post("http://localhost:8000/api/logout/")
                        .then(() => {
                            setUser("");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                },

                isRegistered: isRegistered,
                setIsRegistered: setIsRegistered,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
