import { API_BASE_URL } from "@/constants/ConfigApp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchError } from "@/utils/fetchError";

export async function fetchBackend(options: {
    readonly type: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
    url: string;
    readonly params?: Record<string, string>;
    readonly data?: any;
}): Promise<any> {
    const { type, params, data } = options;
    let { url } = options;

    if (params && type === "GET") {
        url +=
            "?" +
            new URLSearchParams(
                Object.entries(params).filter(
                    (x) => x[1] !== undefined && x[1] !== null,
                ),
            ).toString();
    }

    const response = await fetch(`${API_BASE_URL}/` + url, {
        method: type,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": await AsyncStorage.getItem("csrf_token"),
        },
        ...(data && { body: JSON.stringify(data) }),
    });

    if (response.ok) {
        const responseData = await response.json();

        if (responseData !== undefined) {
            return { data: responseData };
        } else {
            return { data: "success" };
        }
    } else {
        throw new fetchError("An error has occurred", response);
    }
}
