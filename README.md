# NutrientNavigators
Agile Methodolgies Team Project,
Team 9


The goal of the Diet Analyzer project is to develop an application that is easy to use and understand. The tool will allow users to input their daily food logs by taking images of what they eat and receive insightful feedback about their dietary choices and how it affects their health goals. 

The first critical objective of the project is food identification. Using image recognition technology we will enable the user to simplify the logging process. The application will contain an override feature to help ensure that logs are accurate.

The second object is nutritional data analysis. The application will give the user detailed insights into the macronutrients and micronutrients that they are consuming.

## How to install the project
Open a terminal and run the following commands:

npm install

pip install flask

pip install flask_cors

pip install mysql.connector

## How to run the project:

Open a split terminal or two separate terminals

In one terminal run: npx expo start --web

In the other terminal run: python3 backend/app.py


## If running in codespaces update API URL on frontend to forwarding address.

Change: http://127.0.0.1:5000

To a URL like this example: https://nasty-crypt-xgr6rqp6r4v3xpr-5000.app.github.dev/


## Troubleshooting

### Address already in use Port 5000 is in use by another program. Either identify and stop that program, or start the server with a different port.

Run the following commands in the termnal:


lsof -t -i:5000

Terminal will output list of processed. Get the PID and use in next command.

kill <PID>
