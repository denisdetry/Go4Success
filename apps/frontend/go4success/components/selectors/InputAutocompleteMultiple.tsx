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
import { SelectItem } from "@/types/SelectItem";
import styles from "@/styles/global";

export interface InputAutocompleteProps {
    readonly items: SelectItem[];
    readonly placeholder: string;
    readonly searchPlaceholder: string;
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

/**
 * !! Implementation needs to be updated !!
 * InputAutocompleteMultiple component to display an input field with autocomplete dropdown
 * User can select multiple items from the dropdown and type in the input field to filter the items
 * will return the selected items when an item is selected
 * @param items List of items to display in the autocomplete dropdown
 * @param placeholder Placeholder text for the input
 * @param searchPlaceholder Placeholder text for the search input
 * @param onChange Function to call when an item is selected
 * @param readOnly Boolean to make the input field read-only
 **/
const InputAutocompleteMultiple: React.FC<InputAutocompleteProps> = ({
    items,
    placeholder,
    searchPlaceholder,
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
                    placeholder={searchPlaceholder}
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
            <SafeAreaView>
                <Pressable
                    onPress={() => {
                        setFocus(!focus);
                        setFilteredData(items);
                    }}
                >
                    <SafeAreaView style={styles.inputField}>
                        {selectedData.length > 0 ? (
                            <Text style={styles.input}>
                                {selectedData
                                    .map((item) => item.value)
                                    .join(", ")}
                            </Text>
                        ) : (
                            <Text style={styles.placeholder}>
                                {placeholder}
                            </Text>
                        )}
                    </SafeAreaView>
                </Pressable>

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
        </ScrollView>
    );
};

export default InputAutocompleteMultiple;
