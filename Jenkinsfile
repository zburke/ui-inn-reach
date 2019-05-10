@Library ('folio_jenkins_shared_libs@fix_npmDeploy') _

buildNPM {

   publishModDescriptor = false
   npmDeploy = false
   runLint = true
   runSonarqube = true
   runTest = true
   runTestOptions = '--karma.singleRun --karma.browsers ChromeDocker --karma.reporters mocha junit --coverage'

}
