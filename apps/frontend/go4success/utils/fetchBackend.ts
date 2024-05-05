import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchError } from "@/utils/fetchError";
import { t } from "i18next";

export async function fetchBackend(options: {
    readonly type: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
    url: string;
    readonly params?: any;
    readonly data?: any;
}): Promise<any> {
    const backendUrl = process.env.EXPO_PUBLIC_API_URL;
    const { type, params, data } = options;
    let { url } = options;

    const token = await AsyncStorage.getItem("accessToken");
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
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

    const response = await fetch(`${backendUrl}/` + url, {
        method: type,
        credentials: "include",
        headers,
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
        throw new fetchError(
            t("translationProfile.defaultErrorMessage"),
            response,
        );
    }
}
