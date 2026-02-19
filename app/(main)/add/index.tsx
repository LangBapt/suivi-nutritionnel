import { useRouter } from 'expo-router'
import * as React from 'react'
import {
    ActivityIndicator,
    FlatList,
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import { useMeals } from '../../../context/MealsContext'
import { searchProducts } from '../../../services/openFoodFacts'
import { Food, MealType } from '../../../types'

const MEAL_TYPES: MealType[] = [
    'Petit-déjeuner',
    'Déjeuner',
    'Dîner',
    'Snack',
] as const

const router = useRouter()

export default function AddMealPage() {
    const {
        currentMeal,
        createMeal,
        addFoodToCurrentMeal,
        saveCurrentMeal,
        removeFoodFromCurrentMeal
    } = useMeals()

    const [selectedType, setSelectedType] = React.useState<MealType>('Snack')
    const [query, setQuery] = React.useState('')
    const [results, setResults] = React.useState<Food[]>([])
    const [loading, setLoading] = React.useState(false)
    const [keyboardVisible, setKeyboardVisible] = React.useState(false)

    React.useEffect(() => {
        createMeal(selectedType)
    }, [selectedType])

    React.useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const timeout = setTimeout(async () => {
            setLoading(true)
            const foods = await searchProducts(query)
            setResults(foods)
            setLoading(false)
        }, 400)

        return () => clearTimeout(timeout)
    }, [query])


    React.useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))
        return () => {
            showSub.remove()
            hideSub.remove()
        }
    }, [])

    const handleAddFood = (food: Food) => {
        addFoodToCurrentMeal(food)
        setQuery('')
        setResults([])
    }

    const canSave = selectedType && currentMeal && currentMeal.foods.length > 0

    const handleSave = async () => {
        if (!canSave) return

        await saveCurrentMeal()

        setSelectedType('Snack')
        setQuery('')
        setResults([])

        router.push('/(main)/(home)')
    }


    return (
        <View style={styles.container}>

            <Text style={styles.label}>Type de repas</Text>

            <View style={styles.mealTypes}>
                {MEAL_TYPES.map((type) => (
                    <Pressable
                        key={type}
                        style={[
                            styles.mealButton,
                            selectedType === type && styles.mealButtonActive,
                        ]}
                        onPress={() => setSelectedType(type)}
                    >
                        <Text
                            style={[
                                styles.mealButtonText,
                                selectedType === type && styles.mealButtonTextActive,
                            ]}
                        >
                            {type}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <View style={styles.searchWrapper}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un aliment..."
                    value={query}
                    onChangeText={setQuery}
                />

                <Pressable style={styles.qrButton} onPress={() => router.push('/add/camera')}>
                    <Text style={styles.qrText}>[QR]</Text>
                </Pressable>
            </View>

            {currentMeal && currentMeal.foods.length > 0 && query.trim() === '' && (
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontWeight: '600', marginBottom: 8 }}>
                        Produits ajoutés
                    </Text>
                    {currentMeal.foods.map(food => (
                        <View key={food.id} style={styles.addedItem}>
                            {food.image_url ? (
                                <Image source={{ uri: food.image_url }} style={styles.resultImage} />
                            ) : (
                                <View style={styles.resultImagePlaceholder} />
                            )}
                            <View style={{ flex: 1 }}>
                                <Text style={styles.resultName}>{food.name}</Text>
                                <Text style={styles.resultCalories}>{food.calories} kcal</Text>
                            </View>
                            <Pressable
                                style={styles.removeButton}
                                onPress={() => removeFoodFromCurrentMeal(food.id)}
                            >
                                <Text style={styles.removeButtonText}>-</Text>
                            </Pressable>
                        </View>
                    ))}
                </View>
            )}



            {loading && <ActivityIndicator style={{ marginBottom: 10 }} />}

            <FlatList
                keyboardShouldPersistTaps="handled"
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.resultItem}>
                        {item.image_url ? (
                            <Image
                                source={{ uri: item.image_url }}
                                style={styles.resultImage}
                            />
                        ) : (
                            <View style={styles.resultImagePlaceholder} />
                        )}

                        <View style={styles.resultInfo}>
                            <Text style={styles.resultName}>{item.name}</Text>
                            <Text style={styles.resultCalories}>
                                {item.calories} kcal
                            </Text>
                        </View>

                        <Pressable
                            style={styles.addButton}
                            onPress={() => handleAddFood(item)}
                        >
                            <Text style={styles.addButtonText}>+</Text>
                        </Pressable>
                    </View>
                )}
            />

            <Pressable
                style={[
                    styles.saveButton,
                    !canSave && { backgroundColor: '#ccc' },
                ]}
                disabled={!canSave}
                onPress={handleSave}
            >
                <Text style={styles.saveButtonText}>
                    Valider le repas
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },

    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },

    mealTypes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },

    mealButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },

    mealButtonActive: {
        backgroundColor: '#4CAF50',
    },

    mealButtonText: {
        color: '#333',
        fontWeight: '600',
    },

    mealButtonTextActive: {
        color: '#fff',
    },

    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    searchInput: {
        height: 48,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },

    qrButton: {
        width: 48,
        height: 48,
        marginLeft: 8,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    qrText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },

    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },

    resultImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },

    resultImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#ddd',
    },

    resultInfo: {
        flex: 1,
    },

    resultName: {
        fontSize: 16,
        fontWeight: '600',
    },

    resultCalories: {
        fontSize: 14,
        color: '#777',
        marginTop: 2,
    },

    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },

    addButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },

    saveButton: {
        backgroundColor: '#0a7ea4',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },

    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    addedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },

    removeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#ff4444',
        justifyContent: 'center',
        alignItems: 'center',
    },

    removeButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },

})
