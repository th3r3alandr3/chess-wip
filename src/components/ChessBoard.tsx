import * as React from 'react';
import {RefObject} from "react";
import {CameraControls, Instance, Instances} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";
import * as THREE from 'three';

interface ChessBoardProps {
    fieldClick: (event: ThreeEvent<MouseEvent>, controls: RefObject<CameraControls>) => void;
    controls: RefObject<CameraControls>;
    colorBlack: number;
}

const ChessBoard: React.FC<ChessBoardProps> = ({fieldClick, controls, colorBlack}) => {
    const fields = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 7; j >= 0; j--) {
            const name = `field-${String.fromCharCode(65 + i)}${8 - j}`;
            const color = new THREE.Color(colorBlack);
            fields.push(
                <Instance
                    color={color}
                    position={[i - 3.5, -0.026, j - 3.5]}
                    rotation-x={-Math.PI / 2}
                    name={name}
                    onClick={(event: ThreeEvent<MouseEvent>) => fieldClick(event, controls)}
                />
            );
        }
    }

    return (
        <Instances
            name={'fieldsInstance'}
            limit={fields.length} // Optional: max amount of items (for calculating buffer size)
            range={fields.length} // Optional: draw-range
        >
            <planeGeometry args={[1, 1, 1]}/>
            <meshBasicMaterial transparent={true} opacity={.4}/>
            <>{fields}</>
        </Instances>
    );

};

export default ChessBoard;

