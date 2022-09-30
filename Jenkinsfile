#!/usr/bin/env groovy

pipeline {
    agent any
    environment {
            DATABASE_URL = credentials('DATABASE_URL')
            GITHUB_ID = credentials('GITHUB_ID')
            GITHUB_SECRET = credentials('GITHUB_SECRET')
            ADMIN_SECRET = credentials('ADMIN_SECRET')
            NEXTAUTH_SECRET = credentials('NEXTAUTH_SECRET')
            DISCORD_WEBHOOK_URL = credentials('DISCORD_WEBHOOK_URL')
        }
    stages {
        stage('Deploy') {
            steps {
                echo 'Deploying docker container'
                sh "docker-compose up -d --build"
            }
        }
    }
    options {
        disableConcurrentBuilds()
    }
}
