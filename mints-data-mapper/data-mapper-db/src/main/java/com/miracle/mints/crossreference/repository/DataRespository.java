package com.miracle.mints.crossreference.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.miracle.mints.crossreference.model.CrossReference;

public interface DataRespository extends MongoRepository<CrossReference, String> {
 
	List<CrossReference> findBymapName(String mapName);
  
}
