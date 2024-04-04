import React from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styles from "@/styles/global";

export interface InputAutocompleteProps {
    readonly items: ItemData[];
    readonly placeholder: string;
}

export type ItemData = {
    label: string;
    value: string;
};

type ItemProps = {
    readonly item: ItemData;
    readonly onPress: () => void;
};

const Item = ({ item, onPress }: ItemProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text>{item.label}</Text>
        </TouchableOpacity>
    );
};

export default function InputAutocomplete(props: InputAutocompleteProps) {
    const [visible, setVisible] = React.useState(false);
    const [filteredData, setFilteredData] = React.useState<ItemData[]>(props.items);

    const [selectedId, setSelectedId] = React.useState("");

    const filterData = (text: string) => {
        return props.items.filter((item) =>
            text
                .split("")
                .every((letter) =>
                    item.label.toLowerCase().includes(letter.toLowerCase()),
                ),
        );
    };

    const renderItem = ({ item }: { item: ItemData }) => {
        if (visible) {
            return (
                <Item
                    item={item}
                    onPress={() => {
                        setSelectedId(item.value);
                    }}
                />
            );
        }
        return null;
    };

    function textInput() {
        return (
            <TextInput
                style={styles.input}
                placeholder={props.placeholder}
                onFocus={() => {
                    setVisible(true);
                }}
                onChangeText={(text) => {
                    setFilteredData(filterData(text));
                    setSelectedId(text);
                }}
                onBlur={() =>
                    setTimeout(() => {
                        setVisible(false);
                    }, 100)
                }
                value={selectedId}
            />
        );
    }

    return (
        <SafeAreaView>
            <FlatList
                style={{
                    maxHeight: 200,
                }}
                data={filteredData}
                ListHeaderComponent={textInput()}
                renderItem={renderItem}
                keyExtractor={(item) => item.value}
            />
        </SafeAreaView>
    );
}
