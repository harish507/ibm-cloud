package com.mints.mtx.bean;

public class AggregateFunction {

	String input;
	String output;
	String inputStatic;
	String AggregateFunctionName;

	public String getInput() {
		return input;
	}

	public void setInput(String input) {
		this.input = input;
	}

	public String getOutput() {
		return output;
	}

	public AggregateFunction(String input, String inputStatic, String output, String aggregateFunctionName) {
		super();
		this.input = input;
		this.inputStatic = inputStatic;
		this.output = output;
		AggregateFunctionName = aggregateFunctionName;
	}

	public void setOutput(String output) {
		this.output = output;
	}

	public String getAggregateFunctionName() {
		return AggregateFunctionName;
	}

	public void setAggregateFunctionName(String aggregateFunctionName) {
		AggregateFunctionName = aggregateFunctionName;
	}

	public String getInputStatic() {
		return inputStatic;
	}

	public void setInputStatic(String inputStatic) {
		this.inputStatic = inputStatic;
	}

}
