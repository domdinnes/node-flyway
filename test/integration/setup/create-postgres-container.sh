# Kills a running postgres container if one exists
# Starts a new container with the expected values
docker container stop node_flyway_postgres_db
docker container rm node_flyway_postgres_db

docker run -d --name node_flyway_postgres_db --env POSTGRES_PASSWORD=password123 -p 2575:5432 postgres