import { useQuery } from "@tanstack/react-query";

import { fetchBackend } from "@/utils/fetchBackend";
import {
    Feedback,
    FeedbackStudent,
    FeedbackAdditionalQuestions,
    FeedbackStudentAdditionalQuestions,
} from "@/types/Feedback";

export function useFeedback(feedbackId: string, activityId: string, userId: string) {
    const { isPending, data, error } = useQuery<Feedback[]>({
        queryKey: ["feedbacks", feedbackId, activityId, userId],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: "feedback/feedbacks",
                params: {
                    id: feedbackId,
                    activity_id: activityId,
                    user_id: userId,
                },
            });
            return data;
        },
    });

    return { isPending, feedbacks: data ?? [], error };
}

export function useFeedbackStudent(feedbackId: string) {
    const { isPending, data, error } = useQuery<FeedbackStudent[]>({
        queryKey: ["feedbackStudent", feedbackId],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: "feedback/feedbackstudent",
                params: {
                    feedback: feedbackId,
                },
            });
            return data;
        },
    });

    return { isPending, feedbackStudent: data ?? [], error };
}

export function useFeedbackAdditionalQuestions(feedbackId: string) {
    const { isPending, data, error } = useQuery<FeedbackAdditionalQuestions[]>({
        queryKey: ["feedbackAdditionalQuestions", feedbackId],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: "feedback/feedbackadditionnalquestions",
                params: {
                    feedback: feedbackId,
                },
            });
            return data;
        },
    });

    return { isPending, feedbackAdditionalQuestions: data ?? [], error };
}

export function useFeedbackStudentAdditionalQuestions(
    studentId: string,
    feedbackId: string,
) {
    const { isPending, data, error } = useQuery<FeedbackStudentAdditionalQuestions[]>({
        queryKey: ["feedbackstudentadditionnalquestions", studentId, feedbackId],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: "feedback/feedbackstudentadditionnalquestions",
                params: {
                    student_id: studentId,
                    feedback: feedbackId,
                },
            });
            return data;
        },
    });

    return { isPending, feedbackstudentadditionnalquestions: data ?? [], error };
}
