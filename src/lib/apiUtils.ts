import fs from 'fs';
import path from 'path';

const logDirectoryPath = path.join(__dirname.split(".next")[0], "src", "logs");
const logFilePath = path.join(logDirectoryPath, 'api_logs.json');

export async function log_request(request: Request) {
    if (process.env.NODE_ENV === "development") {
        const body = await request.text();
        const logEntry = {
            timestamp: Date.now().toString(),
            request: {
                method: request.method,
                pathname: request.url.split("/api")[1],
                body: body,
                headers: Object.fromEntries(request.headers.entries()),
            }
        };

        if (!fs.existsSync(logDirectoryPath)) {
            fs.mkdirSync(logDirectoryPath, { recursive: true });
        }

        let logData;
        if (fs.existsSync(logFilePath)) {
            const fileContent = fs.readFileSync(logFilePath, 'utf8');
            logData = JSON.parse(fileContent);
        } else {
            logData = { entries: [] };
        }

        logData.entries.push(logEntry);
        fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));

        console.log("Logged request to", logFilePath);
    }
}
