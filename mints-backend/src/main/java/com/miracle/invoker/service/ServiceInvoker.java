package com.miracle.invoker.service;

import java.util.Arrays;
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
public class ServiceInvoker {
	private static Logger logger = Logger.getLogger(LogComponent.class);

	public static String execute(String input, String serviceHost,
			String servicePort, String baseURL, String httpMethod,
			String metadataString, String queryStringParams, String queryParams) {
		String response = null;

		String completeURL = ServiceInvokerUtils.buldURL(serviceHost,
				servicePort, baseURL);

		if (queryParams.equals("true")) {
			completeURL = ServiceInvokerUtils.addQueryParams(queryStringParams,
					completeURL);
		}
		logger.debug(completeURL);
		// String baseURL = "http://" + itxHost + ":" + itxPort +
		// "/tx-rest/v1/itx/maps/direct/" + mapName + "?output=1";

		RestTemplate restTemplate = new RestTemplate();

		MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.ALL));

		headers.add("user-agent", ServiceInvokerConstants.UserAgent);

		HttpMethod method = HttpMethod.valueOf(httpMethod);

		if (metadataString == null || metadataString == ""
				|| metadataString.isEmpty()) {
			headers.setContentType(MediaType.TEXT_PLAIN);
			HttpEntity<String> requestEntity = new HttpEntity<>(input, headers);
			response = restTemplate
					.exchange(completeURL, method, requestEntity, String.class)
					.getBody().toString();

		} else {

			String completePayload = ServiceInvokerUtils.addMetaDataToPayload(
					input, metadataString);

			logger.debug("Payload with Meta Data :" + completePayload);

			headers.setContentType(MediaType.APPLICATION_JSON);

			HttpEntity<String> requestEntity = new HttpEntity<>(
					completePayload, headers);

			response = restTemplate
					.exchange(completeURL, method, requestEntity, String.class)
					.getBody().toString();

		}

		return response;
	}

}
