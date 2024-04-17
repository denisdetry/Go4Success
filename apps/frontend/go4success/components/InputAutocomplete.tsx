import React from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styles from "@/styles/global";
import { SelectItem } from "@/components/select";

export interface InputAutocompleteProps {
    readonly items: SelectItem[];
    readonly placeholder: string;
    readonly onChange?: (value: SelectItem) => void;
    readonly search?: boolean;
}

type ItemProps = {
    readonly item: SelectItem;
    readonly onPress: () => void;
};

const Item = ({ item, onPress }: ItemProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text>{item.value}</Text>
        </TouchableOpacity>
    );
};
const InputAutocomplete: React.FC<InputAutocompleteProps> = ({
    items,
    placeholder,
    onChange = () => {},
    search = true,
}) => {
    const [visible, setVisible] = React.useState(false);
    const [filteredData, setFilteredData] = React.useState<SelectItem[]>(items);

    const [selectedData, setselectedData] = React.useState<any>([]);

    const filterData = (text: string) => {
        return items.filter((item) => {
            const itemValue = item.value.toLowerCase().replace(":", "");
            const searchText = text.toLowerCase();

            return itemValue.includes(searchText);
        });
    };

    const renderItem = ({ item }: { item: SelectItem }) => {
        if (visible) {
            return (
                <Item
                    item={item}
                    onPress={() => {
                        onChange(item);
                        setselectedData(item);
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
                placeholder={placeholder}
                editable={search}
                onFocus={() => {
                    setVisible(true);
                }}
                onChangeText={(text) => {
                    setFilteredData(filterData(text));
                    setselectedData({ key: "none", value: text });
                    onChange({ key: text, value: text });
                }}
                onBlur={() =>
                    setTimeout(() => {
                        setVisible(false);
                    }, 100)
                }
                value={selectedData.value ?? ""}
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
};

export default InputAutocomplete;
