#!/usr/bin/env groovy

pipeline {
    agent any
    environment {
        DATABASE_URL = credentials('DATABASE_URL')
        GITHUB_ID = credentials('GITHUB_ID')
        GITHUB_SECRET = credentials('GITHUB_SECRET')
        ADMIN_SECRET = credentials('ADMIN_SECRET')
        DISCORD_WEBHOOK_URL = credentials('DISCORD_WEBHOOK_URL')
    }
    stages {
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image'
                sh '''
                docker build \
                  --build-arg DATABASE_URL="$DATABASE_URL" \
                  --build-arg GITHUB_ID="$GITHUB_ID" \
                  --build-arg GITHUB_SECRET="$GITHUB_SECRET" \
                  --build-arg ADMIN_SECRET="$ADMIN_SECRET" \
                  --build-arg DISCORD_WEBHOOK_URL="$DISCORD_WEBHOOK_URL" \
                  -t modtoberfest .
                '''
            }
        }
        stage('Run Migrations') {
            steps {
                echo 'Running database migrations'
                sh '''
                docker run --rm \
                  -e DATABASE_URL="$DATABASE_URL" \
                  -e GITHUB_ID="$GITHUB_ID" \
                  -e GITHUB_SECRET="$GITHUB_SECRET" \
                  -e ADMIN_SECRET="$ADMIN_SECRET" \
                  -e DISCORD_WEBHOOK_URL="$DISCORD_WEBHOOK_URL" \
                  modtoberfest npx prisma migrate deploy
                '''
            }
        }
        stage('Start Container') {
            steps {
                echo 'Starting docker container'
                sh "docker compose up -d"
            }
        }
    }
    options {
        disableConcurrentBuilds()
    }
}
