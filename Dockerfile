# generate distNew first
# docker build -t outroo .

# OS
FROM node:10

# Install directly (no user interaction)
ENV DEBIAN_FRONTEND noninteractive

# Install basics
RUN apt-get update && \
    apt-get install -y apt-utils make gcc wget perl

# Install apache2
RUN apt-get update && \
    apt-get install -y apache2 && \
    a2enmod alias headers proxy proxy_http rewrite ssl

# Install PM2
RUN npm install pm2 -g

# Apache conf (Redirect on reloading page)
RUN sed -i 's/<\/VirtualHost>/\n RewriteEngine On \n RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR] \n RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d \n RewriteRule ^ - [L] \n RewriteRule ^ \/index.html \n <\/VirtualHost>/g' /etc/apache2/sites-available/000-default.conf

# Apache conf
RUN echo 'ServerName fake1.local' >> /etc/apache2/apache2.conf

# Remove all files from html folder
RUN rm /var/www/html/*.*

# Copy build
COPY ./distNew/ /var/www/html/dist

# Exec
CMD ["npm", "install", "pm2", "-g", "&&", "pm2", "start", "dist/server.js"]

# Run on port
EXPOSE 80
