import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

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
    id: string,
    first_name: string | undefined,
    last_name: string | undefined,
    is_superUser: string | undefined,
    is_professor: string | null,
    is_tutor: string | null,
) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    // console.log("Called useActivities");

    const { isPending, data, error } = useQuery<User[]>({
        queryKey: ["rolemanagement", id, first_name, last_name, is_superuser],
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
