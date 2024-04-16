//import { API_BASE_URL } from "@/constants/ConfigApp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchError } from "@/utils/fetchError";
import { t, use } from "i18next";
import { useCsrfToken } from "@/hooks/useCsrfToken";

export async function fetchBackend(options: {
    readonly type: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
    url: string;
    readonly params?: any;
    readonly data?: any;
}): Promise<any> {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;
    const { type, params, data } = options;
    let { url } = options;

    // Get token from AsyncStorage if it doesn't exist query it with useCsrfToken
    if (!(await AsyncStorage.getItem("csrf_token"))) {
        await useCsrfToken();
    }

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

    const response = await fetch(`${backend_url}/` + url, {
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
        throw new fetchError(t("translationProfile.defaultErrorMessage"), response);
    }
}
