import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

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

export function post_questionnaire() {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;
    let questionnaire: Questionnaire;
    const {
        isPending,
        data: sites,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["getSites"],
        queryFn: async () => {
            const { data, error } = await fetchBackend({
                type: "POST",
                url: "postquestionnaire/postquestionnaire",
                data: {
                    title: questionnaire.title,
                    description: questionnaire.description,
                    start_date: questionnaire.start_date,
                    end_date: questionnaire.end_date,
                    course: questionnaire.course,
                },
            });

            if (typeof data === "object" && "error" in data) {
                throw new Error(data.error);
            }

            if (error) {
                throw new Error(error);
            }
        },
    });

    return { isPending, sites: sites ?? [], error };
}
