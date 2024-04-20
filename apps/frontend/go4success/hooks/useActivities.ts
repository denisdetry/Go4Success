import { Room } from "./useRooms";
import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { SelectItem } from "@/components/SelectSearch";

export interface Activity {
    id: string;
    name: string;
    room: Room;
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
    searchName: string,
    selectedRoom: string | undefined,
    selectedSite: string | undefined,
    startDateISO: string | null,
    endDateISO: string | null,
) {
    const { isPending, data, error } = useQuery<Activity[]>({
        queryKey: [
            "activities",
            endpoint,
            searchName,
            selectedRoom,
            selectedSite,
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
                    // eslint-disable-next-line camelcase
                    start_date: startDateISO,
                    // eslint-disable-next-line camelcase
                    end_date: endDateISO,
                },
            });
            return data;
        },
    });
    return { isPending, data: data ?? [], error };
}

export function useActivitiesSelectItem(endpoint: string) {
    const {
        isLoading,
        data: activitiesData,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["getActivitySelectItem", endpoint],
        queryFn: async () => {
            const { data, error } = await fetchBackend({
                type: "GET",
                url: `activities/${endpoint}/`,
            });

            if (typeof data === "object" && "error" in data) {
                throw new Error(data.error);
            }

            if (error) {
                throw new Error(error);
            }

            return data.map((item: any) => {
                if (item.activity) {
                    // item is an attend object
                    return {
                        label: item.activity.name,
                        value: item.activity.id,
                    };
                } else {
                    // item is an activity object
                    return {
                        label: item.name,
                        value: item.id,
                    };
                }
            });
        },
    });

    return { isLoading, activitiesData: activitiesData ?? [], error };
}
