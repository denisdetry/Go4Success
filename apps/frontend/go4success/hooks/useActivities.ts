import { Room } from "./useRooms";
import { Language } from "./useLanguages";
import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

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

export function useActivities(
    endpoint: string,
    searchName: string,
    selectedRoom: string | undefined,
    selectedSite: string | undefined,
    selectedLanguage: string | undefined,
    startDateISO: string | null,
    endDateISO: string | null,
) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    // console.log("Called useActivities");

    const { isPending, data, error } = useQuery<Activity[]>({
        queryKey: [
            "activities",
            endpoint,
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
            // console.log("resp:", data);
            return data;
        },
    });
    return { isPending, data: data ?? [], error };
}
