import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../features/auth/store/authStore";
import { stopBackgroundMusic } from "../features/adventure/components/BackgroundMusic";

import RequireAuth, { GuestOnlyRoute } from "./AuthGuard";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import LandingPage from "../features/home/pages/LandingPage";
import HomePage from "../features/home/pages/HomePage";

import AdventurePage from "../features/adventure/pages/AdventurePage";
import FoodForestPage from "../features/adventure/pages/FoodForestPage";
import KitchenAdventurePage from "../features/adventure/pages/KitchenAdventurePage";
import SupermarketShoppingPage from "../features/adventure/pages/SupermarketShoppingPage";
import FamilyRestaurantPage from "../features/adventure/pages/FamilyRestaurantPage";
import NotificationPage from "../features/notification/pages/NotificationPage";
import CharacterCreatorPage from "../features/home/pages/CharacterCreatorPage";
import StudyHubPage from "../features/study/pages/StudyHubPage";
import FlashcardModePage from "../features/study/pages/FlashcardModePage";
import LearnModePage from "../features/study/pages/LearnModePage";
import TestModePage from "../features/study/pages/TestModePage";
import MatchModePage from "../features/study/pages/MatchModePage";

function GlobalMusicController() {
  const location = useLocation();
  useEffect(() => {
    // Only allow music to keep playing if we are DEEP inside /adventure/...
    // If we are at exactly /adventure, or outside /adventure entirely, stop the music.
    if (location.pathname === '/adventure' || location.pathname === '/adventure/' || !location.pathname.startsWith('/adventure')) {
      stopBackgroundMusic();
    }
  }, [location.pathname]);
  return null;
}

export default function AppRouter() {
  const loadCurrentUser = useAuthStore((s) => s.loadCurrentUser);

  // Attempt to restore any existing session on boot.
  // On success this also loads the child profile via loadCurrentUser.
  useEffect(() => {
    loadCurrentUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <GlobalMusicController />
      <Routes>
        {/* Redirect root to the new landing page */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Guest-only routes */}
        <Route
          path="/landing"
          element={
            <GuestOnlyRoute>
              <LandingPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnlyRoute>
              <SignupPage />
            </GuestOnlyRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/notifications"
          element={
            <RequireAuth>
              <NotificationPage />
            </RequireAuth>
          }
        />
        <Route
          path="/character-creator"
          element={
            <RequireAuth>
              <CharacterCreatorPage />
            </RequireAuth>
          }
        />

        {/* Study Mode Routes */}
        <Route
          path="/study"
          element={
            <RequireAuth>
              <StudyHubPage />
            </RequireAuth>
          }
        />
        <Route
          path="/study/:categoryId/flashcards"
          element={
            <RequireAuth>
              <FlashcardModePage />
            </RequireAuth>
          }
        />
        <Route
          path="/study/:categoryId/learn"
          element={
            <RequireAuth>
              <LearnModePage />
            </RequireAuth>
          }
        />
        <Route
          path="/study/:categoryId/test"
          element={
            <RequireAuth>
              <TestModePage />
            </RequireAuth>
          }
        />
        <Route
          path="/study/:categoryId/match"
          element={
            <RequireAuth>
              <MatchModePage />
            </RequireAuth>
          }
        />

        {/* Adventure Hub */}
        <Route
          path="/adventure"
          element={
            <RequireAuth>
              <AdventurePage />
            </RequireAuth>
          }
        />
        {/* Food Forest World */}
        <Route
          path="/adventure/food-forest"
          element={
            <RequireAuth>
              <FoodForestPage />
            </RequireAuth>
          }
        />
        <Route
          path="/adventure/foodforest"
          element={
            <RequireAuth>
              <FoodForestPage />
            </RequireAuth>
          }
        />
        <Route
          path="/food-forest"
          element={
            <RequireAuth>
              <FoodForestPage />
            </RequireAuth>
          }
        />
        <Route
          path="/foodforest"
          element={
            <RequireAuth>
              <FoodForestPage />
            </RequireAuth>
          }
        />

        {/* Level 1 – Breakfast Trouble / Kitchen Adventure */}
        <Route
          path="/adventure/food-forest/breakfast-trouble"
          element={
            <RequireAuth>
              <KitchenAdventurePage />
            </RequireAuth>
          }
        />
        <Route
          path="/adventure/food-forest/kitchen-adventure"
          element={
            <RequireAuth>
              <KitchenAdventurePage />
            </RequireAuth>
          }
        />
        <Route
          path="/adventure/kitchen-adventure"
          element={
            <RequireAuth>
              <KitchenAdventurePage />
            </RequireAuth>
          }
        />
        <Route
          path="/adventure/kitchenadventure"
          element={
            <RequireAuth>
              <KitchenAdventurePage />
            </RequireAuth>
          }
        />
        <Route
          path="/kitchen-adventure"
          element={
            <RequireAuth>
              <KitchenAdventurePage />
            </RequireAuth>
          }
        />
        <Route
          path="/kitchenadventure"
          element={
            <RequireAuth>
              <KitchenAdventurePage />
            </RequireAuth>
          }
        />

        {/* Level 2 – Supermarket Shopping */}
        <Route
          path="/adventure/food-forest/supermarket-shopping"
          element={
            <RequireAuth>
              <SupermarketShoppingPage />
            </RequireAuth>
          }
        />

        {/* Level 3 – Family Restaurant */}
        <Route
          path="/adventure/food-forest/family-restaurant"
          element={
            <RequireAuth>
              <FamilyRestaurantPage />
            </RequireAuth>
          }
        />
        <Route
          path="/adventure/family-restaurant"
          element={
            <RequireAuth>
              <FamilyRestaurantPage />
            </RequireAuth>
          }
        />
        <Route
          path="/adventure/familyrestaurant"
          element={
            <RequireAuth>
              <FamilyRestaurantPage />
            </RequireAuth>
          }
        />
        <Route
          path="/family-restaurant"
          element={
            <RequireAuth>
              <FamilyRestaurantPage />
            </RequireAuth>
          }
        />
        <Route
          path="/familyrestaurant"
          element={
            <RequireAuth>
              <FamilyRestaurantPage />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
