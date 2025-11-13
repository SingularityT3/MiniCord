import LetterGlitch from "@/components/LetterGlitch";
import Nav from "@/components/Nav";
import React from "react";

const Home: React.FC = () => {
  return (
    <main className="">
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <LetterGlitch
          glitchSpeed={10}
          centerVignette={true}
          outerVignette={true}
        />
      </div>
      <Nav />
    </main>
  );
};

export default Home;
