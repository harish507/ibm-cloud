package com.miracle.mints.crossreference.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.aggregation.ArithmeticOperators.Trunc;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.miracle.mints.crossreference.model.CrossReference;
import com.miracle.mints.crossreference.model.DataMapperData;
import com.miracle.mints.crossreference.model.DataMapperKeys;
import com.miracle.mints.crossreference.repository.DataRespository;
import com.miracle.mints.crossreference.repository.MetaDataRepository;
import com.miracle.mints.crossreference.repository.MetaKeyRepositiory;

@Service
public class DataService {

	@Autowired
	DataRespository dataRepository;
	@Autowired
	MetaDataRepository metaDataRepository;
	@Autowired
	MetaKeyRepositiory metaKeyRepository;

	/**
	 * getAllCountries
	 * 
	 * @return getCountriesList
	 */
	public String getMapData(String mapName) {

		try {
			List<DataMapperKeys> dataKeys = new ArrayList<DataMapperKeys>();
			List<DataMapperData> dataValues = new ArrayList<DataMapperData>();
			String DOUBLE_QUOTE = "\"";
			String finaloutPut = "";
			List<String[]> keyList = new ArrayList<String[]>();
			List<String[]> valueList = new ArrayList<String[]>();

			// countryRepository.findAll().forEach(countriesList::add);
			metaKeyRepository.findBymapName(mapName).forEach(dataKeys::add);
			metaDataRepository.findBymapName(mapName).forEach(dataValues::add);
			System.out.println(" fetching from datastore");

			String[] keys = null;
			String[] data = null;
			String[] values = null;

			for (DataMapperKeys mapperkeys : dataKeys) {
				keys = mapperkeys.getData();
				values = mapperkeys.getValues();
				keyList.add(values);
				keyList.add(keys);
			}
			List<String> listKeys = Arrays.asList(keys);
			List<String> listValues = Arrays.asList(values);
			List<String> finalList = new ArrayList<>();
			finalList.addAll(listKeys);
			finalList.addAll(listValues);

			for (DataMapperData dataMapperData2 : dataValues) {
				data = dataMapperData2.getData();
				valueList.add(data);
			}

			JSONArray key = new JSONArray(finalList);
			JSONArray value = new JSONArray(valueList);

			finaloutPut = "{" + DOUBLE_QUOTE + "header" + DOUBLE_QUOTE + ":" + key.toString() + "," + DOUBLE_QUOTE
					+ "data" + DOUBLE_QUOTE + ":" + value.toString() + " }";
			return finaloutPut;
		} catch (Exception e) {
			e.printStackTrace();
			return e.toString();
		}
	}

	/**
	 * 
	 * @return
	 */

	public List<String> getMaps() {
		List<String> maps = new ArrayList<String>();
		try {
			List<DataMapperKeys> dataKeys = new ArrayList<DataMapperKeys>();
			String mapName = null;
			// countryRepository.findAll().forEach(countriesList::add);
			// dataRepository.findBymapName(mapName).forEach(dataKeys::add);
			metaKeyRepository.findAll().forEach(dataKeys::add);

			System.out.println(" fetching from datastore");
			List<DataMapperKeys> keyList = dataKeys;
			for (DataMapperKeys mapperKeys : keyList) {
				mapName = mapperKeys.getMapName();
				maps.add(mapName);
			}
			return maps;
		} catch (Exception e) {
			e.printStackTrace();
			return maps;
		}
		
	}

	/**
	 * getcountryByName
	 * 
	 * @param keyName
	 * @param countryName
	 * @return countriesList
	 */
	public String getValueByKey(@PathVariable("mapName") String mapName, String keyName) {
		try {
			List<DataMapperKeys> dataKeys = new ArrayList<DataMapperKeys>();
			List<DataMapperData> dataValues = new ArrayList<DataMapperData>();
			List<String> tempList = new ArrayList<String>();

			// countryRepository.findAll().forEach(countriesList::add);
			metaKeyRepository.findBymapName(mapName).forEach(dataKeys::add);
			metaDataRepository.findBymapName(mapName).forEach(dataValues::add);
			System.out.println(" fetching from datastore");
			List<DataMapperKeys> mapList = dataKeys;

			String[] keys = null;
			String[] tempArray = new String[100];

			for (DataMapperKeys mapperkeys : mapList) {
				for (int i = 0; i < mapperkeys.getData().length; i++) {
					keys = mapperkeys.getData();
				}
			}

			HashMap<String, String> hMap = new HashMap<String, String>();
			for (DataMapperData dataMapperData2 : dataValues) {
				tempArray = dataMapperData2.getData();
				String key = tempArray[0] + "_" + tempArray[1];
				hMap.put(key, tempArray[2]);
				tempList.add(key);
			}

			String keyValue = null;
			String[] temp = keyName.split(",");
			String tempKey = temp[0] + "_" + temp[1];

			if (tempList.contains(tempKey)) {
				keyValue = hMap.get(tempKey);
				return keyValue;
			}
			return keyValue;
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		}
	
	}

