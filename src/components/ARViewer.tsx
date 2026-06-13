import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text } from '@react-three/drei';
import Webcam from 'react-webcam';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import type { PlantModel } from '../types';

function GLTFModel({ url, color }: { url: string, color: string }) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setError(false);
    setModel(null);
    
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        if (active) setModel(gltf.scene);
      },
      undefined,
      (err) => {
        console.warn("Model GLB gagal dimuat:", err);
        if (active) setError(true);
      }
    );
    return () => { active = false; };
  }, [url]);

  if (error) {
    return (
      <group position={[0, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial color={color} wireframe />
        </mesh>
        <Text position={[0, 0.8, 0]} fontSize={0.15} color="white" outlineWidth={0.02} outlineColor="red">
          FORMAT GLB TIDAK VALID
        </Text>
      </group>
    );
  }

  if (!model) {
    return (
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color={color} wireframe />
      </mesh>
    );
  }

  return (
    <group position={[0, 0, 0]}>
      <primitive object={model} />
    </group>
  );
}

function Plant3D({ plant }: { plant: PlantModel }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005; // Make rotation slower and prevent bobbing
    }
  });

  return (
    <group ref={group}>
      <GLTFModel url={plant.modelUrl} color={plant.color} />
    </group>
  );
}

export function ARViewer({ plant, onPick }: { plant: PlantModel, onPick: () => void }) {
  return (
    <div className="relative w-full h-full bg-black">
      <Webcam
        audio={false}
        videoConstraints={{ facingMode: "environment" }}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full">
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={1.5} />
          <Environment preset="city" />
          <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
          <Plant3D plant={plant} />
          <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={5} blur={2} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2} 
          />
        </Canvas>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10 px-4">
        <button
          onClick={onPick}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition active:scale-95 text-lg w-full max-w-sm"
        >
          Petik Tanaman
        </button>
      </div>
      
      <div className="absolute top-8 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="bg-black/50 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm">
          Arahkan kamera ke area yang terang
        </div>
      </div>
    </div>
  );
}
