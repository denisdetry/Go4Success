import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { useMutation } from "@tanstack/react-query";

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

const postSite = async (newSiteData: any) => {
    const { data, error } = await fetchBackend({
        type: "POST",
        url: `/rolemanagement/${endpoint}/`,
        body: JSON.stringify(newSiteData),
    });

    if (error) {
        throw new Error(error);
    }

    return data;
};

export function usePostSite() {
    const { mutate, isLoading, isError, error, data } = useMutation(postSite, {
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
        isLoading,
        isError,
        error,
        data,
    };
}
