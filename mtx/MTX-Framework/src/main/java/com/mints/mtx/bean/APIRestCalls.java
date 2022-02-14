package com.mints.mtx.bean;

public class APIRestCalls {
	
	String input;
	String output;
	String APIType;
	String endPoint;
	
	public String getInput() {
		return input;
	}
	public void setInput(String input) {
		this.input = input;
	}
	public String getOutput() {
		return output;
	}
	public void setOutput(String output) {
		this.output = output;
	}
	public String getAPIType() {
		return APIType;
	}
	public void setAPIType(String aPIType) {
		APIType = aPIType;
	}
	public String getEndPoint() {
		return endPoint;
	}
	public void setEndPoint(String endPoint) {
		this.endPoint = endPoint;
	}
	
	public APIRestCalls(String input, String output, String aPIType , String endpoint) {
		super();
		this.input = input;
		this.output = output;
		this.APIType = aPIType;
		this.endPoint = endpoint;
	}
	
	
	

}
