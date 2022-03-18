package com.miracle.mints.datamapper.controller;

import java.io.FileReader;
import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.Properties;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.miracle.mints.datamapper.model.DataMapperData;
import com.miracle.mints.datamapper.model.DataMapperKeys;
import com.miracle.mints.datamapper.model.InputObject;
import com.miracle.mints.datamapper.model.MetaData;
import com.miracle.mints.utility.DataTransformService;
import com.miracle.mints.utility.ServiceInvoker;

@RestController
@RequestMapping("/api")
public class DataMapperController {

	@Value("${prop.path}")
	private String properties;
	private Properties serviceProps;

	@Autowired
	DataTransformService dataTransformService;

	
	
	/**
	 * Added By Chandramouli for health Checking
	 * @return
	 * @throws Exception
	 */
	@GetMapping("/healthCheck")
	public ResponseEntity<HashMap<String, String>> healthCheck(){
		
        HashMap<String, String> map = new HashMap<>();
        map.put("Status", "Up");

        
		try {
			return new ResponseEntity<>(map, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	/**
	 * 
	 * @param inputObject
	 * @return
	 * @throws Exception
	 */
	@PostMapping("/processPayload")
	public String processPayload(@RequestBody InputObject inputObject) throws Exception {

		//get data from input request
		String payload = inputObject.getPayload();
		MetaData metaData = inputObject.getMetadata();

		String  transformedPayload = dataTransformService.invokeDataMapper(metaData, payload);
		return transformedPayload;
	}

	/**
	 * 
	 * @param mapName
	 * @param keyName
	 * @return
	 * @throws IOException
	 */
	@GetMapping("/maps/{mapName}/keys/{keyName}")
	public ResponseEntity<String> getValueByKey(@PathVariable("mapName") String mapName, @PathVariable("keyName") String keyName) throws IOException {

		//load application properties
		FileReader reader = new FileReader(properties); 
		serviceProps = new Properties();  
		serviceProps.load(reader);  
		try { 

			String response  = ServiceInvoker.transform(null, mapName,keyName, serviceProps.getProperty("DataMapperDbServiceUrl"));

			if (response ==null)  {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			} 
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
		catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	/**
	 * 
	 * @param mapName
	 * @return
	 * @throws IOException 
	 */
	@GetMapping("/maps/{mapName}")
	public ResponseEntity<String> getMapData(@PathVariable("mapName") String mapName) throws IOException {
		FileReader reader = new FileReader(properties); 
		serviceProps = new Properties();  
		serviceProps.load(reader);  
		try { 

			String response = ServiceInvoker.transform(null, mapName,null, serviceProps.getProperty("DataMapperDbServiceUrl"));

			if (response==null) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			} 
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
		catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	

	/**
	 * 
	 * @param mapName
	 * @return
	 * @throws IOException 
	 */
	@GetMapping("/maps")
	public ResponseEntity<String> getMapData() throws IOException {
		FileReader reader = new FileReader(properties); 
		serviceProps = new Properties();  
		serviceProps.load(reader);  
		try { 

			String response = ServiceInvoker.transformMaps(null, null,null, serviceProps.getProperty("DataMapperDbServiceUrl"));

			if (response.isEmpty()|| response.isBlank()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			} 
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
		catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	/**
	 * 
	 * @return
	 */
	@DeleteMapping("/deleteEntries")
	public ResponseEntity<HttpStatus> deleteEntries() {
		try {
			FileReader reader = new FileReader(properties); 
			serviceProps = new Properties();  
			serviceProps.load(reader);  
			
			RestTemplate restTemplate= new RestTemplate();
			URI	url = new URI(serviceProps.getProperty("DataMapperDbServiceUrl")+"/deleteEntries");
			restTemplate.delete(url);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping("/datamapper")
	public ResponseEntity<DataMapperData> createEntry(@RequestBody DataMapperData dataMapperData) {

		DataMapperData response = null;
		try {
			FileReader reader = new FileReader(properties);
			serviceProps = new Properties();
			serviceProps.load(reader);
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			HttpEntity<DataMapperData> entity = new HttpEntity<DataMapperData>(dataMapperData, headers);
			response = restTemplate.exchange(serviceProps.getProperty("DataMapperDbServiceUrl") + "/datamapper", 
					HttpMethod.POST, entity, DataMapperData.class).getBody();
			if (null != response) {
				return new ResponseEntity<>(response, HttpStatus.CREATED);
			} else {
				return new ResponseEntity<>(response, HttpStatus.CONFLICT);
			}

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	

	@PostMapping("/keys")
	public ResponseEntity<DataMapperKeys> createEntry(@RequestBody DataMapperKeys dataMapperKeys) {

		try {
			FileReader reader = new FileReader(properties);
			serviceProps = new Properties();
			serviceProps.load(reader);
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			HttpEntity<DataMapperKeys> entity = new HttpEntity<DataMapperKeys>(dataMapperKeys, headers);
			HttpEntity<DataMapperKeys>  response = restTemplate.exchange(serviceProps.getProperty("DataMapperDbServiceUrl") + "/keys",
					HttpMethod.POST, entity, DataMapperKeys.class);
			if (null != response) {
				return new ResponseEntity<>(response.getBody(), HttpStatus.CREATED);
			} else {
				return new ResponseEntity<>(response.getBody(), HttpStatus.CONFLICT);
			}

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	/**
	 * 
	 * @param inputObject
	 * @return
	 * @throws Exception
	 */
//	@PostMapping("/complexProcessPayload")
//	public String complexProcessPayload(@RequestBody String inputObject) throws Exception {
//
//		JSONObject jsonObj = new JSONObject(inputObject.toString());
//		JSONArray getArray = jsonObj.getJSONArray("inOrder");
//		DocumentContext jsonContext = JsonPath.parse(inputObject);
//		System.out.println(jsonContext);
//		for (int i = 0; i < getArray.length(); i++) {
//			JSONObject objects = getArray.getJSONObject(i);
//			if (objects instanceof JSONObject) {
//				System.out.println(objects.get("address"));
//				JSONObject addressObj = new JSONObject(objects.get("address").toString());
//				if (addressObj instanceof JSONObject) {
//					System.out.println(addressObj.get("streetno"));
//				}
//
//			}
//
//		}
////		String jsonpathCreatorNamePath = "$['tool']['jsonpath']['creator']['name']";
////	//	String jsonpathCreatorLocationPath = "$.book[1].title";
////		String jsonpathCreatorLocationPath = "$.book[1].address[*]";
////		DocumentContext jsonContext = JsonPath.parse(inputObject);
////		String jsonpathCreatorName = jsonContext.read(jsonpathCreatorNamePath);
////		String jsonpathCreatorLocation = jsonContext.read(jsonpathCreatorLocationPath);;
////System.out.println(jsonpathCreatorName);
////System.out.println(jsonpathCreatorLocation);
//
//		return "";
//	}
}
