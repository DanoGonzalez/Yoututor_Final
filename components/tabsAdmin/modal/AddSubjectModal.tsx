import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";

interface AddSubjectModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (subjectName: string) => void;
}

const AddSubjectModal = ({ visible, onClose, onAdd }: AddSubjectModalProps) => {
  const [subjectName, setSubjectName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAdd = async () => {
    if (subjectName.trim()) {
      setIsLoading(true);
      try {
        await onAdd(subjectName);
        setSubjectName("");
        onClose();
      } catch (error) {
        console.error('Error adding subject:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Agregar Materia</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingles"
                value={subjectName}
                onChangeText={setSubjectName}
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                style={[styles.addButton, isLoading && styles.disabledButton]} 
                onPress={handleAdd}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Agregando...' : 'Agregar'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
  addButton: {
    backgroundColor: "#0078FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default AddSubjectModal;
