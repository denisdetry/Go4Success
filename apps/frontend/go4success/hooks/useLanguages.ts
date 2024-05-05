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

            return data.map((language: { name: any; id: any }) => ({
                label: language.name,
                value: language.id,
            }));
        },
    });

    return { isPending, languages: languages ?? [], error };
}
