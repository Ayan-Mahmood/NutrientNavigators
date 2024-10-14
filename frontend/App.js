import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import AppStyles from './src/styles/AppStyles';

const App = () => {
    return (
        <SafeAreaView style={AppStyles.container}>
          <Text style={AppStyles.text}>Hello World! Welcome to the Diet Analyzer App!</Text>
        </SafeAreaView>
    );
};

export default App;