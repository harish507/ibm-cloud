FROM java:8
EXPOSE 8083
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ADD /target/data-mapper-service-0.0.1-SNAPSHOT.jar mints-data-mapper-api.jar
ENTRYPOINT ["java", "-jar", "mints-data-mapper-api.jar"]