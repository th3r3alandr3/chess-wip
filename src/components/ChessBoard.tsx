import * as React from 'react';
import {RefObject} from "react";
import {CameraControls} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";

interface ChessBoardProps {
    fieldClick: (event: ThreeEvent<MouseEvent>, controls: RefObject<CameraControls>) => void;
    controls: RefObject<CameraControls>;
    colorBlack: number;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ fieldClick, controls, colorBlack }) => {
    const fields = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 7; j >= 0; j--) {
            const name = `field-${String.fromCharCode(65 + i)}${8 - j}`;
            fields.push(
                <mesh
                    position={[i - 3.5, 0.026, j - 3.5]}
                    rotation-x={-Math.PI / 2}
                    name={name}
                    onClick={(event: ThreeEvent<MouseEvent>) => fieldClick(event, controls)}
                >
                    <planeGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color={colorBlack} transparent opacity={0} />
                </mesh>
            );
        }
    }

    return <>{fields}</>;
};

export default ChessBoard;

