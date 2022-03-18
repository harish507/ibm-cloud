package com.miracle.mints.utility;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
/**
 * 
 * This class makes a rest call to the cross reference rest api to fetch value for the given key sent
 * 
 * @version 1.0
 * 
 */
public class ServiceInvoker {

	public static String transform(String input, String mapName, String queryParam, String dbServiceUrl) {
		
		try {
			String response = null;
			String baseURL="";
			if (queryParam != null) {
				baseURL = dbServiceUrl + "/" + mapName + "/" + "keys" + "/" + queryParam;
			} else {
				baseURL = dbServiceUrl + "/maps/" + mapName;
			}

			RestTemplate restTemplate = new RestTemplate();

			Map<Integer, String> params = new HashMap<Integer, String>();
			params.put(1, input);

			MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
			body.add("1", input);

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.MULTIPART_FORM_DATA);

			HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body,headers);
			response = restTemplate.exchange(baseURL, HttpMethod.GET, requestEntity,String.class).getBody();

			return response;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
	}
	
	public static String transformMaps(String input, String mapName, String queryParam, String dbServiceUrl) {
		String response = null;
		String baseURL = dbServiceUrl + "/maps";
		RestTemplate restTemplate = new RestTemplate();
		Map<Integer, String> params = new HashMap<Integer, String>();
		params.put(1, input);

		MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
		body.add("1", input);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.MULTIPART_FORM_DATA);

		HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
		response = restTemplate.exchange(baseURL, HttpMethod.GET, requestEntity, String.class).getBody();

		return response;
	}
	
	
}
