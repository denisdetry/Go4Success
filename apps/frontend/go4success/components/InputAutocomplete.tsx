import { ListRenderItem, Pressable, TextInput, View } from "react-native";
import styles from "@/styles/global";
import { FlatList } from "react-native-gesture-handler";

export type InputAutocompleteProps = {
    readonly placeholder: string;
};

const Data = ["test"];

type Propy = { title: string };

export default function InputAutocomplete(
    props: InputAutocompleteProps,
    item: Propy,
    data: string[],
) {
    return (
        <View>
            <TextInput style={styles.input} placeholder={props.placeholder} />
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <Pressable onPress={() => console.log(item)} />
                )}
            />
        </View>
    );
}
