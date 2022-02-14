package com.mints.mtx.controller;

import java.io.File;
import java.io.Reader;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.ethlo.jsons2xsd.Config;
import com.ethlo.jsons2xsd.Jsons2Xsd;
import com.ethlo.jsons2xsd.XmlUtil;
import com.mints.mtx.service.ConversionService;
import com.mints.mtx.util.JavaClassGenerator;
import com.mints.mtx.util.XMLJavaConverter;

@RestController
@RequestMapping("/xml/service")
public class RestControllerApp {

	@Value("${shared.path}")
	private String sharedPath;

	private String jmapperName;

	
	@Autowired
	private  ConversionService conversionService;
	
	
	@PostMapping(value = "/generate/output", consumes={"text/html",MediaType.ALL_VALUE}, produces = MediaType.ALL_VALUE)
	public String generateOutputUsingJMapper(@RequestBody String request_content,
			@RequestParam(name = "mapName") String jMapName, @RequestParam(name = "projectPath") String projectPath,
			@RequestParam(name="cacheEnabled") String cacheEnabled) throws Exception {
		
		
		 return conversionService.generateOutputUsingJMapper(request_content,jMapName,projectPath,sharedPath,cacheEnabled);
	
	}
	

	// healthCheck checking added By chandra mouli
	@GetMapping( value="/healthCheck" , consumes={"text/html",MediaType.ALL_VALUE}, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HashMap<String, String>> healthCheck() {

		HashMap<String, String> map = new HashMap<>();
		map.put("Status", "Up");

		try {
			return new ResponseEntity<>(map, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	
	@PostMapping(value = "/generate/classes", consumes={"text/html",MediaType.ALL_VALUE}, produces = MediaType.ALL_VALUE)
	public String generateClassesFromXSD(@RequestParam(name = "projectPath") String projectPath,String request_xsd,
			String response_xsd, String isXML
			) throws Exception {
		   
		
		boolean isInputJSON=false;
		boolean isOutputXML=false;
		
		if(isXML!=null && isXML.equals("XML")) {
			isInputJSON= false;
			isOutputXML=true;
		}
		else {
			isInputJSON= true;
			isOutputXML=false;
		}
		
		 return conversionService.generateJavaClassesFromXSD(request_xsd,response_xsd,null,sharedPath+"/"+projectPath+"/",isInputJSON,isOutputXML);
	  
		//  generateJavaClassesFromXSD(request_xsd,response_xsd,jMapName,fullSharedPath,isInputJSON,isOutputXML);
		  
	//	 return conversionService.generateClassesFromXSD(request_content,jMapName,projectPath,sharedPath,cacheEnabled);
	
	}
	
	
	
	@PostMapping(value = "/callXMLGenerationService", consumes = "application/xml", produces = "application/xml")
	public String callXMLGenerationService(@RequestBody String request_xml,
			@RequestParam(name = "mapName") String jMapName) {
		try {
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			DocumentBuilder builder = factory.newDocumentBuilder();

			Document document = builder.parse(new InputSource(new StringReader(request_xml)));

			document.getDocumentElement().normalize();

			Element root = document.getDocumentElement();

			String requestClassName = root.getNodeName().substring(0, 1).toUpperCase()
					+ root.getNodeName().substring(1);

			String jmapper_content = new String(Files.readAllBytes(Paths.get(sharedPath + jMapName + ".xml")));

			// document = builder.parse(response_content);

			document = builder.parse(new InputSource(new StringReader(jmapper_content)));

			document.getDocumentElement().normalize();

			String responseClassName = null;
			NodeList nodes = document.getElementsByTagName("class");
			for (int i = 0; i < nodes.getLength(); i++) {
				Element element = (Element) nodes.item(i);

				responseClassName = element.getAttribute("name");
				// responseClassName= element.getNodeValue();
				// responseClassName= element.getNodeValue();
			}

			System.out.println("responseClassName" + responseClassName);

			responseClassName = responseClassName.substring(responseClassName.indexOf(".") + 1);

			File inputDir = new File("./resources/input");
			boolean inputClassExists = false;

			File[] inputFileArr = inputDir.listFiles();
			if (inputFileArr != null) {
				for (int i = 0; i < inputFileArr.length; i++) {
					File inputFile = inputFileArr[i];
					if (inputFile != null && inputFile.getName().equals(requestClassName + ".java")) {
						inputClassExists = true;
						break;
					}

				}
			}

			File outputDir = new File("./resources/output");
			boolean outputClassExists = false;
			File[] outputFileArr = outputDir.listFiles();
			if (outputFileArr != null) {

				for (int i = 0; i < outputFileArr.length; i++) {
					File outputFile = outputFileArr[i];
					if (outputFile != null && outputFile.getName().equals(responseClassName + ".java")) {
						outputClassExists = true;
						break;
					}

				}
			}

			if (!inputClassExists) {
				String request_content = new String(
						Files.readAllBytes(Paths.get(sharedPath + requestClassName + ".xsd")));
				JavaClassGenerator.generateXMLClasses(request_content, "input");
				File inputFile = inputDir.listFiles()[0];
				JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
				compiler.run(null, null, null, inputFile.getPath());

				/*
				 * for(File file:inputDir.listFiles()){ copyFiles(file); }
				 */

			}

			if (!outputClassExists) {
				String response_content = new String(
						Files.readAllBytes(Paths.get(sharedPath + responseClassName + ".xsd")));

				JavaClassGenerator.generateXMLClasses(response_content, "output");
				File outputFile = outputDir.listFiles()[0];
				JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
				compiler.run(null, null, null, outputFile.getPath());

				/*
				 * for (File file : outputDir.listFiles()){ copyFiles(file); }
				 */
			}

			XMLJavaConverter xmlJavaConverter = new XMLJavaConverter();
			String Xml_output = xmlJavaConverter.convert(request_xml, sharedPath, jMapName, requestClassName,
					responseClassName, true, new ArrayList(),new ArrayList(),false);
			return Xml_output;
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Exception occurred, Please see the application logs";
		}

	}

	@GetMapping("/filenames/{request_xsd}/{response_xsd}/{jmapper}")
	public String callService(@PathVariable String request_xsd, @PathVariable String response_xsd,
			@PathVariable String jmapper) {
		try {
			jmapperName = jmapper;
			String request_content = new String(Files.readAllBytes(Paths.get(sharedPath + request_xsd + ".xsd")));
			JavaClassGenerator.generateXMLClasses(request_content, "input");

			String response_content = new String(Files.readAllBytes(Paths.get(sharedPath + response_xsd + ".xsd")));
			JavaClassGenerator.generateXMLClasses(response_content, "output");

			File source = new File(sharedPath + jmapper + ".xml");
			File dest = new File("./resources/xml/" + jmapper + ".xml");
			FileUtils.copyFile(source, dest);

			File inputDir = new File("./resources/xml/input");
			File outputDir = new File("./resources/xml/output");

			JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();

			for (File file : inputDir.listFiles()) {
				compiler.run(null, null, null, file.getPath());
			}
			for (File file : outputDir.listFiles()) {
				compiler.run(null, null, null, file.getPath());
			}

		} catch (Exception ex) {
			ex.printStackTrace();
			return "Exception occured, Please see the application logs";
		}

		return "success:" + request_xsd + "-" + response_xsd;
	}

	public String generateJavaClassesFromXSD(String request_xsd, String response_xsd, String jmapper,
			String fullSharedPath, boolean isInputJSON, boolean isOutputXML) {
		try {
			System.out.println("request_xsd" + request_xsd);
			System.out.println("response_xsd" + response_xsd);
			jmapperName = jmapper;
			String request_content = new String(Files.readAllBytes(Paths.get(fullSharedPath + request_xsd)));

			if (isInputJSON) {

				Reader r = new StringReader(request_content);

				Config cfg = new Config.Builder().createRootElement(false)
						.targetNamespace("http://www.w3.org/2001/XMLSchema").name("jmapper2").build();
				Document doc = Jsons2Xsd.convert(r, cfg);
				String actual = XmlUtil.asXmlString(doc.getDocumentElement());
				System.out.println("actual--->" + actual);
				request_content = actual;

				request_content = request_content.replaceFirst("<complexType name=\"jmapper2\">", " ");
				request_content = request_content.replaceFirst("<sequence>", " ");
				int lastIndex = request_content.lastIndexOf("</sequence>");
				int tagLenth = "</complexType>".length();
				int lastIndex1 = request_content.lastIndexOf("</complexType>");
				tagLenth = tagLenth + lastIndex1;

				String request_content_final = "";

				request_content_final = request_content.substring(0, lastIndex);
				String request_content2 = request_content.substring(tagLenth);
				request_content_final = request_content_final + " " + request_content2;
				System.out.println("request_content" + request_content_final);

				request_content = request_content_final;
			}

			String response_content = new String(Files.readAllBytes(Paths.get(fullSharedPath + response_xsd)));

			if (!isOutputXML) {

				Reader r = new StringReader(response_content);

				Config cfg = new Config.Builder().createRootElement(false)
						.targetNamespace("http://www.w3.org/2001/XMLSchema").name("jmapper3").build();
				Document doc = Jsons2Xsd.convert(r, cfg);
				String actual = XmlUtil.asXmlString(doc.getDocumentElement());
				System.out.println("actual--->" + actual);
				response_content = actual;

				response_content = response_content.replaceFirst("<complexType name=\"jmapper3\">", " ");
				response_content = response_content.replaceFirst("<sequence>", " ");
				int lastIndex = response_content.lastIndexOf("</sequence>");
				int tagLenth = "</complexType>".length();
				int lastIndex1 = response_content.lastIndexOf("</complexType>");
				tagLenth = tagLenth + lastIndex1;

				String response_content_final = "";

				response_content_final = response_content.substring(0, lastIndex);
				String response_content2 = response_content.substring(tagLenth);
				response_content_final = response_content_final + " " + response_content2;
				System.out.println("response_content2" + response_content_final);

				response_content = response_content_final;
			}

			// String request_content = new
			// String(Files.readAllBytes(Paths.get(sharedPath+request_xsd)));
			JavaClassGenerator.generateXMLClasses(request_content, "input");

			JavaClassGenerator.generateXMLClasses(response_content, "output");

			File source = new File(fullSharedPath + jmapper + ".xml");
			File dest = new File("./resources/xml/" + jmapper + ".xml");
			FileUtils.copyFile(source, dest);

			File inputDir = new File("./resources/xml/input");
			File outputDir = new File("./resources/xml/output");

			JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();

			for (File file : inputDir.listFiles()) {
				compiler.run(null, null, null, file.getPath());
			}
			for (File file : outputDir.listFiles()) {
				compiler.run(null, null, null, file.getPath());
			}

		} catch (Exception ex) {
			ex.printStackTrace();
			return "Exception occured, Please see the application logs";
		}

		return "success:" + request_xsd + "-" + response_xsd;
	}

	@PostMapping(value = "/generate/xmloutput", consumes = "application/xml", produces = "application/xml")
	public String generateXMLOutput(@RequestBody String request_xml, @RequestParam(name = "mapName") String jMapName) {
		try {

			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			DocumentBuilder builder = factory.newDocumentBuilder();

			Document document = builder.parse(new InputSource(new StringReader(request_xml)));

			document.getDocumentElement().normalize();

			Element root = document.getDocumentElement();

			String requestClassName = root.getNodeName().substring(0, 1).toUpperCase()
					+ root.getNodeName().substring(1);

			String jmapper_content = new String(Files.readAllBytes(Paths.get(sharedPath + jMapName + ".xml")));
			// String jmapper_content = new
			// String(Files.readAllBytes(Paths.get(dir+jmapper+".xml")));

			// document = builder.parse(response_content);

			document = builder.parse(new InputSource(new StringReader(jmapper_content)));

			document.getDocumentElement().normalize();

			String responseClassName = null;
			NodeList nodes = document.getElementsByTagName("class");
			for (int i = 0; i < nodes.getLength(); i++) {
				Element element = (Element) nodes.item(i);

				responseClassName = element.getAttribute("name");
				// responseClassName= element.getNodeValue();
				// responseClassName= element.getNodeValue();
			}

			System.out.println("responseClassName" + responseClassName);

			responseClassName = responseClassName.substring(responseClassName.indexOf(".") + 1);

			generateJavaClassesFromXSD(requestClassName, responseClassName, jMapName, sharedPath, false, true);

			XMLJavaConverter xmlJavaConverter = new XMLJavaConverter();
			String output = xmlJavaConverter.convert(request_xml, sharedPath, jmapperName, requestClassName,
					responseClassName, true,new ArrayList(),new ArrayList(),false);

			return "Output generated successfully\\n\\n " + output;
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Exception occurred, Please see the application logs";
		} finally {
			try {
				// File inputDir = new File("./resources/input");
				// File outputDir = new File("./resources/output");
				// FileUtils.deleteDirectory(inputDir);
				// FileUtils.deleteDirectory(outputDir);
				FileUtils.forceDelete(new File("./resources/xml/" + jmapperName + ".xml"));
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
	}

	@PostMapping(value = "/generate/jsonoutput", consumes = "application/xml", produces = "application/json")
	public String generateJSONOutput(@RequestBody String request_xml, @RequestParam(name = "mapName") String jMapName) {
		try {

		
			
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			DocumentBuilder builder = factory.newDocumentBuilder();

			Document document = builder.parse(new InputSource(new StringReader(request_xml)));

			document.getDocumentElement().normalize();

			Element root = document.getDocumentElement();

			String requestClassName = root.getNodeName().substring(0, 1).toUpperCase()
					+ root.getNodeName().substring(1);

			String jmapper_content = new String(Files.readAllBytes(Paths.get(sharedPath + jMapName + ".xml")));
			// String jmapper_content = new
			// String(Files.readAllBytes(Paths.get(dir+jmapper+".xml")));

			// document = builder.parse(response_content);

			document = builder.parse(new InputSource(new StringReader(jmapper_content)));

			document.getDocumentElement().normalize();

			String responseClassName = null;
			NodeList nodes = document.getElementsByTagName("class");
			for (int i = 0; i < nodes.getLength(); i++) {
				Element element = (Element) nodes.item(i);

				responseClassName = element.getAttribute("name");
				// responseClassName= element.getNodeValue();
				// responseClassName= element.getNodeValue();
			}

			System.out.println("responseClassName" + responseClassName);

			responseClassName = responseClassName.substring(responseClassName.indexOf(".") + 1);

			XMLJavaConverter xmlJavaConverter = new XMLJavaConverter();
			String output = xmlJavaConverter.convert(request_xml, sharedPath, jmapperName, requestClassName,
					responseClassName, false,new ArrayList(),new ArrayList(),false);

			return "Output generated successfully\\n\\n " + output;
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Exception occurred, Please see the application logs";
		} finally {
			try {
				// File inputDir = new File("./resources/input");
				// File outputDir = new File("./resources/output");
				// FileUtils.deleteDirectory(inputDir);
				// FileUtils.deleteDirectory(outputDir);
				FileUtils.forceDelete(new File("./resources/xml/" + jmapperName + ".xml"));
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
	}


    Logger logger = LoggerFactory.getLogger(RestController.class);

}
