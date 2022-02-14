package com.mints.mtx.service;

public interface ConversionService {
	
	String generateOutputUsingJMapper(String request_content,String jMapName,String projectPath,String sharedPath, String cacheEnabled);

	String generateJavaClassesFromXSD(String request_xsd, String response_xsd, String jmapper,
			String fullSharedPath, boolean isInputJSON, boolean isOutputXML) ;
	
}
