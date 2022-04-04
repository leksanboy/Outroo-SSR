
# ######################### #
# Docker build & run & exec #
# ######################### #
1. npm run build:ssr && rm -rf dist/browser/assets
2. docker build . -t beatfeel:0.1 -f docker/web/Dockerfile
3. docker run -d -p 8090:4000 beatfeel:0.1
4. docker run -it beatfeel:0.1 sh
5. docker exec -it 9aed4c816c37 sh
# ######################### #

---

# ######################### #
# Docker build & run & exec #
# ######################### #
1. docker build . -t beatfeel-api:0.1 -f docker/api/Dockerfile
   docker build -t beatfeel-api:0.1 .
2. docker run -d -p 8095:80 beatfeel-api:0.1
3. docker run -it beatfeel-api:0.1 sh
4. docker exec -it 9aed4c816c37 sh
# ######################### #

---

# ######################### #
# Kill & Remove containers  #
# ######################### #
1. docker kill $(docker ps -q)
2. docker rm $(docker ps -a -q)
3. docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
# ######################### #