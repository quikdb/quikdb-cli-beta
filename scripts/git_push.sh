#!/usr/bin/env bash

deploy_git() {
  local commit_message
  local git_branch

    read -p "Enter commit message (or 'exit' to finish): " commit_message
    if [ "$commit_message" = "exit" ]; then
      break
    fi

    read -p "Enter git branch: " git_branch
    echo 
    git add .
    git commit -m "$commit_message"
    git push origin "$git_branch"
}

deploy_git
