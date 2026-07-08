import { Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../../shared/components/TopBar";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import useWorlds from "../hooks/useWorlds";
import useWorldProgress from "../hooks/useWorldProgress";
import FoodForestWorld3D from "../components/FoodForestWorld3D";
import "../styles/AdventurePage.css";

function FoodForestScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={1.8} color="#fff2d1" />
      <directionalLight position={[-4, 3, 2]} intensity={0.6} color="#e0f2fe" />
      <FoodForestWorld3D position={[0, 0.3, 0]} />
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

  const foodForest = useMemo(
    () => worlds.find((w) => w.name?.toLowerCase() === "food forest"),
    [worlds],
  );

  const { progress, loading: progressLoading } = useWorldProgress(
    foodForest?.id,
  );
  console.log("progresss{}", progress);
  const loading = worldsLoading || progressLoading;
  const completion = progress?.completionPercentage ?? 0;

  return (
    <div className="adv-page">
      <TopBar theme="dark" />

      <button className="adv-back-home" onClick={() => navigate('/home')}>
        ← Back to Home
      </button>

      <div className="adv-bg-glow" />

      <div className="adv-header">
        <h1 className="adv-title">{foodForest?.name || "Food Forest"}</h1>

        <p className="adv-subtitle">
          {foodForest?.description ||
            "Explore and learn English through fun adventures!"}
        </p>
      </div>

      <div className="adv-progress-section">
        <div className="adv-progress-bar-track">
          <div
            className="adv-progress-bar-fill"
            style={{ width: `${completion}%` }}
          />
        </div>

        <span className="adv-progress-label">{completion}%</span>
      </div>

      <div className="adv-model-section">
        {loading ? (
          <div className="adv-loading">Loading world...</div>
        ) : (
          <Canvas
            camera={{ position: [0, 0, 4], fov: 40 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <FoodForestScene />
            </Suspense>
          </Canvas>
        )}
      </div>

      <div className="adv-footer">
        <button
          className="adv-enter-btn"
          onClick={() => navigate("/adventure/food-forest")}
        >
          Enter World
        </button>
      </div>
    </div>
  );
}
