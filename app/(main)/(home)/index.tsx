import { useRouter } from 'expo-router';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useMeals } from '../../../context/MealsContext';

export default function MealsScreen() {
  const { meals, getTotalCalories } = useMeals();
  const router = useRouter();

  if (meals.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Aucun repas enregistré pour le moment.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const firstImage = item.foods[0]?.image_url;

          return (
            <Pressable
              style={styles.mealItem}
              onPress={() =>
                router.push({
                  pathname: '/[id]',
                  params: { id: item.id },
                })
              }
            >
              <View style={styles.mealInfo}>
                <Text style={styles.mealType}>
                  {item.name}
                </Text>

                <Text
                  style={styles.mealFoods}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.foods.map((f) => f.name).join(', ')}
                </Text>

                <Text style={styles.mealDate}>
                  {new Date(item.date).toLocaleDateString()} • {getTotalCalories(item)} kcal
                </Text>
              </View>

              {firstImage ? (
                <Image
                  source={{ uri: firstImage }}
                  style={styles.mealImage}
                />
              ) : (
                <View style={styles.mealImagePlaceholder} />
              )}
            </Pressable>
          );
        }}
      />
    </View>
  )
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },

  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  mealInfo: {
    flex: 1,
    marginRight: 12,
  },

  mealType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  mealFoods: {
    fontSize: 14,
    color: '#666',
  },

  mealDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },

  mealImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  mealImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
});
