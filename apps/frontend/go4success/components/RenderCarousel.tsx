import React from "react";
import { Dimensions, Platform, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import styles from "@/styles/global";

const { width } = Dimensions.get("screen");

interface CarouselProps {
    readonly data: any;
    readonly renderItem: any;
}

const RenderCarousel: React.FC<CarouselProps> = ({ data, renderItem }) => {
    return Platform.OS === "web" ? (
        <View style={styles.containerCard}>
            <FlatList
                contentContainerStyle={{ gap: 10 }}
                data={data}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            />
        </View>
    ) : (
        <Carousel
            width={width * 0.9}
            height={width / 1.9}
            renderItem={renderItem}
            data={data}
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
