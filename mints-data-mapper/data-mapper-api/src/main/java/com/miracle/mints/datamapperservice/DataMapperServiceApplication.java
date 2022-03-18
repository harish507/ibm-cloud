package com.miracle.mints.datamapperservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages="com.miracle.mints")
public class DataMapperServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DataMapperServiceApplication.class, args);
	}

}
