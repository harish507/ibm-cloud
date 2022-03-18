package com.miracle.mints.crossreference.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miracle.mints.crossreference.model.CrossReference;
import com.miracle.mints.crossreference.model.DataMapperData;
import com.miracle.mints.crossreference.model.DataMapperKeys;
import com.miracle.mints.crossreference.service.DataService;

@RestController
@RequestMapping("/api")
public class DataController {

	@Autowired
	DataService dataService;

	/**
	 * Added By Chandramouli for health Checking
	 * 
	 * @return
	 * @throws Exception
	 */
	@GetMapping("/healthCheck")
	public ResponseEntity<HashMap<String, String>> healthCheck() {

		HashMap<String, String> map = new HashMap<>();
		map.put("Status", "Up");

		try {
			return new ResponseEntity<>(map, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/maps")
	public ResponseEntity<List<String>> getMapData() {
		try {
			// List<CrossReference> getDataList = dataService.getMapData();
			List<String> mapsList = dataService.getMaps();

			System.out.println("mapsList--->>>" + mapsList);

			if (mapsList.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(mapsList, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/maps/{mapName}")
	public ResponseEntity<String> getMapData(@PathVariable("mapName") String mapName) {

		try {
			String mapData = dataService.getMapData(mapName);

			if (mapData.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(mapData, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@GetMapping("/{mapName}/keys/{keyName}")
	public ResponseEntity<String> getData(@PathVariable("mapName") String mapName,
			@PathVariable("keyName") String keyName) {

		try {
			String value = dataService.getValueByKey(mapName, keyName);

			if (value == null) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(value, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PostMapping("/insert")
	public ResponseEntity<CrossReference> createCountry(@RequestBody CrossReference crossreferenceData) {
		try {
			CrossReference _insertedEntry = dataService.createMapEntry(new CrossReference(crossreferenceData.getId(),
					crossreferenceData.getKeyName(), crossreferenceData.getValue(), crossreferenceData.getMapName()));
			if (null != _insertedEntry) {
				return new ResponseEntity<>(_insertedEntry, HttpStatus.CREATED);
			} else {
				return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
			}

		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/datamapper")
	public ResponseEntity<DataMapperData> createEntry(@RequestBody DataMapperData dataMapperData) {
		try {
			DataMapperData _insertedEntry = dataService.createMapEntry(
					new DataMapperData(dataMapperData.getId(), dataMapperData.getMapName(), dataMapperData.getData()));
			if (null != _insertedEntry) {
				return new ResponseEntity<>(_insertedEntry, HttpStatus.CREATED);
			} else {
				return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
			}

		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/keys")
	public ResponseEntity<DataMapperKeys> createEntry(@RequestBody DataMapperKeys dataMapperKeys) {
		try {
			DataMapperKeys _insertedEntry = dataService.createMapEntry2(new DataMapperKeys(dataMapperKeys.getId(),
					dataMapperKeys.getMapName(), dataMapperKeys.getData(), dataMapperKeys.getValues()));
			if (null != _insertedEntry) {
				return new ResponseEntity<>(_insertedEntry, HttpStatus.CREATED);
			} else {
				return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
			}

		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/updateEntry/{id}")
	public ResponseEntity<CrossReference> updateEntry(@PathVariable("id") String id,
			@RequestBody CrossReference datatoUpdate) {

		CrossReference updatedData = dataService.updateEntry(id, datatoUpdate);
		if (null != updatedData) {
			return new ResponseEntity<>(updatedData, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PutMapping("/updateData/{id}")
	public ResponseEntity<DataMapperData> updateData(@PathVariable("id") String id,
			@RequestBody DataMapperData datatoUpdate) {

		DataMapperData updatedData = dataService.updateData(id, datatoUpdate);
		if (null != updatedData) {
			return new ResponseEntity<>(updatedData, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/deleteEntry/{id}")
	public ResponseEntity<HttpStatus> deleteEntry(@PathVariable("id") String id) {
		try {
			dataService.deleteEntry(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteData/{id}")
	public ResponseEntity<HttpStatus> deleteData(@PathVariable("id") String id) {
		try {
			dataService.deleteEntry(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteEntries")
	public ResponseEntity<HttpStatus> deleteEntries() {
		try {
			dataService.deleteEntries();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
