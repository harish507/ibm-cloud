package com.miracle.invoker.service;

import java.io.FileReader;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.component.log.LogComponent;
import org.apache.log4j.Logger;

import com.miracle.itx.utility.ITXInvoker;

public class ServiceProcessor implements Processor {
	private static Logger logger = Logger.getLogger(LogComponent.class);

	@Override
	public void process(Exchange exchange) throws Exception {
		FileReader reader = new FileReader(
				"//routes//.camel//Properties.properties");
		Message msg = exchange.getIn();
		String metadataString = "";
		String serviceName = "";
		String baseURL = "";
		String httpMethod = "";
		String queryStringParams = "";
		String queryParams = "";
		String serviceHeadersString = (String) msg.getHeader("serviceHeaders");
		if ((String) msg.getHeader("serviceMetadata") != null) {
			metadataString = (String) msg.getHeader("serviceMetadata");
		}
		System.out.println("serviceHeadersString" + serviceHeadersString);

		if ((String) msg.getHeader("serviceQueryObject") != null) {
			queryStringParams = (String) msg.getHeader("serviceQueryObject");
		}

		Map<String, String> serviceHeadersMap = ServiceInvokerUtils
				.convertHeadersStringToMap(serviceHeadersString);

		if (serviceHeadersMap != null) {
			serviceName = serviceHeadersMap.get("type");
			baseURL = serviceHeadersMap.get("baseURL");
			httpMethod = serviceHeadersMap.get("method");
			queryParams = serviceHeadersMap.get("queryParams");

		}
		Properties serviceProperties = new Properties();
		serviceProperties.load(reader);

		logger.debug("Invoking " + serviceName + "Processor");
		System.out.println("ServiceName : " + serviceName);

		String response = ServiceInvoker.execute(msg.getBody().toString(),
				serviceProperties.getProperty(serviceName + "Connection.Host"),
				serviceProperties.getProperty(serviceName + "Connection.Port"),
				baseURL, httpMethod, metadataString, queryStringParams,
				queryParams);
		msg.setBody(response);
		logger.debug(serviceName + "Processor : Transformed message : "
				+ msg.getBody().toString());
	}
}
