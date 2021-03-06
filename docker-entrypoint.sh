#!/usr/bin/env bash

echo "!!!!!!!!!! NGINX START !!!!!!!!!!";

rm /etc/nginx/nginx.conf
envsubst '${TARGET_ALIAS}' < /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf

chmod 777 /etc/nginx/nginx.conf
chmod +x /usr/sbin/ngssc
chmod -R +r /usr/share/nginx/html

ngssc insert --recursive /usr/share/nginx/html/
nginx-debug -g 'daemon off;'

