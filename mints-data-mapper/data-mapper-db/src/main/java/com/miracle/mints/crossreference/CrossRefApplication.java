package com.miracle.mints.crossreference;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;


@SpringBootApplication
@EnableCaching
@EnableMongoRepositories
public class CrossRefApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrossRefApplication.class, args);
	}

}
