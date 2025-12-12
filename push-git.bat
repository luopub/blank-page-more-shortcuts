@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo Git Auto Push Script
echo ========================================
echo.

:: Check if in Git repository
git rev-parse --git-dir >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Current directory is not a Git repository!
    echo Please run: git init
    pause
    exit /b 1
)

:: Get current branch name
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
if "!current_branch!"=="" (
    echo ERROR: Cannot get current branch name!
    pause
    exit /b 1
)

echo Current branch: !current_branch!
echo.

:: Check for uncommitted changes
git status --porcelain >nul 2>&1
if %errorlevel% equ 0 (
    echo File changes detected, preparing to commit...
    
    :: Add all changes
    echo Adding files...
    git add .
    if %errorlevel% neq 0 (
        echo ERROR: Failed to add files!
        pause
        exit /b 1
    )
    
    :: Commit changes
    set commit_msg=Auto commit at %date% %time%
    echo Committing changes...
    git commit -m "!commit_msg!"
    if %errorlevel% neq 0 (
        echo WARNING: No changes to commit or commit failed
    ) else (
        echo Commit successful!
    )
) else (
    echo No file changes detected
)

echo.
echo Starting push to remote repositories...
echo.

:: Push to Gitee
echo Pushing to Gitee...
git remote get-url gitee >nul 2>&1
if %errorlevel% neq 0 (
    echo Gitee remote repository not configured, attempting to add...
    :: Get current directory name as repository name
    for %%i in ("%cd%") do set repo_name=%%~ni
    set gitee_url=https://gitee.com/luopub/!repo_name!.git
    echo Adding Gitee remote: !gitee_url!
    git remote add gitee !gitee_url!
    if %errorlevel% equ 0 (
        echo Gitee remote repository added successfully
    ) else (
        echo ERROR: Failed to add Gitee remote repository
    )
)

if %errorlevel% equ 0 (
    git push gitee !current_branch!
    if %errorlevel% equ 0 (
        echo Gitee push successful!
    ) else (
        echo ERROR: Gitee push failed!
        echo Please check network connection and repository permissions
    )
)

echo.

:: Push to GitHub
echo Pushing to GitHub...
git remote get-url github >nul 2>&1
if %errorlevel% neq 0 (
    echo GitHub remote repository not configured, attempting to add...
    :: Get current directory name as repository name
    for %%i in ("%cd%") do set repo_name=%%~ni
    set github_url=https://github.com/luopub/!repo_name!.git
    echo Adding GitHub remote: !github_url!
    git remote add github !github_url!
    if %errorlevel% equ 0 (
        echo GitHub remote repository added successfully
    ) else (
        echo ERROR: Failed to add GitHub remote repository
    )
)

if %errorlevel% equ 0 (
    git push github !current_branch!
    if %errorlevel% equ 0 (
        echo GitHub push successful!
    ) else (
        echo ERROR: GitHub push failed!
        echo Please check network connection and repository permissions
    )
)

echo.
echo ========================================
echo Operation completed!
echo ========================================
echo.

:: Show remote repository status
echo Remote repository status:
git remote -v

echo.
echo Tips:
echo - For first-time push, you may need to configure SSH keys or personal access tokens
echo - Ensure local branch name matches remote branch name
echo - For custom commit messages, manually run: git commit -m "your message"

pause