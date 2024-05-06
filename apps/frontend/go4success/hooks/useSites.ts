import { useQuery } from "@tanstack/react-query";
import { SelectItem } from "@/types/SelectItem";
import { fetchBackend } from "@/utils/fetchBackend";
import { useTranslation } from "react-i18next";

export type Site = {
    id: string;
    name: string;
};

/**
 * Fetch sites from the backend and return the response
 * @param siteId Site ID to fetch sites from if not provided fetch all sites
 * @param allValues Boolean to include a value for "all" sites in the response (no key, and value is "All")
 */
export function useSites(siteId?: string, allValues: boolean = false) {
    const { t } = useTranslation();

    const {
        isPending,
        data: sites,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["getSites", siteId ?? ""],
        queryFn: async () => {
            const { data, error } = await fetchBackend({
                type: "GET",
                url: "activities/sites/" + (siteId ? `site/${siteId}/` : ""),
            });

            if (typeof data === "object" && "error" in data) {
                throw new Error(data.error);
            }

            if (error) {
                throw new Error(error);
            }

            const sitesList = data.map(
                (site: { id: string; name: string }) => ({
                    key: site.id,
                    value: site.name,
                }),
            );
            if (allValues) {
                return [
                    { key: "", value: t("translationHooks.AllValuesM") },
                    ...sitesList,
                ];
            } else {
                return sitesList;
            }
        },
    });

    return { isPending, sites: sites ?? [], error };
}
