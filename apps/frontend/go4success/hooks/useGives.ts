import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

import { Gives } from "@/types/Gives";

export function useGives(activityId: string, teacherId: string) {
    const { isPending, data, error } = useQuery<Gives[]>({
        queryKey: ["gives", activityId, teacherId],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: "activities/give",
                params: {
                    activity: activityId,
                    teacher: teacherId,
                },
            });
            return data;
        },
    });

    return { isPending, gives: data ?? [], error };
}
