.PHONY: network network-down network-up

infra-start: app-start keycloak-start

network-down:
	docker network rm fc-network

network-up:
	docker network create fc-network

network: network-down network-up

.PHONY: app-up app-down app-start app-stop

app-up:
	docker compose -f ./authentication-flow/docker-compose.yml up --build -d

app-down:
	docker compose -f ./authentication-flow/docker-compose.yml down

app-start:
	docker compose -f ./authentication-flow/docker-compose.yml start

.PHONY: keycloak-up keycloak-down keycloak-start keycloak-stop

keycloak-up:
	docker compose -f ./keycloak/docker-compose.yml up --build -d

keycloak-down:
	docker compose -f ./keycloak/docker-compose.yml down

keycloak-start:
	docker compose -f ./keycloak/docker-compose.yml start

keycloak-stop:
	docker compose -f ./keycloak/docker-compose.yml stop

.PHONY: infra-up infra-down infra-start infra-stop

infra-up: network-up app-up keycloak-up

infra-down: network-down app-down keycloak-down
