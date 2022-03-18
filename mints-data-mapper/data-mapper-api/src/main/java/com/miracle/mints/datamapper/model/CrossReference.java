package com.miracle.mints.datamapper.model;



public class CrossReference {
  private String id;
  private String[] keyName;
  private String[] value;
  private String mapName;

public CrossReference() {

  }

  public CrossReference(String id, String[] keyName, String[] value, String mapName) {
    this.keyName = keyName;
    this.value = value;
    this.mapName = mapName;
  }

  public String getId() {
    return id;
  }

  
  public String[] getKeyName() {
	return keyName;
}

public void setKeyName(String[] keyName) {
	this.keyName = keyName;
}

public String[] getValue() {
    return value;
  }

  public void setValue(String[] value) {
    this.value = value;
  }
  
  public String getMapName() {
		return mapName;
	}

	public void setMapName(String mapName) {
		this.mapName = mapName;
	}
  

@Override
  public String toString() {
    return "Map Values [mapName = " + mapName + ", id=" + id + ", key=" + keyName + ", Value=" + value + "]";
  }
}
