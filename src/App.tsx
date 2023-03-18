import {Canvas, useLoader} from '@react-three/fiber';
import React, {RefObject, useRef} from 'react';
import {Environment, CameraControls} from '@react-three/drei';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import Chess from './ts/Chess';
import ChessBoard from './components/ChessBoard';
import Pieces from './components/Pieces';
import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";
import {Material} from "three";

const chess = new Chess();
const colorWhite = 0xff0000;
const colorBlack = 0x00ff00;

let activeColor = colorWhite;
let selectedPiece = null as THREE.Object3D | null;

const App: React.FC = () => {
    const rookData = {
        gltf: useLoader(GLTFLoader, process.env.PUBLIC_URL + '/models/rook.glb'),
        positions: [[-3.5, 0, 3.5], [-3.5, 0, -3.5], [3.5, 0, 3.5], [3.5, 0, -3.5]] as [number, number, number][],
    };

    const knightData = {
        gltf: useLoader(GLTFLoader, process.env.PUBLIC_URL + '/models/knight.glb'),
        positions: [[-2.5, 0, 3.5], [-2.5, 0, -3.5], [2.5, 0, 3.5], [2.5, 0, -3.5]] as [number, number, number][],
    };

    const bishopData = {
        gltf: useLoader(GLTFLoader, process.env.PUBLIC_URL + '/models/bishop.glb'),
        positions: [[-1.5, 0, 3.5], [-1.5, 0, -3.5], [1.5, 0, 3.5], [1.5, 0, -3.5]] as [number, number, number][],
    };

    const queenData = {
        gltf: useLoader(GLTFLoader, process.env.PUBLIC_URL + '/models/queen.glb'),
        positions: [[-.5, 0, 3.5], [-.5, 0, -3.5]] as [number, number, number][],
    };

    const kingData = {
        gltf: useLoader(GLTFLoader, process.env.PUBLIC_URL + '/models/king.glb'),
        positions: [[.5, 0, 3.5], [.5, 0, -3.5]] as [number, number, number][],
    };

    const pawnData = {
        gltf: useLoader(GLTFLoader, process.env.PUBLIC_URL + '/models/pawn.glb'),
        positions: [[-3.5, 0, 2.5], [-3.5, 0, -2.5], [3.5, 0, 2.5], [3.5, 0, -2.5], [-2.5, 0, -2.5], [-2.5, 0, 2.5], [2.5, 0, -2.5], [2.5, 0, 2.5], [-1.5, 0, -2.5], [-1.5, 0, 2.5], [1.5, 0, -2.5], [1.5, 0, 2.5], [-.5, 0, -2.5], [-.5, 0, 2.5], [.5, 0, -2.5], [.5, 0, 2.5]] as [number, number, number][],
    };

    const boardTexture = useLoader(THREE.TextureLoader, process.env.PUBLIC_URL + '/textures/board.jpg')
    const controls = useRef<any>();

    return (
        <div style={{width: "100vw", height: "100vh"}}>
            <Canvas
                camera={{
                    fov: 75,
                    near: 0.1,
                    far: 1000,
                    position: [0, 5, 6],
                }}
            >
                <ambientLight intensity={0.5}/>
                <pointLight position={[-10, 0, -20]} color="white" intensity={1}/>
                <pointLight position={[0, -10, 0]} intensity={1}/>
                <Environment preset="studio"/>
                <CameraControls ref={controls}/>
                <mesh rotation-x={-Math.PI / 2}>
                    <boxGeometry args={[8.63, 8.63, 0.05]}/>
                    <meshBasicMaterial map={boardTexture}/>
                </mesh>
                <ChessBoard
                    fieldClick={fieldClick}
                    controls={controls}
                    colorBlack={colorBlack}
                />
                <Pieces
                    gltf={rookData.gltf}
                    pieceClick={pieceClick}
                    positions={rookData.positions}
                />
                <Pieces
                    gltf={knightData.gltf}
                    pieceClick={pieceClick}
                    positions={knightData.positions}
                />
                <Pieces
                   gltf={bishopData.gltf}
                    pieceClick={pieceClick}
                    positions={bishopData.positions}
                />
                <Pieces
                    gltf={queenData.gltf}
                    pieceClick={pieceClick}
                    positions={queenData.positions}
                />
                <Pieces
                    gltf={kingData.gltf}
                    pieceClick={pieceClick}
                    positions={kingData.positions}
                />
                <Pieces
                    gltf={pawnData.gltf}
                    pieceClick={pieceClick}
                    positions={pawnData.positions}
                />
            </Canvas>
        </div>
    );
};

function pieceClick(e: ThreeEvent<MouseEvent>) {
    if (!(e.eventObject instanceof THREE.Mesh)) {
        return;
    }
    if (e.eventObject.material.color.getHex('') !== activeColor) {
        return;
    }
    selectedPiece = e.eventObject;
    e.eventObject.parent?.children.forEach((child) => {
        if (child.name.startsWith('field-') && child instanceof THREE.Mesh) {
            child.material.opacity = 0;
        }
    });
    // selectedPiece.material.color = new THREE.Color(0x0000ff);
    chess.getPossibleMoves(e.eventObject.position).forEach((move) => {
        const name = 'field-' + String.fromCharCode(65 + move.y) + (8 - move.x);
        const field = e.eventObject.parent?.getObjectByName(name);
        console.log(e.eventObject.parent?.children, 'children', name, field);
        if (field instanceof THREE.Mesh) {
            field.material.opacity = .5;
            field.material.color = new THREE.Color(move.capture ? colorWhite : colorBlack);
        }
        console.log(move, name);
    });
}

function fieldClick(e: ThreeEvent<MouseEvent>, controls: RefObject<CameraControls>) {
    console.log('click', e, controls);
    const mesh = e.eventObject as THREE.Mesh;
    if (mesh.material instanceof Material && mesh.material.opacity > 0) {
        const {
            newPosition,
            capture,
            castling
        } = chess.move(mesh.position);
        if (newPosition) {
            const activePlayer = chess.getActivePlayer();
            if (capture) {
                const totalCaptured = chess.getCapturedPieces()[activePlayer === 'white' ? 'black' : 'white'].length;
                const capturedPiece = mesh.parent?.children.find((child) => child.position.x === newPosition.x && child.position.z === newPosition.z && !child.name.startsWith('field-'));
                const capturedPiecePosition = activeColor === colorWhite ? new THREE.Vector3(-5, 0, (-4.25 + totalCaptured * 0.5)) : new THREE.Vector3(5, 0, (4.25 - totalCaptured * 0.5));
                capturedPiece?.position.copy(capturedPiecePosition);
            }
            if (castling) {
                const rook = mesh.parent?.children.find((child) => child.position.x === castling.x && child.position.z === castling.z && !child.name.startsWith('field-'));
                rook?.position.copy(new THREE.Vector3(newPosition.x + (newPosition.x > 0 ? -1 : 1), 0, newPosition.z));
            }
            selectedPiece?.position.copy(newPosition);
            activeColor = chess.getActivePlayer() === 'white' ? colorWhite : colorBlack;
            controls.current?.rotateTo(chess.getActivePlayer() === 'white' ? 0 : Math.PI, Math.PI / 4, true);
        }
        mesh.parent?.children.forEach((child) => {
            if (child.name.startsWith('field-') && child instanceof THREE.Mesh) {
                child.material.opacity = 0;
            }
        });
    }
}

export default App;
