import { API_BASE_URL } from "@/constants/ConfigApp";

function getCSRFToken() {
    const csrfCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="));

    if (csrfCookie) {
        return csrfCookie.split("=")[1];
    } else {
        return "";
    }
}

function constructPath(params: string[]): string {
    return params.join("/") + "/";
}

export async function fetchBackend<T extends any>(
    type: "POST" | "GET" | "PUT" | "DELETE",
    url: string,
    data?: any,
) {
    const csrftoken = getCSRFToken();

    try {
        const response = await fetch(`${API_BASE_URL}/` + url, {
            method: type,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            ...(data && { body: JSON.stringify(data) }),
        });

        if (response.ok) {
            return (await response.json()) as Promise<T>;
        } else {
            return { error: "Something went wrong once!" };
        }
    } catch (error) {
        return { error: "Something went wrong twice!" };
    }
}
