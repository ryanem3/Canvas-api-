
/* NEON INFINITY TUNNEL
   HTML5 Canvas Generative Art
   Mouse Interaction + Glowing Particles
*/

// --------------------------------
// CANVAS SETUP
// --------------------------------

const canvas = document.getElementById("displayCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

// Animation variables
let rotation = 0;
let travel = 0;
let patternSeed = Math.random() * 100;
let colorIndex = 0;

// Mouse position
let mouseX = 0;
let mouseY = 0;

// Smooth mouse movement
let smoothX = 0;
let smoothY = 0;

// --------------------------------
// COLOR COMBINATIONS
// --------------------------------

const colorThemes = [
  {
    name: "Pink & Teal",
    triangle: "#ff008c",
    tunnel: "#00ffcc",
    glow: 30
  },
  {
    name: "Red & White",
    triangle: "#ffffff",
    tunnel: "#ff2020",
    glow: 15
  },
  {
    name: "Orange & Green",
    triangle: "#ff8900",
    tunnel: "#39ff14",
    glow: 15
  }
];

// --------------------------------
// MOUSE INTERACTION
// --------------------------------

canvas.addEventListener("mousemove", function(event) {
  const rect = canvas.getBoundingClientRect();

  // Convert mouse position to values from -1 to 1
  mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouseY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
});

// Return to the center when mouse leaves
canvas.addEventListener("mouseleave", function() {
  mouseX = 0;
  mouseY = 0;
});

// --------------------------------
// GLOWING PARTICLES
// --------------------------------

const particles = [];
const numberOfParticles = 120;

// Create particles with random positions
function createParticles() {
  particles.length = 0;

  for (let i = 0; i < numberOfParticles; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      depth: Math.random(),
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.003 + 0.001
    });
  }
}

// Draw and animate particles
function drawParticles(color) {
  ctx.save();

  for (let particle of particles) {
    // Move outward from the center
    particle.depth += particle.speed;

    if (particle.depth >= 1) {
      particle.depth = 0;
      particle.angle = Math.random() * Math.PI * 2;
    }

    const distance = Math.pow(particle.depth, 1.5) * 650;

    const x =
      width / 2 +
      smoothX * 35 +
      Math.cos(particle.angle) * distance;

    const y =
      height / 2 +
      smoothY * 25 +
      Math.sin(particle.angle) * distance;

    const radius = particle.size * (0.5 + particle.depth * 1.5);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.2 + particle.depth * 0.8;
    ctx.shadowBlur = 12;
    ctx.shadowColor = color;

    ctx.fill();
  }

  ctx.restore();
}

// --------------------------------
// CONVERT HEX COLORS TO RGB
// --------------------------------

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `${r}, ${g}, ${b}`;
}

// --------------------------------
// DRAW NEON TRIANGLES
// --------------------------------

function drawTriangle(size, angle, color, glow) {
  ctx.save();

  // Move center based on mouse position
  ctx.translate(
    width / 2 + smoothX * 35,
    height / 2 + smoothY * 25
  );

  ctx.rotate(angle);

  ctx.beginPath();

  for (let i = 0; i < 3; i++) {
    const theta = (i * Math.PI * 2) / 3 - Math.PI / 2;

    const x = Math.cos(theta) * size;
    const y = Math.sin(theta) * size;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowBlur = glow;
  ctx.shadowColor = color;

  ctx.stroke();
  ctx.restore();
}

// --------------------------------
// DRAW GEOMETRIC TUNNEL
// --------------------------------

function drawTunnel(color, glow) {
  const numberOfLines = 180;

  const centerX = width / 2 + smoothX * 35;
  const centerY = height / 2 + smoothY * 25;

  const rgb = hexToRGB(color);

  ctx.save();

  for (let i = 0; i < numberOfLines; i++) {
    const depth = i / numberOfLines;

    const angle =
      rotation * 0.4 +
      depth * 15 +
      patternSeed * 0.05 +
      smoothX * 0.5;

    const radius = 10 + depth * 600;

    const nextAngle = angle + 1.8;
    const nextRadius = radius + 90;

    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;

    const x2 = centerX + Math.cos(nextAngle) * nextRadius;
    const y2 = centerY + Math.sin(nextAngle) * nextRadius;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle =
      `rgba(${rgb}, ${0.15 + depth * 0.65})`;

    ctx.lineWidth = 0.8;
    ctx.shadowBlur = glow * 0.4;
    ctx.shadowColor = color;

    ctx.stroke();
  }

  ctx.restore();
}

// --------------------------------
// ANIMATION LOOP
// --------------------------------

function animate() {
  // Clear canvas
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // Smooth mouse tracking
  smoothX += (mouseX - smoothX) * 0.05;
  smoothY += (mouseY - smoothY) * 0.05;

  // Current color theme
  const theme = colorThemes[colorIndex];

  // Draw the geometric tunnel
  drawTunnel(theme.tunnel, theme.glow);

  // Draw glowing particles
  drawParticles(theme.tunnel);

  // Draw traveling triangles
  const numberOfTriangles = 18;

  for (let i = 0; i < numberOfTriangles; i++) {
    const depth =
      ((i / numberOfTriangles) + travel) % 1;

    const size = 15 + Math.pow(depth, 1.8) * 720;

    // Pulsing size effect
    const pulse =
      1 + Math.sin(rotation * 2 + i * 0.4) * 0.08;

    const finalSize = size * pulse;

    // Mouse changes triangle rotation
    const angle =
      rotation +
      i * 0.12 +
      patternSeed * 0.1 +
      smoothX * 0.5;

    const opacity = 0.2 + depth * 0.8;

    ctx.save();
    ctx.globalAlpha = opacity;

    drawTriangle(
      finalSize,
      angle,
      theme.triangle,
      theme.glow
    );

    ctx.restore();
  }

  // Rotate the artwork
  rotation += 0.02;

  // Move triangles toward viewer
  travel += 0.002;

  if (travel >= 1) {
    travel -= 1;
  }

  // Change colors after full rotation
  if (rotation >= Math.PI * 2) {
    rotation -= Math.PI * 2;

    colorIndex =
      (colorIndex + 1) % colorThemes.length;

    console.log(
      "New color theme:",
      colorThemes[colorIndex].name
    );
  }

  requestAnimationFrame(animate);
}

// --------------------------------
// REGENERATE BUTTON
// --------------------------------

document.getElementById("btnRegenerate")
  .addEventListener("click", function() {
    patternSeed = Math.random() * 100;
    createParticles();
  });

// --------------------------------
// EXPORT IMAGE BUTTON
// --------------------------------

document.getElementById("btnExport")
  .addEventListener("click", function() {
    const link = document.createElement("a");

    link.download = "neon-infinity-tunnel.png";
    link.href = canvas.toDataURL("image/png");

    link.click();
  });

// --------------------------------
// START THE ANIMATION
// --------------------------------

createParticles();
animate();
