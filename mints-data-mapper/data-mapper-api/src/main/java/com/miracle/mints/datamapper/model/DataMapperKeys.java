/**
 * 
 */
package com.miracle.mints.datamapper.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * @author Chandra mouli
 *
 */

@JsonIgnoreProperties(ignoreUnknown = true)
public class DataMapperKeys implements Serializable {
	private String id;
	private String[] keys;
	private String mapName;
	private String[] values;
    private static final long serialVersionUID = 1L;

	
	/**
	 * @param id
	 * @param keys
	 * @param values
	 */
    
    public DataMapperKeys() {
    	super();
    }
	public DataMapperKeys(String id, String mapName, String[] keys, String[] values) {
		this.id = id;
		this.keys = keys;
		this.mapName = mapName;
		this.values = values;
	}
	/**
	 * @return the values
	 */
	public String[] getValues() {
		return values;
	}
	/**
	 * @param values the values to set
	 */
	public void setValues(String[] values) {
		this.values = values;
	}
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the data
	 */
	public String[] getData() {
		return keys;
	}
	/**
	 * @param data the data to set
	 */
	public void setData(String[] data) {
		this.keys = data;
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
	public String[] getKeys() {
		return keys;
	}
	public void setKeys(String[] keys) {
		this.keys = keys;
	}
	
}
