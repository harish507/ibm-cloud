package com.miracle.itx.utility;

import java.util.HashMap;
import java.util.Map;

import org.apache.camel.component.log.LogComponent;
import org.apache.log4j.Logger;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * ITXInvoker is invoked whenever a transformation map needs to be executed
 * through rest call.
 * 
 * This class makes a rest call to the ITX rest api which executes the map which
 * is sent
 * 
 * Methods :
 * 
 * public static String transform(String input, String MapName)
 * 
 * @author
 * 
 * 
 */
public class ITXInvoker {
	private static Logger logger = Logger.getLogger(LogComponent.class);

	public static String transform(String input, String mapName, String itxHost, String itxPort) {
		
		String response = null;

		logger.debug("http://" + itxHost + ":" + itxPort + "/tx-rest/v1/itx/maps/direct/" + mapName + "?output=1");
		String baseURL = "http://" + itxHost + ":" + itxPort + "/tx-rest/v1/itx/maps/direct/" + mapName + "?output=1";

		RestTemplate restTemplate = new RestTemplate();

		Map<Integer, String> params = new HashMap<Integer, String>();
		params.put(1, input);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.MULTIPART_FORM_DATA);

		MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
		body.add("1", input);

		HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

		response = restTemplate.exchange(baseURL, HttpMethod.PUT, requestEntity, String.class).getBody().toString();
		logger.debug(response);
		return response;
	}

}
