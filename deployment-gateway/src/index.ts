import express, { Request, Response } from "express"
import logger from "./utils/logger";
import httpProxy from "http-proxy"
import { generateSlug } from "random-word-slugs"
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs"
import Redis from "ioredis"
import { Server } from "socket.io"
import http from "http"
import { Socket } from "dgram";

// Load environment variables
require('dotenv').config();

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9000;

const subscriber = new Redis(process.env.REDIS_URL!);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

io.on('connection', socket => {
  socket.on('subscribe', channel => {
    socket.join(channel)
    socket.emit('message', `Joined ${channel}`)
  })
})

const ecsClient = new ECSClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

const config = {
  CLUSTER: process.env.ECS_CLUSTER_ARN || "arn:aws:ecs:us-east-1:763788837884:cluster/build-cluster",
  TASK: process.env.ECS_TASK_DEFINITION_ARN || "arn:aws:ecs:us-east-1:763788837884:task-definition/builder-task:3"
}


app.use(express.json());



app.post("/project", async (req: Request, res: Response) => {
  try {
    const projectSlug = generateSlug();
    const { gitURL } = req.body

    const command = new RunTaskCommand({
      cluster: config.CLUSTER,
      taskDefinition: config.TASK,
      launchType: "FARGATE",
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: [
            process.env.ECS_SUBNET_1 || "subnet-0c85a5c57a9da0483",
            process.env.ECS_SUBNET_2 || "subnet-034878d98cd403128"
          ],
          securityGroups: [process.env.ECS_SECURITY_GROUP || "sg-02b295bd5ed1b434d"],
          assignPublicIp: "ENABLED"
        }
      },
      overrides: {
        containerOverrides: [
          {
            name: 'builder-image',

            environment: [
              { name: 'GIT_REPOSITORY__URL', value: gitURL },
              { name: 'PROJECT_ID', value: projectSlug }
            ]
          }
        ]
      }


    })
    await ecsClient.send(command)
    res.json({
      status: "queued",
      data: { projectSlug, url: `http://${projectSlug}.localhost:8000` }
    })

  }
  catch (error) {
    console.log("error ", error);
  }
})






async function initRedisSubscribe() {
  console.log('Subscribed to logs....')
  subscriber.psubscribe('logs:*')
  subscriber.on('pmessage', (pattern, channel, message) => {
    io.to(channel).emit('message', message)
  })
}


initRedisSubscribe()


app.listen(PORT, () => {
  logger.info("deployment gateway running on port 9000");
})
