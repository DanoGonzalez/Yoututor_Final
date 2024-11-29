import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

interface ErrorModalProps {
  visible: boolean;
  onClose: () => void;
}

const ModalTutoriaDetails = ({ visible, onClose }: ErrorModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Image
            source={require("../../assets/ModalImages/CancelGeneral.png")}
            style={styles.icon}
          />
          <Text style={styles.title}>
            No hay un enlace disponible para esta tutoría. Espere a que el profesor
            comparta el enlace.
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
    paddingVertical: 30,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  closeButton: {
    backgroundColor: "#0078FF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ModalTutoriaDetails;