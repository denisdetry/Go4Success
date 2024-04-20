import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

export interface Feedback {
    id: string;
    student: {
        id: string;
        username: string;
        first_name: string;
        last_name: string;
        noma: string;
    };
    activity: {
        id: string;
        name: string;
        date_start: string;
        date_end: string;
        noma: string;
    };
    evaluation: number;
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
            return data;
        },
    });

    async function postFeedback(feedbackData: Feedback) {
        try {
            await fetchBackend({
                type: "POST",
                url: "feedback/newfeedback/",
                data: feedbackData,
            });
        } catch (error) {
            console.error(error);
        }
    }

    return { isPending, feedbacks: data ?? [], error };
}
