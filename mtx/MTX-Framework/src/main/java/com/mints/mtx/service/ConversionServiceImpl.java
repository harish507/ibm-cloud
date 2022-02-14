package com.mints.mtx.service;

import java.io.File;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.ethlo.jsons2xsd.Config;
import com.ethlo.jsons2xsd.Jsons2Xsd;
import com.ethlo.jsons2xsd.XmlUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.ser.ToXmlGenerator;
import com.mints.mtx.bean.APIRestCalls;
import com.mints.mtx.bean.AggregateFunction;
import com.mints.mtx.util.JavaClassGenerator;
import com.mints.mtx.util.JedisMain;
import com.mints.mtx.util.XMLJavaConverter;

@Service
public class ConversionServiceImpl implements ConversionService  {
	
    Logger logger = LoggerFactory.getLogger(ConversionServiceImpl.class);
    private int isCacheEnabled= 0;
    private Map<String,String> dataCacheVariable= new HashMap<String,String>();
	public String generateOutputUsingJMapper(String request_content,String jMapName,String projectPath,String sharedPath, String cacheEnabled) {

        try {
        	if(cacheEnabled!=null && cacheEnabled.equalsIgnoreCase("0")) {
        		isCacheEnabled=0;
        	}
        	else if(cacheEnabled!=null && cacheEnabled.equalsIgnoreCase("1")) {
        		isCacheEnabled=1;
        	}
        	else if(cacheEnabled!=null && cacheEnabled.equalsIgnoreCase("2")) {
        		isCacheEnabled=2;
        	}else {
        		isCacheEnabled=0;
        	}
        
        	boolean isOutputXML=false;
        	boolean isInputJSON=false;
        
        	
        		
        	String fullSharedPath=sharedPath+"/"+projectPath+"/";
        	 String jmapper_content =null;
        	 
        	 String mapKey= projectPath+"&&"+jMapName;
        	
        	 if(isCacheEnabled==0) {
        		 jmapper_content = new String(Files.readAllBytes(Paths.get(fullSharedPath+jMapName+".xml")));
        		// System.out.println("isCacheEnabled0");
            	
            
        	 } else if(isCacheEnabled==1) {
             if(dataCacheVariable!=null && dataCacheVariable.get(mapKey)!=null) {
           // 	 System.out.println("reading from cache");
            	 
            	 jmapper_content=dataCacheVariable.get(mapKey);
            //	 System.out.println("isCacheEnabled1cache");
             }
             else {
            	 jmapper_content = new String(Files.readAllBytes(Paths.get(fullSharedPath+jMapName+".xml")));
            	 dataCacheVariable.put(mapKey,jmapper_content);
            	
             }
        	 }
        	 else if(isCacheEnabled==2) {
        		 JedisMain jedisMain = new JedisMain();
        		 Map<String, String> retrieveMap =jedisMain.getJmapperHash(mapKey);
        		// System.out.println("retrieveMap"+retrieveMap);
        		// System.out.println("retrieveMapsize"+retrieveMap.size());
        		 
        		 if(retrieveMap.size()==0) {
        			 jmapper_content = new String(Files.readAllBytes(Paths.get(fullSharedPath+jMapName+".xml")));
        			 retrieveMap =new HashMap<String, String>();
        			 retrieveMap.put(mapKey, jmapper_content);
        			 jedisMain.addJmapperHash(mapKey,retrieveMap);
        		//	 System.out.println("isCacheEnabled2notcache");
        		 }
        		 
        		 jmapper_content=retrieveMap.get(mapKey);
        		 
        	 }
             //String jmapper_content = new String(Files.readAllBytes(Paths.get(dir+jmapper+".xml")));
             
         //     document = builder.parse(response_content);
        	 DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
             DocumentBuilder builder = factory.newDocumentBuilder();


             Document  document = builder.parse(new InputSource(new StringReader(jmapper_content)));

             String request_xsd=null;
             String response_xsd=null;
             String inoutFormat=null;
             
             document.getDocumentElement().normalize();
             
           //Here comes the root node
             Element root = document.getDocumentElement();
          //   System.out.println(root.getNodeName());
              
             NodeList nList = document.getElementsByTagName("configuration");
        //     System.out.println("============================");
              
             for (int temp = 0; temp < nList.getLength(); temp++)
             {
              Node node = nList.item(temp);
         //     System.out.println("");    //Just a separator
              if (node.getNodeType() == Node.ELEMENT_NODE)
              {
                 //Print each employee's detail
                 Element eElement = (Element) node;
          
                 inoutFormat= eElement.getElementsByTagName("inoutformat").item(0).getTextContent();
                 request_xsd= eElement.getElementsByTagName("inputdefinition").item(0).getTextContent();
                 response_xsd= eElement.getElementsByTagName("outputdefinition").item(0).getTextContent();
              }
             }

       List<AggregateFunction> AggregationFunctionList= new ArrayList<AggregateFunction>();
       List<APIRestCalls> apiRestCallList= new ArrayList<APIRestCalls>();    
             

             Document  document1 = builder.parse(new InputSource(new StringReader(jmapper_content)));

           
             
             document1.getDocumentElement().normalize();
             
           //Here comes the root node
             Element root1 = document1.getDocumentElement();
             
            
             nList = document1.getElementsByTagName("AggregateFunction");
               System.out.println("==============AggregateFunction============="+nList.getLength());
                   
                  for (int temp = 0; temp < nList.getLength(); temp++)
                  {
                   Node node = nList.item(temp);
                   if (node.getNodeType() == Node.ELEMENT_NODE)
                   {
                      Element eElement = (Element) node;
                     String aggregateFunctionName= eElement.getElementsByTagName("AggregateFunctionName").item(0).getTextContent();
                     String input= eElement.getElementsByTagName("input").item(0).getTextContent();
                     String inputStatic= eElement.getElementsByTagName("inputStatic").item(0).getTextContent();
                     String  output= eElement.getElementsByTagName("output").item(0).getTextContent();
                      AggregateFunction aggregateFunction= new AggregateFunction( input,inputStatic, output, 
                    		  aggregateFunctionName);
                      AggregationFunctionList.add(aggregateFunction);
                   }
                  }
                  
                  nList = document1.getElementsByTagName("APIRestCall");
                  System.out.println("==============APIRestCall============="+nList.getLength());
                      
                     for (int temp = 0; temp < nList.getLength(); temp++)
                     {
                      Node node = nList.item(temp);
                      if (node.getNodeType() == Node.ELEMENT_NODE)
                      {
                         Element eElement = (Element) node;
                        String APIType= eElement.getElementsByTagName("APIType").item(0).getTextContent();
                        String input= eElement.getElementsByTagName("input").item(0).getTextContent();
                        String  output= eElement.getElementsByTagName("output").item(0).getTextContent();
                        String  endpoint= eElement.getElementsByTagName("endpoint").item(0).getTextContent();
                        APIRestCalls apiRestCalls= new APIRestCalls(input,output, APIType, endpoint);
                        apiRestCallList.add(apiRestCalls);
                      }
                     }
             String responseClassName =null;
           
             
         
             
             if(inoutFormat.equals("xml2xml")) {
            		
                	 isOutputXML=true; 	 
                	
             }
            
             else if(inoutFormat.equals("json2xml")) {
             	 isInputJSON=true;
             	 isOutputXML=true;
             	
            	
            	 
             }
             else if(inoutFormat.equals("json2json")) {
            	 isInputJSON=true;
            	
            	
            	 
             }
             else  if(inoutFormat.equals("xml2json")) {
         		
            	 isOutputXML=false;
            	 isInputJSON=false;
            	
             }
               
             NodeList  nodes = document.getElementsByTagName("class");
             for (int i = 0; i < nodes.getLength(); i++) {
               Element element = (Element) nodes.item(i);
                 
               responseClassName= element.getAttribute("name");
               break;
             //  responseClassName= element.getNodeValue();
              // responseClassName= element.getNodeValue();
             }
             
             boolean isMultiLevel=false;
             if(responseClassName.lastIndexOf("$")!=-1) {          
            	 responseClassName = responseClassName.substring(responseClassName.lastIndexOf("$")+1);
            	 isMultiLevel=true;
            	 responseClassName=responseClassName+"s";
             
             }
           
      //       System.out.println("responseClassName"+responseClassName);
             
              responseClassName = responseClassName.substring(responseClassName.lastIndexOf("$")+1);
            //  responseClassName = responseClassName.substring(responseClassName.indexOf(".") + 1);
              int startIndex=jmapper_content.indexOf("<configuration");
              
              int endIndex=jmapper_content.indexOf("</configuration>");
              
              int endIndex1= "</configuration>".length();
              
              endIndex=endIndex+endIndex1;
                jmapper_content=   jmapper_content.substring(0,startIndex)+ " " +jmapper_content.substring(endIndex);
              
       //       System.out.println("jmapper_content"+jmapper_content);
             
                
                if(jmapper_content.indexOf("<AggregateFunctions")!=-1) {
                startIndex=jmapper_content.indexOf("<AggregateFunctions");
               
                 endIndex=jmapper_content.indexOf("</AggregateFunctions>");
                  endIndex1= "</AggregateFunctions>".length();
                
                  endIndex=endIndex+endIndex1;
                  jmapper_content=   jmapper_content.substring(0,startIndex)+ " " +jmapper_content.substring(endIndex);;
                }
                if(jmapper_content.indexOf("<APIRestCalls")!=-1) {
                    startIndex=jmapper_content.indexOf("<APIRestCalls");
                   
                     endIndex=jmapper_content.indexOf("</APIRestCalls>");
                      endIndex1= "</APIRestCalls>".length();
                    
                      endIndex=endIndex+endIndex1;
                      jmapper_content=   jmapper_content.substring(0,startIndex)+ " " +jmapper_content.substring(endIndex);;
                    }
                
                String request_xml=null;
              if(isInputJSON==true) {
            	  
         
              
              ObjectMapper jsonMapper = new ObjectMapper();
          	JsonNode node = jsonMapper.readValue(request_content, JsonNode.class);
          	XmlMapper xmlMapper = new XmlMapper();
          	        xmlMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
          	        xmlMapper.configure(ToXmlGenerator.Feature.WRITE_XML_DECLARATION, true);
          	        xmlMapper.configure(ToXmlGenerator.Feature.WRITE_XML_1_1, true);
          	StringWriter w = new StringWriter();
          	xmlMapper.writeValue(w, node);
          	 request_xml=w.toString();
          	
       //   	System.out.println("request_xml"+request_xml);

          	  request_xml = request_xml.replace("<ObjectNode>", "").replace("</ObjectNode>", "").trim();
     //     	 
         // 	 System.out.println("request_xml"+request_xml);
              }
              else {
            	  request_xml=request_content.trim();	
              }
    
           
              document = builder.parse(new InputSource(new StringReader(request_xml)));

             document.getDocumentElement().normalize();

              root = document.getDocumentElement();
             
             String requestClassName = root.getNodeName().substring(0,1).toUpperCase()+root.getNodeName().substring(1);
        
             generateJavaClassesFromXSD(request_xsd,response_xsd,jMapName,fullSharedPath,isInputJSON,isOutputXML);
          
        	XMLJavaConverter xmlJavaConverter= new XMLJavaConverter();
        	
     //   	System.out.println("jmapper_content"+jmapper_content);
        	String output = xmlJavaConverter.convert(request_xml,fullSharedPath,jmapper_content,requestClassName,responseClassName,isOutputXML
        			,AggregationFunctionList,apiRestCallList,isMultiLevel);

            return output;
        } catch (Exception ex){
            ex.printStackTrace();
            return "Exception occurred, Please see the application logs";
        }finally {
            try {
           //     File inputDir = new File("./resources/input");
          //      File outputDir = new File("./resources/output");
          //      FileUtils.deleteDirectory(inputDir);
         //       FileUtils.deleteDirectory(outputDir);
             //  FileUtils.forceDelete(new File("./resources/xml/" + jMapName + ".xml"));
            }catch (Exception ex){
                ex.printStackTrace();
            }
        }
   
		
		//return null;
	}
	
