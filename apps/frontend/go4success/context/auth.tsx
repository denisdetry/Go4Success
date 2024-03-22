import * as React from "react";
import { useRouter, useSegments } from "expo-router";
import { User } from "@/types/User";
import axios from "axios";

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
    const [user, setUser] = React.useState<User | undefined | string>("");

    React.useEffect(() => {
        axios
            .get("http://localhost:8000/api/current_user/")
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

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
                        });
                    // setUser(username);
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
