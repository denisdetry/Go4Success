import ButtonComponent from "@/components/ButtonComponent";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import Toast from "react-native-toast-message";
import { queryClient } from "@/app/_layout";
import { useAuth } from "@/context/Auth";
import { useState } from "react";
import UserProfileModal from "@/components/modals/UserProfileModal";
import { useRouter } from "expo-router";


export const DeleteUserAccount = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { t } = useTranslation();
    const { user } = useAuth();

    const router = useRouter();

    const handleDeleteUser = useMutation({
        mutationFn: async () => {
            await fetchBackend({
                type: "DELETE", url: "auth/delete_user/" + user.id + "/",
            });
        },
        onSettled: () => {
            Toast.show({
                type: "success",
                text1: t("translateToast.SuccessText1"),
                text2: t("translationProfile.successUserDelete"),
            });
            void queryClient.invalidateQueries({ queryKey: ["current_user"] });
            router.push("/");
        },

    });

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleConfirm = () => {
        // alert("User deleted");
        handleDeleteUser.mutate();
        // router.replace("/login");
        setIsModalVisible(false);
    };


    return (
        <>
            <UserProfileModal
                isVisible={isModalVisible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                dataLabelName={"compte"}
                deleteAccount={true}
            />

            <ButtonComponent
                text={t("translationProfile.deleteUserButton")}
                onPress={() => {
                    setIsModalVisible(true);
                }}
                buttonType={"danger"}
            />
        </>
    );
};