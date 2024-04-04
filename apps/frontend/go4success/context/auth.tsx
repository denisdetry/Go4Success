import * as React from "react";
import { useRouter, useSegments } from "expo-router";
import axios from "axios";
import Toast from "react-native-root-toast";
import { Platform } from "react-native";

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
    const [user, setUser] = React.useState<string | undefined>("a");

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
        } else if (user && rootSegment === "(auth)") {
            router.replace("/");
        }
    }, [user, rootSegment]);


    return (
        <AuthContext.Provider
            value={{
                user: user,
                signUp: (
                    username: string,
                    email: string,
                    lastname: string,
                    firstname: string,
                    noma: number,
                    password: string,
                ) => {
                    {
                        axios
                            .post("http://localhost:8000/api/register/", {
                                username: username,
                                email: email,
                                last_name: lastname,
                                first_name: firstname,
                                noma: noma,
                                password: password,
                            })
                            .then((res) => {
                                console.log(res.data);
                                setUser(res.data);
                            })
                            .catch((err) => {
                                console.log(err);
                                if (err.response.status === 400) {
                                    if (Platform.OS === "web") {
                                        alert(err.response.data);
                                    } else {
                                        Toast.show(err.response.data, {
                                            duration: Toast.durations.LONG,
                                        });
                                    }
                                }
                            });
                    }
                },
                signIn: (username: string, password: string) => {
                    axios
                        .post("http://localhost:8000/api/login/", {
                            username: username,
                            password: password,
                        })
                        .then((res) => {
                            console.log(res);
                            setUser(res.data);
                        })
                        .catch((err) => {
                            console.log(err);
                            if (err.response.status === 400) {
                                if (Platform.OS === "web") {
                                    alert(
                                        "Nom d'utilisateur ou mot de passe incorrect",
                                    );
                                } else {
                                    Toast.show(
                                        "Nom d'utilisateur ou mot de passe incorrect",
                                        {
                                            duration: Toast.durations.LONG,
                                        },
                                    );
                                }
                            }
                        });
                },

                signOut: () => {
                    axios
                        .post("http://localhost:8000/api/logout/")
                        .then((res) => {
                            console.log(res);
                            setUser("");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                },
            
                getUserInfo: () => {
                    
                    axios
                        .get("http://localhost:8000/api/rolemanagement/")    
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                        
                },

                getUserRole: () =>{
                        axios
                        .get("http://localhost:8000/api/editRole/")    
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                        
                }


            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
