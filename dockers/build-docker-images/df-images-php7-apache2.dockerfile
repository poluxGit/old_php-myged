FROM ubuntu:16.04

MAINTAINER Polux <polux@poluxfr.org>

#VOLUME ["/var/www"]

RUN apt-get update && apt-get install -y --force-yes \
      vim \
      apache2 \
      php7.0 \
      php7.0-cli \
      libapache2-mod-php7.0 \
      php7.0-gd \
      php7.0-json \
      php7.0-ldap \
      php7.0-mbstring \
      php7.0-mysql \
      php7.0-pgsql \
      php7.0-sqlite3 \
      php7.0-xml \
      php7.0-xsl \
      php7.0-zip \
      php7.0-soap \
      php-xdebug

USER root

# Prepare directories for logs && share
RUN mkdir -p /var/log/php/ && mkdir -p /var/www/html/php-myged && chmod -R 777 /var/log/php/

# PHP 7.0 - Configuration files
COPY ./01-apache2.conf /etc/apache2/apache2.conf
COPY ./05-php.ini /etc/php/7.0/apache2/php.ini
COPY ./10-xdebug.ini /etc/php/7.0/apache2/conf.d/20-xdebug.ini
COPY ./02-000-default.conf /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite
#RUN cd /etc/apache2/mods-enabled && ln -sr ../mods-available/rewrite.load .

EXPOSE 9000 80

#VOLUME ["/var/www", "/var/log/apache2", "/etc/apache2"]
ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
