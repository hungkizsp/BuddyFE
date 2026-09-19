import { Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../../shared/components/TopBar";
import SideBar from "../../../layouts/SideBar";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import useWorlds from "../hooks/useWorlds";
import useWorldProgress from "../hooks/useWorldProgress";
import FoodForestWorld3D from "../components/FoodForestWorld3D";
import { useAuthStore } from "../../auth/store/authStore";
import "../../home/pages/HomePage.css";
import "./AdventurePage.css";

function FoodForestScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={1.8} color="#fff2d1" />
      <directionalLight position={[-4, 3, 2]} intensity={0.6} color="#e0f2fe" />
      <FoodForestWorld3D position={[0, 0, 0]} />
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.4}
        scale={4}
        blur={2.5}
      />
    </>
  );
}

export default function AdventurePage() {
  const navigate = useNavigate();
  const { worlds, loading: worldsLoading } = useWorlds();
  const { childProfile } = useAuthStore();

  const foodForest = useMemo(
    () => worlds.find((w) => w.name?.toLowerCase() === "food forest" || "khu rừng thức ăn"),
    [worlds],
  );
  const { progress, loading: progressLoading } = useWorldProgress(
    foodForest?.id,
    childProfile?.id,
  );
  const loading = worldsLoading || progressLoading;
  const completion = progress?.completionPercentage ?? 0;

  return (
    <div className="home-root app-shell">
      <div className="noise-overlay" aria-hidden="true" />
      <SideBar />

      <main className="chat-main adv-hub-main">
        <TopBar theme="dark" />

        <div className="adv-hub-container">
          {/* Left Column: Info & CTA Card */}
          <div className="adv-hub-info">
            <div className="adv-hub-badge">
              <span> Thế Giới 1</span>
            </div>

            <h1 className="adv-hub-title">
              {foodForest?.name || "Khu Rừng Thức Ăn"}
            </h1>

            <p className="adv-hub-subtitle">
              {foodForest?.description ||
                "Khám phá và học từ vựng tiếng Anh qua các cuộc phiêu lưu kì thú!"}
            </p>

            {/* Progress Card */}
            <div className="adv-hub-progress-card">
              <div className="adv-hub-progress-header">
                <span className="adv-hub-progress-title">Tiến độ hoàn thành</span>
                <span className="adv-hub-progress-value">{completion}%</span>
              </div>
              <div className="adv-hub-progress-track">
                <div
                  className="adv-hub-progress-fill"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              className="adv-enter-btn-hero"
              onClick={() => navigate("/adventure/food-forest")}
            >
              <span>Vào Thế Giới Phiêu Lưu</span>
              <span className="adv-enter-btn-arrow">→</span>
            </button>
          </div>

          {/* Right Column: Interactive 3D World Globe */}
          <div className="adv-hub-visual">
            {loading ? (
              <div className="adv-loading">Đang tải thế giới...</div>
            ) : (
              <Canvas
                camera={{ position: [0, 0, 4.2], fov: 40 }}
                gl={{ alpha: true, antialias: true }}
                style={{ width: "100%", height: "100%" }}
              >
                <Suspense fallback={null}>
                  <FoodForestScene />
                </Suspense>
              </Canvas>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
