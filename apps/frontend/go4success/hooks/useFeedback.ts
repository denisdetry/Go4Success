import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

export interface Feedback {
    id: string;
    student: {
        username: string;
        first_name: string;
        last_name: string;
        noma: string;
    };
    activity: {
        name: string;
    };
    evaluation: string;
    positive_point: string;
    negative_point: string;
    suggestion: string;
    additional_comment: string;
    date_submitted: string;
}

export function useFeedback() {
    const { isPending, data, error } = useQuery<Feedback[]>({
        queryKey: ["feedbacks"],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: `feedback/feedbacks`,
            });
            console.log("resp:", data);
            return data;
        },
    });
    return { isPending, feedbacks: data ?? [], error };
}
