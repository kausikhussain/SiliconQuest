import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  interactive?: boolean;
  theme?: 'dark' | 'light';
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ interactive = true, theme = 'dark' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isLight = theme === 'light';

    // 1. Scene & Camera
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const isSmallScreen = width < 768;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isLight ? 0xf8f9fc : 0x060709, isLight ? 0.025 : 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, isSmallScreen ? 8.8 : 7.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.4 : 1.2;

    containerRef.current.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(isLight ? 0xffffff : 0x1a2234, isLight ? 1.6 : 1.2);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(isLight ? 0x0284c7 : 0x00f2fe, isLight ? 4.0 : 3.5, 14);
    cyanPointLight.position.set(0, 0, 0);
    scene.add(cyanPointLight);

    const topKeyLight = new THREE.DirectionalLight(0xffffff, isLight ? 3.0 : 2.5);
    topKeyLight.position.set(5, 8, 5);
    scene.add(topKeyLight);

    const indigoRimLight = new THREE.DirectionalLight(isLight ? 0x4f46e5 : 0x6366f1, isLight ? 2.2 : 2.8);
    indigoRimLight.position.set(-6, -4, -4);
    scene.add(indigoRimLight);

    // 4. Central 3D Geometry: Futuristic Titanium Knowledge Hexacube
    const centralGroup = new THREE.Group();
    scene.add(centralGroup);

    // Outer Brushed Metallic Cube Cage
    const outerBoxGeo = new THREE.BoxGeometry(2.2, 2.2, 2.2);
    const edgesGeo = new THREE.EdgesGeometry(outerBoxGeo);
    const lineMat = new THREE.LineBasicMaterial({
      color: isLight ? 0x0284c7 : 0x00f2fe,
      transparent: true,
      opacity: isLight ? 0.85 : 0.7,
      linewidth: 1.5
    });
    const wireframeCube = new THREE.LineSegments(edgesGeo, lineMat);
    centralGroup.add(wireframeCube);

    // Inner Metallic Brushed Core
    const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: isLight ? 0xe2e8f0 : 0x111622,
      emissive: isLight ? 0x0284c7 : 0x00283a,
      emissiveIntensity: isLight ? 0.15 : 0.4,
      roughness: isLight ? 0.2 : 0.15,
      metalness: isLight ? 0.6 : 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    centralGroup.add(innerCore);

    // Nested Glowing Neural Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(0.7, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: isLight ? 0x0284c7 : 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.6 : 0.45
    });
    const neuralSphere = new THREE.Mesh(sphereGeo, sphereMat);
    centralGroup.add(neuralSphere);

    // Orbital Mechanical Ring Shards
    const shardCount = 8;
    const shardGroup = new THREE.Group();
    const shardGeo = new THREE.BoxGeometry(0.12, 0.6, 0.04);
    const shardMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x64748b : 0x94a3b8,
      metalness: 0.8,
      roughness: 0.2
    });

    const shards: THREE.Mesh[] = [];
    for (let i = 0; i < shardCount; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      const angle = (i / shardCount) * Math.PI * 2;
      const radius = 2.4;
      shard.position.set(Math.cos(angle) * radius, Math.sin(angle) * 0.4, Math.sin(angle) * radius);
      shard.rotation.x = Math.random() * Math.PI;
      shard.rotation.y = angle;
      shard.rotation.z = Math.PI / 6;
      shardGroup.add(shard);
      shards.push(shard);
    }
    centralGroup.add(shardGroup);

    // 5. Constellation Knowledge Nodes Particle System (adjusted count for performance)
    const particleCount = isSmallScreen ? 90 : 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const r = 3.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.004,
        y: (Math.random() - 0.5) * 0.004,
        z: (Math.random() - 0.5) * 0.004
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: isLight ? 0x0284c7 : 0x00f2fe,
      size: isLight ? 0.08 : 0.07,
      transparent: true,
      opacity: isLight ? 0.75 : 0.65,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Dynamic Connecting Constellation Lines
    const maxLineConnections = isSmallScreen ? 120 : 220;
    const linePositions = new Float32Array(maxLineConnections * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const constellationLinesMat = new THREE.LineBasicMaterial({
      color: isLight ? 0x0284c7 : 0x00f2fe,
      transparent: true,
      opacity: isLight ? 0.25 : 0.18,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending
    });

    const constellationLines = new THREE.LineSegments(lineGeo, constellationLinesMat);
    scene.add(constellationLines);

    // 7. Mouse & Touch Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      const touch = e.touches[0];
      targetMouseX = (touch.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (touch.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.position.z = w < 768 ? 8.8 : 7.5;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse & touch interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Group Rotation
      centralGroup.rotation.x = elapsedTime * 0.25 + mouseY * 0.4;
      centralGroup.rotation.y = elapsedTime * 0.35 + mouseX * 0.5;
      centralGroup.rotation.z = Math.sin(elapsedTime * 0.2) * 0.1;

      shardGroup.rotation.y = -elapsedTime * 0.45;
      neuralSphere.rotation.y = elapsedTime * 0.6;
      neuralSphere.rotation.x = -elapsedTime * 0.3;

      // Pulse neural sphere
      const scale = 1 + Math.sin(elapsedTime * 2.5) * 0.06;
      neuralSphere.scale.set(scale, scale, scale);

      // Particle Constellation Animation
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleVelocities[i].x;
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3 + 2] += particleVelocities[i].z;

        // Bounding bounce
        if (Math.abs(positions[i * 3]) > 7) particleVelocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 5) particleVelocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 7) particleVelocities[i].z *= -1;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Update Constellation Lines
      let lineVertexIndex = 0;
      const posArray = lineGeo.attributes.position.array as Float32Array;
      const maxDistance = 2.2;

      for (let i = 0; i < particleCount && lineVertexIndex < maxLineConnections * 6; i++) {
        for (let j = i + 1; j < particleCount && lineVertexIndex < maxLineConnections * 6; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            posArray[lineVertexIndex++] = positions[i * 3];
            posArray[lineVertexIndex++] = positions[i * 3 + 1];
            posArray[lineVertexIndex++] = positions[i * 3 + 2];

            posArray[lineVertexIndex++] = positions[j * 3];
            posArray[lineVertexIndex++] = positions[j * 3 + 1];
            posArray[lineVertexIndex++] = positions[j * 3 + 2];
          }
        }
      }

      lineGeo.setDrawRange(0, lineVertexIndex / 3);
      lineGeo.attributes.position.needsUpdate = true;

      // Gentle Camera Float
      camera.position.x = Math.sin(elapsedTime * 0.1) * 0.3;
      camera.position.y = Math.cos(elapsedTime * 0.12) * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      // Dispose Three.js objects
      outerBoxGeo.dispose();
      edgesGeo.dispose();
      lineMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      shardGeo.dispose();
      shardMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      constellationLinesMat.dispose();
      renderer.dispose();
    };
  }, [interactive, theme]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
      aria-hidden="true"
    />
  );
};
