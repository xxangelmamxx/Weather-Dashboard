import React, { useEffect } from 'react';

const ParticlesBackground = () => {
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS("particles-js", {
        particles: {
          number: {
            value: 300,
            density: { enable: true, value_area: 800 }
          },
          color: { value: "#ffffff" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" }
          },
          opacity: { value: 0.5, random: false },
          size: { value: 3, random: true },
          line_linked: { enable: false },
          move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
          }
        },
        retina_detect: true
      });
    } else {
      console.error("particlesJS is not loaded. Make sure the script is included.");
    }
  }, []);

  return (
    <div
      id="particles-js"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  );
};

export default ParticlesBackground;
