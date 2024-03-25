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




    return (


    <AuthContext.Provider>

        
    </AuthContext.Provider>
    );

}