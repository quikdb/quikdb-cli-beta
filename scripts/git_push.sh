#!/usr/bin/env bash

deploy_git() {
  local commit_message
  local git_branch

  while true; do
    read -p "Enter commit message (or 'exit' to finish): " commit_message
    if [ "$commit_message" = "exit" ]; then
      echo "Exiting git deployment."
      break
    fi

    read -p "Enter git branch: " git_branch

    # Validate git_branch input
    if [ -z "$git_branch" ]; then
      echo "Git branch cannot be empty. Please try again."
      continue
    fi

    echo "Staging all changes..."
    git add .

    echo "Committing changes with message: $commit_message"
    git commit -m "$commit_message"

    echo "Pushing to branch: $git_branch"
    git push origin "$git_branch"

    if [ $? -eq 0 ]; then
      echo "Commit and push successful."
    else
      echo "An error occurred during git push. Please check your repository and network connection."
    fi

    echo "---------------------------------------"
  done
}

deploy_git
