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
    );
  }

  const groupedMeals = meals.reduce((acc: any, meal) => {
    const dateKey = new Date(meal.date).toLocaleDateString();

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(meal);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedMeals).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedDates}
        keyExtractor={(item) => item}
        renderItem={({ item: date }) => {
          const mealsOfDay = groupedMeals[date];

          const total = mealsOfDay.reduce(
            (acc: any, meal: any) => {
              meal.foods.forEach((food: any) => {
                acc.calories += food.calories || 0;
                acc.protein += food.protein || 0;
                acc.carbs += food.carbs || 0;
                acc.fat += food.fat || 0;
              });
              return acc;
            },
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
          );

          return (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.dateHeader}>{date}</Text>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>
                  🔥 {Math.round(total.calories)} kcal
                </Text>
                <Text style={styles.summaryText}>
                  💪 {Math.round(total.protein)}g Prot
                </Text>
                <Text style={styles.summaryText}>
                  🍞 {Math.round(total.carbs)}g Gluc
                </Text>
                <Text style={styles.summaryText}>
                  🥑 {Math.round(total.fat)}g Lip
                </Text>
              </View>

              {/* 🍽 Tes cards repas INCHANGÉES */}
              {mealsOfDay.map((item: any) => {
                const firstImage = item.foods[0]?.image_url;

                return (
                  <Pressable
                    key={item.id}
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
                        {item.foods.map((f: any) => f.name).join(', ')}
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
              })}
            </View>
          );
        }}
      />
    </View>
  );
}

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

  dateHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },

  summaryText: {
    fontSize: 13,
    fontWeight: '600',
  },

});
