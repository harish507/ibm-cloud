package com.miracle.jmapper.utility;

import java.io.FileReader;
import java.util.Properties;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.component.log.LogComponent;
import org.apache.log4j.Logger;

public class JMapperProcessor implements Processor {

	private static Logger logger = Logger.getLogger(LogComponent.class);
	
	@Override
	public void process(Exchange exchange) throws Exception {
		FileReader reader=new FileReader("//routes//.camel//Properties.properties");  
	      
	    Properties jMapperProperties=new Properties();  
	    jMapperProperties.load(reader);  
		logger.debug("Invoking MTXProcessor");
		Message msg = exchange.getIn();
		System.out.println("Received message : " + msg.getBody());
		logger.debug("MTXProcessor : Received message : " + msg.getBody());
		String response = JMapperInvoker.transform(msg.getBody().toString(), (String) msg.getHeader("mapName"),(String) msg.getHeader("projectPath"),
				jMapperProperties.getProperty("JMapperConnection.Host"), jMapperProperties.getProperty("JMapperConnection.Port"));
		msg.setBody(response);
		System.out.println(msg.getHeader("endpoint")+" Transformed message : " + msg.getBody());
		logger.debug("MTXProcessor : Transformed message : " + msg.getBody());
	}
}