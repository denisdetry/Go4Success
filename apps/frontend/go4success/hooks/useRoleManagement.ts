import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { useMutation } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type UserInfo = {
    id: number;
    first_name: string;
    last_name: string;
    is_superuser: boolean;
};

export type UserRole = {
    user: number;
    is_professor: boolean;
    is_tutor: boolean;
};

export function useInfo() {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const {
        isFetching: isPending,
        data: sites,
        error,
    } = useQuery<UserInfo[]>({
        queryKey: "getUserInfo",
        queryFn: async () => {
            const response = await fetchBackend({
                type: "GET",
                url: `/rolemanagement/rolemanagement/`,
            });

            if (response.error) {
                throw new Error(response.error);
            }

            return response.data.map((site: UserInfo) => ({
                id: site.id,
                first_name: site.first_name,
                last_name: site.last_name,
                is_superuser: site.is_superuser,
            }));
        },
    });

    return { isPending, sites: sites ?? [], error };
}

export function useUserRoles() {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const {
        isFetching: isPendings,
        data: roles,
        error: errors,
    } = useQuery<UserRole[]>({
        queryKey: "getUserRoles",
        queryFn: async () => {
            const response = await fetch(
                `${backend_url}/rolemanagement/editRole/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            return data.map((role: UserRole) => ({
                user: role.user,
                is_professor: role.is_professor,
                is_tutor: role.is_tutor,
            }));
        },
    });

    return { isPendings, roles: roles ?? [], errors };
}

export function useEditRole() {
    return useMutation({
        mutationFn: editRole,
    });
}

async function editRole(editRoleData) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(`${backend_url}/rolemanagement/editRole/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(editRoleData),
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}

export function useDeleteRole() {
    return useMutation({
        mutationFn: deleteRole,
    });
}

async function deleteRole(roleId) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(
        `${backend_url}/rolemanagement/editRole/${roleId}`,
        {
            method: "DELETE",
        },
    );

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}

export function usePatchRole() {
    return useMutation({
        mutationFn: patchRole,
    });
}

async function patchRole({ roleId, roleData }) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(
        `${backend_url}/rolemanagement/editRole/${roleId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(roleData),
        },
    );

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}

export function usePatchUser() {
    return useMutation({
        mutationFn: patchUser,
    });
}

async function patchUser({ userId, userData }) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(
        `${backend_url}/rolemanagement/rolemanagement/${userId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        },
    );

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}
