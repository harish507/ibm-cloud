package com.miracle.camel.audit;

import org.apache.camel.Exchange;
import org.apache.camel.component.log.LogComponent;
import org.apache.camel.spi.ExchangeFormatter;
import org.apache.log4j.Logger;

import com.miracle.camel.audit.utility.TimeDateUtils;

/**
 * 
 * @author
 *
 */
public class AuditLogger implements ExchangeFormatter {
	// Declaring Logger Object and initializing the same with camel LogComponent
	// class
	private static Logger logger = Logger.getLogger(LogComponent.class);
	
	
	/**
	 * 
	 */
	@Override
	public String format(Exchange exchange) {
		// Returning customized Log Message Which will be logged on to console.
		return exchange.getFromRouteId().toString()+" | "+ exchange.getFromEndpoint().toString()+" | "+"Message ID :"+exchange.getIn().getMessageId()+" | Timestamp :"+TimeDateUtils.getTimestamp();
		
	}

}