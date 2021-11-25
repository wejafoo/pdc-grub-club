

FROM	nginx

ARG		ROUTE_BASE
ENV		ROUTE_BASE=${ROUTE_BASE}

### Install ngssc binary
ADD		https://github.com/kyubisation/angular-server-side-configuration/releases/download/v12.0.0/ngssc_64bit /usr/sbin/ngssc
RUN		chmod +x /usr/sbin/ngssc
RUN		rm -rf /usr/share/nginx/html

### Add ngssc init script
COPY	docker-entrypoint.sh /
COPY	nginx  /etc/nginx

### Copy app
COPY	.dist /usr/share/nginx/html
WORKDIR	/usr/share/nginx/html
