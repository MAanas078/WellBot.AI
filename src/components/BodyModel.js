import { useGLTF, Html } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

function Model({ setError, onPartClick, selectedParts }) {
  const [model, setModel] = useState(null);
  const originalMaterials = useRef(new Map());

  const loadModel = useCallback(async () => {
    try {
      console.log('Attempting to fetch model from /assets/models/body-model.glb');
      const response = await fetch('/assets/models/body-model.glb', {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
      }

      const gltf = await useGLTF('/assets/models/body-model.glb');
      gltf.scene.scale.set(3, 3, 3);
      gltf.scene.rotation.set(0, 0, 0);

      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);

      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (!child.material) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
          }
          originalMaterials.current.set(child, child.material.clone());
        }
      });

      setModel(gltf);
    } catch (err) {
      console.error('Model loading error:', err);
      setError(`Failed to load model: ${err.message}`);
    }
  }, [setError]);

  useEffect(() => {
    loadModel();
  }, [loadModel]);

  useEffect(() => {
    if (!model) return;

    model.scene.traverse((child) => {
      if (child.isMesh) {
        const isSelected = selectedParts.includes(child.name);
        if (isSelected) {
          child.material = new THREE.MeshStandardMaterial({ color: 0x006400 });
        } else {
          const originalMaterial = originalMaterials.current.get(child);
          if (originalMaterial) {
            child.material = originalMaterial;
          }
        }
      }
    });
  }, [selectedParts, model]);

  const handleMeshClick = useCallback((e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.isMesh && mesh.name) {
      console.log('Part clicked:', mesh.name);
      onPartClick(mesh.name);
    }
  }, [onPartClick]);

  if (!model) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  return (
    <group>
      <primitive object={model.scene} onClick={handleMeshClick} />
    </group>
  );
}

export default function BodyModel({ onPartClick, selectedParts }) {
  const [error, setError] = useState(null);

  return (
    <Suspense fallback={<Html center>Loading model...</Html>}>
      {error ? (
        <Html center>
          <div style={{ color: 'red', maxWidth: '400px', background: 'white', padding: '20px', borderRadius: '8px' }}>
            <h3>Error Loading Model</h3>
            <p>{error}</p>
            <p>Check:</p>
            <ol>
              <li>File exists at public/assets/models/body-model.glb</li>
              <li>File is a valid GLB format (binary, not UTF-8)</li>
              <li>Server is running on localhost:3000</li>
              <li>No network issues (e.g., firewall, VPN)</li>
              <li>{'File size is reasonable (e.g., <10MB)'}</li>
            </ol>
          </div>
        </Html>
      ) : (
        <Model setError={setError} onPartClick={onPartClick} selectedParts={selectedParts} />
      )}
    </Suspense>
  );
}

useGLTF.preload('/assets/models/body-model.glb');