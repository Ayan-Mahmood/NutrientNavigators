import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from 'axios';

const flask_api = "http://127.0.0.1:5000";

interface Macronutrients {
    carbs: number;
    proteins: number;
    fats: number;
}

interface FoodItem {
    food_name: string;
    calories: number;
    carbs: number;
    proteins: number;
    fats: number;
}

interface Goals {
    calories: number;
    carbs: number;
    proteins: number;
    fats: number;
}

interface DailySummary {
    date: string;
    summary: {
        totalCalories: number;
        macronutrients: Macronutrients;
        foodItems: FoodItem[];
    };
    goals: Goals;
}

const DailySummaryScreen = () => {
    const [summary, setSummary] = useState<DailySummary | null>(null);

    useEffect(() => {
        fetchDailySummary();
    }, []);

    const fetchDailySummary = async () => {
        try {
            const response = await axios.get<DailySummary>(`${flask_api}/api/daily-summary`);
            setSummary(response.data);
        } catch (error) {
            console.error("Error fetching daily summary:", error);
        }
    };

    if (!summary) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.date}>{summary.date}</Text>
            <Text style={styles.calories}>
                Total Calories: {summary.summary.totalCalories} / {summary.goals.calories}
            </Text>
            <MacroBreakdown 
                macronutrients={summary.summary.macronutrients} 
                goals={summary.goals} 
            />
            <FoodList foodItems={summary.summary.foodItems} />
        </View>
    );
};

interface MacroBreakdownProps {
    macronutrients: Macronutrients;
    goals: Goals;
}

const MacroBreakdown = ({ macronutrients, goals }: MacroBreakdownProps) => {
    return (
        <View style={styles.macros}>
            <Text>Carbs: {macronutrients.carbs}g / {goals.carbs}g</Text>
            <Text>Proteins: {macronutrients.proteins}g / {goals.proteins}g</Text>
            <Text>Fats: {macronutrients.fats}g / {goals.fats}g</Text>
        </View>
    );
};

interface FoodListProps {
    foodItems: FoodItem[];
}

const FoodList = ({ foodItems }: FoodListProps) => {
    return (
        <FlatList
            data={foodItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }: { item: FoodItem }) => (
                <View style={styles.foodItem}>
                    <Text>{item.food_name}</Text>
                    <Text>{item.calories} cal</Text>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    date: { fontSize: 18, fontWeight: 'bold' },
    calories: { fontSize: 16, marginVertical: 10 },
    macros: { marginVertical: 10 },
    foodItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }
});

export default DailySummaryScreen;
