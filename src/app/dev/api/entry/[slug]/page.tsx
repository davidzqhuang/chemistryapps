'use client'

import { useState } from "react"

import data from "../../../../../logs/api_logs.json"

import JSONPretty from "react-json-pretty"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

function isValidJson(str: string) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

export default function Page({ params }: { params: { slug: string } }) {
    const idx = parseInt(params.slug)
    const entry = data["entries"][idx]

    const [body, setBody] = useState<string>(entry.request.body);
    const [headers, setHeaders] = useState<string>(JSON.stringify(entry.request.headers));
    const [result, setResult] = useState<string>("");

    return <div className="space-y-2 max-w-4xl">
        <h1 className="text-xl">pathname: {entry.request.pathname}</h1>
        <div className="flex flex-row space-x-4">
            <div>
                <p>Headers: </p>
            </div>
            <div className="max-w-4xl overflow-x-scroll">
                { isValidJson(headers) ?
                <JSONPretty  data={JSON.parse(headers)} theme={{
                    main: 'line-height:1.3;color:#499BAB;background:#FFFFFF;overflow:auto;',
                    error: 'line-height:1.3;color:#499BAB;background:#FFFFFF;overflow:auto;',
                    key: 'color:#AB685B;',
                    string: 'color:#41AB82;',
                    value: 'color:#526DAB;',
                    boolean: 'color:#AB685B;',
                }}></JSONPretty> : null}
            </div>
        </div>
        <Textarea value={headers} onChange={(e) => setHeaders(e.target.value)} rows={8}/>
        <div className="flex flex-row space-x-4">
            <div>
                <p>Body: </p>
            </div>
            <div className="max-w-4xl overflow-x-scroll">
                { isValidJson(body) ?
                <JSONPretty data={JSON.parse(body)} theme={{
                    main: 'line-height:1.3;color:#499BAB;background:#FFFFFF;overflow:auto;',
                    error: 'line-height:1.3;color:#499BAB;background:#FFFFFF;overflow:auto;',
                    key: 'color:#AB685B;',
                    string: 'color:#41AB82;',
                    value: 'color:#526DAB;',
                    boolean: 'color:#AB685B;',
                }}></JSONPretty> : null}
            </div>
        </div>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8}/>
        <div className="mt-4 space-y-4">
            <Button onClick={() => {
                console.log("Testing")
                fetch(`/api/${entry.request.pathname}`, {
                    method: entry.request.method,
                    headers: JSON.parse(headers),
                    body: body
                })
                .then(res => res.json())
                .then(json => setResult(JSON.stringify(json)))
            }}
            >
                Test
            </Button>
            {
                result ? (
                    <div className="max-w-4xl overflow-x-scroll">
                        <JSONPretty data={JSON.parse(result)} theme={{
                            main: 'line-height:1.3;color:#499BAB;background:#FFFFFF;overflow:auto;',
                            error: 'line-height:1.3;color:#499BAB;background:#FFFFFF;overflow:auto;',
                            key: 'color:#AB685B;',
                            string: 'color:#41AB82;',
                            value: 'color:#526DAB;',
                            boolean: 'color:#AB685B;',
                        }}></JSONPretty>
                    </div>
                ) : null
            }
        </div>
    </div>
}