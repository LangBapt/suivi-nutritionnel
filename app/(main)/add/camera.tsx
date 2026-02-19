import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useMeals } from '../../../context/MealsContext';
import { searchProductByCode } from '../../../services/openFoodFacts';

export default function CameraScanPage() {
  const { addFoodToCurrentMeal } = useMeals();
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if(scanning) return

    setScanning(true)
    setLoading(true);
    try {
      const foods = await searchProductByCode(data);
      if (!foods || foods.length === 0) {
        Alert.alert('Produit non trouvé', 'Aucun produit correspondant au code-barres.');
      } else {
        addFoodToCurrentMeal(foods[0]);
        Alert.alert('Produit ajouté', `${foods[0].name} a été ajouté au repas.`);
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de récupérer le produit.');
    } finally {
      setLoading(false);
      setScanning(false)
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Pas de permission pour la caméra</Text>
        <Pressable
          style={styles.scanButton}
          onPress={requestPermission}
        >
          <Text style={styles.scanButtonText}>Autoriser la caméra</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing={"back"}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={styles.scanOverlay}>
            <Text style={styles.scanText}>Placez le code-barres dans le cadre</Text>
            {loading && <ActivityIndicator size="large" color="#fff" />}
          </View>
        </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  scanOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
    backgroundColor: 'transparent',
  },
  scanText: { color: '#fff', fontSize: 18, marginBottom: 20, fontWeight: '600' },
});
