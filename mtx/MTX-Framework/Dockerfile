FROM java:8
EXPOSE 8080
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ADD /target/MTXFramework-1.0-SNAPSHOT.jar MTXFramework-1.0.jar
ENTRYPOINT ["java", "-jar", "MTXFramework-1.0.jar"]