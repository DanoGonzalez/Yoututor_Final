import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TutorStackParamList } from "../../types";

const ScheduleConsulting = () => {
  const navigation = useNavigation<StackNavigationProp<TutorStackParamList>>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  };

  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Materia</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Material</Text>
            <TouchableOpacity style={styles.select}>
              <Text style={styles.selectText}>Material</Text>
              <Ionicons name="chevron-down" size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plataforma</Text>
            <TouchableOpacity style={styles.select}>
              <Text style={styles.selectText}>Plataforma</Text>
              <Ionicons name="chevron-down" size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cantidad límite de Estudiantes</Text>
            <TouchableOpacity style={styles.select}>
              <Text style={styles.selectText}>12</Text>
              <Ionicons name="chevron-down" size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha</Text>
            <TouchableOpacity style={styles.select} onPress={handleDatePress}>
              <Text style={styles.selectText}>
                {selectedDate ? formatDate(selectedDate) : "Seleccionar fecha"}
              </Text>
              <Ionicons name="calendar-outline" size={24} color="gray" />
            </TouchableOpacity>

            {showDatePicker && (
              <Modal
                transparent={true}
                animationType="fade"
                visible={showDatePicker}
                onRequestClose={() => setShowDatePicker(false)}>
                <TouchableOpacity
                  style={styles.modalOverlay}
                  onPress={() => setShowDatePicker(false)}>
                  <View style={styles.datePickerContainer}>
                    <Text style={styles.datePickerHeader}>Selecciona el día</Text>
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display="calendar"
                      onChange={handleDateChange}
                      style={styles.datePicker}
                    />
                    <View style={styles.datePickerButtons}>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        style={styles.datePickerButton}>
                        <Text style={styles.datePickerButtonTextCancel}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        style={styles.datePickerButton}>
                        <Text style={styles.datePickerButtonTextOk}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>
            )}
          </View>

          <View style={styles.timeContainer}>
            <View style={styles.timeGroup}>
              <Text style={styles.label}>Hora de Inicio</Text>
              <TouchableOpacity style={styles.timeSelect}>
                <Text style={styles.selectText}>12:05</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeGroup}>
              <Text style={styles.label}>Hora de Finalización</Text>
              <TouchableOpacity style={styles.timeSelect}>
                <Text style={styles.selectText}>1:05</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>GUARDAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  formContainer: {
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#000000",
  },
  select: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    height: 48,
  },
  selectText: {
    color: "#757575",
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  timeGroup: {
    flex: 1,
    gap: 8,
  },
  timeSelect: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    height: 48,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#0078FF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  datePickerHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  datePicker: {
    width: "100%",
    height: 300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  datePickerButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  datePickerButtonTextCancel: {
    color: "#0078FF",
    fontSize: 16,
  },
  datePickerButtonTextOk: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default ScheduleConsulting;
