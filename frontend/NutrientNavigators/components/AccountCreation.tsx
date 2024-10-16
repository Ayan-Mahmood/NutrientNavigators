import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const flask_api = null;

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${flask_api}/api/register`, {
                email,
                password,
            });
            
            if (response.data.success) {
                console.log('Registration is successful!');
            }
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    };

    return ( 
        <View style={StyleSheet.container}>
            <TextInput
            styles={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            />
            <TextInput
            styles={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
            <Button title="Register" onPress={handleRegister} />
            {error ? <Text style={styles.error}>{error></Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
    },
});

export default RegisterScreen;