	/**
	 * createCountry
	 * 
	 * @param countryCrossreference
	 * @return _createCountry
	 */
	public CrossReference createMapEntry(@RequestBody CrossReference crossreference) {
		CrossReference entryCreated = null;
		try {
			if (dataRepository.findBymapName(crossreference.getMapName()).isEmpty()) {
				entryCreated = dataRepository.save(new CrossReference(crossreference.getId(), crossreference.getKeyName(),
						crossreference.getValue(), crossreference.getMapName()));
				System.out.println(" Insert into datastore");

			}
			return entryCreated;
		} catch (Exception e) {
			e.printStackTrace();
			return entryCreated;
		}
		

	}

	/**
	 * updateCountry
	 * 
	 * @param id
	 * @param crossreference
	 * @return countryCrossreferenceData
	 */

	public CrossReference updateEntry(@PathVariable("id") String id, @RequestBody CrossReference crossreference) {
		CrossReference crossreferenceData = null;

		try {
			Optional<CrossReference> mapData = dataRepository.findById(id);
			if (mapData.isPresent()) {
				crossreferenceData = mapData.get();
				crossreferenceData.setKeyName(crossreference.getKeyName());
				crossreferenceData.setValue(crossreference.getValue());
			}
			System.out.println(" fetching from datastore");
			return crossreferenceData;
		} catch (Exception e) {
			e.printStackTrace();
			return crossreferenceData;		}
	
	}

	/**
	 * delete country by id
	 * 
	 * @param id
	 */

	public void deleteEntry(@PathVariable("id") String id) {

		System.out.println(" delete from datastore");
		dataRepository.deleteById(id);
	}

	/**
	 * 
	 * @param id
	 */
	public void deleteData(@PathVariable("id") String id) {
		System.out.println(" delete from datastore");
		metaDataRepository.deleteById(id);
	}

	

	/**
	 * 
	 * @param dataMapperData
	 * @return
	 */
	public DataMapperData createMapEntry(DataMapperData dataMapperData) {
		DataMapperData entryCreated = null;
		try {
			String[] tempArray = new String[100];
			ArrayList<String> tempList = new ArrayList<String>();
			List<DataMapperData> data = new ArrayList<DataMapperData>();

			metaDataRepository.findBymapName(dataMapperData.getMapName()).forEach(data::add);
			for (DataMapperData dataMapperData2 : data) {
				tempArray = dataMapperData2.getData();
				String key = tempArray[0] + "_" + tempArray[1];
				tempList.add(key);
			}

			tempArray = dataMapperData.getData();
			String key = tempArray[0] + "_" + tempArray[1];

			if (!tempList.contains(key)) {
				entryCreated = metaDataRepository.save(
						new DataMapperData(dataMapperData.getId(), dataMapperData.getMapName(), dataMapperData.getData()));
				System.out.println("Record inserted successfully");
			}
			return entryCreated;
		} catch (Exception e) {
			e.printStackTrace();
			return entryCreated;
		}
		

	}

	/**
	 * 
	 * @param dataMapperKeys
	 * @return
	 */
	public DataMapperKeys createMapEntry2(DataMapperKeys dataMapperKeys) {
		DataMapperKeys entryCreated = null;
	try {
		//String[] tempArray = new String[100];
		ArrayList<String> tempList = new ArrayList<String>();
		List<DataMapperKeys> data = new ArrayList<DataMapperKeys>();

		metaKeyRepository.findBymapName(dataMapperKeys.getMapName()).forEach(data::add);
		for (DataMapperKeys dataMapperData2 : data) {
			//tempArray = dataMapperData2.getData();
		//	String key = dataMapperData2.getData()[0] + "_" + dataMapperData2.getData()[1];
			tempList.add(dataMapperData2.getData()[0] + "_" + dataMapperData2.getData()[1]);
		}

		List<String> list= Arrays.asList(dataMapperKeys.getKeys());
		String key = list.get(0) + "_" + list.get(1);

		if (!tempList.contains(key)) {
			entryCreated = metaKeyRepository.save(new DataMapperKeys(dataMapperKeys.getId(),
					dataMapperKeys.getMapName(), dataMapperKeys.getData(), dataMapperKeys.getValues()));
			System.out.println("Record inserted successfully");
		}
		return entryCreated;
	} catch (Exception e) {
		e.printStackTrace();
		return entryCreated;

	}
	

	}

	/**
	 * 
	 * @param id
	 * @param dataMapperData
	 * @return
	 */
	public DataMapperData updateData(@PathVariable("id") String id, @RequestBody DataMapperData dataMapperData) {
		DataMapperData metaData = null;

		try {
			Optional<DataMapperData> mapData = metaDataRepository.findById(id);
			if (mapData.isPresent()) {
				metaData = mapData.get();
				metaData.setData(dataMapperData.getData());
			}
			System.out.println("Record updated successfully");
			return metaData;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return metaData;
		}
	
	}
	
	
	/**
	 * 
	 */
	public void deleteEntries() {
		dataRepository.deleteAll();
		metaDataRepository.deleteAll();
		metaKeyRepository.deleteAll();
		}
}
