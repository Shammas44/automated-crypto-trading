#!/usr/bin/env bash
ps | egrep -v "bash|zsh|tmux" | awk '{print $1}' | tail -n +2 | xargs kill 