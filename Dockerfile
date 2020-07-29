# generate distNew first
# docker build -t outroo .

# OS
FROM node:10

# Install directly (no user interaction)
ENV DEBIAN_FRONTEND noninteractive

# Install basics
RUN apt-get update && \
    apt-get -y install \
        apt-utils \
        httpd \
        php \
        php-cli \
        php-common \
        mod_ssl \
        openssl

# Install PM2
RUN npm install pm2 -g

# Apache conf (Redirect on reloading page) for SSR Web
RUN sed -i 's/<\/VirtualHost>/\n RewriteEngine On \n RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR] \n RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d \n RewriteRule ^ - [L] \n RewriteRule ^ \/index.html \n <\/VirtualHost>/g' /etc/apache2/sites-available/000-default.conf

# Apache conf
RUN echo 'ServerName fake1.local' >> /etc/apache2/apache2.conf

# Copy ssl conf (TODO)
#COPY ./conf/ssl.conf /etc/httpd/conf.d/default.conf

# Copy build
COPY ./distNew/ /var/www/html/dist

# Run on port
EXPOSE 80

# Exec
CMD ["pm2", "start", "dist/server.js"]
