build:
	docker build --tag registry.gitlab.com/floor12/images:whatsapp --file ./docker/Dockerfile .

push:
	docker push registry.gitlab.com/floor12/images:whatsapp