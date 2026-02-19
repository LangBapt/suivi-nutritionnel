import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMeals } from '../../../context/MealsContext';

export default function MealDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    meals,
    deleteMeal,
    getTotalCalories,
    getTotalProteins,
    getTotalCarbs,
    getTotalFats,
  } = useMeals();

  const meal = meals.find((m) => m.id === id);

  if (!meal) {
    return (
      <View style={styles.container}>
        <Text>Repas introuvable</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Supprimer le repas",
      "Es-tu sûr de vouloir supprimer ce repas ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteMeal(meal.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.mealTitle}>{meal.name}</Text>
      <Text style={styles.mealDate}>
        {new Date(meal.date).toLocaleDateString()}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total nutritionnel</Text>

        <View style={styles.nutritionGrid}>
          <NutritionBox color="#4CAF50" label="Calories" value={`${getTotalCalories(meal)} kcal`} />
          <NutritionBox color="#2196F3" label="Protéines" value={`${getTotalProteins(meal)} g`} />
          <NutritionBox color="#FFC107" label="Glucides" value={`${getTotalCarbs(meal)} g`} />
          <NutritionBox color="#F44336" label="Lipides" value={`${getTotalFats(meal)} g`} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Aliments ({meal.foods.length})
        </Text>

        {meal.foods.map((food) => (
          <View key={food.id} style={styles.foodCard}>
            <Image
              source={{ uri: food.image_url }}
              style={styles.foodImage}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{food.name}</Text>

              <View style={styles.foodNutritionRow}>
                <SmallBox color="#4CAF50" value={`${food.calories} kcal`} />
                <SmallBox color="#2196F3" value={`${food.proteins} g`} />
                <SmallBox color="#FFC107" value={`${food.carbs} g`} />
                <SmallBox color="#F44336" value={`${food.fats} g`} />
              </View>
            </View>
          </View>
        ))}
      </View>

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>
          Supprimer ce repas
        </Text>
      </Pressable>

    </ScrollView>
  );
}

type NutritionBoxProps = {
  color: string;
  label: string;
  value: string;
};

function NutritionBox({ color, label, value }: NutritionBoxProps) {
  return (
    <View style={[styles.nutritionBox, { backgroundColor: color }]}>
      <Text style={styles.nutritionValue}>{value}</Text>
      <Text style={styles.nutritionLabel}>{label}</Text>
    </View>
  );
}

type SmallBoxProps = {
  color: string;
  value: string;
};

function SmallBox({ color, value }: SmallBoxProps) {
  return (
    <View style={[styles.smallBox, { backgroundColor: color }]}>
      <Text style={styles.smallBoxText}>{value}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },

  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  mealDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  cardTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },

  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  nutritionBox: {
    width: '48%',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  nutritionValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  nutritionLabel: {
    color: '#fff',
    fontSize: 12,
  },

  foodCard: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },

  foodName: {
    fontWeight: '600',
    marginBottom: 6,
  },

  foodNutritionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  smallBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  smallBoxText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  deleteButton: {
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },

  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
