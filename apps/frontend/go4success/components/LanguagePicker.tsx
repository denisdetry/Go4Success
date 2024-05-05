import React from "react";
import { useTranslation } from "react-i18next";
import RNPickerSelect from "react-native-picker-select";
import Colors from "../constants/Colors";

export default function LanguagePicker() {
    const { i18n } = useTranslation();

    return (
        <RNPickerSelect
            onValueChange={(value) => i18n.changeLanguage(value)}
            items={[
                { label: "EN", value: "en" },
                { label: "FR", value: "fr" },
            ]}
            style={{
                inputIOS: {
                    fontSize: 14,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    margin: 10,
                    marginRight: 230,
                    borderWidth: 1,
                    borderColor: Colors.primaryColor,
                    borderRadius: 4,
                    color: Colors.primaryColor,
                    paddingRight: 10,
                },
                inputAndroid: {
                    fontSize: 14,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    margin: 10,
                    marginRight: 230,
                    borderWidth: 1,
                    borderColor: Colors.primaryColor,
                    borderRadius: 4,
                    color: Colors.primaryColor,
                    paddingRight: 10,
                },
                inputWeb: {
                    fontSize: 14,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    margin: 10,
                    marginRight: 230,
                    borderWidth: 1,
                    borderColor: Colors.primaryColor,
                    borderRadius: 4,
                    color: Colors.primaryColor,
                    paddingRight: 4,
                },
            }}
            placeholder={{}}
            value={i18n.language}
            fixAndroidTouchableBug={true}
        />
    );
}
