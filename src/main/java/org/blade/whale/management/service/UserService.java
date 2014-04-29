package org.blade.whale.management.service;

import java.sql.SQLException;
import java.util.List;

import org.blade.whale.model.UserVO;

public interface UserService {

	public void addUser(UserVO user) throws SQLException ;
	
	public void deleteUser(UserVO user) throws SQLException ;
	
	public List<UserVO> getUsers() throws SQLException ;
	
	public boolean validateUser(UserVO user) throws SQLException ;
}
