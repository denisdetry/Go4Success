import { useQuery } from "@tanstack/react-query";
import { SelectItem } from "@/types/SelectItem";
import { fetchBackend } from "@/utils/fetchBackend";
import { useTranslation } from "react-i18next";

export type Language = {
    id: string;
    name: string;
    code: string;
};

export function useLanguages(languageId?: string, allValues: boolean = false) {
    const { t } = useTranslation();

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

            const languagesList = data.map((language: Language) => ({
                key: language.id,
                value: language.name,
            }));
            if (allValues) {
                return [
                    { key: "", value: t("translationHooks.AllValuesM") },
                    ...languagesList,
                ];
            } else {
                return languagesList;
            }
        },
    });

    return { isPending, languages: languages ?? [], error };
}
