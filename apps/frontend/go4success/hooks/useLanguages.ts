import { useQuery } from "@tanstack/react-query";
import { SelectItem } from "@/components/SelectSearch";
import { fetchBackend } from "@/utils/fetchBackend";

export type Language = {
    id: string;
    name: string;
    code: string;
};

export function useLanguages(languageId?: string) {
    const {
        isPending,
        data: languages,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["getLanguages", languageId ?? ""],
        queryFn: async () => {
            const { data, error } = await fetchBackend({
                type: "GET",
                url:
                    "activities/languages/" +
                    (languageId ? `languages/${languageId}/` : ""),
            });

            if (typeof data === "object" && "error" in data) {
                throw new Error(data.error);
            }

            if (error) {
                throw new Error(error);
            }

            return data.map((language: Language) => ({
                key: language.id,
                value: language.name,
            }));
        },
    });

    return { isPending, languages: languages ?? [], error };
}
