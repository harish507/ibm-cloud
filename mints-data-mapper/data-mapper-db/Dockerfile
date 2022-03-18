FROM java:8
EXPOSE 8081
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ADD /target/crossreference-0.0.1-SNAPSHOT.jar mints-data-mapper-db-api.jar
ENTRYPOINT ["java", "-jar", "mints-data-mapper-db-api.jar"]