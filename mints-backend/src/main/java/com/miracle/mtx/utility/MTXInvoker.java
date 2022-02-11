package com.miracle.mtx.utility;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
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
public class MTXInvoker {
	private static Logger logger = Logger.getLogger(LogComponent.class);

	public static String transform(String input, String mapName,String projectPath, String mTXHost, String mTXPort) {
		
		String response = null;

		logger.debug("http://" + mTXHost + ":" + mTXPort + "/xml/service/generate/output?mapName="+mapName+"PurchaseOrder&projectPath="+projectPath);
		String baseURL = "http://" + mTXHost + ":" + mTXPort + "/xml/service/generate/output"+"?mapName="+mapName+"&projectPath="+projectPath+"&cacheEnabled=0"+"&flag=false";
		//String baseURL="http://52.189.68.61:8080/xml/service/callXMLGenerationService?mapName=purchase_order";
		//String baseURL="http://13.86.5.3:8080/xml/service/generate/output?mapName=PurchaseOrder&projectPath=Products&cacheEnabled=0"


		logger.debug("URL :" +baseURL);
		RestTemplate restTemplate = new RestTemplate();

		Map<Integer, String> params = new HashMap<Integer, String>();
		params.put(1, input);

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.ALL));
		headers.setContentType(MediaType.APPLICATION_XML);
		MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
		body.add("1", input);
		HttpEntity<String> requestEntity = new HttpEntity<>(input, headers);
		
		response = restTemplate.exchange(baseURL, HttpMethod.POST, requestEntity, String.class).getBody().toString();
		logger.debug(response);
		return response;
	}
	

}
