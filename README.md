# 🥗 WeeklyPlate – Weekly Meal Planner

**WeeklyPlate** is a modern, responsive, and lightweight web application designed to help you organize a full 7-day meal plan, balance your nutrition, and auto-compile your weekly grocery checklist without needing any backend server, API keys, build tools, or frameworks.

Built entirely with clean, semantic **HTML5**, modern **CSS3** (with light/dark mode support and print stylesheets), and modular **Vanilla JavaScript (ES6+)**.

---

## 🌟 Key Features

### 1. 📅 7-Day Interactive Meal Calendar
* **Flexible Meal Slots**: Plan **Breakfast**, **Lunch**, **Dinner**, and **Snacks** for Monday through Sunday.
* **Detailed Meal Editor**: Add meal names, ingredients with quantities, category tags, cooking notes, and mark favorite meals.
* **Leftover Carry-Over**: One-click duplication to carry dinner forward to tomorrow's lunch as leftovers (without adding duplicate grocery items).
* **Empty Slot Suggestions**: Click the **"💡 Idea"** button on any empty slot to instantly get a curated recipe idea tailored to that slot.

### 2. 🗓️ Previous & Next Week Navigation
* Navigate smoothly between weeks using **← Prev Week** and **Next Week →** buttons, or jump back to **Current Week**.
* **Isolated Multi-Week Storage**: Switching weeks never overwrites other weeks—each week preserves its own meal plan and grocery checks independently.
* **Today Highlighting**: Automatically detects and highlights today with a prominent badge when viewing the current week.

### 3. 🛒 Smart Categorized Grocery Checklist
* **Automatic Compilation**: Auto-generates your grocery checklist directly from your scheduled meals.
* **Smart Quantity Aggregation**: Combines duplicate ingredients and adds quantities together (e.g., `2 cups Rice` + `1 cup Rice` → `3 cups Rice`).
* **Department Categorization**: Organizes items into clean grocery aisles:
  * 🥦 **Vegetables**
  * 🍎 **Fruits**
  * 🧀 **Dairy & Eggs**
  * 🍗 **Meat & Protein**
  * 🍞 **Grains & Bakery**
  * 🧂 **Pantry & Spices**
  * 📦 **Other**
* **Checklist Management**: Check off items as you shop in-store, add custom items with categories, edit custom items, clean completed items (**Clean Done**), or uncheck all (**Reset Checks**).
* **One-Click Clipboard Copy**: Copies your organized shopping list categorized with clean bullet points.

### 4. 🔍 Live Search & Category Filters
* **Instant Search**: Find meals by name or ingredient in real-time. Matching cards are highlighted while non-matching cards are dimmed.
* **Dietary Filter Pills**: Filter your week by:
  * ⚡ **Quick (<30m)**
  * 🌱 **Vegetarian**
  * 💪 **High Protein**
  * ❤️ **Family Favorites**
  * 🍱 **Leftovers**
  * ★ **Saved Favorites**

### 5. 📊 Nutrition & Progress Tracker
* Tracks main meals planned (**out of 21** for Breakfast, Lunch, and Dinner).
* Real-time percentage indicator and animated progress bar.
* Friendly, encouraging messages that celebrate when your week is 100% planned.

### 6. 🌓 Light & Dark Mode
* One-click theme toggle in the header.
* Fully styled dark palette optimized for contrast and readability.
* Automatically saved in `localStorage`.

### 7. 🖨️ Fridge-Ready Print Layout
* Clean `@media print` stylesheet formatted for printing a one-page weekly meal planner and grocery checklist to stick on your refrigerator.

---

## 📁 File Structure

```text
meal_planner/
├── index.html          # Semantic HTML markup, modals, and accessible structure
├── css/
│   └── style.css       # Design system, CSS variables, dark mode, responsive & print styles
├── js/
│   └── script.js       # Core logic: week dates, ingredient combiner, local storage & UI rendering
└── README.md           # Documentation and setup guide
```

---

## 🚀 How to Run & Test Locally

No installation, build tools, or packages (`npm`, `yarn`, `pip`, etc.) are needed. You can test it locally in several ways:

### Option 1: Open Directly in Any Browser
1. In Finder or File Explorer, double-click `index.html`.
2. The web app will launch immediately with full functionality.

### Option 2: Using VS Code Live Server (Recommended)
1. Open the `meal_planner` folder in **Visual Studio Code**.
2. If you have the **Live Server** extension installed:
   * Right-click `index.html` in the explorer sidebar.
   * Select **"Open with Live Server"** (or click **Go Live** on the bottom status bar).
3. Live Server will serve the page at `http://127.0.0.1:5500/index.html` with instant live-reload upon saving.

### Option 3: Using VS Code Built-In Terminal (Python)
If you prefer a local HTTP server:
```bash
# In the meal_planner directory:
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 🧪 Testing Checklist

- [x] **Week Navigation**: Click `Next Week` and `Prev Week`; plan meals in both and verify they don't overwrite each other.
- [x] **Ingredient Combiner**: Add `2 cups Rice` on Monday dinner and `1 cup Rice` on Wednesday lunch; verify the grocery list combines them into `3 cups Rice`.
- [x] **Search & Filters**: Type in the search bar or click "🌱 Vegetarian" to see matching slots highlighted.
- [x] **Theme Toggle**: Click the moon/sun icon in the header to toggle light and dark modes.
- [x] **Sample Plan**: Click **Sample Plan** to populate a full balanced week with ingredients.
- [x] **Print**: Click **Print** to preview the clean printable schedule layout.
- [x] **Responsive Layout**: Resize your browser window or inspect in mobile emulation to test the single-day tab view.
