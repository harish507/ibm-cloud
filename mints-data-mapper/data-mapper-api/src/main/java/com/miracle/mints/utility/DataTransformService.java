/**
 * 
 */
package com.miracle.mints.utility;

import java.io.FileReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.Arrays;
import java.util.Properties;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.miracle.mints.constants.DataMapperConstants;
import com.miracle.mints.datamapper.model.MetaData;

/**
 * @author Jagan
 *	
 */
@Component
public class DataTransformService {

	@Value("${prop.path}")
	private String properties;

	private Properties serviceProps;

	/**
	 * 
	 * @param metaMap
	 * @param inputRequest
	 * @return 
	 * @throws Exception 
	 */
	public String invokeDataMapper(MetaData metaData,String payload) throws Exception {
		
		//load application properties
		FileReader reader = new FileReader(properties); 
		serviceProps = new Properties();  
		serviceProps.load(reader);  
		String contentType = metaData.getContentType();
		String mapName = metaData.getMapName();
		String[] inputTag = metaData.getInputFields();
		String[] outputTag = metaData.getOutputFields();
		String output = null;
		
		//call for XML Transformation
		if((null!=inputTag && null!= outputTag && null != mapName && contentType.equalsIgnoreCase(DataMapperConstants.INPUT_XML_TYPE))) {
			try {
				output = callXMLDataWrapper(payload,mapName,inputTag[0],outputTag[0]);
			}
			catch(Exception e) {
			}
		}
		//call for JSON Transformation
		else if (null!=inputTag && null!= outputTag && null != mapName && contentType.equalsIgnoreCase(DataMapperConstants.INPUT_JSON_TYPE)) {
			try {
				output = callJsonDataMapper(mapName,inputTag[0],outputTag[0],payload,metaData);
			}
			catch(Exception e) {
			}
		}
		else {
			throw new Exception(DataMapperConstants.HEADERS_MISSING_EXCEPTION);
		}
		return output;
	}

	/**
	 * 
	 * @param inputTag
	 * @param outputTag
	 * @param inputFileName
	 * @return 
	 * @throws IOException
	 */
	private String callJsonDataMapper(String mapName, String inputTag, String outputTag, String messageBody,
			MetaData metaData) throws Exception {

		try {
			String[] strOutParamArray = outputTag.split(DataMapperConstants.PERIOD_SEPARATOR);
			String request_content = new String(messageBody);
			DocumentContext documentContext = JsonPath.parse(request_content);
			String[] inputTagArray = metaData.getInputFields();
			String[] outputTagArray = metaData.getOutputFields();
			String inputKey = documentContext.read(inputTagArray[0]);
			String inputKey1 = documentContext.read(inputTagArray[1]);
			String key = inputKey + "," + inputKey1;

			// call cross reference service & fetch value for given key
			String response = ServiceInvoker.transform(null, mapName, inputKey + "," + inputKey1,
					serviceProps.getProperty("DataMapperDbServiceUrl"));
			// construct output path to update value
			String[] outPathArray = constructOutputPath(strOutParamArray);
			DocumentContext updatedJson = documentContext.put(outPathArray[0], outPathArray[1], response);
			return updatedJson.jsonString();
		} catch (Exception e) {
			e.printStackTrace();
			return e.getMessage();
		}

	}

	/**
	 * 
	 * @param msg
	 * @param inputFileName
	 * @param inputTag
	 * @param outputTag
	 * @return 
	 * @throws ParserConfigurationException
	 * @throws SAXException
	 * @throws IOException
	 * @throws TransformerException
	 */
	private String callXMLDataWrapper(String mapName, String inputXML, String inputTag, String outputTag) throws Exception {
		
		//read xml document and update required fields
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		InputSource inputSource = new InputSource(new StringReader(inputXML));
		Document document = builder.parse(inputSource);
		document.getDocumentElement().normalize();
		Element inElement = evaluateXpath(inputTag,document);
		String inputKey = inElement.getTextContent();
		
		//call cross reference service & fetch value for given key 
		String response =  ServiceInvoker.transform(null, mapName,inputKey, serviceProps.getProperty("DataMapperDbServiceUrl"));
		Element outElement  = evaluateXpath(outputTag,document);
		outElement.setTextContent(response);
		return document.toString();
	}

	/**
	 * 
	 * @param strOutParamArray
	 * @return outPathArray
	 */
	private String[] constructOutputPath(String[] strOutParamArray) {
		
		String [] outPathArray = new String[2];
		StringBuffer pathToFind = new StringBuffer();
		String outPutTagName = null;
		for (int i = 0; i < strOutParamArray.length; i++) {
			String string = strOutParamArray[i];
			int index = Arrays.asList(strOutParamArray).indexOf(string);
			int arrayIndex = strOutParamArray.length-1;
			if(index == arrayIndex) {
				outPutTagName = strOutParamArray[arrayIndex];
			} else {
				pathToFind.append(string + ".");
			}
		}
		int pathIndex = pathToFind.length()-1;
		pathToFind= pathToFind.deleteCharAt(pathIndex);
		outPathArray[0] = pathToFind.toString();
		outPathArray[1] = outPutTagName;
		return outPathArray;
	}

	/**
	 * 
	 * @param inputTag
	 * @param document
	 * @return
	 */
	private Element evaluateXpath(String tag, Document document) {
		
		NodeList list;
		Element element = null;
		try {
			XPathFactory xPathFactory = XPathFactory.newInstance();
			XPath xpath = xPathFactory.newXPath();
			XPathExpression expr = xpath.compile(tag);
			Object eval = expr.evaluate(document, XPathConstants.NODESET);
			list=  (NodeList) eval;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		for (int temp = 0; temp < list.getLength(); temp++) {
			Node node = list.item(temp);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				element = (Element) node;
			}
		}
		return element;
	}
}

