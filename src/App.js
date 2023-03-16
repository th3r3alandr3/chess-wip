import React, {useRef} from 'react'
import {Canvas, useLoader, useThree} from '@react-three/fiber'
import {OrbitControls, Environment, CameraControls} from '@react-three/drei'
import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import Chess from "./Chess.ts";
import {gsap} from "gsap";

const chess = new Chess();
const colorWhite = 0xff0000;
const colorBlack = 0x00ff00;
let activeColor = colorWhite;

const App = () => {
    const rookGLTF = useLoader(GLTFLoader, '/models/rook.glb');
    const knightGLTF = useLoader(GLTFLoader, '/models/knight.glb');
    const bishopGLTF = useLoader(GLTFLoader, '/models/bishop.glb');
    const queenGLTF = useLoader(GLTFLoader, '/models/queen.glb');
    const kingGLTF = useLoader(GLTFLoader, '/models/king.glb');
    const pawnGLTF = useLoader(GLTFLoader, '/models/pawn.glb');

    const rook = initGLTF(rookGLTF);
    const knight = initGLTF(knightGLTF);
    const bishop = initGLTF(bishopGLTF);
    const queen = initGLTF(queenGLTF);
    const king = initGLTF(kingGLTF);
    const pawn = initGLTF(pawnGLTF);

    const rookPositions = [[-3.5, 0, 3.5], [-3.5, 0, -3.5], [3.5, 0, 3.5], [3.5, 0, -3.5]]
    const rooks = [];
    rookPositions.forEach((position) => {
        const clone = rook.clone();
        clone.material = clone.material.clone();
        clone.material.color = new THREE.Color(position[2] > 0 ? colorWhite : colorBlack);
        rooks.push(<primitive object={clone} position={[position[0], position[1], position[2]]} onClick={pieceClick}/>);
    });

    const knightPositions = [[-2.5, 0, 3.5], [-2.5, 0, -3.5], [2.5, 0, 3.5], [2.5, 0, -3.5]]
    const knights = [];
    knightPositions.forEach((position) => {
        const clone = knight.clone();
        clone.material = clone.material.clone();
        clone.material.color = new THREE.Color(position[2] > 0 ? colorWhite : colorBlack);
        knights.push(<primitive object={clone} position={[position[0], position[1], position[2]]} onClick={pieceClick}/>);
    });

    const bishopPositions = [[-1.5, 0, 3.5], [-1.5, 0, -3.5], [1.5, 0, 3.5], [1.5, 0, -3.5]]
    const bishops = [];
    bishopPositions.forEach((position) => {
        const clone = bishop.clone();
        clone.material = clone.material.clone();
        clone.material.color = new THREE.Color(position[2] > 0 ? colorWhite : colorBlack);
        bishops.push(<primitive object={clone} position={[position[0], position[1], position[2]]} onClick={pieceClick}/>);
    });

    const queenPositions = [[-.5, 0, 3.5], [-.5, 0, -3.5]]
    const queens = [];
    queenPositions.forEach((position) => {
        const clone = queen.clone();
        clone.material = clone.material.clone();
        clone.material.color = new THREE.Color(position[2] > 0 ? colorWhite : colorBlack);
        queens.push(<primitive object={clone} position={[position[0], position[1], position[2]]} onClick={pieceClick}/>);
    });

    const kingPositions = [[.5, 0, 3.5], [.5, 0, -3.5]]
    const kings = [];
    kingPositions.forEach((position) => {
        const clone = king.clone();
        clone.material = clone.material.clone();
        clone.material.color = new THREE.Color(position[2] > 0 ? colorWhite : colorBlack);
        kings.push(<primitive object={clone} position={[position[0], position[1], position[2]]} onClick={pieceClick}/>);
    });

    const pawnPositions = [[-3.5, 0, 2.5], [-3.5, 0, -2.5], [3.5, 0, 2.5], [3.5, 0, -2.5], [-2.5, 0, -2.5], [-2.5, 0, 2.5], [2.5, 0, -2.5], [2.5, 0, 2.5], [-1.5, 0, -2.5], [-1.5, 0, 2.5], [1.5, 0, -2.5], [1.5, 0, 2.5], [-.5, 0, -2.5], [-.5, 0, 2.5], [.5, 0, -2.5], [.5, 0, 2.5]];
    const pawns = [];
    pawnPositions.forEach((position) => {
        const clone = pawn.clone();
        clone.material = clone.material.clone();
        clone.material.color = new THREE.Color(position[2] > 0 ? colorWhite : colorBlack);
        pawns.push(<primitive object={clone} position={[position[0], position[1], position[2]]} onClick={pieceClick}/>);
    });

    const boardTexture = useLoader(THREE.TextureLoader, 'textures/board.jpg')

    const controls = useRef();
    const fields = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 7; j >= 0; j--) {
            const name = 'field-' + String.fromCharCode(65 + i) + (8 - j);
            fields.push(
                <mesh position={[i - 3.5, .026, j - 3.5]} rotation-x={-Math.PI / 2} name={name} onClick={(event) => fieldClick(event, controls)}>
                    <planeGeometry args={[1, 1, 1]}/>
                    <meshBasicMaterial color={colorBlack} transparent opacity={0}/>
                </mesh>
            );
        }
    }

    return (
        <div style={{
            width: "100vw",
            height: "100vh"
        }}>
            <Canvas camera={{
                fov: 75,
                near: 0.1,
                far: 1000,
                position: [0, 5, 6]
            }}>
                <ambientLight intensity={0.5}/>
                <pointLight position={[-10, 0, -20]} color="white" intensity={1}/>
                <pointLight position={[0, -10, 0]} intensity={1}/>
                <Environment preset="studio"/>
                <CameraControls ref={controls}/>
                <mesh rotation-x={-Math.PI / 2}>
                    <boxGeometry args={[8.63, 8.63, .05]}/>
                    <meshBasicMaterial map={boardTexture}/>
                </mesh>
                {fields}
                {rooks}
                {knights}
                {bishops}
                {queens}
                {kings}
                {pawns}
            </Canvas>
        </div>
    );
}

