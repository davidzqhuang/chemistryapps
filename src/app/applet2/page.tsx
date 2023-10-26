import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-8xl w-full items-center justify-between font-mono text-sm lg:flex flex-col space-y-4">
                <a href="/">
                    <Button variant="outline">Back to App Tree</Button>
                </a>
                <h1 className="text-2xl mb-4">Applet 2</h1>
                <p>This is applet 2</p>
            </div>
        </main>
    )
}