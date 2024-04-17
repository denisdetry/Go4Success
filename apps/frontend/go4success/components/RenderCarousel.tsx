import React from "react";
import { FlatList, Platform, ScrollView } from "react-native";
import CarouselMobile from "react-native-reanimated-carousel";
import styles from "@/styles/global";
import { width } from "@/constants/screensWidth";

interface CarouselProps {
    readonly data: any;
    readonly renderItem: any;
}

const RenderCarousel: React.FC<CarouselProps> = ({ data, renderItem }) => {

    return Platform.OS === "web" ? (
        <ScrollView horizontal={true} style={styles.containerCard}>
            <FlatList
                contentContainerStyle={{ gap: 10 }}
                data={data}
                renderItem={renderItem}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any) => item.id}
            />
        </ScrollView>
    ) : (
        <CarouselMobile
            width={width * 0.9}
            height={width / 1.9}
            renderItem={renderItem}
            data={data}
            loop={false}
            autoPlay={true}
            autoPlayInterval={3000}
            panGestureHandlerProps={{
                activeOffsetX: [-10, 10],
            }}
        />
    );
};

export default RenderCarousel;

/*  */
