#!/bin/bash
cd /home/kavia/workspace/code-generation/voice-controlled-home-automation-16899-17028/UserInterface_ReactJS
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

