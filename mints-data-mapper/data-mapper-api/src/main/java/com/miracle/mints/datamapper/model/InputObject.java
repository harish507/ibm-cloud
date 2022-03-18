/**
 * 
 */
package com.miracle.mints.datamapper.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Jagan
 *
 */
public class InputObject {

	private String payload;
	
	@JsonProperty("metadata")
	private MetaData metadata;
	
	/**
	 * @return the payload
	 */
	public String getPayload() {
		return payload;
	}

	/**
	 * @param payload the payload to set
	 */
	public void setPayload(String payload) {
		this.payload = payload;
	}

	/**
	 * @return the metadata
	 */
	public MetaData getMetadata() {
		return metadata;
	}

	/**
	 * @param metadata the metadata to set
	 */
	public void setMetadata(MetaData metadata) {
		this.metadata = metadata;
	}
}
