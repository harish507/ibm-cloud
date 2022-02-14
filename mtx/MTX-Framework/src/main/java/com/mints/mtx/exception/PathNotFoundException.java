package com.mints.mtx.exception;

public class PathNotFoundException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5835293113974888332L;

	
	 public PathNotFoundException() { super("mapName or projectPath not found"); }
	 
}
