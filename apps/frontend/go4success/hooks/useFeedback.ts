import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

export interface Feedback {
    id: string;
    user: {
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
    positive_point: boolean;
    negative_point: boolean;
    suggestion: boolean;
    additional_comment: boolean;
    date_start: string;
    date_end: string;
}

export interface FeedbackStudent {
    id: string;
    student: {
        id: string;
        username: string;
        first_name: string;
        last_name: string;
        noma: string;
    };
    feedback: Feedback;
    evaluation: number;
    positive_point: string;
    negative_point: string;
    suggestion: string;
    additional_comment: string;
    date_submitted: string;
}

export interface FeedbackAdditionalQuestions {
    id: string;
    feedback: string;
    question: string;
}

export interface FeedbackStudentAdditionalQuestions {
    id: string;
    student: {
        id: string;
        username: string;
        first_name: string;
        last_name: string;
        noma: string;
    };
    feedback: string;
    question: FeedbackAdditionalQuestions;
    answer: string;
}

export function useFeedback(feedbackId: string, activityId: string) {
    const { isPending, data, error } = useQuery<Feedback[]>({
        queryKey: ["feedbacks", feedbackId, activityId],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: "feedback/feedbacks",
                params: {
                    id: feedbackId,
                    activity_id: activityId,
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
