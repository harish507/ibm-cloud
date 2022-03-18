/**
 * 
 */
package com.miracle.mints.datamapper.model;

/**
 * @author Jagan
 *
 */
public class MetaData {

	String contentType;
	String mapName;
	String[] inputFields;
	String [] outputFields;

	/**
	 * @return the contentType
	 */
	public String getContentType() {
		return contentType;
	}
	/**
	 * @param contentType the contentType to set
	 */
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	/**
	 * @return the mapName
	 */
	public String getMapName() {
		return mapName;
	}
	/**
	 * @param mapName the mapName to set
	 */
	public void setMapName(String mapName) {
		this.mapName = mapName;
	}
	/**
	 * @return the inputFields
	 */
	public String[] getInputFields() {
		return inputFields;
	}
	/**
	 * @param inputFields the inputFields to set
	 */
	public void setInputFields(String[] inputFields) {
		this.inputFields = inputFields;
	}
	/**
	 * @return the outputFields
	 */
	public String[] getOutputFields() {
		return outputFields;
	}
	/**
	 * @param outputFields the outputFields to set
	 */
	public void setOutputFields(String[] outputFields) {
		this.outputFields = outputFields;
	}

}
