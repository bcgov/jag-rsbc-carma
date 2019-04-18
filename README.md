# jag-rsbc-carma
Ministry of Attorney General, Road Safety BC CARMA (Case and Records Management Application) API for integration with VIPS

## API Client Installation

This API includes a Typescript / Javascript client within the repo that can be added to your project via

`yarn add github:bcgov/jag-rsbc-carma`

or 

`npm install github:bcgov/jag-rsbc-carma`

## Getting Started

### Openshift Deployment
1) In Openshift console open project CARMA-API (Tools) or (jvv0qm-tools) 
2) Navigate to Builds > Pipelines using the left pane menu.
3) Start pipeline to start the deployment.
4) After the pipeline has finished a deployment to DEV is done by default. 
5) To deploy to TEST/PROD promote the pipeline as needed.  

### Development Environment

Setup the .env.dev file in the root folder of the project with the following structure:

API_USERNAME='developer'
API_PASSWORD='dev'
CARMA_URL='https://wsgw.dev.jag.gov.bc.ca/carma/cases'
CARMA_USERNAME='<USERNAME>'
CARMA_PASSWORD='<PASSWORD>'

### Debugging
This project was built using [VS Code](https://code.visualstudio.com/) and as such the debugging flow is built around some mechanisms supported in this specific editor. 

You can attach the debugger to the test runner, dev and test instances of the api easily.  Each of these are defined within the [launch.json](.vscode/launch.json) and support multiple debugging sessions at the same time.  Which allows you to debug right from the unit test into the api and back.

## Commands 

The scripts can be organized into a few categories:

### Development

#### `yarn start:dev` 
>
> Launches the API in dev mode.  Running this command will read and use environment variables defined in `.env.dev`.  See the ##Setup## section for instructions on how to have this file generated for you automatically. 

#### `yarn rebuild`
>
> Cleans all compiled files (found in the `dist/`) with the exception of the `dist/.gitignore` folder. Then regenerates all typescript files and rebuilds.  **This should be done before issuing / completing Pull Requests**

## License

    Copyright 2016 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
