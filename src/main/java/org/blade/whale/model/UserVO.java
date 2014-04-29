package org.blade.whale.model;

public class UserVO {

	private String userName;
	private String password;
	private boolean isSuperAdmin;
	
	public UserVO(){}
	
	public UserVO(String userName, String password) {
		this.userName = userName;
		this.password = password;
	}
	
	public UserVO(String userName, String password, boolean isSuperAdmin) {
		this.userName = userName;
		this.password = password;
		this.isSuperAdmin = isSuperAdmin;
	}
	
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public boolean isSuperAdmin() {
		return isSuperAdmin;
	}
	public void setSuperAdmin(boolean isSuperAdmin) {
		this.isSuperAdmin = isSuperAdmin;
	}
}
