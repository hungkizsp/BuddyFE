/* =========================================================
   Game Levels Data
   Level 2 – Fruit Hunt  (🌳 Apple Orchard)     – Easy+
   Level 3 – Lunch Time  (🍔 Food Court)         – Medium
   Level 4 – Buddy's Restaurant (🍽️ Fine Dining) – Medium+
   ========================================================= */

export const GAME_LEVELS = {
  /* ─────────────────────────────────────────────────────────
     LEVEL 2  –  Apple Orchard  (Easy+)
  ───────────────────────────────────────────────────────── */
  2: {
    id: 2,
    theme: 'orchard',
    name: "Fruit Hunt",
    roomTitle: "🌳 Buddy's Apple Orchard",
    levelLabel: "Level 2 – Fruit Hunt",
    difficulty: 'Easy+',
    difficultyColor: '#22c55e',
    backRoute: '/adventure/food-forest',
    xpPerFood: 15,
    missionInstruction: '🍎 Pick the ripe fruits!',
    buddyInitialSpeech: "Let's pick fruits! Can you find the ripe ones for me? 🍎",
    buddyWinSpeech: "Delicious! Thank you, fruit expert! 🍓",
    hint: "Pick fruits that grow on trees or in the garden!",
    missions: [
      { id: 'm1', text: 'Find a tree fruit',   done: false },
      { id: 'm2', text: 'Find a berry',         done: false },
      { id: 'm3', text: 'Find a big fruit',     done: false },
    ],
    newWords: [
      { id: 'fruit',  word: 'Fruit',  type: 'n.',   color: '#f97316' },
      { id: 'pick',   word: 'Pick',   type: 'v.',   color: '#4ade80' },
      { id: 'garden', word: 'Garden', type: 'n.',   color: '#22d3ee' },
      { id: 'ripe',   word: 'Ripe',   type: 'adj.', color: '#a78bfa' },
    ],
    // isFood: true = correct click ✅ | false = distractor ❌
    // missionId: which mission this food item satisfies (first found wins)
    items: [
      { id: 'apple',       label: 'Apple',       emoji: '🍎', isFood: true,  pos: { left: '18%', top: '28%' }, missionId: 'm1' },
      { id: 'pear',        label: 'Pear',        emoji: '🍐', isFood: true,  pos: { left: '56%', top: '22%' }, missionId: 'm1' },
      { id: 'strawberry',  label: 'Strawberry',  emoji: '🍓', isFood: true,  pos: { left: '34%', top: '52%' }, missionId: 'm2' },
      { id: 'watermelon',  label: 'Watermelon',  emoji: '🍉', isFood: true,  pos: { left: '80%', top: '56%' }, missionId: 'm3' },
      { id: 'orange',      label: 'Orange',      emoji: '🍊', isFood: true,  pos: { left: '74%', top: '30%' }, missionId: 'm3' },
      // Distractors
      { id: 'leaf',        label: 'Leaf',        emoji: '🍃', isFood: false, pos: { left: '44%', top: '16%' } },
      { id: 'bird',        label: 'Bird',        emoji: '🐦', isFood: false, pos: { left: '11%', top: '14%' } },
      { id: 'butterfly',   label: 'Butterfly',   emoji: '🦋', isFood: false, pos: { left: '63%', top: '44%' } },
      { id: 'stone',       label: 'Stone',       emoji: '🪨', isFood: false, pos: { left: '26%', top: '64%' } },
      { id: 'wateringcan', label: 'Watering Can',emoji: '🪣', isFood: false, pos: { left: '88%', top: '44%' } },
    ],
  },

  /* ─────────────────────────────────────────────────────────
     LEVEL 3  –  Food Court  (Medium)
  ───────────────────────────────────────────────────────── */
  3: {
    id: 3,
    theme: 'restaurant',
    name: "Lunch Time",
    roomTitle: "🍔 Yummy Food Court",
    levelLabel: "Level 3 – Lunch Time",
    difficulty: 'Medium',
    difficultyColor: '#f59e0b',
    backRoute: '/adventure/food-forest',
    xpPerFood: 18,
    missionInstruction: '🍽️ Order the right food!',
    buddyInitialSpeech: "I'm at the food court! Help me choose what to eat for lunch 🍔",
    buddyWinSpeech: "Perfect order! This looks SO yummy! 😋",
    hint: "Order real food and drinks from the menu!",
    missions: [
      { id: 'm1', text: 'Order a hot meal',    done: false },
      { id: 'm2', text: 'Find something cold', done: false },
      { id: 'm3', text: 'Find a drink',        done: false },
    ],
    newWords: [
      { id: 'order',     word: 'Order',     type: 'v.',   color: '#f97316' },
      { id: 'menu',      word: 'Menu',      type: 'n.',   color: '#60a5fa' },
      { id: 'delicious', word: 'Delicious', type: 'adj.', color: '#4ade80' },
      { id: 'lunch',     word: 'Lunch',     type: 'n.',   color: '#f472b6' },
    ],
    items: [
      { id: 'burger',   label: 'Burger',    emoji: '🍔', isFood: true,  pos: { left: '20%', top: '36%' }, missionId: 'm1' },
      { id: 'pizza',    label: 'Pizza',     emoji: '🍕', isFood: true,  pos: { left: '48%', top: '30%' }, missionId: 'm1' },
      { id: 'noodles',  label: 'Noodles',   emoji: '🍜', isFood: true,  pos: { left: '68%', top: '38%' }, missionId: 'm1' },
      { id: 'icecream', label: 'Ice Cream', emoji: '🍦', isFood: true,  pos: { left: '36%', top: '54%' }, missionId: 'm2' },
      { id: 'juice',    label: 'Juice',     emoji: '🧃', isFood: true,  pos: { left: '84%', top: '33%' }, missionId: 'm3' },
      // Distractors (6 items = slightly harder)
      { id: 'menucard', label: 'Menu Card', emoji: '📋', isFood: false, pos: { left: '12%', top: '25%' } },
      { id: 'napkin',   label: 'Napkin',    emoji: '🫧', isFood: false, pos: { left: '60%', top: '54%' } },
      { id: 'vase',     label: 'Vase',      emoji: '🏺', isFood: false, pos: { left: '76%', top: '19%' } },
      { id: 'candle',   label: 'Candle',    emoji: '🕯️', isFood: false, pos: { left: '40%', top: '19%' } },
      { id: 'chair',    label: 'Chair',     emoji: '🪑', isFood: false, pos: { left: '88%', top: '52%' } },
      { id: 'tray',     label: 'Tray',      emoji: '🫙', isFood: false, pos: { left: '24%', top: '54%' } },
    ],
  },

  /* ─────────────────────────────────────────────────────────
     LEVEL 4  –  Fine Dining  (Medium+)
  ───────────────────────────────────────────────────────── */
  4: {
    id: 4,
    theme: 'fancy',
    name: "Buddy's Restaurant",
    roomTitle: "🍽️ Buddy's Fine Restaurant",
    levelLabel: "Level 4 – Buddy's Restaurant",
    difficulty: 'Medium+',
    difficultyColor: '#8b5cf6',
    backRoute: '/adventure/food-forest',
    xpPerFood: 20,
    missionInstruction: '👨‍🍳 Find the fine dining dishes!',
    buddyInitialSpeech: "Welcome to my restaurant! Help me pick the real food on the table 🍽️",
    buddyWinSpeech: "Excellent! You are a true food expert! 👨‍🍳",
    hint: "Find actual food dishes – cutlery and decorations are NOT food!",
    missions: [
      { id: 'm1', text: 'Find a main course', done: false },
      { id: 'm2', text: 'Find the dessert',   done: false },
      { id: 'm3', text: 'Find a drink',       done: false },
    ],
    newWords: [
      { id: 'fancy',  word: 'Fancy',  type: 'adj.', color: '#a78bfa' },
      { id: 'dinner', word: 'Dinner', type: 'n.',   color: '#f97316' },
      { id: 'waiter', word: 'Waiter', type: 'n.',   color: '#60a5fa' },
      { id: 'course', word: 'Course', type: 'n.',   color: '#4ade80' },
    ],
    items: [
      { id: 'steak',  label: 'Steak',      emoji: '🥩', isFood: true,  pos: { left: '28%', top: '38%' }, missionId: 'm1' },
      { id: 'soup',   label: 'Soup',       emoji: '🍲', isFood: true,  pos: { left: '54%', top: '32%' }, missionId: 'm1' },
      { id: 'salad',  label: 'Salad',      emoji: '🥗', isFood: true,  pos: { left: '16%', top: '50%' }, missionId: 'm1' },
      { id: 'cake',   label: 'Cake',       emoji: '🎂', isFood: true,  pos: { left: '76%', top: '40%' }, missionId: 'm2' },
      { id: 'wine',   label: 'Grape Juice',emoji: '🥂', isFood: true,  pos: { left: '44%', top: '55%' }, missionId: 'm3' },
      // Distractors (7 items = hardest – tricky fork/plate look food-related)
      { id: 'fork',   label: 'Fork',       emoji: '🍴', isFood: false, pos: { left: '20%', top: '26%' } },
      { id: 'plate',  label: 'Plate',      emoji: '🍽️', isFood: false, pos: { left: '66%', top: '22%' } },
      { id: 'candle3',label: 'Candle',     emoji: '🕯️', isFood: false, pos: { left: '48%', top: '20%' } },
      { id: 'rose',   label: 'Rose',       emoji: '🌹', isFood: false, pos: { left: '84%', top: '25%' } },
      { id: 'menu3',  label: 'Menu',       emoji: '📖', isFood: false, pos: { left: '9%',  top: '37%' } },
      { id: 'glass',  label: 'Empty Glass',emoji: '🫗', isFood: false, pos: { left: '62%', top: '53%' } },
      { id: 'napkin3',label: 'Napkin',     emoji: '🎀', isFood: false, pos: { left: '36%', top: '24%' } },
    ],
  },
}
