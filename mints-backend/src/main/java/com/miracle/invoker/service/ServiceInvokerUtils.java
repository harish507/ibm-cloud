package com.miracle.invoker.service;


import java.util.HashMap;
import java.util.Map;

public class ServiceInvokerUtils {

	public static Map<String, String> convertHeadersStringToMap(
			String serviceHeadersString) {
		String headersString[] = serviceHeadersString.split("\\|");
		Map<String, String> headersMap = new HashMap<String, String>();

		// iterate the headers and add them to a HashMap
		for (String headers : headersString) {
			// split the headersString with :
			// Key and Value
			String header[] = headers.split(":");

			String key = header[0].trim();
			String value = header[1].trim();

			// Adding to HeadersMap
			headersMap.put(key, value);
		}

		return headersMap;

	}

	public static String buldURL(String serviceHost, String servicePort,
			String baseURL) {
		StringBuilder completeURL = new StringBuilder();
		completeURL.append("http://");
		completeURL.append(serviceHost);
		completeURL.append(":");

		completeURL.append(servicePort);
		completeURL.append(baseURL);

		return completeURL.toString();
	}

	public static String addMetaDataToPayload(String input,
			String metadataString) {
		StringBuilder buildPayload = new StringBuilder("{");
		buildPayload.append("\"payload\":\"");
		buildPayload.append(input + "\",");
		buildPayload.append("\"metadata\":");
		buildPayload.append(metadataString + "}");

		return buildPayload.toString();
	}

	public static String addQueryParams(String queryParamsString,
			String completeUrl) {
		Map<String, String> queryParamsMap = null;
		StringBuilder urlBuilder = new StringBuilder(completeUrl);
		urlBuilder.append("?");
		queryParamsMap = ServiceInvokerUtils
				.convertHeadersStringToMap(queryParamsString);
		int counter = 0;
		for (Map.Entry<String, String> queryParam : queryParamsMap.entrySet()) {
			if (counter != 0) {
				urlBuilder.append("&");
			}

			urlBuilder.append(queryParam.getKey());
			urlBuilder.append("=");
			urlBuilder.append(queryParam.getValue());
			counter++;
		}
		return urlBuilder.toString();

	}

}
