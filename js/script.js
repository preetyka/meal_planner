/**
 * WeeklyPlate – Modern, Interactive Weekly Meal Planner & Smart Grocery Assistant
 * Vanilla JavaScript (ES6+) with zero external dependencies
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Constants & Default Knowledge Base
  // ==========================================================================
  const STORAGE_KEY = 'weeklyplate_app_v2';
  const LEGACY_STORAGE_KEY = 'weeklyplate_meal_data_v1';

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  // Categories for Grocery Organization
  const GROCERY_CATEGORIES = [
    'Vegetables',
    'Fruits',
    'Dairy & Eggs',
    'Meat & Protein',
    'Grains & Bakery',
    'Pantry & Spices',
    'Other'
  ];

  // Common ingredient keyword dictionary for smart categorization
  const CATEGORY_KEYWORDS = {
    'Vegetables': [
      'onion', 'garlic', 'tomato', 'tomatoes', 'spinach', 'lettuce', 'kale', 'broccoli',
      'carrot', 'carrots', 'bell pepper', 'peppers', 'zucchini', 'cucumber', 'asparagus',
      'mushroom', 'mushrooms', 'celery', 'potato', 'potatoes', 'sweet potato', 'cauliflower',
      'cabbage', 'corn', 'peas', 'ginger', 'cilantro', 'parsley', 'basil', 'herb', 'herbs',
      'chili', 'jalapeno', 'scallion', 'scallions', 'green onion', 'leek', 'shallot', 'arugula',
      'eggplant', 'radish', 'avocado'
    ],
    'Fruits': [
      'apple', 'apples', 'banana', 'bananas', 'berry', 'berries', 'blueberry', 'blueberries',
      'strawberry', 'strawberries', 'raspberry', 'raspberries', 'lemon', 'lemons', 'lime',
      'limes', 'orange', 'oranges', 'mango', 'grape', 'grapes', 'pineapple', 'peach',
      'peaches', 'pear', 'pears', 'watermelon', 'cherry', 'cherries'
    ],
    'Dairy & Eggs': [
      'egg', 'eggs', 'milk', 'cheese', 'cheddar', 'mozzarella', 'parmesan', 'feta',
      'yogurt', 'greek yogurt', 'butter', 'cream', 'heavy cream', 'sour cream',
      'cottage cheese', 'ricotta', 'cream cheese'
    ],
    'Meat & Protein': [
      'chicken', 'chicken breast', 'chicken thighs', 'turkey', 'ground turkey', 'beef',
      'ground beef', 'pork', 'bacon', 'salmon', 'tuna', 'shrimp', 'fish', 'steak',
      'tofu', 'tempeh', 'sausage', 'ham', 'lamb', 'lentil', 'lentils', 'chickpea',
      'chickpeas', 'black bean', 'black beans', 'kidney bean', 'beans'
    ],
    'Grains & Bakery': [
      'bread', 'whole grain bread', 'sourdough', 'rice', 'basmati rice', 'brown rice',
      'pasta', 'noodle', 'noodles', 'spaghetti', 'penne', 'oats', 'rolled oats', 'oatmeal',
      'quinoa', 'tortilla', 'tortillas', 'wrap', 'wraps', 'flour', 'bagel', 'bagels',
      'pita', 'cereal', 'crust', 'pizza dough'
    ],
    'Pantry & Spices': [
      'oil', 'olive oil', 'vegetable oil', 'sesame oil', 'vinegar', 'balsamic', 'soy sauce',
      'salt', 'pepper', 'black pepper', 'sugar', 'brown sugar', 'honey', 'maple syrup',
      'cumin', 'oregano', 'paprika', 'curry powder', 'cinnamon', 'yeast', 'baking powder',
      'baking soda', 'broth', 'chicken broth', 'vegetable broth', 'stock', 'diced tomatoes',
      'coconut milk', 'mustard', 'mayo', 'mayonnaise', 'peanut butter', 'almond butter',
      'nuts', 'almonds', 'walnuts', 'peanuts', 'chia seeds', 'sesame seeds', 'chili flakes'
    ]
  };

  // Recipe Ideas for Quick Inspiration & Empty Slot Suggestions
  const RECIPE_SUGGESTIONS = [
    {
      name: "Berry Oatmeal Bowl",
      type: "Breakfast",
      tags: ["Quick (<30m)", "Vegetarian"],
      ingredients: "1 cup Rolled oats, 1.5 cups Almond milk, 0.5 cup Blueberries, 1 tbsp Chia seeds, 1 tbsp Maple syrup",
      notes: "Top with toasted almonds and fresh blueberries."
    },
    {
      name: "Avocado & Poached Egg Toast",
      type: "Breakfast",
      tags: ["Quick (<30m)", "Vegetarian"],
      ingredients: "2 slices Sourdough bread, 1 Ripe avocado, 2 Eggs, 1 pinch Chili flakes, 1 Lime",
      notes: "Poach eggs for 3 mins, toast bread until golden."
    },
    {
      name: "Greek Yogurt & Granola Parfait",
      type: "Breakfast",
      tags: ["Quick (<30m)", "High Protein", "Vegetarian"],
      ingredients: "1 cup Greek yogurt, 0.5 cup Granola, 0.5 cup Strawberries, 1 tbsp Honey",
      notes: "Layer yogurt, berries, and honey for an easy energizing breakfast."
    },
    {
      name: "Mediterranean Chickpea Salad",
      type: "Lunch",
      tags: ["Quick (<30m)", "Vegetarian", "High Protein"],
      ingredients: "1 can Chickpeas, 1 Cucumber, 1 cup Cherry tomatoes, 50g Feta cheese, 2 tbsp Olive oil, 1 Lemon",
      notes: "Rinse chickpeas, dice veggies, and toss with lemon vinaigrette."
    },
    {
      name: "Turkey & Avocado Wrap",
      type: "Lunch",
      tags: ["Quick (<30m)", "High Protein"],
      ingredients: "2 Tortilla wraps, 150g Sliced turkey, 1 Avocado, 1 cup Spinach, 1 tbsp Dijonnaise",
      notes: "Roll tightly, slice diagonally and wrap in foil."
    },
    {
      name: "Quinoa Veggie Power Bowl",
      type: "Lunch",
      tags: ["Vegetarian", "High Protein"],
      ingredients: "1 cup Quinoa, 1 Bell pepper, 1 cup Black beans, 1 cup Corn, 2 tbsp Olive oil",
      notes: "Cook quinoa ahead of time. Serve warm or chilled."
    },
    {
      name: "Sheet Pan Garlic Butter Salmon",
      type: "Dinner",
      tags: ["Quick (<30m)", "High Protein", "Family Fav"],
      ingredients: "2 Salmon fillets, 1 bunch Asparagus, 300g Baby potatoes, 2 tbsp Butter, 3 cloves Garlic, 1 Lemon",
      notes: "Roast at 400°F (200°C) for 16 minutes."
    },
    {
      name: "Creamy Coconut Lentil Dahl",
      type: "Dinner",
      tags: ["Vegetarian", "Family Fav"],
      ingredients: "1 cup Red lentils, 1 can Coconut milk, 1 can Diced tomatoes, 1 Onion, 2 cloves Garlic, 1 tbsp Curry powder, 1 cup Basmati rice",
      notes: "Simmer lentils for 25 minutes until rich and creamy."
    },
    {
      name: "Lemon Herb Grilled Chicken",
      type: "Dinner",
      tags: ["High Protein", "Family Fav"],
      ingredients: "400g Chicken breast, 2 Zucchini, 1 Bell pepper, 2 tbsp Olive oil, 1 Lemon, 1 tsp Oregano",
      notes: "Marinate chicken in lemon juice and oregano for 20 minutes before grilling."
    },
    {
      name: "Veggie Pasta Primavera",
      type: "Dinner",
      tags: ["Vegetarian", "Family Fav"],
      ingredients: "250g Penne pasta, 1 Zucchini, 1 Bell pepper, 1 cup Cherry tomatoes, 50g Parmesan cheese, 2 tbsp Olive oil",
      notes: "Cook pasta al dente and toss with sautéed vegetables."
    },
    {
      name: "Apple Slices with Almond Butter",
      type: "Snack",
      tags: ["Quick (<30m)", "Vegetarian"],
      ingredients: "1 Apple, 2 tbsp Almond butter, 1 pinch Cinnamon",
      notes: "Slice crisp apples and sprinkle with cinnamon."
    },
    {
      name: "Hummus with Cucumber & Pita",
      type: "Snack",
      tags: ["Quick (<30m)", "Vegetarian"],
      ingredients: "0.5 cup Hummus, 1 Cucumber, 1 Pita bread",
      notes: "Slice cucumbers into rounds for dipping."
    }
  ];

  // Full 7-Day Sample Week Plan
  const SAMPLE_WEEK_DATA = {
    "Monday_Breakfast": { name: "Berry Oatmeal Bowl", tags: ["Quick (<30m)", "Vegetarian"], ingredients: "1 cup Rolled oats, 1.5 cups Almond milk, 0.5 cup Blueberries, 1 tbsp Chia seeds, 1 tbsp Maple syrup", notes: "Top with toasted almonds", isFavorite: true },
    "Monday_Lunch": { name: "Turkey & Avocado Wrap", tags: ["Quick (<30m)", "High Protein"], ingredients: "2 Tortilla wraps, 150g Sliced turkey, 1 Avocado, 1 cup Spinach, 1 tbsp Dijonnaise", notes: "Wrap tightly in foil", isFavorite: false },
    "Monday_Dinner": { name: "Sheet Pan Garlic Butter Salmon", tags: ["Quick (<30m)", "High Protein", "Family Fav"], ingredients: "2 Salmon fillets, 1 bunch Asparagus, 300g Baby potatoes, 2 tbsp Butter, 3 cloves Garlic, 1 Lemon", notes: "Roast at 400°F (200°C) for 16 minutes", isFavorite: true },
    "Tuesday_Breakfast": { name: "Avocado & Poached Egg Toast", tags: ["Quick (<30m)", "Vegetarian"], ingredients: "2 slices Sourdough bread, 1 Ripe avocado, 2 Eggs, 1 pinch Chili flakes, 1 Lime", notes: "Poach eggs for 3 mins", isFavorite: true },
    "Tuesday_Lunch": { name: "Leftover Salmon & Potatoes", tags: ["Leftovers", "High Protein"], ingredients: "", notes: "Reheat gently in toaster oven", isFavorite: false },
    "Tuesday_Dinner": { name: "Creamy Coconut Lentil Dahl", tags: ["Vegetarian", "Family Fav"], ingredients: "1 cup Red lentils, 1 can Coconut milk, 1 can Diced tomatoes, 1 Onion, 2 cloves Garlic, 1 tbsp Curry powder, 1 cup Basmati rice", notes: "Make extra for tomorrow's lunch", isFavorite: true },
    "Wednesday_Breakfast": { name: "Greek Yogurt & Granola Parfait", tags: ["Quick (<30m)", "High Protein", "Vegetarian"], ingredients: "1 cup Greek yogurt, 0.5 cup Granola, 0.5 cup Strawberries, 1 tbsp Honey", notes: "Healthy energizing breakfast", isFavorite: false },
    "Wednesday_Lunch": { name: "Leftover Coconut Dahl with Rice", tags: ["Leftovers", "Vegetarian"], ingredients: "", notes: "Rich and comforting", isFavorite: false },
    "Wednesday_Dinner": { name: "Lemon Herb Grilled Chicken", tags: ["High Protein", "Family Fav"], ingredients: "400g Chicken breast, 2 Zucchini, 1 Bell pepper, 2 tbsp Olive oil, 1 Lemon, 1 tsp Oregano", notes: "Serve with warm pita", isFavorite: true },
    "Thursday_Breakfast": { name: "Avocado & Poached Egg Toast", tags: ["Quick (<30m)", "Vegetarian"], ingredients: "2 slices Sourdough bread, 1 Ripe avocado, 2 Eggs, 1 Lime", notes: "Quick morning fuel", isFavorite: false },
    "Thursday_Lunch": { name: "Mediterranean Chickpea Salad", tags: ["Quick (<30m)", "Vegetarian", "High Protein"], ingredients: "1 can Chickpeas, 1 Cucumber, 1 cup Cherry tomatoes, 50g Feta cheese, 2 tbsp Olive oil, 1 Lemon", notes: "Toss with oregano vinaigrette", isFavorite: true },
    "Thursday_Dinner": { name: "Veggie Pasta Primavera", tags: ["Vegetarian", "Family Fav"], ingredients: "250g Penne pasta, 1 Zucchini, 1 Bell pepper, 1 cup Cherry tomatoes, 50g Parmesan cheese, 2 tbsp Olive oil", notes: "Al dente pasta", isFavorite: false },
    "Friday_Breakfast": { name: "Berry Oatmeal Bowl", tags: ["Quick (<30m)", "Vegetarian"], ingredients: "1 cup Rolled oats, 1.5 cups Almond milk, 0.5 cup Blueberries, 1 tbsp Maple syrup", notes: "Warm comfort bowl", isFavorite: false },
    "Friday_Lunch": { name: "Turkey & Avocado Wrap", tags: ["Quick (<30m)", "High Protein"], ingredients: "2 Tortilla wraps, 150g Sliced turkey, 1 Avocado, 1 cup Spinach", notes: "Quick lunch", isFavorite: false },
    "Friday_Dinner": { name: "Homemade Margherita Pizza", tags: ["Family Fav", "Vegetarian"], ingredients: "1 Pizza dough, 1 cup Diced tomatoes, 200g Mozzarella cheese, 1 bunch Basil, 1 tbsp Olive oil", notes: "Bake on high heat for 12 mins", isFavorite: true },
    "Saturday_Breakfast": { name: "Fluffy Banana Pancakes", tags: ["Family Fav", "Vegetarian"], ingredients: "2 Bananas, 2 Eggs, 1 cup Flour, 1 cup Milk, 2 tbsp Butter, 2 tbsp Maple syrup", notes: "Weekend family brunch", isFavorite: true },
    "Saturday_Lunch": { name: "Mediterranean Chickpea Salad", tags: ["Quick (<30m)", "Vegetarian"], ingredients: "1 can Chickpeas, 1 Cucumber, 1 cup Cherry tomatoes, 50g Feta cheese", notes: "Refreshing salad", isFavorite: false },
    "Saturday_Dinner": { name: "Grilled Steak with Roasted Asparagus", tags: ["High Protein"], ingredients: "400g Steak, 1 bunch Asparagus, 300g Baby potatoes, 2 tbsp Butter, 2 cloves Garlic", notes: "Sear steak 4 mins per side", isFavorite: false },
    "Sunday_Breakfast": { name: "Greek Yogurt & Granola Parfait", tags: ["Quick (<30m)", "Vegetarian"], ingredients: "1 cup Greek yogurt, 0.5 cup Granola, 0.5 cup Strawberries, 1 tbsp Honey", notes: "Sunday morning treat", isFavorite: false },
    "Sunday_Lunch": { name: "Quinoa Veggie Power Bowl", tags: ["Vegetarian", "High Protein"], ingredients: "1 cup Quinoa, 1 Bell pepper, 1 can Black beans, 1 cup Corn, 2 tbsp Olive oil", notes: "Healthy meal prep lunch", isFavorite: false },
    "Sunday_Dinner": { name: "Sheet Pan Garlic Butter Salmon", tags: ["Quick (<30m)", "High Protein"], ingredients: "2 Salmon fillets, 1 bunch Asparagus, 300g Baby potatoes, 2 tbsp Butter, 2 cloves Garlic", notes: "Easy clean-up to end the weekend", isFavorite: true }
  };

  // ==========================================================================
  // 2. Application State Management
  // ==========================================================================
  const state = {
    theme: 'light',
    currentWeekMonday: getMonday(new Date()),
    searchQuery: '',
    activeFilterTag: 'All',
    activeMobileDay: 'Monday',
    favorites: [], // Saved meal templates
    weeks: {}, // Map of 'YYYY-MM-DD' -> { meals: {}, customGroceries: [], checkedItems: {} }
    activeModalSlot: null, // { day, type }
    activeEditingGrocery: null // { id, ... }
  };

  // --- Date Helpers ---
  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getWeekKey(mondayDate) {
    const y = mondayDate.getFullYear();
    const m = String(mondayDate.getMonth() + 1).padStart(2, '0');
    const d = String(mondayDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatWeekRange(mondayDate) {
    const sundayDate = new Date(mondayDate);
    sundayDate.setDate(mondayDate.getDate() + 6);

    const options = { month: 'short', day: 'numeric' };
    const startStr = mondayDate.toLocaleDateString(undefined, options);
    const endStr = sundayDate.toLocaleDateString(undefined, { ...options, year: 'numeric' });
    return `${startStr} – ${endStr}`;
  }

  function getDayDate(mondayDate, dayIndex) {
    const target = new Date(mondayDate);
    target.setDate(mondayDate.getDate() + dayIndex);
    return target;
  }

  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  // Ensure current week object exists in state
  function getCurrentWeekData() {
    const key = getWeekKey(state.currentWeekMonday);
    if (!state.weeks[key]) {
      state.weeks[key] = {
        meals: {},
        customGroceries: [],
        checkedItems: {}
      };
    }
    return state.weeks[key];
  }

  // --- LocalStorage Persistence ---
  function loadStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state.theme = parsed.theme || 'light';
        state.favorites = Array.isArray(parsed.favorites) ? parsed.favorites : [];
        state.weeks = parsed.weeks || {};
      } else {
        // Try migrating from legacy v1 storage if available
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          const currentKey = getWeekKey(state.currentWeekMonday);
          state.weeks[currentKey] = {
            meals: parsedLegacy.meals || {},
            customGroceries: parsedLegacy.customGroceries || [],
            checkedItems: parsedLegacy.checkedIngredients || {}
          };
        }
      }
    } catch (err) {
      console.warn("Storage could not be loaded; continuing with fresh state.", err);
    }
  }

  function saveStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        theme: state.theme,
        favorites: state.favorites,
        weeks: state.weeks
      }));
    } catch (err) {
      showToast("Heads up: Your changes couldn't be saved to browser storage.", "error");
    }
  }

  // ==========================================================================
  // 3. Smart Ingredient Parsing & Combination Engine
  // ==========================================================================

  /**
   * Parses an ingredient string like "2 cups White Rice" into structured data:
   * { quantity: 2, unit: "cups", item: "White Rice", category: "Grains & Bakery" }
   */
  function parseIngredient(rawStr) {
    let clean = rawStr.trim();
    if (!clean) return null;

    // Pattern for matching fractions like 1/2, decimals like 1.5, or integers like 2
    // followed optionally by standard cooking units
    const unitsRegex = /^(?:cups?|tbsp|tablespoons?|tsp|teaspoons?|lbs?|pounds?|oz|ounces?|grams?|g|kg|ml|liters?|l|cloves?|slices?|pinch|pinches?|cans?|bunch(?:es)?|pieces?|heads?|stalks?)\b/i;

    let quantity = null;
    let unit = '';
    let itemName = clean;

    // Check for leading fraction or number (e.g., "1 1/2", "1/2", "2.5", "3")
    const matchQty = clean.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s*(.*)/i);
    if (matchQty) {
      const numPart = matchQty[1].trim();
      const rest = matchQty[2].trim();

      // Convert fraction to numeric
      if (numPart.includes('/')) {
        const parts = numPart.split(' ');
        if (parts.length === 2) {
          const [whole, frac] = parts;
          const [num, den] = frac.split('/');
          quantity = parseFloat(whole) + (parseFloat(num) / parseFloat(den));
        } else {
          const [num, den] = numPart.split('/');
          quantity = parseFloat(num) / parseFloat(den);
        }
      } else {
        quantity = parseFloat(numPart);
      }

      // Check if `rest` begins with a recognized unit
      const matchUnit = rest.match(unitsRegex);
      if (matchUnit) {
        unit = matchUnit[0].toLowerCase();
        // Normalize plural units
        if (unit === 'tablespoon' || unit === 'tablespoons') unit = 'tbsp';
        if (unit === 'teaspoon' || unit === 'teaspoons') unit = 'tsp';
        if (unit === 'pound' || unit === 'pounds') unit = 'lbs';
        if (unit === 'ounce' || unit === 'ounces') unit = 'oz';
        if (unit === 'gram' || unit === 'grams') unit = 'g';

        itemName = rest.slice(matchUnit[0].length).trim();
      } else {
        itemName = rest;
      }
    }

    // Capitalize first letter of item name
    if (itemName) {
      itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
    }

    const category = categorizeIngredient(itemName);

    return {
      raw: clean,
      quantity,
      unit,
      item: itemName || clean,
      category
    };
  }

  function categorizeIngredient(name) {
    const lower = name.toLowerCase();

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const kw of keywords) {
        // Match word boundaries or substring
        if (lower.includes(kw)) {
          return category;
        }
      }
    }
    return 'Other';
  }

  function formatQuantity(val) {
    if (!val || isNaN(val)) return '';
    // Format nice fractions or round to 1 decimal place
    const rounded = Math.round(val * 100) / 100;
    if (rounded === 0.5) return '1/2';
    if (rounded === 0.25) return '1/4';
    if (rounded === 0.75) return '3/4';
    if (rounded === 0.33) return '1/3';
    if (rounded === 1.5) return '1 1/2';
    return String(rounded);
  }

  /**
   * Combines duplicate ingredients across meals into aggregated quantities
   */
  function aggregateIngredients(mealList, customList) {
    const map = new Map();

    // 1. Process ingredients from planned meals
    mealList.forEach(({ meal, slotLabel }) => {
      if (!meal.ingredients) return;
      const lines = meal.ingredients.split(/[\n,;]+/);
      lines.forEach(line => {
        const parsed = parseIngredient(line);
        if (!parsed || !parsed.item) return;

        // Grouping key: normalized item name + category
        const key = `${parsed.item.toLowerCase()}_${parsed.category}`;

        if (!map.has(key)) {
          map.set(key, {
            id: key,
            displayItem: parsed.item,
            category: parsed.category,
            quantitiesByUnit: {},
            sources: new Set(),
            isCustom: false
          });
        }

        const entry = map.get(key);
        entry.sources.add(slotLabel);

        const u = parsed.unit || '__nounit__';
        if (parsed.quantity !== null && !isNaN(parsed.quantity)) {
          entry.quantitiesByUnit[u] = (entry.quantitiesByUnit[u] || 0) + parsed.quantity;
        } else {
          entry.quantitiesByUnit['__raw__'] = true;
        }
      });
    });

    // 2. Process custom added grocery items
    customList.forEach(custom => {
      const parsed = parseIngredient(custom.text);
      if (!parsed || !parsed.item) return;

      const category = custom.category || parsed.category;
      const key = `custom_${custom.id}`;

      map.set(key, {
        id: custom.id,
        displayItem: parsed.item,
        category: category,
        quantitiesByUnit: parsed.quantity ? { [parsed.unit || '__nounit__']: parsed.quantity } : {},
        sources: new Set(['Custom']),
        isCustom: true,
        checked: Boolean(custom.checked)
      });
    });

    // 3. Format into final items list
    const result = [];
    map.forEach((entry, key) => {
      let qtyString = '';
      const parts = [];

      for (const [unit, sum] of Object.entries(entry.quantitiesByUnit)) {
        if (unit === '__raw__') continue;
        const fmtNum = formatQuantity(sum);
        if (unit === '__nounit__') {
          parts.push(fmtNum);
        } else {
          parts.push(`${fmtNum} ${unit}`);
        }
      }

      qtyString = parts.filter(Boolean).join(' + ');

      result.push({
        id: entry.id,
        name: entry.displayItem,
        quantityText: qtyString,
        category: entry.category,
        sources: Array.from(entry.sources),
        isCustom: entry.isCustom,
        customChecked: entry.checked
      });
    });

    return result;
  }

  // ==========================================================================
  // 4. Toast Notifications
  // ==========================================================================
  function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    let iconSvg = '';
    if (type === 'error') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else if (type === 'success') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-message">${escapeHtml(message)}</div>
      <button class="toast-close" aria-label="Dismiss">&times;</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(12px)';
        setTimeout(() => toast.remove(), 250);
      }
    }, duration);
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ==========================================================================
  // 5. DOM Renderers
  // ==========================================================================

  // --- Render Header & Week Navigator ---
  function renderWeekNavigator() {
    const rangeDisplay = document.getElementById('weekRangeDisplay');
    const weekTitle = document.getElementById('weekTitle');
    const today = new Date();
    const isCurrentWeek = isSameDay(state.currentWeekMonday, getMonday(today));

    if (rangeDisplay) {
      rangeDisplay.textContent = formatWeekRange(state.currentWeekMonday);
    }
    if (weekTitle) {
      weekTitle.textContent = isCurrentWeek ? "This Week" : `Week of ${state.currentWeekMonday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    }
  }

  // --- Render 7-Day Meal Calendar ---
  function renderCalendar() {
    const weekGrid = document.getElementById('weekGrid');
    if (!weekGrid) return;

    weekGrid.innerHTML = '';
    const weekData = getCurrentWeekData();
    const today = new Date();

    const query = state.searchQuery.toLowerCase().trim();
    const filterTag = state.activeFilterTag;

    DAYS.forEach((day, dayIndex) => {
      const dayDate = getDayDate(state.currentWeekMonday, dayIndex);
      const isToday = isSameDay(dayDate, today);

      const dayCard = document.createElement('div');
      dayCard.className = `day-card ${isToday ? 'is-today' : ''} ${day === state.activeMobileDay || state.activeMobileDay === 'All' ? 'active-mobile-day' : ''}`;
      dayCard.dataset.day = day;

      // Count meals planned for this day
      let dayMealsCount = 0;
      MEAL_TYPES.forEach(type => {
        if (weekData.meals[`${day}_${type}`]) dayMealsCount++;
      });

      // Day Card Header
      const header = document.createElement('div');
      header.className = 'day-header';
      header.innerHTML = `
        <div class="day-title-wrap">
          <div class="day-title">
            <span>${day}</span>
            ${isToday ? '<span class="today-tag">Today</span>' : ''}
          </div>
          <span class="day-date">${dayDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        <div class="day-count">${dayMealsCount}/4 planned</div>
      `;
      dayCard.appendChild(header);

      // Day Card Body with 4 Meal Slots
      const body = document.createElement('div');
      body.className = 'day-body';

      MEAL_TYPES.forEach(type => {
        const slotKey = `${day}_${type}`;
        const meal = weekData.meals[slotKey];
        const slot = document.createElement('div');
        slot.dataset.day = day;
        slot.dataset.type = type;

        const typeClass = type.toLowerCase();

        if (meal) {
          slot.className = 'meal-slot has-meal';

          // Search & Filter matching logic
          let matchesSearch = true;
          if (query) {
            matchesSearch = meal.name.toLowerCase().includes(query) ||
                            (meal.ingredients && meal.ingredients.toLowerCase().includes(query));
          }

          let matchesFilter = true;
          if (filterTag === 'Favorites') {
            matchesFilter = Boolean(meal.isFavorite);
          } else if (filterTag !== 'All') {
            matchesFilter = (meal.tags || []).includes(filterTag);
          }

          if (query && matchesSearch) {
            slot.classList.add('highlight-match');
          } else if ((query && !matchesSearch) || !matchesFilter) {
            slot.classList.add('dimmed');
          }

          // Build tags HTML
          const tagsHtml = (meal.tags || []).map(t => {
            let cls = 'meal-tag';
            if (t.includes('Quick')) cls += ' quick';
            else if (t.includes('Veg')) cls += ' veg';
            else if (t.includes('Protein')) cls += ' protein';
            else if (t.includes('Leftover')) cls += ' leftover';
            else if (t.includes('Fav')) cls += ' fav';
            return `<span class="${cls}">${escapeHtml(t)}</span>`;
          }).join('');

          const isFav = Boolean(meal.isFavorite);

          slot.innerHTML = `
            <div class="slot-meta">
              <span class="slot-type ${typeClass}">${type}</span>
              <div class="slot-quick-actions">
                <button class="favorite-star-btn ${isFav ? 'is-fav' : ''}" title="${isFav ? 'Remove from favorites' : 'Mark as favorite'}" aria-label="Favorite meal">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
            </div>
            <div class="meal-name">${escapeHtml(meal.name)}</div>
            ${tagsHtml ? `<div class="meal-tags-row">${tagsHtml}</div>` : ''}
            ${meal.ingredients ? `
              <div class="meal-ingredients-preview" title="${escapeHtml(meal.ingredients)}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/></svg>
                <span>${meal.ingredients.split(/[\n,;]+/).length} ingredients</span>
              </div>
            ` : ''}
            <div class="slot-actions">
              <button class="slot-btn duplicate-btn" title="Duplicate as leftover to tomorrow's lunch" aria-label="Duplicate meal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>Leftover</span>
              </button>
              <button class="slot-btn edit-btn" title="Edit meal details" aria-label="Edit meal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </button>
              <button class="slot-btn delete-btn" title="Remove meal" aria-label="Delete meal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          `;

          // Slot Action Handlers
          slot.addEventListener('click', (e) => {
            if (e.target.closest('.slot-btn') || e.target.closest('.favorite-star-btn')) return;
            openMealModal(day, type);
          });

          slot.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openMealModal(day, type);
          });

          slot.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteMeal(day, type);
          });

          slot.querySelector('.duplicate-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            duplicateMealAsLeftover(day, type);
          });

          slot.querySelector('.favorite-star-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMealFavorite(day, type);
          });

        } else {
          // Empty Meal Slot
          slot.className = 'meal-slot is-empty';
          slot.innerHTML = `
            <div class="empty-slot-content">
              <div class="empty-slot-left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Plan ${type.toLowerCase()}</span>
              </div>
              <button type="button" class="suggest-hint-btn" title="Suggest an idea for ${type}">
                <span>💡 Idea</span>
              </button>
            </div>
          `;

          slot.addEventListener('click', (e) => {
            if (e.target.closest('.suggest-hint-btn')) return;
            openMealModal(day, type);
          });

          slot.querySelector('.suggest-hint-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            suggestMealForSlot(day, type);
          });
        }

        body.appendChild(slot);
      });

      dayCard.appendChild(body);
      weekGrid.appendChild(dayCard);
    });

    updateProgress();
    renderGroceryList();
    renderFilterPillCounts();
  }

  // --- Render Progress Tracker & Motivational Text ---
  function updateProgress() {
    const weekData = getCurrentWeekData();
    let plannedMain = 0;

    DAYS.forEach(day => {
      ['Breakfast', 'Lunch', 'Dinner'].forEach(type => {
        if (weekData.meals[`${day}_${type}`]) plannedMain++;
      });
    });

    const percent = Math.round((plannedMain / 21) * 100);

    const countEl = document.getElementById('mainMealsProgressCount');
    const percentEl = document.getElementById('progressPercentage');
    const fillEl = document.getElementById('progressFill');
    const msgEl = document.getElementById('progressMotivationMessage');

    if (countEl) countEl.textContent = `${plannedMain} of 21`;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (fillEl) fillEl.style.width = `${percent}%`;

    if (msgEl) {
      if (plannedMain === 21) {
        msgEl.className = 'progress-message completed';
        msgEl.textContent = "🎉 Wonderful! All 21 main meals planned! You're completely organized for the week.";
      } else if (plannedMain >= 15) {
        msgEl.className = 'progress-message';
        msgEl.textContent = `Almost there! Just ${21 - plannedMain} more main meals to complete your weekly schedule.`;
      } else if (plannedMain >= 7) {
        msgEl.className = 'progress-message';
        msgEl.textContent = `Great progress! ${21 - plannedMain} meals left to plan for a stress-free week.`;
      } else {
        msgEl.className = 'progress-message';
        msgEl.textContent = "Plan your breakfasts, lunches, and dinners to save time and eat better.";
      }
    }
  }

  // --- Render Smart Grocery List with Categories & Combined Items ---
  function renderGroceryList() {
    const listWrap = document.getElementById('groceryItemsWrap');
    const statsBadge = document.getElementById('groceryStatsBadge');
    const headerCountBadge = document.getElementById('groceryHeaderCountBadge');
    if (!listWrap) return;

    listWrap.innerHTML = '';
    const weekData = getCurrentWeekData();

    // 1. Gather all planned meals
    const plannedMealsList = [];
    DAYS.forEach(day => {
      MEAL_TYPES.forEach(type => {
        const meal = weekData.meals[`${day}_${type}`];
        if (meal) {
          plannedMealsList.push({
            meal,
            slotLabel: `${day.slice(0, 3)} ${type}`
          });
        }
      });
    });

    // 2. Aggregate ingredients
    const items = aggregateIngredients(plannedMealsList, weekData.customGroceries || []);

    // 3. Count completed vs total
    let totalItems = items.length;
    let completedCount = 0;

    items.forEach(item => {
      const isChecked = item.isCustom ? item.customChecked : Boolean(weekData.checkedItems[item.id]);
      if (isChecked) completedCount++;
    });

    const remainingCount = totalItems - completedCount;

    if (statsBadge) {
      statsBadge.textContent = `${completedCount} / ${totalItems} done`;
    }
    if (headerCountBadge) {
      headerCountBadge.textContent = `${totalItems} items (${remainingCount} left)`;
    }

    if (totalItems === 0) {
      listWrap.innerHTML = `
        <div class="empty-grocery-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          <div style="font-weight:600;">No groceries needed yet!</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">Plan meals with ingredients above or add custom items to build your shopping checklist.</div>
        </div>
      `;
      return;
    }

    // 4. Group by Category
    const categorized = {};
    GROCERY_CATEGORIES.forEach(cat => categorized[cat] = []);

    items.forEach(item => {
      const cat = GROCERY_CATEGORIES.includes(item.category) ? item.category : 'Other';
      categorized[cat].push(item);
    });

    GROCERY_CATEGORIES.forEach(category => {
      const groupItems = categorized[category];
      if (groupItems.length === 0) return;

      const groupDiv = document.createElement('div');
      groupDiv.className = 'grocery-category-group';

      const catHeader = document.createElement('div');
      catHeader.className = 'category-group-header';
      catHeader.innerHTML = `
        <span>${category}</span>
        <span class="category-group-count">${groupItems.length}</span>
      `;
      groupDiv.appendChild(catHeader);

      groupItems.forEach(item => {
        const isChecked = item.isCustom ? item.customChecked : Boolean(weekData.checkedItems[item.id]);
        const itemRow = document.createElement('div');
        itemRow.className = 'grocery-item';

        const sourceTooltip = item.sources.join(', ');

        itemRow.innerHTML = `
          <label class="grocery-label-wrap">
            <input type="checkbox" class="grocery-checkbox" ${isChecked ? 'checked' : ''} />
            <div class="grocery-text-container">
              ${item.quantityText ? `<span class="grocery-quantity">${escapeHtml(item.quantityText)}</span>` : ''}
              <span class="grocery-text ${isChecked ? 'checked' : ''}">${escapeHtml(item.name)}</span>
            </div>
          </label>
          <span class="grocery-source" title="Source: ${escapeHtml(sourceTooltip)}">${escapeHtml(item.sources.slice(0, 2).join(', '))}${item.sources.length > 2 ? '…' : ''}</span>
          <div class="grocery-item-actions">
            ${item.isCustom ? `
              <button class="slot-btn edit-grocery-btn" title="Edit custom item" aria-label="Edit item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </button>
              <button class="slot-btn delete-btn delete-grocery-btn" title="Delete custom item" aria-label="Delete item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            ` : ''}
          </div>
        `;

        const checkbox = itemRow.querySelector('.grocery-checkbox');
        const textSpan = itemRow.querySelector('.grocery-text');

        checkbox.addEventListener('change', () => {
          if (item.isCustom) {
            const customObj = weekData.customGroceries.find(c => c.id === item.id);
            if (customObj) customObj.checked = checkbox.checked;
          } else {
            if (checkbox.checked) {
              weekData.checkedItems[item.id] = true;
            } else {
              delete weekData.checkedItems[item.id];
            }
          }
          textSpan.classList.toggle('checked', checkbox.checked);
          saveStorage();
          updateGroceryCounters();
        });

        if (item.isCustom) {
          itemRow.querySelector('.delete-grocery-btn').addEventListener('click', () => {
            weekData.customGroceries = weekData.customGroceries.filter(c => c.id !== item.id);
            saveStorage();
            renderGroceryList();
            showToast(`Removed "${item.name}" from your grocery list.`, 'info');
          });

          itemRow.querySelector('.edit-grocery-btn').addEventListener('click', () => {
            openGroceryEditModal(item.id);
          });
        }

        groupDiv.appendChild(itemRow);
      });

      listWrap.appendChild(groupDiv);
    });
  }

  function updateGroceryCounters() {
    const weekData = getCurrentWeekData();
    const plannedMealsList = [];
    DAYS.forEach(day => {
      MEAL_TYPES.forEach(type => {
        const meal = weekData.meals[`${day}_${type}`];
        if (meal) plannedMealsList.push({ meal, slotLabel: '' });
      });
    });

    const items = aggregateIngredients(plannedMealsList, weekData.customGroceries || []);
    let completedCount = 0;
    items.forEach(item => {
      const isChecked = item.isCustom ? item.customChecked : Boolean(weekData.checkedItems[item.id]);
      if (isChecked) completedCount++;
    });

    const totalItems = items.length;
    const remainingCount = totalItems - completedCount;

    const statsBadge = document.getElementById('groceryStatsBadge');
    const headerCountBadge = document.getElementById('groceryHeaderCountBadge');
    if (statsBadge) statsBadge.textContent = `${completedCount} / ${totalItems} done`;
    if (headerCountBadge) headerCountBadge.textContent = `${totalItems} items (${remainingCount} left)`;
  }

  // --- Render Filter Pill Counts ---
  function renderFilterPillCounts() {
    const weekData = getCurrentWeekData();
    const counts = {
      'All': 0,
      'Quick (<30m)': 0,
      'Vegetarian': 0,
      'High Protein': 0,
      'Family Fav': 0,
      'Leftovers': 0,
      'Favorites': 0
    };

    DAYS.forEach(day => {
      MEAL_TYPES.forEach(type => {
        const meal = weekData.meals[`${day}_${type}`];
        if (meal) {
          counts['All']++;
          if (meal.isFavorite) counts['Favorites']++;
          (meal.tags || []).forEach(t => {
            if (counts[t] !== undefined) counts[t]++;
          });
        }
      });
    });

    document.querySelectorAll('.filter-pill').forEach(pill => {
      const tag = pill.dataset.tag;
      const countSpan = pill.querySelector('.count');
      if (countSpan && counts[tag] !== undefined) {
        countSpan.textContent = counts[tag];
      }
    });
  }

  // --- Render Recipe Inspiration / Favorites Panel ---
  function renderInspirationPanel(viewMode = 'suggestions') {
    const container = document.getElementById('ideasList');
    if (!container) return;

    container.innerHTML = '';

    if (viewMode === 'favorites') {
      const favs = state.favorites || [];
      if (favs.length === 0) {
        container.innerHTML = `
          <div style="font-size:0.82rem; color:var(--text-muted); text-align:center; padding:16px 0;">
            No favorite meals saved yet. Tap the heart icon on any meal to save it here!
          </div>
        `;
        return;
      }

      favs.forEach(fav => {
        const chip = document.createElement('div');
        chip.className = 'idea-chip';
        chip.innerHTML = `
          <div>
            <strong style="color:var(--text-main); font-size:0.85rem;">${escapeHtml(fav.name)}</strong>
            <div style="font-size:0.72rem; color:var(--text-muted);">${escapeHtml(fav.type || 'Meal')} • ${(fav.tags || []).join(', ')}</div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        `;
        chip.addEventListener('click', () => {
          openMealModalWithData(fav);
        });
        container.appendChild(chip);
      });
    } else {
      // General suggestions
      RECIPE_SUGGESTIONS.forEach(rec => {
        const chip = document.createElement('div');
        chip.className = 'idea-chip';
        chip.innerHTML = `
          <div>
            <strong style="color:var(--text-main); font-size:0.85rem;">${escapeHtml(rec.name)}</strong>
            <div style="font-size:0.72rem; color:var(--text-muted);">${escapeHtml(rec.type)} • ${(rec.tags || []).join(', ')}</div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        `;
        chip.addEventListener('click', () => {
          openMealModalWithData(rec);
        });
        container.appendChild(chip);
      });
    }
  }

  // ==========================================================================
  // 6. Meal Operations (Add, Edit, Delete, Duplicate, Favorites)
  // ==========================================================================

  function openMealModal(day, type) {
    state.activeModalSlot = { day, type };
    const weekData = getCurrentWeekData();
    const meal = weekData.meals[`${day}_${type}`] || null;

    const modal = document.getElementById('mealModalBackdrop');
    const title = document.getElementById('modalTitle');
    const subtitle = document.getElementById('modalSubtitle');
    const daySelect = document.getElementById('mealDaySelect');
    const typeSelect = document.getElementById('mealTypeSelect');
    const nameInput = document.getElementById('mealNameInput');
    const ingrInput = document.getElementById('mealIngredientsInput');
    const notesInput = document.getElementById('mealNotesInput');
    const favCheckbox = document.getElementById('mealFavCheckbox');
    const deleteBtn = document.getElementById('deleteMealBtn');

    title.textContent = meal ? `Edit ${type}` : `Plan ${type}`;
    subtitle.textContent = `For ${day} (${formatWeekRange(state.currentWeekMonday)})`;

    daySelect.value = day;
    typeSelect.value = type;

    if (meal) {
      nameInput.value = meal.name || '';
      ingrInput.value = meal.ingredients || '';
      notesInput.value = meal.notes || '';
      if (favCheckbox) favCheckbox.checked = Boolean(meal.isFavorite);
      deleteBtn.style.display = 'inline-flex';

      const tags = meal.tags || [];
      document.querySelectorAll('#tagCheckboxes input').forEach(cb => {
        cb.checked = tags.includes(cb.value);
        cb.parentElement.classList.toggle('selected', cb.checked);
      });
    } else {
      nameInput.value = '';
      ingrInput.value = '';
      notesInput.value = '';
      if (favCheckbox) favCheckbox.checked = false;
      deleteBtn.style.display = 'none';

      document.querySelectorAll('#tagCheckboxes input').forEach(cb => {
        cb.checked = false;
        cb.parentElement.classList.remove('selected');
      });
    }

    modal.classList.add('open');
    setTimeout(() => nameInput.focus(), 60);
  }

  function openMealModalWithData(data) {
    const weekData = getCurrentWeekData();
    // Pick first open slot for this meal type
    let targetDay = 'Monday';
    for (const d of DAYS) {
      if (!weekData.meals[`${d}_${data.type}`]) {
        targetDay = d;
        break;
      }
    }

    state.activeModalSlot = { day: targetDay, type: data.type };

    const modal = document.getElementById('mealModalBackdrop');
    const title = document.getElementById('modalTitle');
    const subtitle = document.getElementById('modalSubtitle');
    const daySelect = document.getElementById('mealDaySelect');
    const typeSelect = document.getElementById('mealTypeSelect');
    const nameInput = document.getElementById('mealNameInput');
    const ingrInput = document.getElementById('mealIngredientsInput');
    const notesInput = document.getElementById('mealNotesInput');
    const favCheckbox = document.getElementById('mealFavCheckbox');
    const deleteBtn = document.getElementById('deleteMealBtn');

    title.textContent = `Schedule ${data.name}`;
    subtitle.textContent = `Assigning to ${targetDay} ${data.type}`;

    daySelect.value = targetDay;
    typeSelect.value = data.type;
    nameInput.value = data.name;
    ingrInput.value = data.ingredients || '';
    notesInput.value = data.notes || '';
    if (favCheckbox) favCheckbox.checked = Boolean(data.isFavorite);
    deleteBtn.style.display = 'none';

    const tags = data.tags || [];
    document.querySelectorAll('#tagCheckboxes input').forEach(cb => {
      cb.checked = tags.includes(cb.value);
      cb.parentElement.classList.toggle('selected', cb.checked);
    });

    modal.classList.add('open');
    setTimeout(() => nameInput.focus(), 60);
  }

  function suggestMealForSlot(day, type) {
    // Find recipes matching this type
    const matching = RECIPE_SUGGESTIONS.filter(r => r.type === type);
    const chosen = matching[Math.floor(Math.random() * matching.length)] || RECIPE_SUGGESTIONS[0];

    const weekData = getCurrentWeekData();
    weekData.meals[`${day}_${type}`] = {
      name: chosen.name,
      ingredients: chosen.ingredients,
      notes: chosen.notes,
      tags: chosen.tags,
      isFavorite: false
    };

    saveStorage();
    renderCalendar();
    showToast(`Suggested "${chosen.name}" for ${day} ${type}!`, "success");
  }

  function handleMealFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('mealNameInput').value.trim();
    const day = document.getElementById('mealDaySelect').value;
    const type = document.getElementById('mealTypeSelect').value;
    const ingredients = document.getElementById('mealIngredientsInput').value.trim();
    const notes = document.getElementById('mealNotesInput').value.trim();
    const favCheckbox = document.getElementById('mealFavCheckbox');
    const isFavorite = favCheckbox ? favCheckbox.checked : false;

    if (!name) {
      showToast("Please provide a meal title before saving.", "error");
      document.getElementById('mealNameInput').focus();
      return;
    }

    const selectedTags = [];
    document.querySelectorAll('#tagCheckboxes input:checked').forEach(cb => {
      selectedTags.push(cb.value);
    });

    const weekData = getCurrentWeekData();

    // If day or slot changed during edit, clear old slot
    if (state.activeModalSlot &&
       (state.activeModalSlot.day !== day || state.activeModalSlot.type !== type)) {
      delete weekData.meals[`${state.activeModalSlot.day}_${state.activeModalSlot.type}`];
    }

    weekData.meals[`${day}_${type}`] = {
      name,
      ingredients,
      notes,
      tags: selectedTags,
      isFavorite
    };

    // Update favorites list
    if (isFavorite) {
      if (!state.favorites.some(f => f.name.toLowerCase() === name.toLowerCase())) {
        state.favorites.push({ name, type, ingredients, notes, tags: selectedTags, isFavorite: true });
      }
    }

    saveStorage();
    closeMealModal();
    renderCalendar();
    showToast(`Saved "${name}" for ${day} ${type}!`, "success");
  }

  function deleteMeal(day, type) {
    const weekData = getCurrentWeekData();
    const meal = weekData.meals[`${day}_${type}`];
    if (!meal) return;

    if (confirm(`Remove "${meal.name}" from ${day} ${type}?`)) {
      delete weekData.meals[`${day}_${type}`];
      saveStorage();
      renderCalendar();
      showToast(`Removed meal from ${day} ${type}.`, "info");
    }
  }

  function duplicateMealAsLeftover(day, type) {
    const weekData = getCurrentWeekData();
    const meal = weekData.meals[`${day}_${type}`];
    if (!meal) return;

    const dayIndex = DAYS.indexOf(day);
    const nextDay = DAYS[(dayIndex + 1) % DAYS.length];
    const targetType = type === 'Dinner' ? 'Lunch' : type;

    const tags = Array.from(new Set([...(meal.tags || []), 'Leftovers']));

    weekData.meals[`${nextDay}_${targetType}`] = {
      name: `Leftover ${meal.name}`,
      ingredients: "", // Leftovers don't need additional groceries
      notes: `Carry-over from ${day} ${type}.`,
      tags: tags,
      isFavorite: false
    };

    saveStorage();
    renderCalendar();
    showToast(`Carried over "${meal.name}" to ${nextDay} ${targetType} as leftovers!`, "success");
  }

  function toggleMealFavorite(day, type) {
    const weekData = getCurrentWeekData();
    const meal = weekData.meals[`${day}_${type}`];
    if (!meal) return;

    meal.isFavorite = !meal.isFavorite;

    if (meal.isFavorite) {
      if (!state.favorites.some(f => f.name.toLowerCase() === meal.name.toLowerCase())) {
        state.favorites.push({ ...meal });
      }
      showToast(`Added "${meal.name}" to your favorites!`, "success");
    } else {
      state.favorites = state.favorites.filter(f => f.name.toLowerCase() !== meal.name.toLowerCase());
      showToast(`Removed "${meal.name}" from favorites.`, "info");
    }

    saveStorage();
    renderCalendar();
    renderInspirationPanel(document.querySelector('.ideas-tab-btn.active')?.dataset.tab || 'suggestions');
  }

  function closeMealModal() {
    document.getElementById('mealModalBackdrop').classList.remove('open');
    state.activeModalSlot = null;
  }

  // ==========================================================================
  // 7. Grocery Operations (Add, Edit, Clean, Reset, Copy)
  // ==========================================================================

  function handleAddCustomGrocery(e) {
    e.preventDefault();
    const input = document.getElementById('customGroceryInput');
    const text = input.value.trim();

    if (!text) {
      showToast("Please enter an item name before adding to your grocery list.", "error");
      input.focus();
      return;
    }

    const weekData = getCurrentWeekData();
    const parsed = parseIngredient(text);

    weekData.customGroceries.push({
      id: 'custom_' + Date.now(),
      text: text,
      category: parsed.category,
      checked: false
    });

    input.value = '';
    saveStorage();
    renderGroceryList();
    showToast(`Added "${text}" to grocery list.`, "success");
  }

  function openGroceryEditModal(customId) {
    const weekData = getCurrentWeekData();
    const item = weekData.customGroceries.find(c => c.id === customId);
    if (!item) return;

    state.activeEditingGrocery = item;
    const modal = document.getElementById('groceryEditModalBackdrop');
    const input = document.getElementById('editGroceryInput');
    const catSelect = document.getElementById('editGroceryCategorySelect');

    input.value = item.text;
    catSelect.value = item.category || 'Other';

    modal.classList.add('open');
    setTimeout(() => input.focus(), 60);
  }

  function handleSaveEditedGrocery(e) {
    e.preventDefault();
    if (!state.activeEditingGrocery) return;

    const input = document.getElementById('editGroceryInput');
    const catSelect = document.getElementById('editGroceryCategorySelect');
    const newText = input.value.trim();

    if (!newText) {
      showToast("Item name cannot be empty.", "error");
      input.focus();
      return;
    }

    state.activeEditingGrocery.text = newText;
    state.activeEditingGrocery.category = catSelect.value;

    saveStorage();
    closeGroceryEditModal();
    renderGroceryList();
    showToast("Updated grocery item.", "success");
  }

  function closeGroceryEditModal() {
    document.getElementById('groceryEditModalBackdrop').classList.remove('open');
    state.activeEditingGrocery = null;
  }

  function cleanCheckedGroceries() {
    const weekData = getCurrentWeekData();
    let cleanedCount = 0;

    // Remove checked custom items
    const origCustom = weekData.customGroceries.length;
    weekData.customGroceries = weekData.customGroceries.filter(c => !c.checked);
    cleanedCount += (origCustom - weekData.customGroceries.length);

    // Uncheck meal-derived items
    const checkedKeys = Object.keys(weekData.checkedItems);
    cleanedCount += checkedKeys.length;
    weekData.checkedItems = {};

    saveStorage();
    renderGroceryList();

    if (cleanedCount > 0) {
      showToast(`Cleaned ${cleanedCount} checked items from your list!`, "success");
    } else {
      showToast("No grocery items are currently checked off.", "info");
    }
  }

  function resetGroceryChecklist() {
    const weekData = getCurrentWeekData();
    let count = 0;

    weekData.customGroceries.forEach(c => {
      if (c.checked) {
        c.checked = false;
        count++;
      }
    });

    const mealCheckedKeys = Object.keys(weekData.checkedItems);
    count += mealCheckedKeys.length;
    weekData.checkedItems = {};

    saveStorage();
    renderGroceryList();

    if (count > 0) {
      showToast("Reset all checklist checkboxes.", "info");
    } else {
      showToast("Checklist is already clean.", "info");
    }
  }

  function copyGroceryListToClipboard() {
    const weekData = getCurrentWeekData();
    const plannedMealsList = [];
    DAYS.forEach(day => {
      MEAL_TYPES.forEach(type => {
        const meal = weekData.meals[`${day}_${type}`];
        if (meal) plannedMealsList.push({ meal, slotLabel: `${day.slice(0, 3)} ${type}` });
      });
    });

    const items = aggregateIngredients(plannedMealsList, weekData.customGroceries || []);

    if (items.length === 0) {
      showToast("Your grocery list is empty. Add meals to build your list!", "error");
      return;
    }

    // Group items by category
    const categorized = {};
    GROCERY_CATEGORIES.forEach(cat => categorized[cat] = []);
    items.forEach(i => {
      const cat = GROCERY_CATEGORIES.includes(i.category) ? i.category : 'Other';
      categorized[cat].push(i);
    });

    let textOutput = `WeeklyPlate Grocery List (${formatWeekRange(state.currentWeekMonday)}):\n`;

    GROCERY_CATEGORIES.forEach(cat => {
      if (categorized[cat].length > 0) {
        textOutput += `\n[ ${cat} ]\n`;
        categorized[cat].forEach(item => {
          const qty = item.quantityText ? `${item.quantityText} ` : '';
          textOutput += ` • ${qty}${item.name}\n`;
        });
      }
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textOutput).then(() => {
        showToast("Grocery list copied to clipboard!", "success");
      }).catch(() => {
        fallbackCopy(textOutput);
      });
    } else {
      fallbackCopy(textOutput);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast("Grocery list copied to clipboard!", "success");
    } catch (err) {
      showToast("Could not copy automatically. You can copy items directly.", "error");
    }
    document.body.removeChild(ta);
  }

  // ==========================================================================
  // 8. Week Navigation & Confirmation Modals
  // ==========================================================================

  function navigateWeek(deltaWeeks) {
    const nextDate = new Date(state.currentWeekMonday);
    nextDate.setDate(nextDate.getDate() + (deltaWeeks * 7));
    state.currentWeekMonday = nextDate;

    renderWeekNavigator();
    renderCalendar();
  }

  function navigateToCurrentWeek() {
    state.currentWeekMonday = getMonday(new Date());
    renderWeekNavigator();
    renderCalendar();
    showToast("Switched to current week.", "info");
  }

  function openClearWeekConfirmModal() {
    const weekData = getCurrentWeekData();
    const plannedCount = Object.keys(weekData.meals).length;
    if (plannedCount === 0 && weekData.customGroceries.length === 0) {
      showToast("This week's schedule is already clear.", "info");
      return;
    }

    const modal = document.getElementById('clearWeekModalBackdrop');
    modal.classList.add('open');
  }

  function confirmClearWeek() {
    const weekData = getCurrentWeekData();
    weekData.meals = {};
    weekData.customGroceries = [];
    weekData.checkedItems = {};

    saveStorage();
    document.getElementById('clearWeekModalBackdrop').classList.remove('open');
    renderCalendar();
    showToast("This week's meal schedule and groceries have been cleared.", "info");
  }

  function loadSamplePlan() {
    const weekData = getCurrentWeekData();
    const hasExisting = Object.keys(weekData.meals).length > 0;

    if (hasExisting) {
      if (!confirm("This will replace this week's planned meals with a delicious sample schedule. Continue?")) {
        return;
      }
    }

    weekData.meals = JSON.parse(JSON.stringify(SAMPLE_WEEK_DATA));
    weekData.checkedItems = {};

    saveStorage();
    renderCalendar();
    showToast("Loaded a complete healthy sample week!", "success");
  }

  // ==========================================================================
  // 9. Theme Toggle (Light / Dark Mode)
  // ==========================================================================
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      if (theme === 'dark') {
        toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
        toggleBtn.setAttribute('title', 'Switch to light mode');
        toggleBtn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
        toggleBtn.setAttribute('title', 'Switch to dark mode');
        toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  }

  function toggleTheme() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    saveStorage();
    showToast(`Switched to ${nextTheme} theme.`, "info", 2000);
  }

  // ==========================================================================
  // 10. Event Listeners Setup
  // ==========================================================================
  function attachEventListeners() {
    // Theme toggle
    document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

    // Week navigation buttons
    document.getElementById('prevWeekBtn')?.addEventListener('click', () => navigateWeek(-1));
    document.getElementById('nextWeekBtn')?.addEventListener('click', () => navigateWeek(1));
    document.getElementById('todayWeekBtn')?.addEventListener('click', navigateToCurrentWeek);

    // Global Action Buttons
    document.getElementById('loadSampleBtn')?.addEventListener('click', loadSamplePlan);
    document.getElementById('printBtn')?.addEventListener('click', () => window.print());
    document.getElementById('clearWeekBtn')?.addEventListener('click', openClearWeekConfirmModal);
    document.getElementById('confirmClearBtn')?.addEventListener('click', confirmClearWeek);
    document.getElementById('cancelClearBtn')?.addEventListener('click', () => {
      document.getElementById('clearWeekModalBackdrop').classList.remove('open');
    });

    // Search bar live filtering
    const searchInput = document.getElementById('mealSearchInput');
    const searchClear = document.getElementById('searchClearBtn');
    searchInput?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      searchClear?.classList.toggle('visible', Boolean(state.searchQuery));
      renderCalendar();
    });

    searchClear?.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      searchClear.classList.remove('visible');
      renderCalendar();
      searchInput.focus();
    });

    // Filter pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeFilterTag = pill.dataset.tag;
        renderCalendar();
      });
    });

    // Mobile Day Selector Pills
    document.querySelectorAll('.mobile-day-selector .day-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.mobile-day-selector .day-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeMobileDay = pill.dataset.day;

        const grid = document.getElementById('weekGrid');
        if (state.activeMobileDay === 'All') {
          grid.classList.remove('single-day-mode');
        } else {
          grid.classList.add('single-day-mode');
        }

        document.querySelectorAll('.day-card').forEach(card => {
          if (state.activeMobileDay === 'All' || card.dataset.day === state.activeMobileDay) {
            card.classList.add('active-mobile-day');
          } else {
            card.classList.remove('active-mobile-day');
          }
        });
      });
    });

    // Meal Modal Events
    document.getElementById('mealForm')?.addEventListener('submit', handleMealFormSubmit);
    document.getElementById('closeModalBtn')?.addEventListener('click', closeMealModal);
    document.getElementById('cancelModalBtn')?.addEventListener('click', closeMealModal);
    document.getElementById('deleteMealBtn')?.addEventListener('click', () => {
      if (state.activeModalSlot) {
        deleteMeal(state.activeModalSlot.day, state.activeModalSlot.type);
        closeMealModal();
      }
    });

    // Tag choices in modal
    document.querySelectorAll('#tagCheckboxes input').forEach(cb => {
      cb.addEventListener('change', () => {
        cb.parentElement.classList.toggle('selected', cb.checked);
      });
    });

    // Grocery Actions
    document.getElementById('addGroceryForm')?.addEventListener('submit', handleAddCustomGrocery);
    document.getElementById('clearCheckedGroceriesBtn')?.addEventListener('click', cleanCheckedGroceries);
    document.getElementById('resetChecklistBtn')?.addEventListener('click', resetGroceryChecklist);
    document.getElementById('copyGroceryListBtn')?.addEventListener('click', copyGroceryListToClipboard);

    // Grocery Edit Modal Events
    document.getElementById('groceryEditForm')?.addEventListener('submit', handleSaveEditedGrocery);
    document.getElementById('closeGroceryEditModalBtn')?.addEventListener('click', closeGroceryEditModal);
    document.getElementById('cancelGroceryEditModalBtn')?.addEventListener('click', closeGroceryEditModal);

    // Ideas Tab switcher (Suggestions vs Favorites)
    document.querySelectorAll('.ideas-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ideas-tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderInspirationPanel(tab.dataset.tab);
      });
    });

    // Close Modals on Backdrop Click or Escape Key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMealModal();
        closeGroceryEditModal();
        document.getElementById('clearWeekModalBackdrop')?.classList.remove('open');
      }
    });

    ['mealModalBackdrop', 'groceryEditModalBackdrop', 'clearWeekModalBackdrop'].forEach(id => {
      const el = document.getElementById(id);
      el?.addEventListener('click', (e) => {
        if (e.target === el) {
          el.classList.remove('open');
        }
      });
    });
  }

  // ==========================================================================
  // 11. App Initialization
  // ==========================================================================
  function init() {
    loadStorage();
    applyTheme(state.theme);
    attachEventListeners();

    // Check if initial plan is completely empty, offer friendly start
    const currentWeek = getCurrentWeekData();
    if (Object.keys(currentWeek.meals).length === 0) {
      // Keep fresh week ready
    }

    renderWeekNavigator();
    renderCalendar();
    renderInspirationPanel('suggestions');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
