import type { MotionValue } from 'framer-motion';
import './HeroSculpture.css';

interface HeroSculptureProps {
  scrollProgress?: MotionValue<number>;
}

export function HeroSculpture(_: HeroSculptureProps) {
  return <div className="hero-sculpture-view">
    <div className="sculpture-stage">
      <img
        className="sculpture-artwork"
        src={`${import.meta.env.BASE_URL}images/care-ecology.webp`}
        alt="Interconnected ivory, teal, and sage ceramic forms joined by a fine thread, representing care as a relationship."
        width="1254"
        height="1254"
        loading="eager"
        decoding="sync"
      />
    </div>
  </div>;
}
