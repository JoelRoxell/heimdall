# Dompen deployment to Amazon ECS
> Deployment pipeline for AWS ECS

*If you find these instructions misleading or wrong, please
[submit an issue](https://github.com/zappen999/dompen/issues/new).*

## TLDR;
Relevant configuration files:
- `deploy/ecs/task-definition-template.json`
- `deploy/ecs/config.py`

Install pipeline dependencies with `pip install -r requirements.txt`<br>
Run pipeline with: `python deploy/deploy.py ecs`

## Pipeline steps
This section will briefly explain each step in the deployment pipeline.

**1. Setup** - Makes sure there is a repository at AWS to push the Docker image
to. If there isn´t a repository, the script will create one named after the
package name (name in package.json).

**2. Build** - This is where the Docker image gets built. The image gets tagged
with the AWS repository name and version from package.json.

**3. Push** - Authenticates against to the Docker registry, pushes the image
and removes the image locally when it´s pushed.

**4. Configure** - Here is where the actual deploy takes place. In this step,
the task definition for the current build gets created, the service gets
updated or created if it doesn´t exist. Note: the load balancer configuration
cannot be changed after the first deploy (when the service gets created) read
more about this [here](#load-balancer).

## Prerequisites for integration server
* Docker
* Python 2.7
* pip
* AWS CLI

This deployment pipeline is standalone and doesn't depend on any integration
tools. It's still recommended to use some CI/CD tool such as Jenkins to act as a
central place for your builds. Tools like Jenkins allows for more integrations,
probably less cumbersome than implementing it yourself.

## Run pipeline
The pipeline can be run like so: `python deploy/deploy.py ecs`

For a continuous deployment workflow, you should add a webhook or similar, to
run the pipeline when new code is pushed.

## Configuration
### AWS CLI
The pipeline needs access to AWS in order to perform a deployment. To make calls
to AWS, you must configure AWS CLI properly. Read more
[here](http://docs.aws.amazon.com/cli/latest/topic/config-vars.html).

### Production container configuration
You can configure runtime parameters for the deployed container (task) in
`deploy/ecs/task-definition-template.json`. Values encapsulated with `< >` will
be replaced when the pipeline is executed. Please refer to
[AWS documentation](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)
for more information about task definition configuration.

**Note:** Leave out the `hostPort` key in the port mapping to allow for
dynamic host mapping (application load balancer). Read more
[here](http://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_PortMapping.html).

### Deployment strategy
You can change the behaviour of the deployment by modifying the config found in
`deploy/ecs/config.py`

### Load balancer
You can configure your service to use an
[application load balancer](https://aws.amazon.com/blogs/aws/new-aws-application-load-balancer/)
in the config file `deploy/ecs/config.py`. **You cannot add/change load balancer
configurations after the service has been created.** This is a limitation of
AWS. Therefore, make sure you configure your load balancer the first
time you make a deployment. If your service already has been created, you can
use the AWS CLI to remove it like so:
`aws ecs delete-service --cluster <YOUR_CLUSTER> --service <SERVICE_NAME>`

### Notifications
The pipeline comes with Slack notifications out of the box, but feel free to
change this behaviour in `deploy/utils/notify.py`

You can configure the notifications with these environment variables:

- `SLACK_CHANNEL` - The Slack channel to post to, defaults to #general.
- `SLACK_USERNAME` - Name to use when posting to Slack, defaults to "Dompen".
- `SLACK_AVATAR` - Link to an avatar image to use for the message, the avatar
should be 48x48 optimally. Defaults to [this](http://i.imgur.com/Hl2mu1Q.jpg).
- `SLACK_TOKEN` - Access token to use for posting.

## Setup with Jenkins
This section is a guide on how to setup this pipeline with Jenkins.

### Installing required plugins
* Pipeline (https://wiki.jenkins-ci.org/display/JENKINS/Pipeline+Plugin)
* AWS CLI
* GIT plugin (should be installed by default)

### Configure Jenkins
* Setup trigger on branch
* AWS Credentials
* Slack Credentials

In order for pip to be run as non-root, run:
```sh
sudo -s
echo "jenkins_user ALL=NOPASSWD:/usr/bin/pip" >> /etc/sudoers
```
