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
