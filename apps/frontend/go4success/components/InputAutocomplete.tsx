import React from "react";
import {
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styles from "@/styles/global";
import { SelectItem } from "@/components/select";

export interface InputAutocompleteProps {
    readonly items: SelectItem[];
    readonly placeholder: string;
    readonly onChange?: (value: SelectItem) => void;
    readonly readOnly?: boolean;
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
    readOnly = false,
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
                        setVisible(false);
                    }}
                />
            );
        }
        return null;
    };

    function textInput() {
        return (
            <View>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    onChangeText={(text) => {
                        setFilteredData(filterData(text));
                        setselectedData({ key: "none", value: text });
                        onChange({ key: text, value: text });
                    }}
                    value={selectedData.value ?? ""}
                    onFocus={() => setVisible(true)}
                    //onBlur={() => setTimeout(() => setVisible(false), 100)}
                    onPressIn={() => {
                        if (!readOnly) {
                            setVisible(true);
                        } else {
                            setVisible(!visible);
                        }
                    }}
                />
                {!readOnly && visible && (
                    <Pressable>
                        <Text>X</Text>
                    </Pressable>
                )}
            </View>
        );
    }

    return (
        <ScrollView horizontal={true} scrollEnabled={false}>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    onChangeText={(text) => {
                        setFilteredData(filterData(text));
                        setselectedData({ key: "none", value: text });
                        onChange({ key: text, value: text });
                    }}
                    value={selectedData.value ?? ""}
                    onFocus={() => setVisible(true)}
                    //onBlur={() => setTimeout(() => setVisible(false), 100)}
                    onPressIn={() => {
                        if (!readOnly) {
                            setVisible(true);
                        } else {
                            setVisible(!visible);
                        }
                    }}
                />
                {!readOnly && visible && (
                    <Pressable onPress={() => setVisible(false)}>
                        <Text>X</Text>
                    </Pressable>
                )}

                <FlatList
                    style={{ maxHeight: 200 }}
                    data={filteredData}
                    //ListHeaderComponent={textInput}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.value}
                />
            </View>
        </ScrollView>
    );
};

export default InputAutocomplete;
