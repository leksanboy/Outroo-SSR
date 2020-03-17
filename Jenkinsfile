pipeline {
	agent any

	environment {
                GOOGLE_PROJECT_ID = 'test-prj-cmd';
		
				GOOGLE_SERVICE_ACCOUNT_KEY = credentials('service_account_key');
        }

	tools { 
    
        git 'localGit'
        jdk 'localJava'
        nodejs 'localNode'

       }
	stages{
		stage('Init'){
			steps{
				 sh '''#!/bin/bash
					echo "JAVA_HOME = ${JAVA_HOME}";
					echo "PATH = ${PATH}";
					echo "MAVEN_HOME = ${M2_HOME}";
                                        echo env;
					echo "this is the project id environment"+GOOGLE_PROJECT_ID;
					npm install -g @angular/cli@6.0.8;
                                        npm install
				'''
				
				
				echo "This is the credentails:${GOOGLE_SERVICE_ACCOUNT_KEY}"
				println "Init success..";

				
			}

			
		}
      
		stage('Build'){
			steps{
				
				echo "Starting build ...."
				sh '''
				  #!/bin/bash
                                  ng build --aot --prod
                                '''
				println "BUILD NUMBER = $BUILD_NUMBER"
				println "Build Success.."
			}
			post {  
       		             always {

       		 	        notifyThroughEmail('Build-stage');
				
       			      }
				
   			    }
			
		          }
		 stage('Package'){
			steps{
				println "Starting package of war file..."
				sh '''
				  #!/bin/bash
                                  ng build --aot --prod
                                 '''
				println "$JENKINS_HOME $JENKINS_URL $BUILD_URL"
				println "Packaging Success.."
			}
			post{
				always{
					notifyThroughEmail('Package-stage');
					
				}
			}
		}
		stage('Publish'){
			steps{
				println('Starting publish..');
				script{
					def server = Artifactory.server('adtech-service-artifactory');
					println("here is the server: "+server);
					println("here is the server: ${server}");

					def buildInfo = Artifactory.newBuildInfo();
					buildInfo.env.capture = true;
                                        //You can get the value of an environment variable collected as follows:

					//value = buildInfo.env.vars['env-var-name']

					/*
					To promote a build between repositories in Artifactory, define the promotion parameters in a promotionConfig object and promote that. For example:

                                        def promotionConfig = [
					    // Mandatory parameters
					    'buildName'          : buildInfo.name,
					    'buildNumber'        : buildInfo.number,
					    'targetRepo'         : 'libs-prod-ready-local',
 
					    // Optional parameters
					    'comment'            : 'this is the promotion comment',
					    'sourceRepo'         : 'libs-staging-local',
					    'status'             : 'Released',
					    'includeDependencies': true,
					    'copy'               : true,
					    // 'failFast' is true by default.
					    // Set it to false, if you don't want the promotion to abort upon receiving the first error.
					    'failFast'           : true
					]
 
					// Promote build
					server.promote promotionConfig	*/



					buildInfo.retention maxBuilds: 10;
					buildInfo.retention maxDays: 10;

					println('Before adding upload spec');
					def uploadSpec = """{
						"files": [
 									{
										"pattern": "*.tar.gz",
										"target": "libs-release-local/XXXX/",
										"recursive": "true",
										"flat": "false",
										"props": "Version=2"
									},
									{
										"pattern": "*.zip",
										"target": "libs-release-local/XXXX/",
										"recursive": "true",
										"flat": "false",
										"props": "Version=2"
									}
								]
					}
					""";
					println('Before calling upload service');
					server.upload(uploadSpec);


					//download the uploaded artifact -  this is to download any dependant modules from
					// the artifcatory if any
					println('Before adding download spec');
					def downloadSpec = """{
						"files": [
 									{
										"pattern": "**/*.war",
										"target": "libs-release-local"
									}
								]
					}
					""";
					server.download(downloadSpec);

					
				}
				println('Publish Success');
				
				
			}
			post {
				always {
					notifyThroughEmail('Publish-stage');
					
				}
			}
		}
		stage('Deploy'){
			steps{
              
				//Deploy to GCP
				sh """
					#!/bin/bash 
					echo "deploy stage";
					curl -o /tmp/google-cloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-225.0.0-linux-x86_64.tar.gz;
					tar -xvf /tmp/google-cloud-sdk.tar.gz -C /tmp/;
					/tmp/google-cloud-sdk/install.sh -q;
                    			
                    			source /tmp/google-cloud-sdk/path.bash.inc;
					
					
					 gcloud config set project ${GOOGLE_PROJECT_ID};
					 gcloud components install app-engine-java;
					 gcloud components install app-engine-python;
					 gcloud auth activate-service-account --key-file ${GOOGLE_SERVICE_ACCOUNT_KEY};
					 
					 gcloud config list;
					 gcloud app deploy --version=v01;
                    			 echo "Deployed to GCP"
				"""
				}	
				post{
				   always{
					println "Result : ${currentBuild.result}";
					
                    			notifyThroughEmail('Deploy-stage');

				}
			}
		}
	}
}


def notifyThroughEmail(String stage= "Default stage"){
	
       		 		emailext  (
					body:"""
					  Adtech-Service - Build # $BUILD_NUMBER - $currentBuild.currentResult:
					

					  Check console output at $BUILD_URL to view the results.
					""",
					compressLog: true,
       		 	                attachLog: true,
					replyTo: '-----@---.com, -----@----.com',
				        recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
					subject: "Build Notification Jenkins - Project : Project-service - Job: $JOB_NAME Build # $BUILD_NUMBER ${currentBuild.currentResult}",
				        to: '-----@---.com, -----@----.com');
				
}