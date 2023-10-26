'use client'

import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";

const useScript = (path: string) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!path) return;

        const el = document.createElement("script");

        el.className = "remote-script";
        el.src = path;
        el.type = "text/javascript";

        el.onload = () => { setReady(true); };

        document.head.appendChild(el);
    }, [path]);

    return ready
};

export default function Page() {
    const ready = useScript("/RDKit_minimal.js");
    const [rdkit, setRDKit] = useState<any>(null);

    useEffect(() => {
        if (!rdkit && ready) {
            (window as any)
                .initRDKitModule()
                .then((RDKit: any) => {
                    setRDKit(RDKit);
                })
        }
    }, [rdkit, ready]);

    const [svg, setSvg] = useState<null | string>(null);

    const caffeine = "CN1C=NC2=C1C(=O)N(C(=O)N2C)";

    useEffect(() => {
        if (rdkit && !svg) {
            const mol = rdkit?.get_mol(caffeine);
            setSvg(mol.get_svg());
            mol.delete();
        }
    }, [rdkit, svg]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-8xl w-full items-center justify-between font-mono text-sm lg:flex flex-col space-y-4">
                <a href="/">
                    <Button variant="outline">Back to App Tree</Button>
                </a>
                <h1 className="text-2xl mb-4">RDKit render SMILES as SVG</h1>
                {
                    svg ? (
                        <div dangerouslySetInnerHTML={{ __html: svg }}></div>
                      ) : (
                        <p>Loading...</p>
                      )
                }
            </div>
        </main>
    )
}