package com.mints.mtx.util;

import java.io.File;
import java.io.StringReader;
import java.io.StringWriter;
import java.lang.reflect.Field;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.googlecode.jmapper.JMapper;
import com.mints.mtx.bean.APIRestCalls;
import com.mints.mtx.bean.AggregateFunction;

public final class XMLJavaConverter {

	Logger logger = LoggerFactory.getLogger(XMLJavaConverter.class);

	public String convert(String requestFile, String dir, String jmapper_content, String requestClassName,
			String responseClassName, boolean isXMLOutput, List<AggregateFunction> AggregationFunctionList,
			List<APIRestCalls> apiRestCallList, boolean isMultiLevel) throws Exception {
		StringWriter sw = new StringWriter();
		String retValue = null;
		try {
			String outPutDir="./resources/xml/input";
			List<File> filesList = Files.list(Paths.get(outPutDir)).map(Path::toFile)
					.collect(Collectors.toList());
			File inputDir = new File("./resources/xml/input");
			File inputFile = inputDir.listFiles()[0];
			File outputDir = new File(outPutDir);
			File outputFile = outputDir.listFiles()[0];
			CustomClassLoader customClassLoader = new CustomClassLoader();
			Class inputClass = customClassLoader.findClass("input/" + requestClassName);
			Class outputClass = null;

			if (isMultiLevel) {

				outputClass = customClassLoader.findClass("output/" + responseClassName);
			} else {
				outputClass = customClassLoader.findClass(
						"output/" + outputFile.getName().substring(0, outputFile.getName().lastIndexOf(".")));
			}

			JAXBContext jaxbContext = JAXBContext.newInstance(inputClass);
			Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
			StringReader reader = new StringReader(requestFile);

			Object orderObj = jaxbUnmarshaller.unmarshal(reader);

			JMapper userMapper;
			Object purchaseOrder;
			List purchaseOrderList;
			JAXBContext jaxbContext1;
			Marshaller marshaller;
			Class<? extends Object> classes = orderObj.getClass();

			Field field = orderObj.getClass().getDeclaredFields()[0]; //getting parent object properties
			Class cls = null;
			Field[] fields = orderObj.getClass().getDeclaredFields();
			for (Field fieldss : fields) {
				String fieldName = fieldss.getName();
			}
			field.setAccessible(true);
			List<String> classNamesList = new ArrayList<String>();
			if (field.getType().equals(List.class)) {
				purchaseOrderList = new ArrayList();
				Object outputList = outputClass.newInstance();
				Field newField = outputList.getClass().getDeclaredFields()[0];
				newField.setAccessible(true);
				jaxbContext1 = JAXBContext.newInstance(outputClass);
				marshaller = jaxbContext1.createMarshaller();

				for (Object obj : (List) field.get(orderObj)) {
//					Field[] fieldss = obj.getClass().asSubclass(obj.getClass()).getDeclaredFields();
//					for (Field d : fieldss) {
//						// edited this line for test purposes
//						for (File fileName : filesList) {
//							// System.out.println(file.getName());
//							if (fileName.getName().contains(
//									d.getName().substring(0, 1).toUpperCase() + d.getName().substring(1) + ".class")) {
//								classNamesList.add(fileName.getName());
//								break;
//							}
//
//						}
//					}
					for (int i = 0; i < apiRestCallList.size(); i++) {
						AggregateFunction aggregateFunction = (AggregateFunction) AggregationFunctionList.get(i);
						APIRestCalls APIRestCalls = (APIRestCalls) apiRestCallList.get(i);
						String input = APIRestCalls.getInput();
						System.out.println("input------>>>>>>  " + input);
						String output = APIRestCalls.getOutput();
						String apiType = APIRestCalls.getAPIType();
						String endPoint = APIRestCalls.getEndPoint();
						if (apiType.equals("GET")) {
							Field field3 = obj.getClass().getDeclaredField(output);
							field3.setAccessible(true);
							field3.set(obj, "India");
						}
						if (apiType.equals("POST")) {
							String str = "  <response>post call respoonse</response>";
							Field field3 = obj.getClass().getDeclaredField(output);
							field3.setAccessible(true);
							field3.set(obj, str);
						}

					}
					for (int i = 0; i < AggregationFunctionList.size(); i++) {
						AggregateFunction aggregateFunction = (AggregateFunction) AggregationFunctionList.get(i);
						String input = aggregateFunction.getInput();
						String inputStatic = aggregateFunction.getInputStatic();

						System.out.println("input------>>>>>>  " + input);
						String output = aggregateFunction.getOutput();
						String aggregateFunctionName = aggregateFunction.getAggregateFunctionName();

						// System.out.println("obj"+obj.getClass().getDeclaredFields()[0]);
						if (aggregateFunctionName.equals("AVG")) {
							JSONArray jsonArray= new JSONArray(input);
							List<String> inputStaticList = new ArrayList<String>(Arrays.asList(inputStatic.trim().split(",")));
							Object inpVal1 = null;
							BigInteger avg = new BigInteger("0");
							if(!inputStatic.trim().equals("")) {
							for (String inputval : inputStaticList) {
								avg = avg.add(new BigInteger(inputval));
							}
							}
							  for(int p=0; p<jsonArray.length();p++) {
							//		System.out.println(jsonArray.get(p).toString());  
									Field fieldn = obj.getClass().getDeclaredField(jsonArray.getString(i).trim());
									fieldn.setAccessible(true);
									inpVal1 = fieldn.get(obj);
									avg = avg.add((BigInteger) inpVal1);
								  }
							Field field3 = obj.getClass().getDeclaredField(output);
							field3.setAccessible(true);
							double dval = jsonArray.length()+inputStaticList.size();
							field3.set(obj, avg.doubleValue() / dval + "");
						}
						if (aggregateFunctionName.equals("SUM")) {
							JSONArray jsonArray= new JSONArray(input);
							List<String> inputStaticList = new ArrayList<String>(Arrays.asList(inputStatic.trim().split(",")));
							Object inpVal1 = null;
							BigInteger sum = new BigInteger("0");
//							for (String inputval : inputList) {
//								System.out.println(inputval);
//								Field fieldn = obj.getClass().getDeclaredField(inputval.trim());
//								System.out.println("filed Value" + fieldn);
//								fieldn.setAccessible(true);
//								inpVal1 = fieldn.get(obj);
//								sum = sum.add((BigInteger) inpVal1);
//							}
								// jsonObj.optjs
						if(!inputStatic.trim().equals("")) {
							for (String inputval : inputStaticList) {
								sum = sum.add(new BigInteger(inputval));
							}	
						}
							  for(int p=0; p<jsonArray.length();p++) {
								System.out.println(jsonArray.get(p).toString());  
								Field fieldn = obj.getClass().getDeclaredField(jsonArray.getString(p).trim());
								System.out.println("filed Value" + fieldn);
								fieldn.setAccessible(true);
								inpVal1 = fieldn.get(obj);
								sum = sum.add((BigInteger) inpVal1);
							  }
							Field field3 = obj.getClass().getDeclaredField(output);
							field3.setAccessible(true);
							field3.set(obj, sum + "");
						}

					}
					// System.out.println("obj.getClass()"+obj.getClass());
					userMapper = new JMapper(outputClass.getClasses()[0], obj.getClass(), jmapper_content);
					// RelationalJMapper<T>
					purchaseOrder = userMapper.getDestination(obj);
					purchaseOrderList.add(purchaseOrder);
				}

				newField.set(outputList, purchaseOrderList);
				marshaller.marshal(outputList, sw);
			} else {
				userMapper = new JMapper(outputClass, inputClass, jmapper_content);
				purchaseOrder = userMapper.getDestination(orderObj);
				jaxbContext1 = JAXBContext.newInstance(outputClass);
				marshaller = jaxbContext1.createMarshaller();
				marshaller.marshal(purchaseOrder, sw);
			}

			// System.out.println("sw.toString"+sw.toString());

			// String jsonOutput=null;
			if (isXMLOutput) {
				// return sw.toString();
				retValue = sw.toString();
			} else {
				JSONObject jsonObject = XML.toJSONObject(sw.toString());
				retValue = jsonObject.toString();
			}

		} catch (JAXBException e) {
			e.printStackTrace();
		}
		return retValue;
	}

}