package org.blade.whale.management.vo;

public class ResultVO<T> {
	
	public static final String SUCCESS = "success";
	public static final String FAIL = "fail";
	public static final String NOTALLOWED = "denied";
	
	public static final String ALL_ROUTING_FINISHED = "all_routing_finished";
	
	private String code;
	private String message;
	private T result;
	
	public ResultVO(){
	}
	
	public ResultVO(String code,String message){
		this.code = code;
		this.message = message;
	}
	
	public ResultVO(String code,String message,T t){
		this.code = code;
		this.message = message;
		this.result = t;
	}
	
	public String getCode() {
		return code;
	}
	public void setCode(String status) {
		this.code = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public T getResult() {
		return result;
	}
	public void setResult(T result) {
		this.result = result;
	}

}
