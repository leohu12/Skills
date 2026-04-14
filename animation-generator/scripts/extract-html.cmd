@echo off
REM Animation Generator - Extract HTML from markdown code block
REM Usage: extract-html.cmd <input_file> <output_file>

setlocal enabledelayedexpansion

set "input_file=%~1"
set "output_file=%~2"

if "%input_file%"=="" (
    echo Usage: extract-html.cmd ^<input_file^> ^<output_file^>
    exit /b 1
)

if "%output_file%"=="" (
    echo Usage: extract-html.cmd ^<input_file^> ^<output_file^>
    exit /b 1
)

REM Use PowerShell to extract HTML code block
powershell -Command ^
    "$content = Get-Content -Path '%input_file%' -Raw; " ^
    "$match = [regex]::Match($content, '```html\s*([\s\S]*?)\s*```'); " ^
    "if ($match.Success) { $match.Groups[1].Value | Out-File -FilePath '%output_file%' -Encoding UTF8; exit 0 } else { exit 1 }"

exit /b %ERRORLEVEL%
