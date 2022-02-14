package todo;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;

import org.apache.commons.io.FileUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.consol.citrus.cucumber.backend.spring.CitrusSpringBackend;

import io.cucumber.core.cli.Main;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;





@RestController
@RequestMapping("/featureTest")
public class FeatureController {

	@RequestMapping(value="/MQEndtoEnd",produces = MediaType.TEXT_HTML_VALUE)
    public String executeFeature(@RequestParam(name = "FeatureFileName") String featureFileName) throws Throwable  {

		//String path="D:/citrus/Report_Directory/citrus-test-results.html";/////inputs/Report_Directory/citrus-test-results.html
		String path="/usr/src/app/resources/reports/citrus-test-results.html";
		 String content="";
		 
		 
	     
		 System.out.println("****************************************************************************************************************************");
		 String stringPath = FeatureController.class.getProtectionDomain().getCodeSource().getLocation().getPath();
		 String decodedPath = URLDecoder.decode(stringPath, "UTF-8");
		 String actualpath=decodedPath.replace("citrus-integration-test-case-0.0.1-SNAPSHOT.jar!/BOOT-INF/classes!", "").replace("file:/", "").replace("//", "/")+path;
          
	     System.out.println("****************************************************************************************************************************"); 
			/*
			 * String[] argv = new String[] { "--glue", "todo", "--plugin",
			 * "com.consol.citrus.cucumber.CitrusReporter", "src/main/resources/todo" };
			 */
	    // String[] argv = new String[] { "--glue",  "xmlfiles", "--plugin",
			//	  "com.consol.citrus.cucumber.CitrusReporter","features/"+featureFileName };
	     CitrusSpringBackend.uri=new HashSet<String>();
		  
		//   CitrusSpringBackend.uri.add("D:/features");
		  CitrusSpringBackend.uri.add("/usr/src/app/resources/testTemplates");

		 String[] argv = new String[] { "--glue",  "xmlfiles", "--plugin",
				  "com.consol.citrus.cucumber.CitrusReporter","file:/usr/src/app/resources/testCases/"+featureFileName };		 
	     
				  
				  ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
				  byte exitstatus = Main.run(argv, contextClassLoader);
		 
		
		 
	
			
		 
		try {
            content = FileUtils.readFileToString(new File(path), StandardCharsets.UTF_8);
         
        } catch (IOException e) {
            e.printStackTrace();
        }
		
				return content;
	}
	
	
		
	
	
	
}