	public String generateJavaClassesFromXSD(String request_xsd, String response_xsd, String jmapper,
			String fullSharedPath, boolean isInputJSON, boolean isOutputXML) {
		try {
			logger.info("request_xsd" + request_xsd);
			logger.info("response_xsd" + response_xsd);
		//	jmapperName = jmapper;
			String request_content = new String(Files.readAllBytes(Paths.get(fullSharedPath + request_xsd)));

			if (isInputJSON) {

				Reader r = new StringReader(request_content);

				Config cfg = new Config.Builder().createRootElement(false)
						.targetNamespace("http://www.w3.org/2001/XMLSchema").name("jmapper2").build();
				Document doc = Jsons2Xsd.convert(r, cfg);
				String actual = XmlUtil.asXmlString(doc.getDocumentElement());
				logger.info("actual--->" + actual);
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
				logger.info("request_content" + request_content_final);

				request_content = request_content_final;
			}

			String response_content = new String(Files.readAllBytes(Paths.get(fullSharedPath + response_xsd)));

			if (!isOutputXML) {

				Reader r = new StringReader(response_content);

				Config cfg = new Config.Builder().createRootElement(false)
						.targetNamespace("http://www.w3.org/2001/XMLSchema").name("jmapper3").build();
				Document doc = Jsons2Xsd.convert(r, cfg);
				String actual = XmlUtil.asXmlString(doc.getDocumentElement());
				logger.info("actual--->" + actual);
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
				logger.info("response_content2" + response_content_final);

				response_content = response_content_final;
			}

			// String request_content = new
			// String(Files.readAllBytes(Paths.get(sharedPath+request_xsd)));
			JavaClassGenerator.generateXMLClasses(request_content, "input");

			JavaClassGenerator.generateXMLClasses(response_content, "output");
			if(jmapper!=null) {
			File source = new File(fullSharedPath + jmapper + ".xml");
			File dest = new File("./resources/xml/" + jmapper + ".xml");
			FileUtils.copyFile(source, dest);
			}

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
			return ex.toString();
		}

		return "success:" + request_xsd + "-" + response_xsd;
	}
	
}
