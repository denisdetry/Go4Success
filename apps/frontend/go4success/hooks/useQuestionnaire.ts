import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { useState } from "react";
export type Courses = {
    id: string;
    code: string;
    name: string;
};
export type Questionnaire = {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    course: string;
};

export function useCourses() {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const {
        isPending,
        data: sites,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["getSites"],
        queryFn: async () => {
            const { data, error } = await fetchBackend({
                type: "GET",
                url: "postquestionnaire/viewcourse",
            });

            if (typeof data === "object" && "error" in data) {
                throw new Error(data.error);
            }

            if (error) {
                throw new Error(error);
            }

            return data.map((site: { name: any; id: any }) => ({
                id: site.id,
                code: site.code,
                name: site.name,
            }));
        },
    });

    return { isPending, sites: sites ?? [], error };
}

export function usePostQuestionnaire() {
    const queryClient = useQueryClient();
    const [error, setError] = useState(null);

    const mutation = useMutation(
        async (questionnaire) => {
            try {
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_API_URL}/postquestionnaire/postquestionnaire`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(questionnaire),
                    },
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }

                return data;
            } catch (error) {
                setError(error.message);
                return null; // Return null in case of error
            }
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["getSites"]);
            },
        },
    );

    return { mutate: mutation.mutate, error };
}
