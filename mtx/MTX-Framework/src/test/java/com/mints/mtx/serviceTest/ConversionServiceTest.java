//package com.mints.mtx.serviceTest;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//import org.junit.runner.RunWith;
//import org.mockito.InjectMocks;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.test.context.TestPropertySource;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import com.mints.mtx.service.ConversionServiceImpl;
//
//@RunWith(SpringRunner.class)
//@TestPropertySource("/application-test.properties")
//public class ConversionServiceTest {
//	
//	Logger logger = LoggerFactory.getLogger(ConversionServiceTest.class);
//	
//	@Value("${XML2XML.Junit.shared.path}")
//	private String sharedPath;
//
//    @Value("${XML2XML.Junit.jMapName}")
//	private String jMapName;
//
//	@Value("${XML2XML.Junit.projectPath}")
//	private String projectPath;
//
//	@Value("${XML2XML.Junit.requestContent}")
//	private String request_content;
//	
//	@Value("${XML2XML.Junit.exceptedContent}")
//	private String excepted_content;
//	
//	@Value("${XML2XML.Junit.cacheEnabled}")
//	private String cacheEnabled;
//	
//	@InjectMocks
//    private ConversionServiceImpl conversionService;
//	
//	@org.junit.Test
//	public void testXML2XMLCase() throws Exception {
//
//		assertThat(conversionService.generateOutputUsingJMapper(request_content, jMapName, projectPath, sharedPath,cacheEnabled)).isEqualTo(excepted_content);
//
//	}
//
//
//}
