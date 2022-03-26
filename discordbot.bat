if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off

cd "D:\Amethyst"

start /min cmd /C "nodemon index.js"
goto :EOF
:minimized