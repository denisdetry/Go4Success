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
