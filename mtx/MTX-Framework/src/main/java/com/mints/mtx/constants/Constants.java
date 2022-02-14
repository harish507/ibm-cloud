package com.mints.mtx.constants;

import org.springframework.beans.factory.annotation.Value;

public class Constants {

	@Value("${shared.path}")
	public static  String SHARED_PATH;

	@Value("${request.fileName}")
	public static  String REQUEST_FILE_NAME;
	
}
