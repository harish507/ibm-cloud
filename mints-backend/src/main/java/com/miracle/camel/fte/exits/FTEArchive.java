package com.miracle.camel.fte.exits;

import java.io.File;
import java.io.IOException;

import org.apache.camel.component.log.LogComponent;
import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

import com.miracle.camel.fte.userexits.AbstractFTEUserExits;

public class FTEArchive extends AbstractFTEUserExits{
	private static Logger logger = Logger.getLogger(LogComponent.class);
	
	public FTEArchive() {
		 
	}

	public static String invokeExit(String parameters) throws IOException {
		
		String inParams[] = parameters.toString().split("\\|");
		logger.debug("Initializing Params for exit :" + FTEArchive.class.getName());
		String sourceFilePath = "";
		String sourceFileName = "";
		String archiveFilePath = "";
		if (inParams.length >= 1 && inParams[0] != null && !inParams[0].trim().equals("")) {
			sourceFilePath = inParams[0].trim();
			sourceFileName = inParams[1].trim();
			archiveFilePath = inParams[2].trim();
		
		File inputFile = new File(sourceFilePath.trim() +"//"+ sourceFileName.trim());
        File archiveFile = new File(archiveFilePath.trim() );
        if(!inputFile.exists())
        {
            logger.error((new StringBuilder("Source file doesn't exist")).append(sourceFileName.trim()).toString());
            throw new IOException((new StringBuilder("Source file doesn't exist ")).append(sourceFileName.trim()).toString());
        }
       
        FileUtils.copyFile(inputFile, archiveFile);
		}
		return "Successfully Archived the file "+ archiveFilePath;
	}
}
