import { API_BASE_URL } from "@/constants/ConfigApp";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function fetchBackend(options: {
                                       readonly type: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
                                       url: string,
                                       readonly params?: any,
                                       readonly data?: any
                                   },
): Promise<any> {
    const { type, params, data } = options;
    let { url } = options;
    // console.log("Data:", data);

    // console.log("Params:", params);

    if (params && type === "GET") {
        url += "?";
        Object.keys(params).forEach((key, index) => {
            if (params[key] !== undefined) {
                url += `${key}=${params[key]}`;
                if (index < Object.keys(params).length - 1) {
                    url += "&";
                }
            }
        });
    }

    // console.log("URL:", url);

    try {
        const response = await fetch(`${API_BASE_URL}/` + url, {
            method: type,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": await AsyncStorage.getItem("csrf_token"),
            },
            ...(data && { body: JSON.stringify(data) }),
        });

        // console.log("response:", response);

        if (response.ok) {
            const responseData = await response.json();
            
            // console.log("responseData:", responseData);

            if (responseData !== undefined) {
                return { data: responseData };
            } else {
                return { data: "success" };
            }
        } else {
            return { error: response };
        }
    } catch (error) {
        return { error: "Something went wrong!" };
    }
}
