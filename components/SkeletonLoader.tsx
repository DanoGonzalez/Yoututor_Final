import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

const SkeletonLoader = () => {
  const animationValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E0E0E0", "#F5F5F5"], // Cambia entre colores
  });

  return (
    <View style={styles.skeletonContainer}>
      {/* Foto de perfil */}
      <Animated.View style={[styles.profileImage, { backgroundColor }]} />

      {/* Texto del título */}
      <Animated.View style={[styles.title, { backgroundColor }]} />

      {/* Sección de asesorías */}
      <View style={styles.section}>
        <Animated.View style={[styles.textLine, { backgroundColor }]} />
        <Animated.View style={[styles.button, { backgroundColor }]} />
        <Animated.View style={[styles.buttonOutline, { backgroundColor }]} />
      </View>

      {/* Título de estudiantes */}
      <Animated.View style={[styles.sectionTitle, { backgroundColor }]} />

      {/* Lista de estudiantes */}
      <Animated.View style={[styles.studentCard, { backgroundColor }]} />
      <Animated.View style={[styles.studentCard, { backgroundColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  title: {
    height: 20,
    width: "50%",
    borderRadius: 10,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  textLine: {
    height: 20,
    width: "40%",
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    height: 40,
    width: "60%",
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonOutline: {
    height: 40,
    width: "60%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sectionTitle: {
    height: 20,
    width: "70%",
    borderRadius: 10,
    marginBottom: 20,
  },
  studentCard: {
    height: 60,
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default SkeletonLoader;
