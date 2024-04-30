import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { useMutation } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export function useUserInfo() {
    const backendURL = process.env.EXPO_PUBLIC_API_URL;
    const {
        data: userInfo,
        error,
        isFetching,
    } = useQuery(["getUserInfo"], async () => {
        const { data, error } = await fetchBackend({
            type: "GET",
            url: `${backendURL}/rolemanagement/rolemanagement/`,
        });

        if (error) {
            throw new Error(error);
        }

        return data;
    });

    return { userInfo, error, isFetching };
}

export function useUserRole() {
    const backendURL = process.env.EXPO_PUBLIC_API_URL;

    const {
        data: userRole,
        error,
        isFetching,
    } = useQuery(["getUserRole"], async () => {
        const { data, error } = await fetchBackend({
            type: "GET",
            url: `${backendURL}/rolemanagement/editRole/`,
        });

        if (error) {
            throw new Error(error);
        }

        return data; // Ajustez en fonction du format attendu
    });

    return { userRole, error, isFetching };
}

export function usePostSite(endpoint: string, newSiteData: any) {
    const { mutate, isError, error, data } = useMutation({
        mutationFn: async () => {
            const { data, error } = await fetchBackend({
                type: "POST",
                url: `/rolemanagement/${endpoint}/`,
                data: JSON.stringify(newSiteData),
            });
            return { data, error };
        },
        onSuccess: () => {
            // Affiche un toast en cas de succès
            Toast.show({
                type: "success",
                text1: "Succès",
                text2: "Les informations ont bien été envoyées.",
            });
        },
        onError: (error) => {
            // Affiche un toast en cas d'erreur
            Toast.show({
                type: "error",
                text1: "Erreur",
                text2: error.message || "Une erreur est survenue.",
            });
        },
    });

    return {
        mutatePostSite: mutate,
        isError,
        error,
        data,
    };
}
