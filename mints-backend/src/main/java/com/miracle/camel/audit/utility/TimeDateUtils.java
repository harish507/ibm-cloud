package com.miracle.camel.audit.utility;

import java.sql.Timestamp;
import java.util.Date;

public class TimeDateUtils {
	
	public static Timestamp getTimestamp()
	
	{
		 Date date= new Date();
         //getTime() returns current time in milliseconds
		 long time = date.getTime();
         //Passed the milliseconds to constructor of Timestamp class 
	 	Timestamp ts = new Timestamp(time);
		return ts;
		
	}

}
