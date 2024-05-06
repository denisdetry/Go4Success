import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
    return useMutation({
        mutationFn: postQuestionnaire,
    });
}

export function usePostQuestion() {
    return useMutation({
        mutationFn: postQuestion,
    });
}

export function useLastQuestionnaire() {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;
    const { data, error, isLoading } = useQuery({
        queryKey: "lastQuestionnaire",
        queryFn: async () => {
            const response = await fetchBackend({
                type: "GET",
                url: "postquestionnaire/postquestionnaire",
            });

            if (typeof response.data === "object" && "error" in response.data) {
                throw new Error(response.data.error);
            }

            if (response.error) {
                throw new Error(response.error);
            }

            // Supposons que les questionnaires sont renvoyés dans un tableau et que le dernier questionnaire est à la fin du tableau
            return response.data[response.data.length - 1];
        },
    });

    // Renvoyer les valeurs
    return { data, error, isLoading };
}
async function postQuestionnaire(questionnaireData) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(
        `${backend_url}/postquestionnaire/postquestionnaire/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(questionnaireData),
        },
    );

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}

async function postQuestion(questionData) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(`${backend_url}/postquestionnaire/postquestion/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}

async function usePostOpenQuestion(questionOpenData) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(`${backend_url}/postquestionnaire/openquestion/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(questionOpenData),
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}

async function usePostClosedQuestion(questionClosedData) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(`${backend_url}/postquestionnaire/closedquestion/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(questionClosedData),
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}

export function useGetQuestions() {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const { data, error, isLoading } = useQuery({
        queryKey: "getQuestions",
        queryFn: async () => {
            const response = await fetchBackend({
                type: "GET",
                url: "postquestionnaire/postquestion/",
            });

            if (typeof response.data === "object" && "error" in response.data) {
                throw new Error(response.data.error);
            }

            if (response.error) {
                throw new Error(response.error);
            }

            return response.data;
        },
    });

    return { data, error, isLoading };
}
