# Cygnet

## How to set up development server

1. Build and Run Container
`docker compose -f docker-compose.debug.yml up --build`
    (add flag --remove-orphans to kill deserted images of cygnet) 
2. run `ssh -L localhost:3306:130.58.64.142:3306 gull` to direct traffic to server
    (whitelisted for ITS databse)
3. Visit http://localhost:3000
As you edit project files, the page should update dynamically (no need to reload!).
ctrl+s multiple times to reset pool connection as needed.

## How to set up prod server

(Ensure Traefik is set up)

1. Build and Run Container (Daemonized)
`docker compose up --build -d`
(Once active dev is done, we can just push built container and pull it)
2. Visit https://cygnetv2.sccs.swarthmore.edu
This will NOT update dynamically and needs to be rebuilt to get changes. This ensures version-locking and fully containerized environment.

NOTE: This creates an optimized (and secure) production build. Don't run devserver in prod!
