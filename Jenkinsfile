node {
  stage('Collecting code') {
    checkout scm
  }

  stage('Installing dependencies for pipeline') {
    sh 'pip install -r ./deploy/requirements.txt'
  }

  stage('Running pipeline') {
    sh 'python ./deploy/deploy.py ecs'
  }
}
