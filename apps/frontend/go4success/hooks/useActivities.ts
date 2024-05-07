import { Room } from "./useRooms";
import { Language } from "./useLanguages";
import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { useTranslation } from "react-i18next";
import { SelectItem } from "@/types/SelectItem";

export interface Activity {
    id: string;
    name: string;
    room: Room;
    language: Language;
    date_start: string;
    date_end: string;
    type: string;
    description: string;
}

export interface Attend {
    activity: Activity;
    student: string;
}

export function useActivities(
    endpoint: string,
    id: string,
    searchName: string,
    selectedRoom: string | undefined,
    selectedSite: string | undefined,
    selectedLanguage: string | undefined,
    startDateISO: string | null,
    endDateISO: string | null,
) {
    const { isPending, data, error } = useQuery<Activity[]>({
        queryKey: [
            "activities",
            endpoint,
            id,
            searchName,
            selectedRoom,
            selectedSite,
            selectedLanguage,
            startDateISO,
            endDateISO,
        ],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: `activities/${endpoint}/`,
                params: {
                    id: id,
                    name: searchName,
                    room: selectedRoom,
                    site: selectedSite,
                    language: selectedLanguage,
                    // eslint-disable-next-line camelcase
                    date_start: startDateISO,
                    // eslint-disable-next-line camelcase
                    date_end: endDateISO,
                },
            });

            return data;
        },
    });
    return { isPending, data: data ?? [], error };
}

export function useActivitiesSelect(
    endpoint: string,
    id: string,
    searchName: string,
    selectedRoom: string | undefined,
    selectedSite: string | undefined,
    selectedLanguage: string | undefined,
    startDateISO: string | null,
    endDateISO: string | null,
    allValues: boolean = false,
    otherkey?: string | null,
) {
    const { t } = useTranslation();

    const { isPending, data, error } = useQuery<SelectItem[]>({
        queryKey: [
            "activities",
            endpoint,
            id,
            searchName,
            selectedRoom,
            selectedSite,
            selectedLanguage,
            startDateISO,
            endDateISO,
            otherkey,
        ],
        queryFn: async () => {
            const { data, error } = await fetchBackend({
                type: "GET",
                url: `activities/${endpoint}/`,
                params: {
                    id: id,
                    name: searchName,
                    room: selectedRoom,
                    site: selectedSite,
                    language: selectedLanguage,
                    // eslint-disable-next-line camelcase
                    date_start: startDateISO,
                    // eslint-disable-next-line camelcase
                    date_end: endDateISO,
                },
            });
            if (typeof data === "object" && "error" in data) {
                throw new Error(data.error);
            }

            if (error) {
                throw new Error(error);
            }

            const activitesList = data.map(
                (activity: { id: string; name: string }) => ({
                    key: activity.id,
                    value: activity.name,
                }),
            );
            if (allValues) {
                return [
                    { key: "", value: t("translationHooks.AllValuesM") },
                    ...activitesList,
                ];
            } else {
                return activitesList;
            }
        },
    });
    return { isPending, data: data ?? [], error };
}
