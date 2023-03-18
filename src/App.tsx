import {Canvas} from '@react-three/fiber';
import React, {Suspense, useRef} from 'react';
import {Environment, CameraControls, Loader} from '@react-three/drei';
import GUI from "./components/GUI";

const App: React.FC = () => {
    const controls = useRef<any>();
    return (
        <>
            <Canvas
                camera={{
                    fov: 75,
                    near: 0.1,
                    far: 1000,
                    position: [0, 5, 6],
                }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5}/>
                    <pointLight position={[-10, 0, -20]} color="white" intensity={1}/>
                    <pointLight position={[0, -10, 0]} intensity={1}/>
                    <Environment preset="studio"/>
                    <CameraControls ref={controls}/>
                    <GUI controls={controls}/>
                </Suspense>
            </Canvas>
            <Loader/>
        </>
    );
};

export default App;
