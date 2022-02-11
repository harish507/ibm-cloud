package com.miracle.camel.fte.userexits;

import java.io.FileReader;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.component.log.LogComponent;
import org.apache.log4j.Logger;

public class FTEExits implements Processor {

	private static Logger logger = Logger.getLogger(LogComponent.class);

	@Override
	public void process(Exchange exchange) throws Exception {
		FileReader reader = new FileReader("//routes//properties//FTEExitsProperties.properties");
		//FileReader reader=new FileReader("./routes/Properties/FTEExitsProperties.properties");  
	      
	    Properties fTEExitsProperties=new Properties();  
	    fTEExitsProperties.load(reader);  
	 
		logger.debug("Exit started");
		Message msg = exchange.getIn();
		String exitResult = "";
		Map<String,String> exitsMap = new LinkedHashMap<>();
		String exitNames = (String) msg.getHeader("exitName");
		logger.debug("Exit Name : " + exitNames);
		String inParam = (String) msg.getHeader("params");
		
		String tildSeperator = "~";
		
		String multipleExits [] = exitNames.split(tildSeperator);
		
		String multipleParams [] = inParam.split(tildSeperator);
		
		if (multipleExits.length > 1 && multipleParams.length > 1) {
			int exitsCount = 0 ;
			while (exitsCount < multipleExits.length) {
				exitsMap.put(multipleExits[exitsCount],multipleParams[exitsCount]);

				exitsCount++ ;
			}
			
			Iterator<Map.Entry<String, String>> iterator = exitsMap.entrySet().iterator();
			while(iterator.hasNext()) {
				Entry<String, String> entry = iterator.next();
				Class<?> exitClass = Class.forName(fTEExitsProperties.getProperty(entry.getKey()));
				exitResult = (String) exitClass.getMethod("invokeExit", String.class).invoke(exitClass, entry.getValue());
				logger.debug("Exit Ended with : " + exitResult);
			}
		}else if (multipleExits.length > 1 && multipleParams.length <= 1) {
			logger.error("Multiple exits were detected but required set of params are missing");
			throw new ArrayIndexOutOfBoundsException();
		}else if (multipleExits.length <= 1 && multipleParams.length > 1) {
			logger.error("Multiple exits are Missing but Multiple set of params were provided");
			throw new ArrayIndexOutOfBoundsException();
		}else {
		
		Class<?> exitClass = Class.forName(fTEExitsProperties.getProperty(exitNames));
		
		exitResult = (String) exitClass.getMethod("invokeExit", String.class).invoke(exitClass, inParam);
		
		logger.debug("Exit Ended with : " + exitResult);
		}
		
	}

}
