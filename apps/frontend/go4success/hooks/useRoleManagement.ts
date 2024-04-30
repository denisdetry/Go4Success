import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { useMutation } from "@tanstack/react-query";

interface User {
    id: number | null;
    first_name: string | null;
    last_name: string | null;
    is_superuser: string | null;
}

interface UserRole {
    user: number;
    is_professor: boolean;
    is_tutor: boolean;
}

export function useRoleManagement(
    id: number | null,
    first_name: string | undefined,
    last_name: string | undefined,
    is_superUser: string | undefined,
    is_professor: string | null,
    is_tutor: string | null,
    user: number | null,
) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    // console.log("Called useActivities");

    const { isPending, data, error } = useQuery<UserRole[]>({
        queryKey: ["userRole", user, is_professor, is_tutor],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: `/rolemanagement/${endpoint}/`,
                params: {
                    // eslint-disable-next-line camelcase

                    user: user,
                    // eslint-disable-next-line camelcase
                    is_professor: is_professor,
                    // eslint-disable-next-line camelcase
                    is_tutor: is_tutor,
                },
            });
            // console.log("resp:", data);
            return data;
        },
    });
    const { isPending, data, error } = useQuery<User[]>({
        queryKey: ["rolemanagement", id, first_name, last_name, is_superUser],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: `/rolemanagement/${endpoint}/`,
                params: {
                    id: id,
                    // eslint-disable-next-line camelcase
                    first_name: first_name,
                    // eslint-disable-next-line camelcase
                    last_name: last_name,
                    // eslint-disable-next-line camelcase
                    is_superUser: is_superUser,
                },
            });
            // console.log("resp:", data);
            return data;
        },
    });
    return { isPending, data: data ?? [], error };
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

// Hook pour utiliser la mutation
export function usePostSite() {
    const { mutate, isLoading, isError, error, data } = useMutation(postSite);

    return {
        mutatePostSite: mutate,
        isLoading,
        isError,
        error,
        data,
    };
}
