import React, { useEffect, useState } from "react";
import { useCourses } from "@/hooks/useQuestionnaire";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
