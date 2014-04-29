package org.blade.whale.model;

public class UserActionVO {

	private String username;
	private String action;
	private String timeStamp;
	
	public UserActionVO(){}
	
	public UserActionVO(String username, String action, String timeStamp) {
		this.username = username;
		this.action = action;
		this.timeStamp = timeStamp;
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getTimeStamp() {
		return timeStamp;
	}
	public void setTimeStamp(String timeStamp) {
		this.timeStamp = timeStamp;
	}
	
	public String toString() {
		return username + " " + action + " " + timeStamp;
	}
}
