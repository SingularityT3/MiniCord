import Nav from "@/components/Nav";
import PixelBlast from "@/components/PixelBlast";
import React from "react";

const Home: React.FC = () => {
  return (
    <main>
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#B19EEF"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>
      <Nav />
    </main>
  );
};

export default Home;
