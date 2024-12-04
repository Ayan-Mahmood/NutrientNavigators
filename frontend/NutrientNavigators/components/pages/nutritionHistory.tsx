import React, { useState, useEffect } from "react";
import {
  Button,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import dayjs from "dayjs";
import { Svg, Rect } from "react-native-svg";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/index";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDay = (day: string) => dayjs.tz(day, "America/Los_Angeles");

type ViewNutritionHistoryProps = StackScreenProps<
  RootStackParamList,
  "ViewNutritionHistory"
>;

const ViewNutritionHistory: React.FC<ViewNutritionHistoryProps> = ({
  route,
  navigation,
}) => {
  const { AccountInfo } = route.params; // Extract AccountInfo
  const userId = AccountInfo.user_profile.id; // Get user_id
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [progress, setProgress] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [goals, setGoals] = useState({
    protein_goal: 0,
    carbs_goal: 0,
    fat_goal: 0,
  });
  const [monthlyProgress, setMonthlyProgress] = useState([]);

  // Fetch monthly progress when the month changes
  useEffect(() => {
    fetchMonthlyProgress();
  }, [currentDate]);

  const fetchMonthlyProgress = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/monthly_progress?user_id=${userId}`
      );
      const data = await response.json();

      if (data.error) {
        console.error(data.error);
      } else {
        setGoals(data.goals);
        setMonthlyProgress(data.progress || []);
        updateProgressForDay(selectedDay, data.progress || []);
      }
    } catch (error) {
      console.error("Error fetching monthly progress:", error);
    }
  };

  const updateProgressForDay = (day: dayjs.Dayjs, progressData: any[]) => {
    const progressForDay = progressData.find((entry: any) =>
      dayjs(entry.day).isSame(day, "day")
    );

    if (progressForDay) {
      setProgress({
        protein: progressForDay.protein_percent || 0,
        carbs: progressForDay.carbs_percent || 0,
        fats: progressForDay.fat_percent || 0,
      });
    } else {
      setProgress({ protein: 0, carbs: 0, fats: 0 });
    }
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentDate((prev) =>
      direction === "prev" ? prev.subtract(1, "month") : prev.add(1, "month")
    );
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
    setSelectedDay(dayjs());
    updateProgressForDay(dayjs(), monthlyProgress);
  };

  const selectDay = (day: dayjs.Dayjs) => {
    setSelectedDay(day);
    updateProgressForDay(day, monthlyProgress);
  };

  const renderProgressBar = (label: string, percentage: number, color: string) => (
    <View style={styles.progressBarContainer}>
      <Text style={styles.progressLabel}>{label}</Text>
      <Svg height="20" width="100%">
        <Rect x="0" y="0" width="100%" height="20" fill="#e0e0e0" rx="5" ry="5" />
        <Rect x="0" y="0" width={`${percentage}%`} height="20" fill={color} rx="5" ry="5" />
      </Svg>
      <Text style={styles.progressPercentage}>{percentage.toFixed(1)}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title="<" onPress={() => handleMonthChange("prev")} />
        <Text style={styles.headerText}>{currentDate.format("MMMM YYYY")}</Text>
        <Button title=">" onPress={() => handleMonthChange("next")} />
        <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={Array.from({ length: currentDate.daysInMonth() }, (_, i) =>
          dayjs(currentDate).date(i + 1)
        )}
        keyExtractor={(item) => item.toString()}
        numColumns={7}
        renderItem={({ item }) => {
          const isToday = item.isSame(dayjs(), "day");
          const isSelected = item.isSame(selectedDay, "day");
          return (
            <TouchableOpacity
              style={[
                styles.dayBox,
                isToday && styles.todayBox,
                isSelected && styles.selectedBox,
              ]}
              onPress={() => selectDay(item)}
            >
              <Text
                style={[
                  styles.dayText,
                  isToday && styles.todayText,
                  isSelected && styles.selectedText,
                ]}
              >
                {item.date()}
              </Text>
            </TouchableOpacity>
          );
        }}
        columnWrapperStyle={styles.row}
      />
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>
          Nutrition Progress for {selectedDay.format("MMMM D, YYYY")}
        </Text>
        {renderProgressBar("Protein", progress.protein, "#4CAF50")}
        {renderProgressBar("Carbs", progress.carbs, "#2196F3")}
        {renderProgressBar("Fats", progress.fats, "#FF9800")}
      </View>
    </SafeAreaView>
  );
};

export default ViewNutritionHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  todayButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  todayButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  row: {
    justifyContent: "center",
  },
  dayBox: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  todayBox: {
    backgroundColor: "#4CAF50",
  },
  selectedBox: {
    backgroundColor: "#FFC107",
  },
  dayText: {
    fontSize: 14,
    color: "#000",
  },
  todayText: {
    color: "#fff",
  },
  selectedText: {
    color: "#fff",
  },
  progressContainer: {
    padding: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressBarContainer: {
    marginVertical: 10,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  progressPercentage: {
    textAlign: "right",
    marginTop: -18,
    marginRight: 5,
    fontSize: 12,
  },
});




//   const { AccountInfo } = route.params; // Extract AccountInfo
//   const userId = AccountInfo.user_profile.id; // Get user_id
//   const [loading, setLoading] = useState(true);
//   const [monthlyProgress, setMonthlyProgress] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchNutritionHistory = async () => {
//       try {
//         const response = await fetch(
//           `http://127.0.0.1:5000/monthly_progress?user_id=${userId}`
//         );
//         const data = await response.json();

//         if (response.ok) {
//           setMonthlyProgress(data.progress);
//         } else {
//           console.error("Error fetching progress:", data.error);
//         }
//       } catch (error) {
//         console.error("Error fetching progress:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNutritionHistory();
//   }, [userId]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : (
//           <>
//             <Text style={styles.title}>Monthly Nutrition Progress</Text>
//             {monthlyProgress.length > 0 ? (
//               monthlyProgress.map((day, index) => (
//                 <View key={index} style={styles.dayContainer}>
//                   <Text style={styles.dateText}>{day.date}</Text>
//                   <View style={styles.progressBarContainer}>
//                     <Text style={styles.macroText}>Protein:</Text>
//                     <View style={styles.progressBar}>
//                       <View
//                         style={[
//                           styles.progress,
//                           { width: `${day.protein_percentage}%`, backgroundColor: "blue" },
//                         ]}
//                       />
//                     </View>
//                     <Text style={styles.macroText}>Carbs:</Text>
//                     <View style={styles.progressBar}>
//                       <View
//                         style={[
//                           styles.progress,
//                           { width: `${day.carbs_percentage}%`, backgroundColor: "green" },
//                         ]}
//                       />
//                     </View>
//                     <Text style={styles.macroText}>Fat:</Text>
//                     <View style={styles.progressBar}>
//                       <View
//                         style={[
//                           styles.progress,
//                           { width: `${day.fats_percentage}%`, backgroundColor: "red" },
//                         ]}
//                       />
//                     </View>
//                   </View>
//                 </View>
//               ))
//             ) : (
//               <Text>No progress data available.</Text>
//             )}
//           </>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default ViewNutritionHistory;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     alignItems: "center",
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   dayContainer: {
//     marginBottom: 20,
//     width: "100%",
//   },
//   dateText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   progressBarContainer: {
//     marginVertical: 5,
//   },
//   macroText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   progressBar: {
//     height: 20,
//     width: "100%",
//     backgroundColor: "#e0e0e0",
//     borderRadius: 10,
//     overflow: "hidden",
//     marginBottom: 10,
//   },
//   progress: {
//     height: "100%",
//   },
// });
