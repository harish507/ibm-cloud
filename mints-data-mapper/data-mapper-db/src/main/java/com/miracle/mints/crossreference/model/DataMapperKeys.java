/**
 * 
 */
package com.miracle.mints.crossreference.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author Jagan
 *
 */

@Document(collection = "datamapper_maps")
public class DataMapperKeys {
	@Id
	private String id;
	private String[] keys;
	private String mapName;
	private String[] values;

	/**
	 * @param id
	 * @param keys
	 * @param values
	 */
	public DataMapperKeys(String id, String mapName, String[] keys, String[] values) {
		super();
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
