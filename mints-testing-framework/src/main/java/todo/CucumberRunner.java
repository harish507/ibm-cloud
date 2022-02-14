package todo;

import java.io.File;
import java.util.HashSet;

import com.consol.citrus.cucumber.backend.spring.CitrusSpringBackend;

//import com.consol.citrus.cucumber.backend.spring.CitrusSpringBackend;

import io.cucumber.core.cli.Main;










public class CucumberRunner {
	
	public static void main(String args[]) throws Throwable
	{
		
	
		
		  CitrusSpringBackend.uri=new HashSet<String>();
		  
		//   CitrusSpringBackend.uri.add("D:/stepFiles");
		  CitrusSpringBackend.uri.add("/usr/src/app/resources/testTemplates");
		 
		 
		 
		 String[] argv = new String[] { "--glue",  "xmlfiles", "--plugin",
				  "com.consol.citrus.cucumber.CitrusReporter","features" };
				 
				  ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
				  byte exitstatus = Main.run(argv, contextClassLoader);
	}
	

}
