start sdkbuilder.bat
ECHO Building sdk, and waiting
TIMEOUT 10
ECHO Fixing sdk
python fixsdk.py
PAUSE