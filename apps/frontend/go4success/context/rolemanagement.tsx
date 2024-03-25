import * as React from "react";
import { useRouter, useSegments } from "expo-router";
import axios from "axios";
import Toast from "react-native-root-toast";
import { Platform } from "react-native";


// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";



const ManagementContext = React.createContext<any>(null);


export function ManagementProvider({ children }: React.PropsWithChildren) {

    const rootSegment = useSegments()[0];
    const router = useRouter();
    const [role, setRole] = React.useState<string | undefined>("");

    React.useEffect(() => {
        axios
            .get("http://localhost:8000/rolemanagement/")
            .then((res) => {
                setRole(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    React.useEffect(() => {
        if (role === undefined) return;

        if (!role && rootSegment !== "(auth)") {
            router.replace("/(auth)/login");
        } else if (role && rootSegment !== "(app)") {
            router.replace("/");
        }
    }, [role, rootSegment]);


    return (
        <AuthContext.Provider
            value={{
                user: role,
                manageRole: (
                    user_id: string,
                    is_tutor: string,
                    is_professor : string,
                    is_superuser : string,
                ) => {
                    {
                        axios
                            .post("http://localhost:8000/rolemanagement/", {
                   
                                user_id: user_id,
                                is_tutor: is_tutor,
                                is_professor : is_professor,
                                is_superuser : is_superuser,
                            })
                            .then((res) => {
                                console.log(res.data);
                                setRole(res.data);
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



            }}
        >
            {children}
        </AuthContext.Provider>
    );

}