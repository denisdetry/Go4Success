import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import styles from "@/styles/global";
import React from "react";
import { useSites } from "@/hooks/useSites";
import { useRooms } from "@/hooks/useRooms";
import InputAutocomplete from "@/components/InputAutocomplete";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useLanguages } from "@/hooks/useLanguages";
import * as yup from "yup";
import { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchBackend } from "@/utils/fetchBackend";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

export default function Add() {
    const { t } = useTranslation();

    const schema = yup.object().shape({
        title: yup
            .string()
            .required(t("translationActivities.yupTitleRequired")),
        description: yup
            .string()
            .required(t("translationActivities.yupDescriptionRequired")),
        site: yup.object().shape({
            key: yup.string(),
            value: yup.string(),
        }),
        room: yup.object().shape({
            key: yup
                .string()
                .required(t("translationActivities.yupRoomRequired")),
            value: yup.string(),
        }),
        language: yup.object().shape({
            key: yup
                .string()
                .required(t("translationActivities.yupLanguageRequired")),
            value: yup.string(),
        }),
        activityDate: yup
            .array()
            .of(yup.string())
            .min(1, t("translationActivities.yupActivityDateRequired"))
            .required(),
        beginTime: yup
            .array()
            .of(yup.string())
            .min(1, t("translationActivities.yupBeginTimeRequired"))
            .required()
            .typeError(t("translationActivities.yupBeginTimeRequired")),
        endTime: yup
            .array()
            .of(yup.string())
            .min(1, t("translationActivities.yupEndTimeRequired"))
            .required()
            .typeError(t("translationActivities.yupEndTimeRequired")),
    });

    type AddActivity = InferType<typeof schema>;

    const generateHourQuarterList = () => {
        const list = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let quarter = 0; quarter < 4; quarter++) {
                const key = `${hour.toString().padStart(2, "0")}:${(quarter * 15).toString().padStart(2, "0")}`;
                list.push({ key, value: key });
            }
        }
        return list;
    };

    const hourQuarterList = generateHourQuarterList();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            site: undefined,
            room: undefined,
            language: undefined,
            activityDate: [],
            beginTime: [],
            endTime: [],
        },
    });

    const { sites, isPending: sitePending, error: siteError } = useSites();

    const watchSite = watch("site", undefined);

    const { rooms, error: roomError } = useRooms(watchSite?.key);

    const { languages } = useLanguages();

    if (siteError) {
        return <View> Error: {siteError.message} </View>;
    }

    if (roomError) {
        return <View> Error: {roomError.message} </View>;
    }

    if (sitePending) {
        return <ActivityIndicator />;
    }

    if (sites === undefined) {
        return <View> Issue loading Sites </View>;
    }

    if (rooms === undefined) {
        return <View> Issue loading Rooms </View>;
    }

    const createActivity: SubmitHandler<AddActivity> = async (data) => {
        const dates = data.activityDate.map((date) => {
            return [
                dayjs(date)
                    .set("hour", Number(data.beginTime[0]))
                    .set("minute", Number(data.beginTime[1]))
                    .toJSON(),
                dayjs(date)
                    .set("hour", Number(data.endTime[0]))
                    .set("minute", Number(data.endTime[1]))
                    .toJSON(),
            ];
        });
        const errors = [];
        for (const date of dates) {
            console.log(date[0], date[1]);
            const formattedData = {
                type: "workshop",
                title: data.title,
                description: data.description,
                site: data.site,
                room: data.room,
                language: data.language,
                dateStart: date[0],
                dateEnd: date[1],
            };
            try {
                await fetchBackend({
                    type: "POST",
                    url: "activities/create/",
                    data: formattedData,
                });
            } catch (error) {
                errors.push(error);
            }
        }
        if (errors.length > 0) {
            Toast.show({
                type: "error",
                text1: t("translationActivities.addError"),
            });
        } else {
            Toast.show({
                type: "success",
                text1: t("translationActivities.addSuccess"),
            });
        }
    };

    return (
        <ScrollView>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.mainContainer}
            >
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.inputField}
                            placeholder={t("translationActivities.title")}
                            placeholderTextColor={"grey"}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="title"
                />

                {errors.title && (
                    <Text style={styles.errorMsg}>{errors.title.message}</Text>
                )}

                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.inputField}
                            placeholder={t("translationActivities.description")}
                            placeholderTextColor={"grey"}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="description"
                />

                {errors.description && (
                    <Text style={styles.errorMsg}>
                        {errors.description.message}
                    </Text>
                )}

                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <InputAutocomplete
                            items={sites}
                            placeholder={t("translationActivities.site")}
                            readOnly={true}
                            onChange={onChange}
                        />
                    )}
                    name={"site"}
                />

                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <InputAutocomplete
                            items={rooms}
                            placeholder={t("translationActivities.room")}
                            onChange={(data) => {
                                onChange(data);
                            }}
                        />
                    )}
                    name={"room"}
                />

                {errors.room && (
                    <Text style={styles.errorMsg}>
                        {errors.room.key?.message}
                    </Text>
                )}

                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <InputAutocomplete
                            items={languages}
                            readOnly={true}
                            placeholder={t("translationActivities.language")}
                            onChange={onChange}
                        />
                    )}
                    name={"language"}
                />

                {errors.language && (
                    <Text style={styles.errorMsg}>
                        {errors.language.key?.message}
                    </Text>
                )}

                <Controller
                    control={control}
                    render={({ field: { value, onChange } }) => {
                        return (
                            <DateTimePicker
                                mode={"multiple"}
                                dates={value}
                                onChange={(params) => {
                                    onChange(params.dates);
                                }}
                            />
                        );
                    }}
                    name={"activityDate"}
                    defaultValue={[]}
                />
                {errors.activityDate && (
                    <Text style={styles.errorMsg}>
                        {errors.activityDate.message}
                    </Text>
                )}
                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <InputAutocomplete
                            items={hourQuarterList}
                            placeholder={t("translationActivities.beginTime")}
                            onChange={(value) => {
                                onChange(value.value.split(":"));
                            }}
                        />
                    )}
                    name={"beginTime"}
                />

                {errors.beginTime && (
                    <Text style={styles.errorMsg}>
                        {errors.beginTime.message}
                    </Text>
                )}

                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <InputAutocomplete
                            items={hourQuarterList}
                            placeholder={t("translationActivities.endTime")}
                            onChange={(value) => {
                                onChange(value.value.split(":"));
                            }}
                        />
                    )}
                    name={"endTime"}
                />

                {errors.endTime && (
                    <Text style={styles.errorMsg}>
                        {errors.endTime.message}
                    </Text>
                )}

                <Pressable
                    style={ownStyle.button}
                    onPress={handleSubmit(createActivity)}
                >
                    <Text style={ownStyle.text}>
                        {t("translationActivities.addButton")}
                    </Text>
                </Pressable>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const ownStyle = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: "black",
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "white",
    },
});
