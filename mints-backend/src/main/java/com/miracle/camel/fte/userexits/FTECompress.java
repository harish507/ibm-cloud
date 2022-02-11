package com.miracle.camel.fte.userexits;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.camel.component.log.LogComponent;
import org.apache.log4j.Logger;

public class FTECompress extends AbstractFTEUserExits {

	private static Logger logger = Logger.getLogger(LogComponent.class);

	public FTECompress() {

	}

	public static String invokeExit(String parameters) throws IOException {

		String inParams[] = parameters.toString().split("\\|");
		logger.debug("Initializing Params for exit :" + FTECompress.class.getName());
		String compressFileName = "";
		String sourceFilePath = "";
		String sourceFile = "";
		if (inParams.length >= 1 && inParams[0] != null && !inParams[0].trim().equals("")) {
			sourceFilePath = inParams[0].trim();
			sourceFile = inParams[1].trim();
			compressFileName = inParams[2].trim();
			String compressFormat = inParams[3].trim();
			System.out.println(sourceFile + " : " + compressFileName + " : " + compressFormat);
			File compressFile = new File(compressFileName);
			System.out.println("File object for compressFile Name created");
			byte buffer[] = new byte[1024];

			try {
				System.out.println("Inside try block");
				FileOutputStream fileOutputStream = new FileOutputStream(
						(new StringBuilder()).append(compressFile).append(compressFormat).toString());

				ZipOutputStream zipOutputStream = new ZipOutputStream(fileOutputStream);
				ZipEntry zipEntry = new ZipEntry(compressFile.getName());
				zipOutputStream.putNextEntry(zipEntry);
				System.out.println("zipEntry created ");
				FileInputStream fileInputStream = new FileInputStream(sourceFilePath + "//" + sourceFile);
				int len;
				while ((len = fileInputStream.read(buffer)) > 0) {
					zipOutputStream.write(buffer, 0, len);
				}
					
				fileInputStream.close();
				zipOutputStream.closeEntry();
				zipOutputStream.close();

			} catch (IOException ex) {
				logger.error(ex.getMessage());
				throw new IOException(ex.getMessage());
			}
		}
		return "Successfully compressed the file "+compressFileName;

	}
}