const initGLTF = (gltf) => {
    const mesh = gltf.scene.children[0];
    mesh.scale.set(0.5, 0.5, 0.5);
    mesh.material.transparent = true;
    mesh.material.opacity = .8;
    mesh.material.receiveShadow = true;
    mesh.material.castShadow = true;
    mesh.material.shininess = 10;
    mesh.material.roughness = 0;
    mesh.material.metalness = .9;
    mesh.traverse((node) => {
        if (node.isLight) {
            this.state.punctualLights = false;
        } else if (node.isMesh) {
            node.material.depthWrite = !node.material.transparent;
        }
    });

    return mesh;
}

let selectedPiece = null;

function pieceClick(e) {
    if (e.eventObject.material.color.getHex('') !== activeColor) {
        return;
    }
    selectedPiece = e.eventObject;
    e.eventObject.parent.children.forEach((child) => {
        if (child.name.startsWith('field-')) {
            child.material.opacity = 0;
        }
    });
    // selectedPiece.material.color = new THREE.Color(0x0000ff);
    chess.getPossibleMoves(e.eventObject.position).forEach((move) => {
        const name = 'field-' + String.fromCharCode(65 + move.y) + (8 - move.x);
        const field = e.eventObject.parent.getObjectByName(name);
        console.log(e.eventObject.parent.children, 'children', name, field);
        field.material.opacity = .5;
        field.material.color = new THREE.Color(move.capture ? colorWhite : colorBlack);
        console.log(move, name);
    });
}

function fieldClick(e, controls) {
    console.log('click', e, controls);
    if (e.eventObject.material.opacity > 0) {
        const {
            newPosition,
            capture,
            castling
        } = chess.move(e.eventObject.position);
        if (newPosition) {
            const activePlayer = chess.getActivePlayer();
            if (capture) {
                const totalCaptured = chess.getCapturedPieces()[activePlayer === 'white' ? 'black' : 'white'].length;
                const capturedPiece = e.eventObject.parent.children.find((child) => child.position.x === newPosition.x && child.position.z === newPosition.z && !child.name.startsWith('field-'));
                const capturedPiecePosition = activeColor === colorWhite ? new THREE.Vector3(-5, 0, (-4.25 + totalCaptured * 0.5)) : new THREE.Vector3(5, 0, (4.25 - totalCaptured * 0.5));
                capturedPiece.position.copy(capturedPiecePosition);
            }
            if (castling) {
                const rook = e.eventObject.parent.children.find((child) => child.position.x === castling.x && child.position.z === castling.z && !child.name.startsWith('field-'));
                rook.position.copy(new THREE.Vector3(newPosition.x + (newPosition.x > 0 ? -1 : 1), 0, newPosition.z));
            }
            selectedPiece.position.copy(newPosition);
            activeColor = chess.getActivePlayer() === 'white' ? colorWhite : colorBlack;
            controls.current.rotateTo(chess.getActivePlayer() === 'white' ? 0 : Math.PI, Math.PI / 4, true);
        }
        e.eventObject.parent.children.forEach((child) => {
            if (child.name.startsWith('field-')) {
                child.material.opacity = 0;
            }
        });
    }
}

export default App;
