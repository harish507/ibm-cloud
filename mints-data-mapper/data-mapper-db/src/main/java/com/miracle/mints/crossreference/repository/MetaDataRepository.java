package com.miracle.mints.crossreference.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.miracle.mints.crossreference.model.DataMapperData;

public interface MetaDataRepository extends MongoRepository<DataMapperData, String> {
		 
		List<DataMapperData> findBymapName(String mapName);
	  
	}