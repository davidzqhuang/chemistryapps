'use client'

import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";

export default function Page() {

    const [rdkit, setRDKit] = useState<any>(null);

    useEffect(() => {
        const script = document.createElement("script");

        script.className = "remote-script";
        script.src = "/RDKit_minimal.js";
        script.type = "text/javascript";

        script.onload = () => { 
            (window as any)
                .initRDKitModule()
                .then((x: any) => {
                    setRDKit(x);
                })
        };

        document.head.appendChild(script);
    }, []);

    const [svg, setSvg] = useState<null | string>(null);

    useEffect(() => {
        if (rdkit) {
            const m = rdkit?.get_mol("CN1C=NC2=C1C(=O)N(C(=O)N2C)");
            setSvg(m.get_svg());
            m.delete();
        }
    }, [rdkit]);

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
                        <p>Loading RDKit, may take a few seconds...</p>
                      )
                }
            </div>
        </main>
    )
}