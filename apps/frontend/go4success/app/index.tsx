import { ScrollView } from "react-native";
import styles from "../styles/global";

import FilterActivity from "../components/FilterActivity";

export default function Index() {
    return (
        <ScrollView contentContainerStyle={styles.containerCard}>
            <FilterActivity filterType={"activity"} />
        </ScrollView>
    );
}
