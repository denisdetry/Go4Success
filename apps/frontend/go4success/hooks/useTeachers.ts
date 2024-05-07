import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { UserEdit } from "@/hooks/useUsers";

export interface Teacher {
    user: UserEdit;
    isProfessor: boolean;
    isTutor: boolean;
}

type TeacherImport = {
    user: UserEdit;
    is_professor: boolean;
    is_tutor: boolean;
};

export function useTeachers() {
    const { isPending, data, error } = useQuery<Teacher[]>({
        queryKey: ["teachers"],
        queryFn: async () => {
            try {
                const { data } = await fetchBackend({
                    type: "GET",
                    url: "rolemanagement/teachers",
                });

                return data.map((teacher: TeacherImport) => ({
                    user: teacher.user,
                    isProfessor: teacher.is_professor,
                    isTutor: teacher.is_tutor,
                }));
            } catch (err) {
                return [];
            }
        },
    });
    return { isPending, teachers: data ?? [], error };
}
