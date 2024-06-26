import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import React from "react";
import { useSites } from "@/hooks/useSites";
import { useRooms } from "@/hooks/useRooms";
import dayjs from "dayjs";
import { useLanguages } from "@/hooks/useLanguages";
import { useAuth } from "@/context/Auth";
import * as yup from "yup";
import { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchBackend } from "@/utils/fetchBackend";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/app/_layout";
import { generateHourQuarterList } from "@/utils/generateHourQuarterList";
import styles from "@/styles/global";
import InputAutocomplete from "@/components/selectors/InputAutocomplete";
import DateTimePicker from "react-native-ui-datepicker";
import { sendNotificationsToAllUsers } from "@/utils/sendNotification";
import useAllExpoTokens from "@/hooks/useAllExpoTokens";

// List of hours and quarters for the begin and end time (proposed values)
const hourQuarterList = generateHourQuarterList();

/**
 * Function to add an activity with a form to fill in:
 * the title, description, site, room, language,
 * activity date, begin time and end time
 * @returns {JSX.Element} - Add activity form
 */
export default function Add() {
    const timezoneOffset = dayjs().utcOffset() / 60;
    const { t } = useTranslation();
    const { allExpoTokens } = useAllExpoTokens();
    const { user } = useAuth();

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
        beginTime: yup.object().shape({
            key: yup.string(),

            value: yup
                .string()
                // Matches regex for hour:minutes format or empty string
                .matches(
                    /^(?:[01]\d|2[0-3]):[0-5]\d$|^$/,
                    t("translationActivities.yupValidTimeFormat"),
                )
                .required(t("translationActivities.yupBeginTimeRequired")),
        }),

        endTime: yup
            .object()
            .shape({
                key: yup.string(),
                value: yup
                    .string()
                    .matches(
                        /^(?:[01]\d|2[0-3]):[0-5]\d$|^$/,
                        t("translationActivities.yupValidTimeFormat"),
                    )
                    .required(t("translationActivities.yupEndTimeRequired")),
            })
            // Check if the key as a number of endTime is greater than the key of beginTime (hour is greater)
            .test(
                "is-greater",
                t("translationActivities.yupEndTimeGreater"),
                function () {
                    const beginTime = this.parent.beginTime;
                    const endTime = this.parent.endTime;
                    if (beginTime.key === "" || endTime.key === "") {
                        return true;
                    }
                    return Number(endTime.key) > Number(beginTime.key);
                },
            ),
    });
    type AddActivity = InferType<typeof schema>;

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
            site: { key: "", value: "" },
            room: { key: "", value: "" },
            language: { key: "", value: "" },
            activityDate: [],
            beginTime: { key: "", value: "" },
            endTime: { key: "", value: "" },
        },
    });

    const { sites, isPending: sitePending, error: siteError } = useSites();

    const watchSite = watch("site", undefined);

    const { rooms, error: roomError } = useRooms(watchSite?.key);

    const { languages } = useLanguages();

    if (siteError) {
        return (
            <View>
                <Text> Error: {siteError.message} </Text>
            </View>
        );
    }

    if (roomError) {
        return (
            <View>
                <Text> Error: {roomError.message} </Text>
            </View>
        );
    }

    if (sitePending) {
        return <ActivityIndicator />;
    }

    if (sites === undefined) {
        return (
            <View>
                <Text>Issue loading Sites </Text>
            </View>
        );
    }

    if (rooms === undefined) {
        return (
            <View>
                <Text> Issue loading Rooms</Text>{" "}
            </View>
        );
    }

    const createActivity: SubmitHandler<AddActivity> = async (data) => {
        const dates = data.activityDate.map((date) => {
            const beginHour = dayjs(date)
                .set(
                    "hour",
                    Number(data.beginTime.value.split(":")[0]) +
                        Number(timezoneOffset),
                )
                .set("minute", Number(data.beginTime.value.split(":")[1]))
                .toJSON();
            const endHour = dayjs(date)
                .set(
                    "hour",
                    Number(data.endTime.value.split(":")[0]) +
                        Number(timezoneOffset),
                )
                .set("minute", Number(data.endTime.value.split(":")[1]))
                .toJSON();
            return [beginHour, endHour];
        });
        const errors = [];
        for (const date of dates) {
            const formattedData = {
                type: "workshop",
                title: data.title,
                description: data.description,
                site: data.site,
                room: data.room,
                language: data.language,
                dateStart: date[0],
                dateEnd: date[1],
                user: user.id,
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
            if (dates.length === 1) {
                Toast.show({
                    type: "error",
                    text1: t("translationActivities.addError"),
                });
            } else {
                Toast.show({
                    type: "error",
                    text1: t("translationActivities.addErrorMultiple"),
                });
            }
        } else {
            await queryClient.invalidateQueries({
                queryKey: ["activities"],
            });
            if (dates.length === 1) {
                Toast.show({
                    type: "success",
                    text1: t("translateToast.SuccessText1"),
                    text2: t("translationActivities.addSuccess"),
                });
            } else {
                Toast.show({
                    type: "success",
                    text1: t("translateToast.SuccessText1"),
                    text2: t("translationActivities.addSuccessMultiple"),
                });
            }
            sendNotificationsToAllUsers(
                allExpoTokens,
                "Viens voir!",
                "Une nouvelle activité a été ajoutée! 📬",
                {},
            );
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <View style={[styles.container, { alignItems: undefined }]}>
                {/* Add activity page title */}
                <Text style={styles.title}>
                    {t("translationActivities.addActivity")}
                </Text>

                {/* Activity title input */}
                <View style={{ gap: 10 }}>
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

                    {/* Error message for title */}
                    {errors.title && (
                        <Text style={styles.errorMsg}>
                            {errors.title.message}
                        </Text>
                    )}

                    {/* Activity description input */}
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputField}
                                placeholder={t(
                                    "translationActivities.description",
                                )}
                                placeholderTextColor={"grey"}
                                onChangeText={onChange}
                                value={value}
                                multiline={true}
                            />
                        )}
                        name="description"
                    />

                    {/* Error message for description */}
                    {errors.description && (
                        <Text style={styles.errorMsg}>
                            {errors.description.message}
                        </Text>
                    )}

                    {/* Site input */}
                    <Controller
                        control={control}
                        render={({ field: { onChange } }) => (
                            <InputAutocomplete
                                items={sites}
                                placeholder={t("translationActivities.site")}
                                readOnly={true}
                                onChange={onChange}
                                icon={"location"}
                            />
                        )}
                        name={"site"}
                    />

                    {/* Room input */}
                    <Controller
                        control={control}
                        render={({ field: { onChange } }) => (
                            <InputAutocomplete
                                items={rooms}
                                placeholder={t("translationActivities.room")}
                                onChange={onChange}
                                icon={"location"}
                            />
                        )}
                        name={"room"}
                    />

                    {/* Error message for room */}
                    {errors.room && (
                        <Text style={styles.errorMsg}>
                            {errors.room.key?.message}
                        </Text>
                    )}

                    {/* Language input */}
                    <Controller
                        control={control}
                        render={({ field: { onChange } }) => (
                            <InputAutocomplete
                                items={languages}
                                readOnly={true}
                                placeholder={t(
                                    "translationActivities.language",
                                )}
                                onChange={onChange}
                                icon={"language"}
                            />
                        )}
                        name={"language"}
                    />

                    {/* Error message for language */}
                    {errors.language && (
                        <Text style={styles.errorMsg}>
                            {errors.language.key?.message}
                        </Text>
                    )}

                    {/* Activity date input */}
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

                    {/* Error message for activity date */}
                    {errors.activityDate && (
                        <Text style={styles.errorMsg}>
                            {errors.activityDate.message}
                        </Text>
                    )}

                    {/* Begin time input */}
                    <Controller
                        control={control}
                        render={({ field: { onChange } }) => (
                            <InputAutocomplete
                                items={hourQuarterList}
                                placeholder={t(
                                    "translationActivities.beginTime",
                                )}
                                onChange={onChange}
                                icon={"time-outline"}
                            />
                        )}
                        name={"beginTime"}
                    />

                    {/* Error message for begin time */}
                    {errors.beginTime && (
                        <Text style={styles.errorMsg}>
                            {errors.beginTime.value?.message}
                        </Text>
                    )}

                    {/* End time input */}
                    <Controller
                        control={control}
                        render={({ field: { onChange } }) => (
                            <InputAutocomplete
                                items={hourQuarterList}
                                placeholder={t("translationActivities.endTime")}
                                onChange={onChange}
                                icon={"time-outline"}
                            />
                        )}
                        name={"endTime"}
                    />

                    {/* Error message for end time */}
                    {errors.endTime && errors.endTime.value ? (
                        <Text style={styles.errorMsg}>
                            {errors.endTime.value.message}
                        </Text>
                    ) : (
                        errors.endTime && (
                            <Text style={styles.errorMsg}>
                                {errors.endTime.message}
                            </Text>
                        )
                    )}

                    {/* Add activity button */}
                    <Pressable
                        style={ownStyle.button}
                        onPress={handleSubmit(createActivity)}
                    >
                        <Text style={ownStyle.text}>
                            {t("translationActivities.addButton")}
                        </Text>
                    </Pressable>
                </View>
            </View>
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
