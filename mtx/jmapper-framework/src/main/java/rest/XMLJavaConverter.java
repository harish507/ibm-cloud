package rest;

import java.io.File;
import java.io.StringReader;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Paths;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.googlecode.jmapper.JMapper;

import com.googlecode.jmapper.JMapper;

public final class XMLJavaConverter {


    public  String convert(String requestFile,String dir,String jmapper_content,String requestClassName, String responseClassName, boolean isXMLOutput) throws Exception {
         StringWriter sw = new StringWriter();
         String retValue=null;
        try {

            File inputDir = new File("./resources/xml/input");
            File inputFile = inputDir.listFiles()[0];

            File outputDir = new File("./resources/xml/output");
            File outputFile = outputDir.listFiles()[0];

            CustomClassLoader customClassLoader = new CustomClassLoader();

         //   Class inputClass = customClassLoader.findClass("input/"+inputFile.getName().substring(0,inputFile.getName().lastIndexOf(".")));

        Class inputClass = customClassLoader.findClass("input/"+requestClassName);  

         //   Class outputClass = customClassLoader.findClass("output/"+outputFile.getName().substring(0,outputFile.getName().lastIndexOf(".")));

         Class outputClass = customClassLoader.findClass("output/"+responseClassName);

            JAXBContext jaxbContext = JAXBContext.newInstance(inputClass);

            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            
             //StringReader reader = new StringReader(requestFile);
            
        //    Object orderObj = jaxbUnmarshaller.unmarshal(requestFile));

            StringReader reader = new StringReader(requestFile);
            
            Object orderObj = jaxbUnmarshaller.unmarshal(reader);

            JMapper userMapper = new JMapper
                    (outputClass, inputClass,jmapper_content);

            Object purchaseOrder = userMapper.getDestination(orderObj);

           JAXBContext jaxbContext1 = JAXBContext.newInstance(outputClass);

           Marshaller marshaller = jaxbContext1.createMarshaller();
        //   marshaller.marshal(purchaseOrder,new File(dir+outputFile.getName().substring(0,outputFile.getName().lastIndexOf(".")).toLowerCase()+".xml"));


           marshaller.marshal(purchaseOrder,sw);
           System.out.println("sw.toString"+sw.toString());
          
           String jsonOutput=null;
            if(isXMLOutput){
              //  return sw.toString();
                retValue=sw.toString();
            }
            else{
                XmlMapper xmlMapper = new XmlMapper();
                JsonNode node = xmlMapper.readTree(sw.toString().getBytes());
                ObjectMapper jsonMapper = new ObjectMapper();
                jsonOutput = jsonMapper.writeValueAsString(node);
                retValue= jsonOutput;
            }
           

        } catch (JAXBException e) {
            e.printStackTrace();
        }
        return retValue;
    }
}