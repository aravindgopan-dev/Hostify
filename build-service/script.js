const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const Redis = require("ioredis");

// Load environment variables
require('dotenv').config();

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Redis connection
const redis = new Redis(process.env.REDIS_URL);

// Project ID from environment
const PROJECT_ID = process.env.PROJECT_ID;

// Function to publish logs
function publish(log) {
    redis.publish(`log:${PROJECT_ID}`, JSON.stringify({ log }));
    console.log(log);
}

// Main function
async function init() {
    publish("Building code...");
    const outDir = path.join(__dirname, 'output');
    const p = exec(`cd ${outDir} && npm install && npm run build`);

    p.stdout.on("data", (data) => {
        publish(data.toString());
    });

    p.stderr.on("data", (data) => {
        publish(data.toString());
    });

    p.on("close", async () => {
        publish("Build completed");
        const distFolderPath = path.join(__dirname, 'output', 'dist');
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });
        publish("starting to upload");
        for (const filePath of distFolderContents) {
            const fullPath = path.join(distFolderPath, filePath);
            try {
                const stats = fs.lstatSync(fullPath);
                if (stats.isDirectory()) {
                    continue;
                }

                publish(`Uploading file: ${filePath}`);

                const command = new PutObjectCommand({
                    Bucket: `hostmysite.io`,
                    Key: `${PROJECT_ID}/${filePath}`,
                    Body: fs.createReadStream(fullPath),
                    ContentType: mime.lookup(filePath) || 'application/octet-stream'
                });

                await s3Client.send(command);
                publish(`Successfully uploaded: ${filePath}`);
            } catch (error) {
                publish(`Error with file ${filePath}: ${error.message}`);
            }
        }

        publish("Done uploading all files!");
    });
}

// Error handler
init().catch((error) => {
    publish(`Error during initialization: ${error.message}`);
});
