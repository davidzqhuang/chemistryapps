'use client'

import { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

enum Statuses {
    'Enter',
    'Valid',
    'Calculate',
    'Done'
}

export default function Page() {
    const [status, setStatus] = useState<Statuses>(Statuses.Enter)
    const [value1, setValue1] = useState<number | null>(null)
    const [value2, setValue2] = useState<number | null>(null)
    const [operator, setOperator] = useState<string | null>(null)
    const [result, setResult] = useState<number | null>(null)

    useEffect(() => {
        if (status === Statuses.Enter || status === Statuses.Valid) {
            if (value1 !== null && value2 !== null && operator !== null && ['+', '-', '*', '/'].includes(operator)) {
                setStatus(Statuses.Valid)
            } else {
                setStatus(Statuses.Enter)
            }
        }
    }, [status, value1, value2, operator])

    useEffect(() => {
        if (status === Statuses.Calculate) {
            fetch('/api/calculator/calculate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        value1,
                        value2,
                        operator
                    })
                }
            )
                .then(response => response.json())
                .then(data => {
                    setResult(data.result)
                    setStatus(Statuses.Done)
                })
        }
    }, [status, value1, value2, operator])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-8xl w-full items-center justify-between font-mono text-sm lg:flex flex-col space-y-4">
                <a href="/">
                    <Button variant="outline">Back to App Tree</Button>
                </a>
                <h1 className="text-2xl mb-4">Calculator</h1>

                {status === Statuses.Enter || status === Statuses.Valid ? (
                    <div className="flex flex-col space-y-4">
                        <Label htmlFor="Value1">Value 1</Label>
                        <Input id="Value1" type="number" onChange={(e) => setValue1(parseInt(e.target.value))} />
                        <Label htmlFor="Value2">Value 2</Label>
                        <Input id="Value2" type="number" onChange={(e) => setValue2(parseInt(e.target.value))} />
                        <Label htmlFor="Operator">Operator</Label>
                        <Input id="Operator" type="text" placeholder="&quot;+&quot;, &quot;-&quot;, &quot;*&quot;, or &quot;/&quot;" onChange={(e) => {
                            if (['+', '-', '*', '/'].includes(e.target.value)) {
                                setOperator(e.target.value)
                            } else {
                                setOperator("** Invalid Operator: " + e.target.value + " **")
                            }
                        }} />
                        <p className="font-bold">
                            Equation
                        </p>
                        <p>
                            {`${value1} ${operator} ${value2}`}
                        </p>
                        <Button onClick={() => {
                            if (status === Statuses.Valid) {
                                setStatus(Statuses.Calculate)
                            }
                        }}
                            variant={status === Statuses.Valid ? "default" : "secondary"}
                            style={{ pointerEvents: status === Statuses.Valid ? "auto" : "none" }}

                        >
                            Calculate
                        </Button>
                    </div>
                ) : null}
                {
                    status === Statuses.Done ? (
                        <>
                            <p className="font-bold">Result: </p>
                            <p>
                                {`${value1} ${operator} ${value2} = ${result}`}
                            </p>
                            <Button onClick={() => {
                                setStatus(Statuses.Enter)
                                setValue1(null)
                                setValue2(null)
                                setOperator(null)
                                setResult(null)
                            }
                            }>
                                Reset
                            </Button>
                        </>
                    ) : null
                }
            </div>
        </main>
    )
}