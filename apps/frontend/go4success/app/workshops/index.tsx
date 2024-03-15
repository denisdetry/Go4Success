import axios from "axios";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import styles from "../../styles/global";
import Card from "../../components/Card";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

type Workshop = {
    id: string;
    type: string;
    name: string;
    description: string;
    date_start: string;
    date_end: string;
    room: string;
    course: Course;
};

type Course = {
    id: number;
    code: string;
    name: string;
};

function ListWorkshops() {
    const { isPending, error, data } = useQuery<Workshop[]>({
        queryKey: ["allWorkshops"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8000/workshops/");
            return response.data;
        },
    });

    if (isPending) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.containerCard}>
            {data?.map((workshop: Workshop) => (
                <Card
                    key={workshop.id}
                    id={workshop.id}
                    title={workshop.name}
                    location={workshop.room}
                    date={workshop.date_start}
                    type={workshop.type}
                    description={workshop.description}
                />
            ))}
        </ScrollView>
    );
}

export default function Workshops() {
    return (
        <QueryClientProvider client={queryClient}>
            <ListWorkshops />
        </QueryClientProvider>
    );
}
