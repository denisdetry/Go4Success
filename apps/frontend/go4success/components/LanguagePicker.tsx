import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RNPickerSelect from "react-native-picker-select";
import Colors from "../constants/Colors";

const LanguagePicker = () => {
    const { i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(
        localStorage.getItem("language") ?? "fr",
    );

    const switchLanguage = (lng: string | undefined) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("language", lng ?? "fr");
        setSelectedLanguage(lng ?? "fr");
    };

    useEffect(() => {
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            switchLanguage(storedLanguage);
        }
    }, []);

    return (
        <RNPickerSelect
            onValueChange={(value) => switchLanguage(value)}
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
                    color: "black",
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
                    color: "black",
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
                    color: "black",
                    paddingRight: 10,
                },
            }}
            placeholder={{}}
            value={selectedLanguage}
            fixAndroidTouchableBug={true}
        />
    );
};

export default LanguagePicker;
