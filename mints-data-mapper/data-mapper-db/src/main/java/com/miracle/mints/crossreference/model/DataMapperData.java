/**
 * 
 */
package com.miracle.mints.crossreference.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "datamapper_data")
public class DataMapperData {
	@Id
	private String id;
	private String[] data;
	private String mapName;
	
	/**
	 * @param id
	 * @param mapName
	 * @param data
	 */
	public DataMapperData(String id, String mapName, String[] data) {
		super();
		this.id = id;
		this.data = data;
		this.mapName = mapName;
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
		return data;
	}
	/**
	 * @param data the data to set
	 */
	public void setData(String[] data) {
		this.data = data;
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
}
