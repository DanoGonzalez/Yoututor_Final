// components/LoadingScreen.tsx
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const LoadingScreen = () => {
  const animation = new Animated.Value(0);

  Animated.loop(
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 750,
        useNativeDriver: true,
      }),
    ])
  ).start();

  const animatedStyle = {
    opacity: animation,
  };

  return (
    <View style={styles.container}>
      <View style={styles.loader}>
        {[...Array(4)].map((_, index) => (
          <Animated.View key={index} style={[styles.loaderSquare, animatedStyle]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 80,
    height: 80,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loaderSquare: {
    width: 30,
    height: 30,
    backgroundColor: '#0078FF',
    margin: 5,
    borderRadius: 5,
  },
});

export default LoadingScreen;
