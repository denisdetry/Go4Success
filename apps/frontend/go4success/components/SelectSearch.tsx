import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import React, { Dispatch, SetStateAction } from "react";

export type SelectItem = {
    label: string;
    value: string;
}

export type SelectSearchProps = {
    readonly zIndex: number;
    readonly items: SelectItem[];
    readonly placeholder: string;
    readonly searchable: boolean;
    readonly onSelectItem: (item: ItemType<string>) => void ;
    readonly open: boolean;
    readonly setOpen: Dispatch<SetStateAction<boolean>>;
};

function SelectSearch (props: SelectSearchProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);

    DropDownPicker.setLanguage("FR")

    return (
        <DropDownPicker
            zIndex={props.zIndex}
            open={open}
            value={value}
            items={props.items}
            placeholder={props.placeholder}
            searchable={props.searchable}
            setOpen={setOpen}
            setValue={setValue}
            onSelectItem={props.onSelectItem}
        />
    );
}

export default SelectSearch;
