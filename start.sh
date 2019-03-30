#! /bin/bash

# file to start the nodejs app and transpile the react app
# get the input for environment from the user
read -p "Please enter port:"  PORT
read -p "Please enter mongodb ulr:" MONGODB_URI
read -p "Please enter environment:" NODE_ENV
read -p "Please enter JWT secret:" SECERET
read -p "Start in:" MODE



# telling the user about the port and log files
echo The server will start on port $PORT
echo logs at ./backend/logs/`date +"%F"`.log

# exporting variables to the nodejs process
export PORT
export MONGODB_URI
export NODE_ENV
export SECERET

# noting the start of the trnspile for the fronend code
start_time=`date +"%s"`

# telling user about logs
echo build  logs can be found at ../backend/logs

# changing to the frontend folder
cd ./frontend

# running build using npm and piping output to logs
npm run build >> "../backend/logs/build-`date +"%F"`.log"

# changing to build folder
cd ./build
ls | while read i; do 
  # copying to public folder
  cp -r $i ../../backend/public
done

# noting end time of the build process
end_time=`date +"%s"`

# telling about the build time
echo build in `expr $end_time - $start_time`s
# telling about files
echo generated files are 
ls --color -l  ../../backend/public 

# back to root of the file
cd ../../

# mode is cluster use cluster.js and pipe logs to logs
if  [ "$MODE" = "cluster" ]; then
         echo Starting Cluster mode....
         echo
         node cluster.js >> "./backend/logs/`date +"%F"`.log"
# mode is local start node on crash 
elif [ "$MODE" = "local" ]; then
        while true; do
          echo Working in local mode....
          echo
          node ./backend
        done
# mode is nodemon use nodemon
elif [ "$MODE" = "nodemon" ]; then
       echo strting in nodemon
       echo
       npm run nodemon       
else
        node ./backend
fi

# end of the script
