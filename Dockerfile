FROM nginx
COPY dist/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/default.conf
CMD ['cd', '/usr/share/nginx/html/']