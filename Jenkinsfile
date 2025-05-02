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
        stage('Deploy') {
            steps {
                echo 'Deploying docker container'
                sh '''
                docker build \
                  --network=mariadb \
                  --build-arg DATABASE_URL="$DATABASE_URL" \
                  --build-arg GITHUB_ID="$GITHUB_ID" \
                  --build-arg GITHUB_SECRET="$GITHUB_SECRET" \
                  --build-arg ADMIN_SECRET="$ADMIN_SECRET" \
                  --build-arg DISCORD_WEBHOOK_URL="$DISCORD_WEBHOOK_URL" \
                  -t modtoberfest .
                '''
                sh "docker compose up -d"
            }
        }
    }
    options {
        disableConcurrentBuilds()
    }
}
