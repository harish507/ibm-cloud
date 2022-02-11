package com.miracle.itx.utility;

import java.io.FileReader;
import java.util.Properties;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.component.log.LogComponent;
import org.apache.log4j.Logger;

public class ITXProcessor implements Processor {

	private static Logger logger = Logger.getLogger(LogComponent.class);
	
	@Override
	public void process(Exchange exchange) throws Exception {
		FileReader reader=new FileReader("//routes//.camel//Properties.properties");  
	      
	    Properties itxProperties=new Properties();  
	    itxProperties.load(reader);  
		logger.debug("Invoking ITXProcessor");
		Message msg = exchange.getIn();
		System.out.println("Received message : " + msg.getBody());
		logger.debug("ITXProcessor : Received message : " + msg.getBody());
		String response = ITXInvoker.transform(msg.getBody().toString(), (String) msg.getHeader("mapName"),
				itxProperties.getProperty("ITXConnection.Host"), itxProperties.getProperty("ITXConnection.Port"));
		msg.setBody(response);
		System.out.println("Transformed message : " + msg.getBody());
		logger.debug("ITXProcessor : Transformed message : " + msg.getBody());
	}
}
