FROM ubuntu:20.04

# Don't ask questions during install
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update  -y \
&&  apt-get install -y apache2 \
                    -y nodejs \
                    -y npm \
                    -y build-essential \
&&  apt-get install -y php \
                    -y php-cli \
                    -y php-zip \
                    -y wget \
                    -y unzip \
                    -y libapache2-mod-php \
&&  apt-get install -y ffmpeg \
                    -y php-imagick \
                    -y id3v2 \
                    -y php-getid3 \
                    -y libphp-phpmailer \
&&  apt-get clean

# Install composer
RUN wget -O composer-setup.php https://getcomposer.org/installer
RUN php composer-setup.php --install-dir=/usr/local/bin --filename=composer
RUN alias composer='/usr/local/bin/composer'

# Install PM2
RUN npm install -g pm2@latest

# App directory
COPY dist /var/www/beatfeel.com/dist
WORKDIR /var/www/beatfeel.com

# Conf
COPY apache2.conf /etc/apache2/apache2.conf
COPY beatfeel.com.conf /etc/apache2/sites-available/beatfeel.com.conf

# Apache2 enable proxy mode
RUN a2enmod proxy \
&&  a2enmod proxy_http \
&&  a2enmod rewrite \
&&  a2dissite 000-default

# Expose the listening port
EXPOSE 4000

# Launch app with PM2
CMD [ "pm2-runtime", "dist/server.js" ]
