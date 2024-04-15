import { SelectList } from "@/lib/react-native-dropdown-select-list";
import React from "react";

export type SelectItem = {
    key: string;
    value: string;
};

export type SelectSearchProps = {
    readonly placeholder: string;
    readonly items: SelectItem[];
    readonly toSave?: "key" | "value" | undefined;
    readonly search?: boolean;
    readonly setSelected: (item: any) => void;
};

function SelectSearch(props: SelectSearchProps) {
    return (
        <SelectList
            setSelected={props.setSelected}
            data={props.items}
            save={props.toSave}
            search={props.search}
            placeholder={props.placeholder}
        />
    );
}

export default SelectSearch;
