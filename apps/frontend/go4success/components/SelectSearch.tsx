import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import React, { Dispatch, SetStateAction } from "react";

export type SelectItem = {
    label: string;
    value: string;
};

export type SelectSearchProps = {
    readonly zIndex: number;
    readonly items: SelectItem[];
    readonly placeholder: string;
    readonly searchable: boolean;
    readonly onSelectItem: (item: ItemType<string>) => void;
    readonly open: boolean;
    readonly setOpen: Dispatch<SetStateAction<boolean>>;
    readonly value: string | null;
};

function SelectSearch(props: SelectSearchProps) {
    const [value, setValue] = React.useState(props.value);

    React.useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    DropDownPicker.setLanguage("FR");

    return (
        <DropDownPicker
            zIndex={props.zIndex}
            open={props.open}
            value={value}
            items={props.items}
            placeholder={props.placeholder}
            searchable={props.searchable}
            setOpen={props.setOpen}
            setValue={setValue}
            onSelectItem={props.onSelectItem}
        />
    );
}

export default SelectSearch;
