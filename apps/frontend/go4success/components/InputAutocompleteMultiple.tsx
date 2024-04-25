import React, { useEffect } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SelectItem } from "@/components/select";
import styles from "@/styles/global";

export interface InputAutocompleteProps {
    readonly items: SelectItem[];
    readonly placeholder: string;
    readonly onChange?: (value: SelectItem[]) => void;
    readonly readOnly?: boolean;
}

type ItemProps = {
    readonly item: SelectItem;
    readonly onPress: () => void;
};

const Item = ({ item, onPress }: ItemProps) => {
    return (
        <Pressable onPress={onPress} onFocus={() => console.log("Focus")}>
            <Text style={styles.text}>{item.value}</Text>
        </Pressable>
    );
};
const InputAutocomplete: React.FC<InputAutocompleteProps> = ({
    items,
    placeholder,
    onChange = () => {},
    readOnly = false,
}) => {
    const [focus, setFocus] = React.useState(false);

    const [filteredData, setFilteredData] = React.useState<SelectItem[]>(items);
    const [selectedData, setSelectedData] = React.useState<SelectItem[]>([]);

    useEffect(() => {
        setFilteredData(items);
        setSelectedData([]);
    }, [items]);

    const filterData = (text: string) => {
        return items.filter((item) =>
            text
                .split("")
                .every((letter) =>
                    item.value.toLowerCase().includes(letter.toLowerCase()),
                ),
        );
    };

    function textInput() {
        if (focus) {
            return (
                <TextInput
                    style={styles.inputField}
                    placeholder={"Search a room"}
                    readOnly={readOnly}
                    autoFocus={true}
                    onChangeText={(text) => {
                        setFilteredData(filterData(text));
                        //onChange({ key: text, value: text });
                    }}
                />
            );
        }
    }

    const renderItem = ({ item }: { item: SelectItem }) => {
        return (
            <Item
                item={item}
                onPress={() => {
                    const updatedData = selectedData.includes(item)
                        ? selectedData.filter((i) => i !== item)
                        : [...selectedData, item];

                    setSelectedData(updatedData);
                    onChange(updatedData);
                }}
            />
        );
    };

    return (
        <ScrollView horizontal={true} scrollEnabled={false}>
            <Pressable
                onPress={() => {
                    setFocus(!focus);
                    setFilteredData(items);
                }}
            >
                <SafeAreaView>
                    <Text style={styles.inputField}>
                        {selectedData.length > 0
                            ? selectedData.map((item) => item.value).join(", ")
                            : placeholder}
                    </Text>

                    {focus && (
                        <View>
                            <FlatList
                                style={{ maxHeight: 200 }}
                                data={filteredData}
                                ListHeaderComponent={textInput()}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.value}
                            />
                        </View>
                    )}
                </SafeAreaView>
            </Pressable>
        </ScrollView>
    );
};

export default InputAutocomplete;