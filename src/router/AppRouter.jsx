import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import HomePage from "../features/home/pages/HomePage";

import AdventurePage from "../features/adventure/pages/AdventurePage";
import FoodForestPage from "../features/adventure/pages/FoodForestPage";
import BreakfastTroublePage from "../features/adventure/pages/BreakfastTroublePage";
import GameRoomPage from "../features/adventure/pages/GameRoomPage";
import GameLevelPage from "../features/adventure/pages/GameLevelPage";
import KitchenAdventurePage from "../features/adventure/pages/KitchenAdventurePage";
import NotificationPage from "../features/notification/pages/NotificationPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/notifications" element={<NotificationPage />} />

        {/* Adventure Hub */}
        <Route path="/adventure" element={<AdventurePage />} />
        
        {/* Food Forest World */}
        <Route path="/adventure/food-forest" element={<FoodForestPage />} />

        {/* Level 1 – Breakfast Trouble (intro + game room) */}
        <Route path="/adventure/food-forest/breakfast-trouble" element={<BreakfastTroublePage />} />
        <Route path="/adventure/food-forest/breakfast-trouble/play" element={<GameRoomPage />} />
        <Route path="/adventure/food-forest/kitchen-adventure" element={<KitchenAdventurePage />} />

        {/* Level 2 – Fruit Hunt (Apple Orchard) */}
        <Route path="/adventure/food-forest/fruit-hunt/play" element={<GameLevelPage levelId={2} />} />

        {/* Level 3 – Lunch Time (Food Court) */}
        <Route path="/adventure/food-forest/lunch-time/play" element={<GameLevelPage levelId={3} />} />

        {/* Level 4 – Buddy's Restaurant (Fine Dining) */}
        <Route path="/adventure/food-forest/buddys-restaurant/play" element={<GameLevelPage levelId={4} />} />
      </Routes>
    </BrowserRouter>
  );
}