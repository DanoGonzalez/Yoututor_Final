import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminMessages = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MessagesDashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 20,
    color: '#0078FF',
  },
});

export default AdminMessages; 