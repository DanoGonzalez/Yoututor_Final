import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ProfileScreenNavigationProp, ProfileScreenProps } from "../../types";
import { getUsuario } from "../../controllers/usuariosController"; // Asegúrate de importar correctamente

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [usuario, setUsuario] = useState<any>(null); // Cambiar `any` por tu tipo de usuario si tienes uno
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("usuario");
      const usuario = await AsyncStorage.getItem("usuario");
      console.log("Valor de usuario después de eliminar:", usuario);
      onLogout();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error al eliminar el usuario de AsyncStorage:", error);
    }
  };

  // Función para cargar los datos del usuario
  const loadUserData = async () => {
      console.log("Cargando datos del usuario...");
      try {
          console.log("Obteniendo datos del usuario...");
          const usuarioData = await AsyncStorage.getItem("usuario");
          console.log("Datos del usuario:", usuarioData); // Verifica que el usuario no sea null
          if (usuarioData) {
              const usuario = JSON.parse(usuarioData); // Parsea el JSON para obtener el objeto
              console.log("Usuario obtenido:", usuario);
              
              // Aquí puedes usar usuario.id
              const data = await getUsuario(usuario.id); // Llama a la función para obtener datos del usuario
              console.log("Datos del usuario:", data);
              setUsuario(data);
          } else {
              console.log("No se encontró el usuario en AsyncStorage.");
          }
      } catch (error) {
          console.error("Error al cargar los datos del usuario:", error);
      } finally {
          setLoading(false);
      }
  };


  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return <Text>Cargando...</Text>; // Muestra un indicador de carga si es necesario
  }

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={require("../../assets/icons/profile-picture.png")}
              style={styles.profilePicture}
            />
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nombre</Text>
            <TextInput
              style={styles.infoInput}
              defaultValue={usuario ? `${usuario.nombres} ${usuario.apellidos}` : ""}
              placeholderTextColor="#000000"
              editable={false} // Hacer el campo no editable
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Correo electrónico de contacto</Text>
            <TextInput
              style={styles.infoInput}
              defaultValue={usuario ? usuario.correo : ""}
              placeholderTextColor="#000000"
              keyboardType="email-address"
              editable={false} // Hacer el campo no editable
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Intereses</Text>
            <TextInput
              style={styles.infoInput}
              defaultValue={usuario ? usuario.tecnologias.join(", ") : ""}
              placeholderTextColor="#000000"
              editable={false} // Hacer el campo no editable
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Método de aprendizaje</Text>
            <TextInput
              style={styles.infoInput}
              defaultValue={usuario ? usuario.descripcion : ""}
              placeholderTextColor="#000000"
              editable={false} // Hacer el campo no editable
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Plataformas a preferir</Text>
            <TextInput
              style={styles.infoInput}
              defaultValue="" // Aquí puedes agregar lógica si tienes este dato
              placeholderTextColor="#000000"
              editable={false} // Hacer el campo no editable
            />
          </View>
          <TouchableOpacity style={styles.changeInfoButton}>
            <Text style={styles.changeInfoButtonText}>Cambiar información</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
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
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 60,
  },
  profilePictureContainer: {
    position: "absolute",
    bottom: -50,
    alignSelf: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    marginTop: 60,
  },
  infoItem: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 5,
  },
  infoInput: {
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    height: 40,
  },
  changeInfoButton: {
    backgroundColor: "#0078FF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  changeInfoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
