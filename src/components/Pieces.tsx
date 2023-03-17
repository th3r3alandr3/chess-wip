import * as THREE from 'three';
import * as React from 'react';
import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            primitive: React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & THREE.Object3D,
                HTMLElement
            >;
        }
    }
}

type PieceProps = {
    gltf: GLTF;
    positions: Array<[number, number, number]>;
    colorWhite: number;
    colorBlack: number;
    pieceClick: (event: ThreeEvent<MouseEvent>) => void;
};

const Pieces: React.FC<PieceProps> = ({gltf, positions, colorWhite, colorBlack, pieceClick}) => {
    const pieces = [] as JSX.Element[]

    const piece = initGLTF(gltf);

    positions.forEach((position) => {
        const clone = piece.clone() as THREE.Mesh;
        //@ts-ignore
        clone.material = clone.material.clone() as THREE.MeshStandardMaterial;
        //@ts-ignore
        clone.material.color = new THREE.Color(position[2] > 0 ? colorWhite : colorBlack);
        //@ts-ignore
        pieces.push(<primitive object={clone} position={[position[0], position[1], position[2]]} onClick={pieceClick}/>);
    });

    return <>{pieces}</>;
};

const initGLTF = (gltf: GLTF) => {
    const mesh = gltf.scene.children[0] as THREE.Mesh;
    mesh.scale.set(0.5, 0.5, 0.5);
    if(mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.transparent = true;
        mesh.material.opacity = .8;
        mesh.material.roughness = 0;
        mesh.material.metalness = .9;
    }
    mesh.traverse((node: any) => {
        if (node.isLight) {
            node.state.punctualLights = false;
        } else if (node.isMesh) {
            node.material.depthWrite = !node.material.transparent;
        }
    });

    return mesh;
}

export default Pieces;
