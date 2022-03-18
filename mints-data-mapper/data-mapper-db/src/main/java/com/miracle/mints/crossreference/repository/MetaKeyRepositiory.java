package com.miracle.mints.crossreference.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.miracle.mints.crossreference.model.DataMapperKeys;

public interface MetaKeyRepositiory extends MongoRepository<DataMapperKeys, String> {

	List<DataMapperKeys> findBymapName(String string);

}

