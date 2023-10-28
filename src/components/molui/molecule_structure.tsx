import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import './MoleculeStructure.css';

interface MolDetails {
    width: number;
    height: number;
    bondLineWidth?: number;
    addStereoAnnotation?: boolean;
    [key: string]: any;
}

interface MoleculeStructureProps {
    id: string;
    rdkit: any;
    className?: string;
    svgMode?: boolean;
    width?: number;
    height?: number;
    structure: string;
    subStructure?: string;
    extraDetails?: MolDetails;
    drawingDelay?: number;
}

const MoleculeStructure: React.FC<MoleculeStructureProps> = (props) => {
    const [svg, setSvg] = useState<string | undefined>(undefined);
    const rdkit = props.rdkit;

    const MOL_DETAILS: MolDetails = {
        width: props.width || 250,
        height: props.height || 200,
        bondLineWidth: 1,
        addStereoAnnotation: true,
        ...props.extraDetails,
    };

    const drawOnce = (() => {
        let wasCalled = false;

        return () => {
            if (!wasCalled) {
                wasCalled = true;
                draw();
            }
        };
    })();

    const draw = () => {
        if (props.drawingDelay) {
            setTimeout(() => {
                drawSVGorCanvas();
            }, props.drawingDelay);
        } else {
            drawSVGorCanvas();
        }
    };

    const drawSVGorCanvas = () => {
        console.log("Structure", props.structure);
        const mol = rdkit.get_mol(props.structure || "invalid");
        const qmol = rdkit.get_qmol(props.subStructure || "invalid");
        const isValidMol = !!mol;
        console.log("isValidMol", isValidMol);
        if (props.svgMode && isValidMol) {
            const svg = mol.get_svg_with_highlights(getMolDetails(mol, qmol));
            console.log("svg", svg);
            setSvg(svg);
        } else if (isValidMol) {
            const canvas = document.getElementById(props.id) as HTMLCanvasElement;
            console.log("canvas", canvas);
            mol.draw_to_canvas_with_highlights(canvas, getMolDetails(mol, qmol));
        }

        mol?.delete();
        qmol?.delete();
    };

    const getMolDetails = (mol: any, qmol: any) => {
        if (!!mol && !!qmol) {
            const subStructHighlightDetails = JSON.parse(
                mol.get_substruct_matches(qmol)
            );
            const subStructHighlightDetailsMerged = !_.isEmpty(
                subStructHighlightDetails
            )
                ? subStructHighlightDetails.reduce(
                    (acc: any, { atoms, bonds }: any) => ({
                        atoms: [...acc.atoms, ...atoms],
                        bonds: [...acc.bonds, ...bonds],
                    }),
                    { bonds: [], atoms: [] }
                )
                : subStructHighlightDetails;
            return JSON.stringify({
                ...MOL_DETAILS,
                ...props.extraDetails,
                ...subStructHighlightDetailsMerged,
            });
        } else {
            return JSON.stringify({
                ...MOL_DETAILS,
                ...props.extraDetails,
            });
        }
    };

    useEffect(() => {
        drawOnce();
    }, [props]);

    if (!rdkit) {
        return <span>Loading renderer...</span>;
    }

    const mol = rdkit.get_mol(props.structure || "invalid");
    const isValidMol = !!mol;
    mol?.delete();

    if (!isValidMol) {
        return (
            <span title={`Cannot render structure: ${props.structure}`}>
                Render Error.
            </span>
        );
    } else if (props.svgMode) {
        return (
            <>
                <div
                    title={props.structure}
                    className={`molecule-structure-svg ${props.className || ''}`}
                    style={{ width: props.width, height: props.height }}
                    dangerouslySetInnerHTML={{ __html: svg || '' }}
                />
            </>
        );
    } else {
        return (
            <>
                <div className={`molecule-canvas-container ${props.className || ''}`}>
                    <canvas
                        title={props.structure}
                        id={props.id}
                        width={props.width}
                        height={props.height}
                    />
                </div>
            </>
        );
    }
};

export default MoleculeStructure;
